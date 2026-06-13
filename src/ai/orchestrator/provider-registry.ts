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

        if (deepseekKey) {
            console.log("[PROVIDER] DeepSeek key detected");
            this.providers.set("deepseek", new DeepSeekProvider(deepseekKey));
            console.log("[PROVIDER] DeepSeek registered");
        }
        if (geminiKey) {
            this.providers.set("gemini", new GeminiProvider(geminiKey));
            console.log("[PROVIDER] Gemini registered");
        }
        if (openaiKey) {
            this.providers.set("openai", new OpenAIProvider(openaiKey));
            console.log("[PROVIDER] OpenAI registered");
        }
        this.providers.set("fallback", new FallbackProvider());
        console.log("[PROVIDER] Fallback registered");
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
        for (const name of this.priorityList) {
            const provider = this.providers.get(name);
            if (!provider) {
                status[name] = "disabled";
                continue;
            }
            try {
                const ok = await provider.verify();
                console.log(`[PROVIDER] Verification for ${name}: ${ok ? "SUCCESS" : "FAILED"}`);
                status[name] = ok ? "ok" : "error";
            } catch (e) {
                console.error(`[PROVIDER] Verification error for ${name}:`, e);
                status[name] = "error";
            }
        }
        return status;
    }

    async getDebugInfo() {
        const debug: any = {
            env: {
                deepseek: !!process.env.DEEPSEEK_API_KEY,
                gemini: !!process.env.GOOGLE_GEMINI_API_KEY,
                openai: !!process.env.OPENAI_API_KEY
            },
            registered: Array.from(this.providers.keys()),
            verified: {},
            lastErrors: {}
        };

        for (const [name, provider] of this.providers) {
            try {
                debug.verified[name] = await provider.verify();
                debug.lastErrors[name] = provider.getLastError();
            } catch (e: any) {
                debug.verified[name] = false;
                debug.lastErrors[name] = e.message;
            }
        }

        return debug;
    }
}
