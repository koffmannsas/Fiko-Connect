import { AIProvider } from "./types";

export class FallbackProvider implements AIProvider {
    public readonly providerName = "fallback";
    public readonly modelName = "static-courtesy";
    public lastError: any = null;

    async generateResponse(): Promise<string> {
        return "Bonjour 👋\n\nJe traite actuellement un volume élevé de demandes.\n\nVotre message a bien été reçu et un conseiller FiKO vous répondra dans quelques instants.";
    }

    getLastError() { return null; }
    async verify(): Promise<boolean> { return true; }
}
