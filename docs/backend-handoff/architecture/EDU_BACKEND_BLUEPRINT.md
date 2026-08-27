# EDU_BACKEND_BLUEPRINT — Phase 2 outline

This is a suggested implementation plan for replacing the mock transport with a
real backend. It is a recommendation, not a constraint on stack choice.

## Suggested stack

- **API**: REST (e.g. Fastify / NestJS / ASP.NET Core) exposing `/v1/*`.
- **Database**: PostgreSQL.
- **ORM**: Prisma or Drizzle.
- **Auth**: session cookies (HttpOnly) — the frontend already forwards cookies
  server-side and sends `credentials: "include"`.
- **Storage**: object storage / CDN for lesson files; the DB stores file paths
  (the frontend only ever receives `filePath`).

## Database tables (mirrors the data model doc)

```
units            (id, slug, order, title, description, icon, color)
lessons          (id, slug, number, title, description, unit_id FK,
                  difficulty, duration, status, tags jsonb, content jsonb,
                  updated_at)
resources        (id, lesson_id FK, title, type, file_name, file_path,
                  size, description, downloadable, viewable)
questions        (id, lesson_id FK, type, question, options jsonb,
                  correct_answers jsonb, explanation, points)
quiz_attempts    (id, lesson_id FK, user_id FK, answers jsonb, score, total,
                  percent, correct_count, incorrect_count, completed_at)
user_progress    (user_id FK, completed_lessons jsonb, quiz_scores jsonb,
                  last_visited_lesson_id, updated_at)   -- one row per user
```

## API / auth / session plan

1. Introduce `/v1/auth` (login/register/logout) with HttpOnly session cookies.
2. Gate `POST /v1/lessons/:slug/quiz/grade` and `/v1/progress*` behind
   authentication.
3. Move grading server-side: the client sends `GradeQuizInput` (answers only);
   the server loads `correctAnswers`, grades, persists `quiz_attempts`, and
   returns `QuizResultDto`. `correctAnswers` are never returned to the quiz UI.
4. Implement `GET /v1/quiz/attempts/:attemptId` to serve the review screen.
5. Serve `/v1/lessons/:slug/questions` (with correct answers) only to
   `admin`/`teacher` roles, or drop it from production entirely.

## RBAC plan

- `ApiScope` is already `"student" | "admin"` and is sent as the
  `X-Client-Surface` header (observability context, not authorization).
- Add role claims to the session; enforce server-side:
  - `student` → lessons, units, home, quiz grade, own progress.
  - `admin`/`teacher` → create/update units, lessons, resources, questions,
    plus question CRUD with `correctAnswers`.

## Migration from sessionStorage / localStorage

| Now (mock) | Later (api) |
|---|---|
| `src/lib/api/mock/mock-transport.ts` (in-memory) | `src/lib/api/transport/fetch-transport.ts` via `NEXT_PUBLIC_API_MODE=http` |
| `src/lib/api/mock/mock-store.ts` attempts in `sessionStorage` | `quiz_attempts` table + `GET /v1/quiz/attempts/:attemptId` |
| `src/lib/progress/local-progress-repository.ts` (localStorage) | `src/lib/progress/…` remote repository → `GET/PUT /v1/progress` (`NEXT_PUBLIC_PROGRESS_MODE=api`) |

The progress repository interface (`src/lib/progress/progress-repository.ts`) is
already the swap point: implement a `remoteProgressRepository()` that calls
`/v1/progress` and flip `NEXT_PUBLIC_PROGRESS_MODE`.

## Rollout checklist

1. Stand up the backend and implement the frozen contract from
   `EDU_BACKEND_API_CONTRACT.md`.
2. Point `.env` at it: `NEXT_PUBLIC_API_MODE=http`, `API_INTERNAL_URL=…`.
3. Run `pnpm test:mock` (still green — it exercises the mock directly).
4. Verify every route in the acceptance checklist against the real API.
5. Migrate progress/attempts from localStorage/sessionStorage to the API.
