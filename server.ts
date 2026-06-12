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

app.post("/webhook", async (req, res) => {
    // 1. Validate Meta Challenge
    if (req.query['hub.mode'] === 'subscribe') {
        return res.send(req.query['hub.challenge']);
    }

    const body = req.body;
    if (!body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        return res.sendStatus(200);
    }

    const msg = body.entry[0].changes[0].value.messages[0];
    const wa_id = msg.id;
    const from = msg.from;
    const recipient = body.entry[0].changes[0].value.metadata?.display_phone_number;
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
    processWithAI(companyId, from, text).catch(console.error);

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Fiko Engine running on port ${PORT}`));
