import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { GoogleGenAI } from "@google/genai";

// Initialize Firebase Admin
if (!getApps().length) {
    initializeApp({
        credential: applicationDefault()
    });
}
const db = getFirestore();

// Automatically creates/syncs Meta Review Account on startup if missing
async function preseedDemoData(adminDb: any) {
  try {
    // Seeding 3 AI Agents
    const agents = [
      {
        id: "agent-mode",
        companyId: "meta-review-company",
        name: "Agent Boutique Mode",
        icon: "👗",
        desc: "Optimisé pour le prêt-à-porter, gestion des tailles et coloris.",
        status: "active",
        model: "gemini-1.5-flash",
        instructions: "Vous êtes un vendeur expert en mode. Répondez au client avec courtoisie."
      },
      {
        id: "agent-resto",
        companyId: "meta-review-company",
        name: "Agent Resto & Lounge",
        icon: "🍔",
        desc: "Gestion de menu, prise de commande et suivi des réservations.",
        status: "active",
        model: "gemini-1.5-flash",
        instructions: "Vous êtes le sommelier/serveur virtuel Fiko. Conseillez nos plats signature."
      },
      {
        id: "agent-immo",
        companyId: "meta-review-company",
        name: "Agent Immobilier CIV",
        icon: "🏢",
        desc: "Capture de budget et fiches de visites de villas ou terrains en Côte d'Ivoire.",
        status: "active",
        model: "gemini-1.5-flash",
        instructions: "Vous effectuez l'accueil des locataires et acheteurs potentiels de villas de standing à Cocody."
      }
    ];

    for (const ag of agents) {
      await adminDb.collection('agents').doc(ag.id).set(ag, { merge: true });
    }

    // Seeding 5 rich conversations and 15 extra leads (Total 20 leads)
    const firstNames = ["Marie", "Koffi", "Awa", "Lassina", "Aminata", "Christian", "Cheikh", "Fatou", "Yasmine", "Moussa", "Serge", "Inès", "Jean-Eudes", "Saliou", "Audrey", "Karamoko", "Ousmane", "Tidiane", "Gnamien", "Bamba"];
    const lastNames = ["Koné", "Yao", "Diallo", "Traoré", "Diop", "Gnamien", "Sow", "Diatta", "Koné", "Coulibaly", "Koffi", "Touré", "Barry", "Cissé", "N'Guessan", "Sylla", "Diagne", "Bamba", "Meité", "Kaboré"];
    const statuses = ["WARM", "HOT", "CLOSED", "NEW", "CONTACTED"];
    const providers = ["Wave", "Orange Money", "MTN Money"];
    const cities = ["Cocody", "Plateau", "Yopougon", "Marcory", "Dakar", "Yoff", "San Pedro", "Bouaké", "Yamassoukro", "Douala"];

    for (let i = 0; i < 20; i++) {
      const phone = `+22507${Math.floor(10000000 + Math.random() * 90000000)}`;
      const name = `${firstNames[i]} ${lastNames[i]}`;
      const status = statuses[i % statuses.length];
      const dealValue = (i + 1) * 15000 + 4900;
      
      const history = i < 5 ? [
        { role: "user", content: "Bonjour, quel est le tarif de votre pack Premium ?" },
        { role: "assistant", content: `Bonjour ${firstNames[i]}! Notre pack Premium est proposé à ${dealValue.toLocaleString()} FCFA.` },
        { role: "user", content: `D'accord, je souhaite réserver. Est-ce que vous acceptez ${providers[i % providers.length]} ?` },
        { role: "assistant", content: `Absolument! Nous acceptons ${providers[i % providers.length]}. Nous préparons votre facture numérique.` }
      ] : [];

      await adminDb.collection('leads').doc(phone).set({
        id: `lead-${i+1}`,
        phone,
        name,
        email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
        companyId: "meta-review-company",
        status,
        dealValue,
        city: cities[i % cities.length],
        country: "Côte d'Ivoire",
        notes: i < 5 ? `Inbound prospect qualifié via IA Fiko. Intérêt pour le paiement direct par Mobile Money.` : `Saisie manuelle CRM.`,
        lastActivity: `Il y a ${i + 1} jours`,
        history,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      if (i < 5) {
        // Clear and reload messages to avoid duplicates
        const messageQuery = await adminDb.collection('messages').where('conversationId', '==', phone).get();
        for (const doc of messageQuery.docs) {
          await doc.ref.delete();
        }

        await adminDb.collection('messages').add({
          conversationId: phone,
          sender: 'client',
          content: "Bonjour, quel est le tarif de votre pack Premium ?",
          timestamp: FieldValue.serverTimestamp()
        });
        await adminDb.collection('messages').add({
          conversationId: phone,
          sender: 'ai',
          content: `Bonjour ${firstNames[i]}! Notre pack Premium est proposé à ${dealValue.toLocaleString()} FCFA.`,
          timestamp: FieldValue.serverTimestamp()
        });
      }
    }

    // Seeding 10 Payments logs
    const itemsList = ["Kit Couture Pro", "Formation Closeur Elite", "Licence Annuelle Fiko", "Sélection de Tissus Mode", "Abonnement Standard", "Campagne publicitaire WhatsApp", "Module IA Premium"];
    for (let i = 0; i < 10; i++) {
      const payId = `pay-${i + 1}`;
      await adminDb.collection('payments').doc(payId).set({
        id: payId,
        companyId: "meta-review-company",
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        phone: `+22507${Math.floor(10000000 + Math.random() * 90000000)}`,
        item: itemsList[i % itemsList.length],
        value: (i + 1) * 22000 + 1500,
        provider: providers[i % providers.length],
        status: i < 8 ? "success" : i === 8 ? "pending" : "failed",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    }

    console.log("Fiko OS Pre-loading of mock analytics, MRR and ROI data succeeded.");
  } catch (err) {
    console.warn("Preseeding details error:", err);
  }
}

async function initMetaReviewAccount() {
  const adminAuth = getAdminAuth();
  const uid = 'meta-review-account';
  const email = 'review@krypton-ia.tech';
  const displayName = 'Meta Review Team';
  const password = 'MetaReview2026!';

  try {
    let authUser;
    try {
      authUser = await adminAuth.getUser(uid);
      console.log(`[Fiko Security] Verified existing review account: ${authUser.email}`);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        console.log("[Fiko Security] Meta Review auth account absent. Creating a secure account...");
        authUser = await adminAuth.createUser({
          uid,
          email,
          emailVerified: true,
          password,
          displayName,
          disabled: false
        });
        console.log("[Fiko Security] Automated creation of Firebase Auth reviewer completed successfully.");
      } else {
        throw e;
      }
    }

    // Set / merge user details in Firestore
    await db.collection('users').doc(uid).set({
      uid,
      email,
      displayName,
      companyId: 'meta-review-company',
      role: 'super_admin',
      plan: 'elite',
      reviewMode: true,
      status: 'active',
      country: "Côte d'Ivoire",
      createdBy: 'system',
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    // Set / merge company detail in Firestore
    await db.collection('companies').doc('meta-review-company').set({
      id: 'meta-review-company',
      name: 'Meta Review Environment',
      subscription: 'elite',
      billingStatus: 'active',
      trial: false,
      reviewEnvironment: true,
      industry: 'Technology',
      country: "Côte d'Ivoire",
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    console.log("[Fiko Security] Firestore collections users/ companies/ fully synchronized.");
    
    // Seed demographic demo content
    await preseedDemoData(db);

  } catch (error) {
    console.error("[Fiko Security] Cannot bootstrap review credentials:", error);
  }
}

// Fire async background initialization
initMetaReviewAccount();

// Initialize Gemini AI (Lazy initialization)
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY environment variable is required');
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lead Scoring & Management Logic
async function handleIncomingMessage(phone: string, content: string) {
    const leadRef = db.collection('leads').doc(phone);
    const messageRef = db.collection('messages').doc();

    const timestamp = FieldValue.serverTimestamp();

    // 1. Save message
    await messageRef.set({
        conversationId: phone,
        sender: 'client',
        content,
        timestamp
    });

    // 2. Manage Lead & AI Reply
    const leadDoc = await leadRef.get();
    let history = leadDoc.exists ? leadDoc.data()?.history || [] : [];
    
    // AI Reply
    const prompt = `Lead: ${phone}. History: ${JSON.stringify(history.slice(-5))}. New message: ${content}. Reply professionally and suggest next step.`;
    const result = await getAIClient().models.generateContent({ model: "gemini-1.5-flash", contents: prompt });
    const reply = result.text || "Merci pour votre message.";

    // 3. Update Lead
    const updatedHistory = [...history, { role: 'user', content }, { role: 'assistant', content: reply }];
    
    await leadRef.set({
        phone,
        status: 'WARM', // Simple scoring logic
        history: updatedHistory,
        updatedAt: timestamp
    }, { merge: true });

    return reply;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // AI Campaign Assistant
  app.post("/api/campaigns/generate", async (req, res) => {
      try {
          const { objective, audience, tone } = req.body;
          const prompt = `You are an expert WhatsApp marketing copywriter. Generate a high-converting WhatsApp campaign message.
Objective: ${objective}
Audience: ${audience}
Tone: ${tone}

Requirements:
- Short version and long version
- Use emojis appropriately
- Include clear CTA
- Include variables like {{name}} where appropriate, enclosed in double curly braces.

Format your response as a JSON array where each object has:
- version: "short" | "long"
- content: "the message text"`;

          const result = await getAIClient().models.generateContent({ 
              model: "gemini-1.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: "application/json"
              }
          });
          
          const text = result.text;
          res.json(JSON.parse(text || "[]"));
      } catch (e: any) {
          console.error("AI Generation Error:", e);
          res.status(500).json({ error: "Generation failed", details: e.message });
      }
  });

  // AI Campaign Score Analyzer
  app.post("/api/campaigns/analyze", async (req, res) => {
      try {
          const { message } = req.body;
          const prompt = `SYSTEM MODE: CAMPAIGN PERFORMANCE ANALYZER

OBJECTIF :
Analyser une campagne WhatsApp marketing et prédire son potentiel de conversion.

Évaluer :
1. puissance du hook
2. qualité CTA
3. personnalisation
4. émotion
5. lisibilité
6. urgence
7. potentiel réponse

Retourner :
- score global /100
- scores détaillés (hookScore /25, ctaScore /20, emotionalScore /20, personalizationScore /15, readabilityScore /20)
- suggestions amélioration
- taux ouverture estimé
- taux réponse estimé

STYLE :
- précis
- stratégique
- orienté conversion

Message à analyser : "${message}"

OUTPUT JSON STRICT :
{
  "score": 0,
  "hookScore": 0,
  "ctaScore": 0,
  "emotionalScore": 0,
  "personalizationScore": 0,
  "readabilityScore": 0,
  "predictedOpenRate": 0,
  "predictedReplyRate": 0,
  "suggestions": []
}`;

          const result = await getAIClient().models.generateContent({ 
              model: "gemini-1.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: "application/json"
              }
          });
          
          const text = result.text;
          res.json(JSON.parse(text || "{}"));
      } catch (e: any) {
          console.error("AI Analysis Error:", e);
          res.status(500).json({ error: "Analysis failed", details: e.message });
      }
  });

  // AI Campaign Optimizer
  app.post("/api/campaigns/optimize", async (req, res) => {
      try {
          const { message, suggestions } = req.body;
          const prompt = `SYSTEM MODE: AI CAMPAIGN OPTIMIZATION ENGINE

OBJECTIF :
Prendre un brouillon de message WhatsApp marketing et l'optimiser pour maximiser la conversion.

MESSAGE ORIGINAL :
"${message}"

SUGGESTIONS D'AMÉLIORATION IDENTIFIÉES :
${suggestions ? suggestions.map((s: string) => '- ' + s).join('\\n') : 'Aucune'}

TÂCHE :
Réécrire complètement ce message pour :
1. Avoir un Hook explosif 
2. Augmenter le FOMO / l'urgence
3. Avoir un CTA hyper clair et actionnable
4. Garder les variables {{name}} et {{company}} si présentes ou utiles.

Retourne uniquement le texte du nouveau message, sans introduction ni format JSON, juste le texte prêt à envoyer. Le message doit paraître naturel, pas trop formel (c'est WhatsApp), utiliser des emojis avec parcimonie.`;

          const result = await getAIClient().models.generateContent({ 
              model: "gemini-1.5-flash",
              contents: prompt
          });
          
          res.json({ optimizedMessage: result.text || "" });
      } catch (e: any) {
          console.error("AI Optimization Error:", e);
          res.status(500).json({ error: "Optimization failed", details: e.message });
      }
  });

  // Campaign Send (Mock for WhatsApp API & Scheduler)
  app.post("/api/campaigns/send", async (req, res) => {
      try {
          const { campaignId, contactCount } = req.body;
          // In a real implementation we would enqueue a job or publish a pubsub message
          // and batch send via the WhatsApp API.
          console.log(`Queued campaign ${campaignId} for ${contactCount} contacts.`);
          res.json({ status: "queued", queuedAt: new Date().toISOString() });
      } catch (e: any) {
          res.status(500).json({ error: "Failed to queue campaign" });
      }
  });

  // WhatsApp Webhook
  app.get("/api/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      res.sendStatus(403);
    }
  });

  app.post("/api/webhook", async (req, res) => {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    if (entry?.messages?.[0]) {
      const message = entry.messages[0];
      const phone = message.from;
      const content = message.text.body;
      
      const reply = await handleIncomingMessage(phone, content);
      console.log("Reply:", reply); // Integration with WhatsApp API here
    }
    res.sendStatus(200);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(3000, "0.0.0.0", () => console.log(`Server running on http://localhost:3000`));
}

startServer();
