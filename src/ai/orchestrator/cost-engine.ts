export class CostEngine {
    // Pricing per 1M tokens (Estimates)
    private prices: any = {
        "deepseek-chat": { input: 0.1, output: 0.1 },
        "gemini-1.5-flash-latest": { input: 0.075, output: 0.3 },
        "gpt-4o-mini": { input: 0.15, output: 0.6 }
    };

    calculateEstimate(model: string, inputTokens: number, outputTokens: number) {
        const p = this.prices[model] || { input: 0.1, output: 0.1 };
        return ((inputTokens / 1000000) * p.input) + ((outputTokens / 1000000) * p.output);
    }
}

export const costEngine = new CostEngine();
