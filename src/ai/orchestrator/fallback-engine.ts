import { AIProvider } from "../providers/types";

export class FallbackEngine {
    async executeWithFailover(providers: AIProvider[], prompt: string, context: string, onFail?: (p: AIProvider, err: Error) => void): Promise<string> {
        for (const provider of providers) {
            try {
                return await provider.generateResponse(prompt, context);
            } catch (error: any) {
                if (onFail) onFail(provider, error);
                continue;
            }
        }
        throw new Error("ALL_PROVIDERS_FAILED");
    }
}

export const fallbackEngine = new FallbackEngine();
