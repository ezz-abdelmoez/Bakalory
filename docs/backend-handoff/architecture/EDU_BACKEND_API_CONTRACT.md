# EDU_BACKEND_API_CONTRACT

Frozen REST contract. The frontend already implements and validates this via
the mock transport; the real backend must return byte-compatible payloads.

- Base path: `/v1`
- Envelope: success responses use `{ "data": <payload> }`; the client unwraps it.
- Errors: RFC-7807 problem documents — `{ status, code, title, detail?, fields?, requestId? }`.
- Content type: `application/json`.
- All responses are Zod-validated by the client; a mismatch raises `502 INVALID_API_RESPONSE`.

## Endpoints

| Method | Path | Query / Filter | Returns | Notes |
|---|---|---|---|---|
| GET | `/v1/home/content` | – | `HomeContentDto` | hero, benefits, features copy |
| GET | `/v1/units` | – | `UnitDto[]` | ordered by `order` |
| GET | `/v1/units/:idOrSlug` | – | `UnitDetailDto` | with `lessons: LessonSummaryDto[]`; 404 if missing |
| GET | `/v1/lessons` | `search, unitId, difficulty, status, sort, page, pageSize` | `PageResult<LessonSummaryDto>` | search over title/description/tags |
| GET | `/v1/lessons/:slug` | – | `LessonDto` | full content + computed counts; 404 if missing |
| GET | `/v1/lessons/:slug/resources` | – | `ResourceDto[]` | always a downloadable path |
| GET | `/v1/lessons/:slug/questions` | – | `QuestionDto[]` **with** `correctAnswers` | mock/tests/review only |
| GET | `/v1/lessons/:slug/quiz` | – | `QuizQuestionDto[]` **without** `correctAnswers` | what the running quiz receives |
| POST | `/v1/lessons/:slug/quiz/grade` | body `GradeQuizInput` | `QuizResultDto` | grades server-side; 404 if lesson missing |
| GET | `/v1/lessons/next/:slug` | – | `{ previous?, next? }` | lesson summaries for auto navigation |
| GET | `/v1/quiz/attempts/:attemptId` | – | `QuizResultDto` | attempt lookup for the result/review screen |

> `GET /v1/quiz/attempts/:attemptId` is an addition to the §5.7 table: it backs
> the `/lessons/[slug]/quiz/result/[attemptId]` review page. In the mock it
> reads graded attempts from `sessionStorage`; a real backend should persist
> attempts and serve them here.

### List & pagination shapes

```ts
type PageMeta = { page: number; pageSize: number; total: number; totalPages: number };
type PageResult<T> = { items: T[]; meta: PageMeta };
type ListFilter = { page?: number; pageSize?: number; search?: string };
type LessonFilter = ListFilter & {
  unitId?: string;
  difficulty?: Difficulty;
  status?: LessonStatus;
  sort?: LessonSort;
};
```

`GET /v1/lessons` defaults to `status: "published"`, `page: 1`, `pageSize: 12`,
`sort: "default"` (by `number` ascending).

## Zod shapes (authoritative)

All shapes mirror `src/lib/api/schemas/*.ts`. Abbreviated for readability; the
source files are the exact reference.

### Enums

```ts
Difficulty   = "beginner" | "intermediate" | "advanced"
LessonStatus = "published" | "draft"
LessonSort   = "default" | "newest" | "duration" | "difficulty"
ResourceType = "pdf" | "slides" | "code" | "exercise" | "image" | "zip" | "doc"
QuestionType = "single-choice" | "multiple-choice" | "true-false"
UnitColor    = "blue" | "green" | "violet" | "amber"
```

### DTO shapes

```ts
UnitDto {
  id: string; slug: string; order: number; title: string; description: string;
  icon: string; color: UnitColor; lessonCount: number; questionCount: number;
}
UnitDetailDto extends UnitDto { lessons: LessonSummaryDto[] }

LessonSummaryDto {
  id: string; slug: string; number: number; title: string; description: string;
  unitId: string; unitTitle: string; difficulty: Difficulty; duration: number;
  status: LessonStatus; tags: string[]; questionCount: number;
  resourceCount: number; updatedAt: string;
}

LessonContentDto {
  introduction: string; objectives: string[];
  concepts: { title: string; body: string }[];
  explanation: string;
  examples: { title: string; language?: "python"|"sql"|"pseudo"|"text"; code?: string; markdown?: string }[];
  summary?: string;
}
LessonDto extends LessonSummaryDto { unitSlug: string; content: LessonContentDto }

ResourceDto {
  id: string; lessonId: string; title: string; type: ResourceType;
  fileName: string; filePath: string; size: string; description: string;
  downloadable: boolean; viewable: boolean;
}

QuestionOptionDto { id: string; text: string }
QuestionDto {
  id: string; lessonId: string; type: QuestionType; question: string;
  options: QuestionOptionDto[]; correctAnswers: string[]; explanation?: string;
  points: number;
}
QuizQuestionDto = Omit<QuestionDto, "correctAnswers">

GradeQuizInput { lessonId: string; answers: Record<string, string[]>; startedAt: string }
GradedAnswerDto {
  questionId: string; selectedOptionIds: string[]; correctOptionIds: string[];
  isCorrect: boolean; explanation?: string;
}
QuizResultDto {
  attemptId: string; lessonId: string; score: number; total: number;
  percent: number; correctCount: number; incorrectCount: number;
  answers: GradedAnswerDto[]; completedAt: string;
}

HomeContentDto {
  heroTitle: string; heroSubtitle: string; primaryCta: string; secondaryCta: string;
  benefits: string[]; features: { title: string; description: string; icon: string }[];
}

LessonNavigationDto { previous?: LessonSummaryDto; next?: LessonSummaryDto }
```

## Error semantics

| Code | Status | Meaning |
|---|---|---|
| `NOT_FOUND` | 404 | missing unit/lesson/attempt |
| `INVALID_API_REQUEST` | 422 | request body failed its Zod schema (client-generated, with `fields`) |
| `INVALID_API_RESPONSE` | 502 | response failed its Zod schema (client-generated) |
| `REQUEST_TIMEOUT` | 408 | fetch transport timed out |

## Grading rules (server must reproduce)

- `single-choice` / `true-false`: exactly one selected id must equal the single
  correct id.
- `multiple-choice`: set equality — all correct selected, none extra, order-insensitive.
- Unanswered = incorrect.
- `score` = sum of correct `points`; `total` = sum of all `points`;
  `percent` = `round(score / total * 100)`.
- Output preserves question order and includes explanations.
