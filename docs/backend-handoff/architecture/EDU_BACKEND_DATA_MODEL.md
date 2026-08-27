# EDU_BACKEND_DATA_MODEL

Data model derived 1:1 from `src/lib/api/contracts/*.ts` and the Zod schemas in
`src/lib/api/schemas/*.ts`. Field names below are the exact wire names used by
the API (camelCase).

## Entities

### Unit

| Field | Type | Notes |
|---|---|---|
| id | string | primary key, e.g. `unit-algorithms` |
| slug | string | unique, URL segment |
| order | number (int) | presentation order |
| title | string | Arabic title |
| description | string | |
| icon | string | lucide icon name (`Workflow`, `Code2`, `Database`) |
| color | enum | `blue` \| `green` \| `violet` \| `amber` (presentation token) |
| lessonCount | number | computed (published lessons) |
| questionCount | number | computed (sum of lesson questions) |

`UnitDetailDto` adds `lessons: LessonSummaryDto[]`.

### Lesson

| Field | Type | Notes |
|---|---|---|
| id | string | primary key, e.g. `lesson-01` |
| slug | string | unique |
| number | number (int) | global lesson number |
| title | string | Arabic |
| description | string | |
| unitId | string | FK → Unit |
| unitTitle | string | denormalized for cards |
| unitSlug | string | only on `LessonDto` |
| difficulty | enum | `beginner` \| `intermediate` \| `advanced` |
| duration | number (int) | minutes |
| status | enum | `published` \| `draft` |
| tags | string[] | |
| questionCount | number | computed |
| resourceCount | number | computed |
| updatedAt | string (ISO date) | |
| content | LessonContent | only on `LessonDto` |

#### LessonContent

| Field | Type | Notes |
|---|---|---|
| introduction | string | markdown |
| objectives | string[] | |
| concepts | { title, body }[] | |
| explanation | string | markdown |
| examples | Example[] | |
| summary? | string | markdown |

#### Example

| Field | Type | Notes |
|---|---|---|
| title | string | |
| language? | enum | `python` \| `sql` \| `pseudo` \| `text` |
| code? | string | raw code block |
| markdown? | string | rich explanation |

### Resource

| Field | Type | Notes |
|---|---|---|
| id | string | primary key |
| lessonId | string | FK → Lesson |
| title | string | e.g. `شرح الدرس` |
| type | enum | `pdf` \| `slides` \| `code` \| `exercise` \| `image` \| `zip` \| `doc` |
| fileName | string | Arabic display / download name |
| filePath | string | public path, e.g. `/lessons/lesson-01/pdf/lesson.pdf` |
| size | string | human-readable, e.g. `2.4 MB` |
| description | string | |
| downloadable | boolean | |
| viewable | boolean | pdf/image open in a new tab |

### Question

| Field | Type | Notes |
|---|---|---|
| id | string | primary key |
| lessonId | string | FK → Lesson |
| type | enum | `single-choice` \| `multiple-choice` \| `true-false` |
| question | string | prompt |
| options | { id, text }[] | true-false uses exactly `[صحيح, خطأ]` |
| correctAnswers | string[] | option ids — **never sent to the quiz client** |
| explanation? | string | shown on review |
| points | number (int) | default 1 |

`QuizQuestionDto` = `QuestionDto` without `correctAnswers`.

### QuizAttempt (derived, in-memory now)

| Field | Type | Notes |
|---|---|---|
| attemptId | string | UUID |
| lessonId | string | FK → Lesson |
| score | number | earned points |
| total | number | available points |
| percent | number | 0–100 rounded |
| correctCount | number | |
| incorrectCount | number | |
| answers | GradedAnswer[] | preserves question order |
| completedAt | string (ISO) | |

`GradedAnswer` = `{ questionId, selectedOptionIds, correctOptionIds, isCorrect, explanation? }`.

### Progress (client-side now)

| Field | Type | Notes |
|---|---|---|
| version | literal `1` | |
| completedLessons | string[] | lesson ids |
| quizScores | Record<string, LessonScore> | lesson id → score |
| lastVisitedLessonId? | string | |
| updatedAt | string (ISO) | |

`LessonScore` = `{ bestScore, attempts, lastScore, lastAttemptAt }`.

## Relationships (ER summary)

```txt
Unit 1 ──── * Lesson 1 ──── * Resource
               │
               └───── * Question

Lesson 1 ──── * QuizAttempt

(Student) 1 ──── * Progress (one row per student)
```

## Notes for the backend

- `lessonCount`, `questionCount`, `resourceCount`, `unitTitle`, `unitSlug` are
  computed/denormalized — derive them server-side (or via joins) exactly as the
  mock transport does.
- `correctAnswers` must be withheld from `GET /lessons/:slug/quiz`; only the
  grading endpoint (server-side) may read them.
- `updatedAt` ordering drives the `newest` lesson sort and the dashboard's
  "recent lessons".
