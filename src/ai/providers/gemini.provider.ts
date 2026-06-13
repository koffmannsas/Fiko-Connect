import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider {
    private client: GoogleGenerativeAI;
    private model: any;
    public readonly modelName = "gemini-1.5-flash-latest";
    public lastError: any = null;

    constructor(apiKey: string) {
        if (!apiKey) throw new Error("Gemini API Key is required");
        this.client = new GoogleGenerativeAI(apiKey);
        this.model = this.client.getGenerativeModel({ model: this.modelName });
    }

    async generateResponse(prompt: string, context: string = "") {
        const fullPrompt = context
            ? `Contexte: ${context}\n\nQuestion: ${prompt}`
            : prompt;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();
            this.lastError = null;
            return text;
        } catch (error: any) {
            this.captureError(error);
            throw error;
        }
    }

    private captureError(error: any) {
        this.lastError = {
            message: error.message,
            stack: error.stack,
            status: error.status,
            statusText: error.statusText,
            details: error.response?.data || error.details,
            timestamp: new Date().toISOString()
        };
        console.error("[GeminiProvider] CRITICAL ERROR CAPTURED:", JSON.stringify(this.lastError, null, 2));
    }

    async verify() {
        try {
            const result = await this.model.generateContent("Say OK");
            const text = result.response.text();
            if (text) {
                this.lastError = null;
                return true;
            }
            return false;
        } catch (e: any) {
            this.captureError(e);
            return false;
        }
    }
}
