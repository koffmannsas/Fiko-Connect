import { orchestrator } from "./orchestrator/ai-orchestrator";
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export class FikoBrain {
    async generateSmartResponse(companyId: string, leadId: string, message: string, businessContext: string) {
        const db = getFirestore();
        let historyPrompt = "";

        try {
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
                historyPrompt = `\nHistorique récent:\n${history}\n`;
            }
        } catch (e) {
            console.error("[FikoBrain] History fetch error:", e);
        }

        const prompt = `Tu es Fiko Closer.${historyPrompt}\nNouveau message Client: ${message}\nRéponds de manière concise et humaine. Objectif: Vendre.`;

        try {
            return await orchestrator.generateResponse(companyId, leadId, prompt, businessContext);
        } catch (error: any) {
            console.error(`[FikoBrain] Orchestrator fatal failure: ${error.message}`);
            return "Bonjour 👋 Un conseiller FiKO vous répondra dans quelques instants.";
        }
    }

    async getStatus() {
        const fullStatus = await orchestrator.getFullStatus();
        return {
            provider: "orchestrator",
            status: "ok",
            details: fullStatus
        };
    }

    getProvidersStatus() {
        // Simplified for UI
        return {
            gemini: true,
            openai: true,
            deepseek: true,
            fallback: true
        };
    }
}

export const brain = new FikoBrain();
