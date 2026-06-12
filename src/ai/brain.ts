import { GeminiProvider } from "./providers/gemini.provider";

export class FikoBrain {
    private gemini: GeminiProvider | null = null;

    constructor() {
        const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (geminiKey) {
            this.gemini = new GeminiProvider(geminiKey);
        }
    }

    async generateSmartResponse(companyId: string, leadId: string, message: string, businessContext: string) {
        if (!this.gemini) {
            throw new Error("No AI provider available");
        }

        const prompt = `Tu es Fiko Closer.
        ID Client: ${leadId}
        Message Client: ${message}

        Réponds de manière concise, humaine et persuasive. Objectif: Closer la vente.`;

        return await this.gemini.generateResponse(prompt, businessContext);
    }

    getProvidersStatus() {
        return {
            gemini: !!this.gemini,
            openai: false,
            claude: false,
            deepseek: false
        };
    }

    async getStatus() {
        return {
            provider: "gemini",
            model: this.gemini?.modelName || "none",
            status: this.gemini ? "ok" : "error"
        };
    }
}

export const brain = new FikoBrain();
