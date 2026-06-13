import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider } from "./types";

export class GeminiProvider implements AIProvider {
    public readonly providerName = "gemini";
    public readonly modelName = "gemini-1.5-flash-latest";
    public lastError: any = null;
    private client: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        if (!apiKey) throw new Error("Gemini API Key is required");
        this.client = new GoogleGenerativeAI(apiKey);
        this.model = this.client.getGenerativeModel({ model: this.modelName });
    }

    async generateResponse(prompt: string, context: string = ""): Promise<string> {
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
            status: error.status,
            statusText: error.statusText,
            timestamp: new Date().toISOString()
        };
    }

    getLastError() {
        return this.lastError;
    }

    async verify(): Promise<boolean> {
        try {
            const result = await this.model.generateContent("Say OK");
            return !!result.response.text();
        } catch (e: any) {
            this.captureError(e);
            return false;
        }
    }
}
