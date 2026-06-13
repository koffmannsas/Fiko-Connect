import { ProviderRegistry } from "./provider-registry";
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export class AIOrchestrator {
    private registry: ProviderRegistry;

    constructor() {
        this.registry = new ProviderRegistry();
    }

    async generateResponse(companyId: string, leadId: string, prompt: string, context: string): Promise<string> {
        const providers = this.registry.getPriorityList();

        for (const provider of providers) {
            try {
                console.log(`[ORCHESTRATOR] Trying provider: ${provider.providerName}`);
                const response = await provider.generateResponse(prompt, context);
                return response;
            } catch (error: any) {
                console.warn(`[ORCHESTRATOR] Provider ${provider.providerName} failed: ${error.message}`);

                // Log failure to Firestore
                try {
                    const db = getFirestore();
                    await db.collection('ai_failures').add({
                        companyId,
                        leadId,
                        provider: provider.providerName,
                        model: provider.modelName,
                        error: error.message,
                        timestamp: FieldValue.serverTimestamp()
                    });
                } catch (fsErr) {
                    console.error("[ORCHESTRATOR] Failed to log failure", fsErr);
                }

                // Continue to next provider in priority list
                continue;
            }
        }

        throw new Error("ALL_PROVIDERS_FAILED");
    }

    async getFullStatus() {
        return await this.registry.getStatus();
    }

    getRegistry() {
        return this.registry;
    }
}

export const orchestrator = new AIOrchestrator();
