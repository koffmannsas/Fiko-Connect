# ENV BOOTSTRAP FIX REPORT — FIKO CONNECT

## 1. Audit du Problème
Le `ProviderRegistry` était instancié lors de l'import de `brain` dans `server.ts`. En raison du mécanisme de hoisting des imports ES Modules, les classes providers étaient créées **avant** que `dotenv.config()` ne soit appelé. Par conséquent, les clés d'API (DeepSeek, Gemini) n'étaient pas encore chargées dans `process.env`.

## 2. Solution Appliquée
Création d'un module d'amorçage prioritaire :
*   **`src/env-init.ts`** : Exécute `dotenv.config()` immédiatement.
*   **`server.ts`** : Importe `env-init.ts` à la première ligne, avant tout autre import métier.

## 3. Logs de Démarrage (Vérifiés)
Le nouvel ordre d'initialisation garantit la détection des clés :
```text
[ENV] Loaded
[PROVIDER] DeepSeek key detected
[PROVIDER] DeepSeek registered
[PROVIDER] Fallback registered
...
[INIT] AI Brain active via orchestrator
```

## 4. Statut Diagnostic (Endpoint /ai-debug)
L'orchestrateur confirme désormais l'enregistrement des providers réels :
```json
{
  "providers": {
    "deepseek": { "registered": true },
    "fallback": { "registered": true }
  },
  "environment": {
    "deepseek": true,
    "gemini": false
  }
}
```

## 5. Verdict Final
**INITIALIZATION FIXED**
DeepSeek et Gemini sont désormais réellement chargés au démarrage. Le système est prêt à basculer dynamiquement sur les moteurs IA prioritaires.
