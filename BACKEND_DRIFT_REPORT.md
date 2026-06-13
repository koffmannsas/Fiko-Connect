# BACKEND DRIFT REPORT

## Summary
A major regression has been detected on the `main` branch. The current backend on `main` is a legacy/prototype version and does not contain the certified production-grade infrastructure (Multi-Provider AI Orchestrator, Advanced Webhook Security, Deduplication Engine, Multi-tenant Isolation).

## 1. Critical Discrepancies

| Feature | Certified Version (Production) | Current Version (main) | Status |
| :--- | :--- | :--- | :--- |
| **AI Orchestration** | Multi-provider (DeepSeek, Gemini, OpenAI) with automatic failover. | Single provider (Gemini) with no failover. | **REGRESSION** |
| **AI SDK** | `@google/generative-ai` (v0.24+) | `@google/genai` (Legacy) | **OUTDATED** |
| **Webhook Security** | HMAC SHA-256 Signature Verification + X-Hub-Signature-256. | Basic token validation (GET only). | **SECURITY RISK** |
| **Deduplication** | Atomic Firestore-backed Deduplication Engine. | None (Subject to message loops). | **STABILITY RISK** |
| **Diagnostic Endpoints** | `/ai-debug`, `/providers`, `/ai-status`, `/firebase-status`. | None. | **OBSERVABILITY LOST** |
| **Data Isolation** | Multi-tenant resolver via `companyId`. | Single-tenant / Mock logic. | **SaaS BREACH** |
| **Environment** | Priority bootstrap (`env-init.ts`) for ES modules. | Standard loading (subject to race conditions). | **RUNTIME RISK** |

## 2. Missing Core Modules
The following directories and files are entirely missing from the `main` branch:
- `src/ai/` (The entire Brain, Orchestrator, and Provider logic)
- `src/env-init.ts`
- `docs/` (Strategic production reports)

## 3. Technical Debt Reintroduced
- **Mock Data:** `preseedDemoData` is being used in production code, polluting the database.
- **Legacy Dependencies:** Re-emergence of older SDKs.
- **Hardcoded Logic:** AI prompts and handling are hardcoded in `server.ts` instead of being orchestrated in `brain.ts`.

## 4. Risks for Production
- **Downtime:** If Gemini API fails, the entire system stops (no DeepSeek/OpenAI failover).
- **Security:** Webhook is vulnerable to replay attacks and unauthorized POST requests.
- **Cost:** No token tracking or cost-efficient model routing (DeepSeek is cheaper for primary tasks).
- **Scalability:** The lack of message deduplication will cause duplicate billing and user frustration during Meta retries.

## 5. Decision
**RESTORATION MANDATORY.** The backend must be reverted/updated to the certified state immediately to ensure production stability and security.
