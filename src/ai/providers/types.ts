export interface AIProvider {
    readonly providerName: string;
    readonly modelName: string;
    generateResponse(prompt: string, context?: string): Promise<string>;
    verify(): Promise<boolean>;
    getLastError(): any;
}
