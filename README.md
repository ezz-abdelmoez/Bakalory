# البرمجة والذكاء الاصطناعي — منصة تعليمية (2ème Bac)

A modern, Arabic-first (RTL) educational website for **Programming & Artificial
Intelligence — 2nd Year Baccalaureate (2ème Bac), Engineering & CS track
(الهندسة والحاسب)**. Structured lessons, downloadable resources (PDF شرح +
slides), interactive quizzes with instant results and answer review,
previous/next navigation, and a local student dashboard.

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

## First-semester curriculum

| # | Unit | Lessons |
|---:|---|---|
| 1 | تكنولوجيا المعلومات والمجتمع | 1-1 تطور تكنولوجيا المعلومات والتحول الاجتماعي · 1-2 كيف يعمل الذكاء الاصطناعي · 1-3 الذكاء الاصطناعي في الحياة اليومية والصناعة · 1-4 القضايا الأخلاقية للذكاء الاصطناعي |
| 2 | الأمن السيبراني | 2-1 تقنيات التشفير والمصادقة · 2-2 تصميم أمن الشبكات · 2-3 الاستجابة للحوادث وإدارة المخاطر |
| 3 | تطبيقات الويب | 3-1 البنية العامة لتطبيقات الويب · 3-2 طرق الاتصال في تطبيقات الويب · 3-3 أساسيات تكنولوجيا الواجهة الأمامية |
| 4 | تصميم الويب والوسائط | 4-1 أنواع الوسائط وخصائصها · 4-2 تصميم المعلومات وتجربة المستخدم للمواقع · 4-3 أساليب تقييم المواقع الإلكترونية · 4-4 عملية التحسين التكراري للمواقع |

The first lesson is published. The remaining 13 lessons are represented as
private draft records, ready to receive their content, resources, and quiz
questions without exposing incomplete lessons to students.

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
