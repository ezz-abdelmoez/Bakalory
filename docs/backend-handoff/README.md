# Backend Handoff — برمجة 2 باك

This folder describes how the frontend is wired to data, and exactly what a
future backend must implement to replace the in-memory mock without touching a
single UI component.

## Mock-first architecture

The app never talks to JSON fixtures or `fetch` directly. Every read/write goes
through this pipeline:

```txt
UI (React Query hooks / server functions)
  ↓
Endpoint factories  (typed operations, Zod-validated)
  ↓
ApiClient           (request/response contract validation, envelope unwrap)
  ↓
Transport           (mock transport  ←→  fetch transport)
  ↓
Contract + Zod schema + JSON fixture   →   future REST API
```

Key files:

| Layer | Location |
|---|---|
| Contracts (DTOs) | `src/lib/api/contracts/*.ts` |
| Zod schemas | `src/lib/api/schemas/*.ts` |
| Transport interface | `src/lib/api/transport/types.ts` |
| Mock transport | `src/lib/api/mock/mock-transport.ts` |
| Fetch transport | `src/lib/api/transport/fetch-transport.ts` |
| ApiClient (validation) | `src/lib/api/client/api-client.ts` |
| Browser client | `src/lib/api/client/browser-client.ts` |
| Server client | `src/lib/api/client/server-client.ts` |
| Endpoint factories | `src/lib/api/modules/{home,units,lessons,quiz}/endpoint.ts` |
| Query keys / hooks | `src/lib/api/modules/*/keys.ts` + `hooks.ts` |
| Server functions | `src/lib/api/modules/*/server.ts` |
| Fixtures | `src/lib/api/mock/fixtures/*.json` |
| Progress persistence | `src/lib/progress/*` |

## How HTTP mode activates

The mode is an environment-flag switch only:

```dotenv
NEXT_PUBLIC_API_MODE=mock   # → http when the backend exists
NEXT_PUBLIC_API_BASE_PATH=/api
API_INTERNAL_URL=http://localhost:5067   # server-side URL, never exposed
API_TIMEOUT_MS=15000
NEXT_PUBLIC_PROGRESS_MODE=local          # → api later
```

- `src/lib/api/client/browser-client.ts` picks `createMockTransport()` or
  `createFetchTransport({ baseUrl: /api, … })`.
- `src/lib/api/client/server-client.ts` mirrors it, using `API_INTERNAL_URL`
  and forwarding the `cookie` header (only in HTTP mode).
- **No component branches on the mode.** The UI keeps calling the same hooks
  and server functions.

## What the backend must satisfy

1. Implement the endpoints in
   [`architecture/EDU_BACKEND_API_CONTRACT.md`](./architecture/EDU_BACKEND_API_CONTRACT.md)
   under the base path `/v1`.
2. Return payloads that match the Zod schemas 1:1 — the client validates every
   response and throws `502 INVALID_API_RESPONSE` otherwise.
3. Return RFC-7807 problem documents on errors:
   `{ status, code, title, detail, fields?, requestId? }`.
4. Grade quizzes server-side (the `POST /v1/lessons/:slug/quiz/grade` endpoint)
   so `correctAnswers` never reach the browser in quiz mode.

## Documents

- [`EDU_BACKEND_DATA_MODEL.md`](./architecture/EDU_BACKEND_DATA_MODEL.md) — ER-style
  model derived from the contracts.
- [`EDU_BACKEND_API_CONTRACT.md`](./architecture/EDU_BACKEND_API_CONTRACT.md) — frozen
  endpoint table and Zod shapes.
- [`EDU_BACKEND_FILE_STORAGE.md`](./architecture/EDU_BACKEND_FILE_STORAGE.md) — the
  file/folder hierarchy, resource taxonomy (pdf/slides/video/link…), and the
  upload API.
- [`EDU_BACKEND_BLUEPRINT.md`](./architecture/EDU_BACKEND_BLUEPRINT.md) — suggested
  phase-2 backend stack and migration plan.
