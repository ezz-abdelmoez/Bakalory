# برمجة 2 باك — منصة تعلم البرمجة (2ème Bac)

A modern, Arabic-first (RTL) educational website for **Programming / IT —
2nd Year Baccalaureate (2ème Bac), Engineering & CS track (الهندسة والحاسب)**.
Structured lessons, downloadable resources (PDF شرح + slides), interactive
quizzes with instant results and answer review, previous/next navigation, and a
local student dashboard.

**v1 is frontend-only** — no backend, no database, no real auth. All data comes
from local JSON fixtures, but the architecture is built exactly as if a backend
will be introduced tomorrow: the UI never touches JSON directly.

```txt
UI
 ↓  (@tanstack/react-query hooks / server functions)
Endpoint Factory  (typed operations, Zod-validated)
 ↓
Transport         (mock transport  ←→  fetch transport)
 ↓
Contract + Schema + Fixture (JSON)  →  future REST API
```

Switching from demo data to a real API is an **environment-flag change only**
(`NEXT_PUBLIC_API_MODE=mock` → `http`).

## Current curriculum

| Stage | Subject | Unit | Lesson |
|---|---|---|---|
| 2ème Bac | الهندسة والحاسب | تكنولوجيا المعلومات والمجتمع | تطور تكنولوجيا المعلومات والتحول الاجتماعي |

Files are organized under the extensible path convention:

```
public/resources/{stage}/{subject}/{lesson-slug}/{category}/{file}
```

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 ·
shadcn/ui (new-york) · Radix UI · TanStack Query 5 · Zod 3 · next-themes ·
sonner · react-markdown + remark-gfm + rehype-slug + rehype-highlight ·
use-debounce · Vitest 4 · pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local   # defaults to mock mode
pnpm dev                     # http://localhost:3000
```

## Scripts

```bash
pnpm dev         # dev server
pnpm build       # production build (TypeScript must be clean)
pnpm start       # serve the production build
pnpm lint        # ESLint
pnpm test:mock   # data-layer workflow suite (Vitest)
pnpm test:unit   # pure quiz-grading engine tests
```

## Routes

| Route | Description |
|---|---|
| `/` | Home (hero, live stats, units, latest lessons, features) |
| `/lessons` | Lesson list with debounced search + filters + sort |
| `/lessons/[slug]` | Lesson detail (markdown, resources, prev/next) |
| `/lessons/[slug]/quiz` | Interactive quiz (3 question types) |
| `/lessons/[slug]/quiz/result/[attemptId]` | Result + answer review |
| `/units` · `/units/[slug]` | Units and their lessons |
| `/dashboard` | Local progress dashboard |
| `/about` | About the platform |

## Project layout

- `app/` — thin App-Router pages under `(public)/`.
- `src/lib/api/` — the mock-first transport-adapter data layer.
- `src/lib/course-config.ts` — course hierarchy + file-path convention (source of truth for the backend).
- `src/components/` — UI, split by domain (`lessons/`, `quiz/`, `dashboard/`, …) + shadcn `ui/`.
- `tests/` — Vitest suites that drive the same endpoint factories the UI uses.
- `docs/backend-handoff/` — contract-derived backend documentation (data model, API contract, file storage).

See `docs/backend-handoff/README.md` for how to activate HTTP mode and what the
future backend must implement.
