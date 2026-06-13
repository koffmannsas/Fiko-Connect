import { AIProvider } from "./types";

export class OpenAIProvider implements AIProvider {
    public readonly providerName = "openai";
    public readonly modelName = "gpt-4o-mini";
    public lastError: any = null;
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateResponse(prompt: string, context: string = ""): Promise<string> {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: [
                        { role: "system", content: context || "You are Fiko Closer, a sales expert." },
                        { role: "user", content: prompt }
                    ]
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "OpenAI API Error");

            this.lastError = null;
            return data.choices[0].message.content;
        } catch (error: any) {
            this.lastError = { message: error.message, timestamp: new Date().toISOString() };
            throw error;
        }
    }

    getLastError() { return this.lastError; }

    async verify(): Promise<boolean> {
        try {
            await this.generateResponse("ping", "test");
            return true;
        } catch (e) {
            return false;
        }
    }
}
