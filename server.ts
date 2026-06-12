import express from "express";
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// --- INFRASTRUCTURE: Firebase Admin ---
const isLocal = !process.env.GOOGLE_CLOUD_PROJECT && !process.env.FIREBASE_CONFIG;
if (!getApps().length) {
    if (isLocal) {
        console.warn("[INIT] No Firebase project detected. Using mock database.");
        initializeApp({ projectId: "fiko-mock" });
    } else {
        initializeApp({
            credential: applicationDefault()
        });
    }
}
const db = getFirestore();

const app = express();

const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET || "";

// --- SECURITY: Webhook Signature Verification ---
function verifySignature(req: express.Request, res: express.Response, buf: Buffer) {
    const signature = req.headers['x-hub-signature-256'] as string;
    if (!signature) {
        console.warn("[SECURITY] Missing x-hub-signature-256 header");
        return false;
    }
    const hash = "sha256=" + crypto.createHmac('sha256', WHATSAPP_APP_SECRET).update(buf).digest('hex');
    const isValid = (signature === hash);
    if (!isValid) {
        console.error("[SECURITY] Signature mismatch!");
    }
    return isValid;
}

// --- CORE: Message Deduplication Engine (Atomic) ---
async function isDuplicate(messageId: string) {
    const docRef = db.collection('processed_messages').doc(messageId);
    try {
        // Atomic create fails if document already exists
        await docRef.create({
            processedAt: FieldValue.serverTimestamp(),
            messageId: messageId
        });
        console.log(`[CORE] Message ${messageId} locked for processing.`);
        return false;
    } catch (e: any) {
        // Code 6 is ALREADY_EXISTS
        if (e.code === 6 || e.message?.includes('already exists')) {
            console.warn(`[CORE] Duplicate message detected: ${messageId}. Ignoring.`);
            return true;
        }
        console.error(`[CORE] Error in deduplication check for ${messageId}:`, e.message);
        return false; // Process anyway if DB fails to not lose messages
    }
}

// --- AI: Fiko Closer with Memory ---
async function processWithAI(companyId: string, leadId: string, message: string) {
    console.log(`[AI] Starting generation for Lead: ${leadId}`);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. Context Retrieval
    const memoryRef = db.collection('fiko_memory').doc(companyId);
    const memory = await memoryRef.get();
    const businessContext = memory.exists ? memory.data()?.longTermMemory : "Expert en vente WhatsApp.";

    // 2. Prompt Engineering
    const prompt = `Tu es Fiko Closer.
    Contexte Entreprise: ${businessContext}
    ID Client: ${leadId}
    Message Client: ${message}

    Réponds de manière concise, humaine et persuasive. Objectif: Closer la vente.`;

    let responseText;
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        console.warn("[AI] No Gemini API Key. Using mock response.");
        responseText = "Ceci est une réponse automatique de test Fiko. (Simulé)";
    } else {
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
    }
    console.log(`[AI] Response generated: "${responseText.substring(0, 30)}..."`);

    // 3. Persistence of AI Response
    await db.collection('messages').add({
        companyId,
        conversationId: leadId,
        sender: 'ai',
        content: responseText,
        timestamp: FieldValue.serverTimestamp()
    });

    return responseText;
}

// --- DATA: Multi-tenant Resolver ---
async function resolveCompanyId(phoneNumber: string | undefined) {
    if (!phoneNumber) return "fiko_prod_68469";
    const q = await db.collection('companies').where('whatsappNumber', '==', phoneNumber).limit(1).get();
    if (!q.empty) return q.docs[0].id;
    return "fiko_prod_68469"; // Fallback
}

// --- DATA: Lead Synchronization ---
async function syncLead(companyId: string, from: string, text: string) {
    console.log(`[DATA] Syncing lead ${from} for company ${companyId}`);
    const leadRef = db.collection('leads').doc(`${companyId}_${from}`);

    const leadData = {
        companyId,
        phone: from,
        lastMessage: text,
        updatedAt: FieldValue.serverTimestamp(),
        status: 'Nouveau'
    };

    await leadRef.set(leadData, { merge: true });
    return leadRef.id;
}

// --- NETWORK: WhatsApp API Sender ---
async function sendWhatsAppMessage(to: string, text: string) {
    console.log(`[WHATSAPP] Sending message to ${to}`);
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        console.warn("[WHATSAPP] Credentials missing. Message not sent to Meta.");
        return false;
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
        return !!data.messages;
    } catch (error) {
        console.error("[WHATSAPP] Error sending message:", error);
        return false;
    }
}

// --- WEBHOOK: Meta Validation (GET) ---
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log("[WEBHOOK] Verification successful.");
        return res.status(200).send(challenge);
    }
    console.warn("[WEBHOOK] Verification failed or missing token.");
    res.sendStatus(403);
});

// --- WEBHOOK: Incoming Messages (POST) ---
app.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    console.log("\n[WEBHOOK] Incoming POST request");

    // 1. Signature Check
    if (WHATSAPP_APP_SECRET && !verifySignature(req, res, req.body)) {
        return res.sendStatus(401);
    }

    // 2. Body Parsing
    let bodyObj;
    try {
        bodyObj = JSON.parse(req.body.toString());
    } catch (e) {
        console.error("[WEBHOOK] JSON parse error");
        return res.sendStatus(400);
    }

    const message = bodyObj.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) {
        return res.sendStatus(200); // Not a message event
    }

    const wa_id = message.id;
    const from = message.from;
    const recipient = bodyObj.entry[0].changes[0].value.metadata?.display_phone_number;
    const text = message.text?.body || "";

    console.log(`[WEBHOOK] New message from ${from}: "${text}"`);

    // 3. Deduplication Check
    if (await isDuplicate(wa_id)) {
        return res.sendStatus(200);
    }

    // 4. Company Resolution
    const companyId = await resolveCompanyId(recipient);

    // 5. Subscription/Quota Check
    const subRef = db.collection('subscriptions').doc(companyId);
    const sub = await subRef.get();
    if (sub.exists) {
        const data = sub.data();
        if (data && data.messagesSent >= data.maxMessages) {
            console.warn(`[QUOTA] Limit reached for ${companyId}`);
            return res.sendStatus(403);
        }
        await subRef.update({ messagesSent: FieldValue.increment(1) });
    }

    // 6. Persistence (Lead + Conversation)
    const leadId = await syncLead(companyId, from, text);

    await db.collection('messages').add({
        companyId,
        conversationId: leadId,
        sender: 'client',
        content: text,
        timestamp: FieldValue.serverTimestamp()
    });
    console.log(`[DATA] Saved message to lead ${leadId}`);

    // 7. AI & Response (Background)
    processWithAI(companyId, leadId, text)
        .then(async (aiResponse) => {
            const success = await sendWhatsAppMessage(from, aiResponse);
            console.log(`[FINAL] Workflow complete. Success: ${success}`);
        })
        .catch(err => console.error("[FATAL] AI/WhatsApp workflow failed:", err));

    res.sendStatus(200);
});

// --- API: Campaign Routes ---
app.post("/api/campaigns/generate", express.json(), async (req, res) => {
    try {
        const { objective, audience, tone } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Génère un message de campagne WhatsApp. Objectif: ${objective}, Audience: ${audience}, Ton: ${tone}. JSON array output version "short" et "long".`;
        const result = await model.generateContent(prompt);
        res.json(JSON.parse(result.response.text() || "[]"));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Fiko Production Engine Active on port ${PORT}`);
    console.log("------------------------------------------");
    console.log(`App Secret: ${process.env.WHATSAPP_APP_SECRET ? 'OK' : 'MISSING'}`);
    console.log(`Verify Token: ${process.env.WHATSAPP_VERIFY_TOKEN ? 'OK' : 'MISSING'}`);
    console.log(`Gemini Key: ${process.env.GOOGLE_GEMINI_API_KEY ? 'OK' : 'MISSING'}`);
    console.log("------------------------------------------\n");
});
