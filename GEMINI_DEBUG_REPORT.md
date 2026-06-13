# GEMINI DEBUG REPORT — FIKO CONNECT

## 1. Audit Diagnostic
L'analyse via `/ai-debug` et les logs de `GeminiProvider` a permis d'isoler la cause des échecs intermittents.

### Modèle Réellement Utilisé
**`gemini-1.5-flash-latest`**

## 2. Résultats des Tests au Démarrage
Le test `generateContent("Say OK")` est désormais exécuté lors de chaque initialisation du provider.

*   **Statut API Key :** Présente.
*   **Vérification Modèle :** Échouait précédemment sans log détaillé.
*   **Nouvelle Instrumentation :** Capture désormais le `status`, `statusText` et les détails du message Google (ex: `SAFETY`, `QUOTA`, `BILLING`).

## 3. Erreur Exacte Identifiée
L'erreur "models/gemini-1.5-flash is not found" provient de l'utilisation d'identifiants de modèles versionnés (v1beta) qui ont été dépréciés. L'utilisation du suffixe `-latest` ou la migration vers `gemini-2.0-flash` résout le problème de routage API.

## 4. Recommandations
1.  **Quota :** Surveiller les erreurs 429 via la collection `ai_failures`. Le système bascule déjà automatiquement vers le `FallbackProvider`.
2.  **Modèle :** Privilégier `gemini-1.5-flash-latest` pour la stabilité ou `gemini-2.0-flash` pour la performance accrue.
3.  **Billing :** Vérifier que le compte Google Cloud associé dispose d'un moyen de paiement valide si le volume dépasse le tier gratuit.

## 5. Verdict
**INSTRUMENTATION COMPLETE**
Le système est désormais capable d'auto-diagnostiquer ses pannes d'IA et de fournir une réponse de secours immédiate aux clients.
