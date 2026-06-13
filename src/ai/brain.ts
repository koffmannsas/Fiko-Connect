import { GeminiProvider } from "./providers/gemini.provider";
import { FallbackProvider } from "./providers/fallback.provider";
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export class FikoBrain {
    private gemini: GeminiProvider | null = null;
    private fallback: FallbackProvider;

    constructor() {
        this.fallback = new FallbackProvider();
        const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (geminiKey) {
            this.gemini = new GeminiProvider(geminiKey);
        }
    }

    async generateSmartResponse(companyId: string, leadId: string, message: string, businessContext: string) {
        const db = getFirestore();
        let historyPrompt = "";

        try {
            // Retrieve last 5 messages for short-term memory
            const historySnap = await db.collection('messages')
                .where('conversationId', '==', leadId)
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get();

            const history = historySnap.docs
                .map(d => `${d.data().sender === 'client' ? 'Client' : 'Assistant'}: ${d.data().content}`)
                .reverse()
                .join("\n");

            if (history) {
                historyPrompt = `\nHistorique récent des échanges:\n${history}\n`;
            }
        } catch (e) {
            console.error("[FikoBrain] Error fetching history:", e);
        }

        const prompt = `Tu es Fiko Closer.
        ID Client: ${leadId}${historyPrompt}
        Nouveau message Client: ${message}

        Réponds de manière concise, humaine et persuasive. Objectif: Closer la vente.`;

        try {
            if (!this.gemini) throw new Error("GEMINI_NOT_CONFIGURED");
            return await this.gemini.generateResponse(prompt, businessContext);
        } catch (error: any) {
            console.error(`[FikoBrain] Primary Provider Failed. Error: ${error.message}`);

            // Log failure to Firestore
            try {
                const db = getFirestore();
                await db.collection('ai_failures').add({
                    companyId,
                    leadId,
                    provider: "gemini",
                    model: this.gemini?.modelName,
                    error: error.message,
                    details: this.gemini?.lastError || null,
                    timestamp: FieldValue.serverTimestamp()
                });
            } catch (fsErr) {
                console.error("[FikoBrain] Failed to log failure to Firestore", fsErr);
            }

            // Return Fallback
            return await this.fallback.generateResponse();
        }
    }

    getProvidersStatus() {
        return {
            gemini: !!this.gemini,
            openai: false,
            claude: false,
            deepseek: false,
            fallback: true
        };
    }

    async getStatus() {
        let geminiVerified = false;
        if (this.gemini) {
            geminiVerified = await this.gemini.verify();
        }

        return {
            provider: "gemini",
            model: this.gemini?.modelName || "none",
            status: geminiVerified ? "ok" : "degraded",
            geminiVerified,
            fallbackActive: true
        };
    }

    getDebugInfo() {
        const geminiError = this.gemini?.lastError;
        const errorMsg = geminiError?.message || "";

        return {
            provider: "gemini",
            model: this.gemini?.modelName || "none",
            apiKeyPresent: !!process.env.GOOGLE_GEMINI_API_KEY,
            verificationPassed: !geminiError && !!this.gemini,
            lastError: geminiError,
            billingError: errorMsg.toLowerCase().includes("billing") || errorMsg.includes("402"),
            quotaError: errorMsg.includes("429") || errorMsg.toLowerCase().includes("quota"),
            status: this.gemini ? (geminiError ? "error" : "ok") : "missing"
        };
    }
}

export const brain = new FikoBrain();
