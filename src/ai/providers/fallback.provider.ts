export class FallbackProvider {
    public readonly modelName = "static-resilience-fallback";

    async generateResponse() {
        return "Bonjour 👋\n\nJe traite actuellement un volume élevé de demandes.\n\nVotre message a bien été reçu et un conseiller FiKO vous répondra dans quelques instants.";
    }

    async verify() {
        return true;
    }
}
