# ARCHITECTURE CURRENT STATE (TARGET RESTORATION)

## 1. High-Level Architecture
Fiko Connect is built as a highly resilient AI-Agent-as-a-Service platform.

### Backend Infrastructure
- **Runtime:** Node.js 22 (ESM)
- **Framework:** Express.js
- **Orchestration:** Multi-provider AI Brain (src/ai)
- **Database:** Firebase Firestore (Multi-tenant)
- **Auth:** Firebase Auth
- **AI Providers:** DeepSeek (Primary), Gemini 1.5 Flash (Failover), OpenAI GPT-4o (Failover)

## 2. Core Engines

### A. AI Orchestrator (The Brain)
Abstracts multiple AI models into a single interface with:
- **Automatic Failover:** Tries providers in sequence if one fails (429, 500, etc.).
- **Provider Registry:** Centralized management of provider health and configuration.
- **Cost Engine:** Tracks and estimates token usage per model.

### B. Message Deduplication Engine
Prevents duplicate message processing (common with WhatsApp Webhooks) using:
- **Atomic Locks:** Firestore document creation for every unique `message_id`.
- **Idempotency:** Ensures a message is only processed once by the AI and only one response is sent.

### C. Security & Isolation
- **HMAC Verification:** Validates incoming Meta webhooks using `x-hub-signature-256`.
- **Multi-tenant Resolver:** Maps WhatsApp numbers to specific `companyId` for strict data separation.
- **Firestore Rules:** Enforces that users can only access data belonging to their company.

## 3. Observability
Comprehensive diagnostic endpoints for real-time monitoring:
- `/health`: System uptime.
- `/ai-status`: Health of the AI Orchestrator.
- `/providers`: Detailed health of each AI provider (API key check, latency).
- `/firebase-status`: Firestore connection and collection availability.
- `/config-check`: Validation of environment variables.

## 4. Production Manifest
- **Source:** `server.ts` (Production Engine)
- **Logic:** `src/ai/brain.ts`
- **Environment:** `.env` managed by `src/env-init.ts`
