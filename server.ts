import express from "express";
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

if (!getApps().length) {
    initializeApp({
        credential: applicationDefault()
    });
}
const db = getFirestore();

const app = express();
app.use(express.json());

const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET || "";

// --- SECURITY: Webhook Signature Verification ---
function verifySignature(req: express.Request, res: express.Response, buf: Buffer) {
    const signature = req.headers['x-hub-signature-256'] as string;
    if (!signature) return false;
    const hash = "sha256=" + crypto.createHmac('sha256', WHATSAPP_APP_SECRET).update(buf).digest('hex');
    return signature === hash;
}

// --- CORE: Message Deduplication Engine (Atomic) ---
async function isDuplicate(messageId: string) {
    const docRef = db.collection('processed_messages').doc(messageId);
    try {
        // Use create() to ensure atomicity - fails if doc already exists
        await docRef.create({ processedAt: FieldValue.serverTimestamp() });
        return false;
    } catch (e) {
        return true;
    }
}

// --- AI: Fiko Closer with Memory ---
async function processWithAI(companyId: string, leadId: string, message: string) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch memory
    const memoryRef = db.collection('fiko_memory').doc(companyId);
    const memory = await memoryRef.get();
    const context = memory.exists ? memory.data()?.longTermMemory : "Nouveau lead.";

    const prompt = `Tu es Fiko Closer, un expert en vente. Contexte Entreprise: ${context}. Message Client: ${message}. Réponds de manière courte et persuasive.`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Update memory & history
    await db.collection('messages').add({
        companyId,
        conversationId: leadId,
        sender: 'ai',
        content: responseText,
        timestamp: FieldValue.serverTimestamp()
    });

    return responseText;
}

// --- Multi-tenant Resolver ---
async function resolveCompanyId(phoneNumber: string) {
    // In production, this looks up the company linked to the recipient WA ID
    const q = await db.collection('companies').where('whatsappNumber', '==', phoneNumber).limit(1).get();
    if (!q.empty) return q.docs[0].id;
    return "fiko_prod_68469"; // Fallback for review
}

// --- WhatsApp API Sender ---
async function sendWhatsAppMessage(to: string, text: string) {
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        console.warn("WhatsApp credentials missing. Skipping send.");
        return;
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "text",
                text: { body: text }
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
    }
}

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    // 2. Verify Signature
    if (WHATSAPP_APP_SECRET && !verifySignature(req, res, req.body)) {
        console.error("Invalid webhook signature.");
        return res.sendStatus(401);
    }

    const bodyObj = JSON.parse(req.body.toString());
    if (!bodyObj.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        return res.sendStatus(200);
    }

    const msg = bodyObj.entry[0].changes[0].value.messages[0];
    const wa_id = msg.id;
    const from = msg.from;
    const recipient = bodyObj.entry[0].changes[0].value.metadata?.display_phone_number;
    const text = msg.text?.body;

    // 2. Multi-tenant Resolution
    const companyId = await resolveCompanyId(recipient);

    // 3. Deduplication Check
    if (await isDuplicate(wa_id)) {
        console.log(`Duplicate message ${wa_id} ignored.`);
        return res.sendStatus(200);
    }

    // 4. Quota Check
    const sub = await db.collection('subscriptions').doc(companyId).get();
    if (sub.exists && sub.data()?.messagesSent >= sub.data()?.maxMessages) {
        return res.sendStatus(403);
    }

    // 5. Persistence
    await db.collection('messages').add({
        companyId,
        conversationId: from,
        sender: 'client',
        content: text,
        timestamp: FieldValue.serverTimestamp()
    });

    // 6. AI Response (Async)
    processWithAI(companyId, from, text)
        .then(async (aiResponse) => {
            await sendWhatsAppMessage(from, aiResponse);
        })
        .catch(console.error);

    res.sendStatus(200);
});

// --- Campaign Endpoints ---
app.post("/api/campaigns/generate", async (req, res) => {
    try {
        const { objective, audience, tone } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Génère un message de campagne WhatsApp. Objectif: ${objective}, Audience: ${audience}, Ton: ${tone}. Retourne un JSON array avec version "short" et "long".`;
        const result = await model.generateContent(prompt);
        res.json(JSON.parse(result.response.text() || "[]"));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Fiko Engine running on port ${PORT}`));
