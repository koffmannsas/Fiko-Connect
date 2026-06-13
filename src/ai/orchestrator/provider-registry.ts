import { GeminiProvider } from "../providers/gemini.provider";
import { DeepSeekProvider } from "../providers/deepseek.provider";
import { OpenAIProvider } from "../providers/openai.provider";
import { FallbackProvider } from "../providers/fallback.provider";
import { AIProvider } from "../providers/types";

export class ProviderRegistry {
    private providers: Map<string, AIProvider> = new Map();
    private priorityList: string[] = ["deepseek", "gemini", "openai", "fallback"];

    constructor() {
        const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
        const deepseekKey = process.env.DEEPSEEK_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;

        if (deepseekKey) this.providers.set("deepseek", new DeepSeekProvider(deepseekKey));
        if (geminiKey) this.providers.set("gemini", new GeminiProvider(geminiKey));
        if (openaiKey) this.providers.set("openai", new OpenAIProvider(openaiKey));
        this.providers.set("fallback", new FallbackProvider());
    }

    getProvider(name: string): AIProvider | undefined {
        return this.providers.get(name);
    }

    getPriorityList(): AIProvider[] {
        return this.priorityList
            .map(name => this.providers.get(name))
            .filter((p): p is AIProvider => !!p);
    }

    async getStatus() {
        const status: any = {};
        for (const [name, provider] of this.providers) {
            const ok = await provider.verify();
            status[name] = ok ? "ok" : "error";
        }
        return status;
    }
}
