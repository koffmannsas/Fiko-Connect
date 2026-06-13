import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { brain } from "./src/ai/brain";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- INFRASTRUCTURE: Firebase Admin ---
const isLocal = !process.env.GOOGLE_CLOUD_PROJECT && !process.env.FIREBASE_CONFIG && process.env.NODE_ENV !== "production";
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "krypton-ai-490214";

if (!getApps().length) {
    if (isLocal) {
        console.warn("[INIT] No Firebase project detected. Using mock database.");
        initializeApp({ projectId: "fiko-mock" });
    } else {
        initializeApp({
            credential: applicationDefault(),
            projectId: PROJECT_ID
        });
    }
}
const db = getFirestore();

const app = express();

// --- STATUS ENDPOINTS ---
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/config-check", (req, res) => {
    res.json({
        gemini: !!process.env.GOOGLE_GEMINI_API_KEY,
        whatsapp_token: !!process.env.WHATSAPP_ACCESS_TOKEN,
        phone_number_id: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
        app_secret: !!process.env.WHATSAPP_APP_SECRET,
        verify_token: !!process.env.WHATSAPP_VERIFY_TOKEN,
        firebase: !!(process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT)
    });
});

app.get("/firebase-status", async (req, res) => {
    try {
        const collections = await db.listCollections();
        const collectionIds = collections.map(c => c.id);
        res.json({
            projectId: PROJECT_ID,
            firestoreConnected: true,
            collections: collectionIds
        });
    } catch (e: any) {
        res.status(500).json({
            projectId: PROJECT_ID,
            firestoreConnected: false,
            error: e.message
        });
    }
});

app.get("/ai-status", async (req, res) => {
    const status = await brain.getStatus();
    res.json(status);
});

app.get("/providers", async (req, res) => {
    const status = await brain.getStatus();
    res.json(status.details || {});
});

app.get("/providers/health", async (req, res) => {
    const status = await brain.getStatus();
    res.json(status);
});

app.get("/ai-debug", (req, res) => {
    res.json(brain.getDebugInfo());
});

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
    if (process.env.NODE_ENV === "test") return false;
    const docRef = db.collection('processed_messages').doc(messageId);
    try {
        await docRef.create({
            processedAt: FieldValue.serverTimestamp(),
            messageId: messageId
        });
        console.log(`[CORE] Message ${messageId} locked for processing.`);
        return false;
    } catch (e: any) {
        if (e.code === 6 || e.message?.includes('already exists')) {
            console.warn(`[CORE] Duplicate message detected: ${messageId}. Ignoring.`);
            return true;
        }
        console.error(`[CORE] Error in deduplication check for ${messageId}:`, e.message);
        return false;
    }
}

// --- AI: Fiko Closer with Memory ---
async function processWithAI(companyId: string, leadId: string, message: string) {
    console.log(`[AI] Starting generation for Lead: ${leadId}`);

    // 1. Context Retrieval
    let businessContext = "Expert en vente WhatsApp.";
    if (process.env.NODE_ENV !== "test") {
        const memoryRef = db.collection('fiko_memory').doc(companyId);
        const memory = await memoryRef.get();
        if (memory.exists) businessContext = memory.data()?.longTermMemory || businessContext;
    }
    console.log(`[AI] Context retrieved.`);

    let responseText;
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        console.warn("[AI] No Gemini API Key. Using mock response.");
        responseText = "Ceci est une réponse automatique de test Fiko. (Simulé)";
    } else {
        try {
            responseText = await brain.generateSmartResponse(companyId, leadId, message, businessContext);
        } catch (e: any) {
            console.error("[AI] Brain Error:", e.message);
            responseText = "Désolé, je rencontre une petite difficulté technique. Je reviens vers vous vite.";
        }
    }
    console.log(`[AI] Response generated: "${responseText.substring(0, 30)}..."`);

    // 3. Persistence of AI Response
    console.log(`[DATA] Saving AI response to messages...`);
    if (process.env.NODE_ENV !== "test") {
        await db.collection('messages').add({
            companyId,
            conversationId: leadId,
            sender: 'ai',
            content: responseText,
            timestamp: FieldValue.serverTimestamp()
        });
    }
    console.log(`[DATA] AI response persisted.`);

    return responseText;
}

// --- DATA: Multi-tenant Resolver ---
async function resolveCompanyId(phoneNumber: string | undefined) {
    if (!phoneNumber) return "fiko_prod_68469";
    if (process.env.NODE_ENV === "test") return "fiko_prod_68469";
    const q = await db.collection('companies').where('whatsappNumber', '==', phoneNumber).limit(1).get();
    if (!q.empty) return q.docs[0].id;
    return "fiko_prod_68469";
}

// --- DATA: Lead Synchronization ---
async function syncLead(companyId: string, from: string, text: string) {
    console.log(`[DATA] Syncing lead ${from} for company ${companyId}`);
    const leadId = `${companyId}_${from}`;
    if (process.env.NODE_ENV !== "test") {
        const leadRef = db.collection('leads').doc(leadId);
        await leadRef.set({
            companyId,
            phone: from,
            lastMessage: text,
            updatedAt: FieldValue.serverTimestamp(),
            status: 'Nouveau'
        }, { merge: true });
    }
    return leadId;
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
        return res.sendStatus(200);
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
    if (process.env.NODE_ENV !== "test") {
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
    }

    // 6. Persistence (Lead + Conversation)
    const leadId = await syncLead(companyId, from, text);

    console.log(`[DATA] Saving client message to messages...`);
    if (process.env.NODE_ENV !== "test") {
        await db.collection('messages').add({
            companyId,
            conversationId: leadId,
            sender: 'client',
            content: text,
            timestamp: FieldValue.serverTimestamp()
        });
    }
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
        // Temporary direct call until brain supports specialized prompt types
        const response = "[]";
        res.json(JSON.parse(response));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// --- PRODUCTION SERVING ---
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
} else {
    // Vite middleware for dev handled by concurrently/vite
}

const PORT = process.env.PORT || 3000;

async function verifyAI() {
    console.log("[INIT] Verifying AI Brain...");
    const status = await brain.getStatus();
    if (status.status === "ok") {
        console.log(`[INIT] AI Brain active via ${status.provider} (${status.model})`);
    } else {
        console.warn("[INIT] AI Brain is NOT ready.");
    }
}

app.listen(PORT, async () => {
    await verifyAI();
    console.log(`\n🚀 Fiko Production Engine Active on port ${PORT}`);
    console.log("------------------------------------------");
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`App Secret: ${process.env.WHATSAPP_APP_SECRET ? 'OK' : 'MISSING'}`);
    console.log(`Verify Token: ${process.env.WHATSAPP_VERIFY_TOKEN ? 'OK' : 'MISSING'}`);
    console.log(`Gemini Key: ${process.env.GOOGLE_GEMINI_API_KEY ? 'OK' : 'MISSING'}`);
    console.log("------------------------------------------\n");
});
