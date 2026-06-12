import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider {
    private client: GoogleGenerativeAI;
    private model: any;
    public readonly modelName = "gemini-1.5-flash-latest"; // Using -latest to avoid specific version issues

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
            return response.text();
        } catch (error: any) {
            console.error("[GeminiProvider] Error:", error.message);
            throw error;
        }
    }

    async verify() {
        try {
            const result = await this.model.generateContent("ping");
            return !!result.response.text();
        } catch (e) {
            return false;
        }
    }
}
