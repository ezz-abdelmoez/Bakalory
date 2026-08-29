# EDU_BACKEND_FILE_STORAGE

How lesson files (and, in the future, videos and links) are organized, stored,
and served. This is the contract the backend must implement. The frontend
already follows it via `src/lib/course-config.ts`.

## Hierarchy

```txt
Stage (المرحلة) → Subject (المادة/المسار) → Unit (الوحدة) → Lesson (الدرس) → Resource (الملف)
```

The current MVP serves exactly one course:

| Layer | slug | title |
|---|---|---|
| Stage | `2bac` | السنة الثانية باكالوريا |
| Subject | `engineering-cs` | الهندسة والحاسب |

It is deliberately a two-level prefix (`{stage}/{subject}`) so that adding new
years, tracks, or subjects later is purely additive — insert a segment (e.g. a
`{track}` between subject and lesson) without breaking existing links.

## Storage path convention

```
/resources/{stage}/{subject}/{lesson-slug}/{category}/{file-name}
```

Concrete example for the first lesson of the course:

```txt
resources/
└── 2bac/                          ← المرحلة الدراسية
    └── engineering-cs/            ← المادة / المسار
        └── introduction-to-it/    ← الدرس (slug)
            ├── explanation/       ← ملف الشرح (PDF)
            │   └── شرح-الدرس.pdf
            ├── slides/            ← السلايدات (PPTX/PDF)
            │   └── الدرس.pptx
            ├── exercises/         ← التمارين (ZIP)
            │   └── تمارين.zip
            ├── code/              ← الأكواد (.py / .sql / ...)
            │   └── example.py
            ├── images/            ← الصور والمخططات
            │   └── مخطط.png
            ├── videos/            ← الفيديوهات المرفوعة (mp4/webm)
            │   └── شرح.mp4
            └── documents/         ← مستندات أخرى
```

### Category ← type mapping

| Resource type | category folder |
|---|---|
| `pdf` | `explanation` |
| `slides` | `slides` |
| `code` | `code` |
| `exercise`, `zip` | `exercises` |
| `image` | `images` |
| `doc` | `documents` |
| `video` (uploaded file) | `videos` |
| `link`, `video` (external URL) | no file — `url` field |

The helper `buildResourcePath(lessonSlug, type, fileName)` in
`src/lib/course-config.ts` is the single source of truth for building these
paths on the frontend; the backend must produce identical `filePath` values.

## Resource model (extensible)

```ts
type ResourceType =
  | "pdf" | "slides" | "code" | "exercise" | "image" | "zip" | "doc"
  | "video"   // NEW — uploaded mp4/webm or an external/YouTube URL
  | "link";   // NEW — any external URL (reference, article, tool…)

type ResourceSource = "upload" | "external";

interface ResourceDto {
  id: string;
  lessonId: string;
  title: string;          // "شرح الدرس"
  type: ResourceType;
  source: ResourceSource; // upload = stored file, external = hosted elsewhere
  fileName?: string;      // original/display name (uploads)
  filePath?: string;      // /resources/{stage}/{subject}/{lesson}/{category}/{file}
  url?: string;           // external URL (video / link)
  mimeType?: string;      // application/pdf, video/mp4, video/youtube, …
  size?: string;          // "2.4 MB" (human readable)
  duration?: number;      // minutes (video)
  description: string;
  downloadable: boolean;
  viewable: boolean;      // can open/play inline or in a new tab
}
```

Rules:
- `source: "upload"` ⇒ `filePath` is required.
- `source: "external"` ⇒ `url` is required (a YouTube watch/embed URL or any
  https URL).
- A resource may be both viewable and downloadable.

## Serving

- In the static/frontend-only MVP, uploads live under `public/resources/…` and
  are served directly by the web server (`unoptimized` images, plain static).
- In production with a backend, the same logical paths are served from object
  storage / CDN. **Keep the URL path identical** so the frontend never changes.

## Upload API (backend, `X-Client-Surface: admin`)

```txt
POST   /v1/lessons/:slug/resources
       multipart/form-data:
         file       = the uploaded file (required)
         title      = "شرح الدرس"
         type       = pdf | slides | code | exercise | image | zip | doc | video
         description = optional
       → 201 ResourceDto (source=upload, filePath assigned by server)

POST   /v1/lessons/:slug/resources/link
       JSON body: { title, type: "link" | "video", url, duration?, description? }
       → 201 ResourceDto (source=external)

DELETE /v1/lessons/:slug/resources/:id   → 204
```

The server derives `category` from `type`, stores the file at
`/resources/{stage}/{subject}/{lesson-slug}/{category}/{file-name}` (preserving
a sanitized, unique file name), and records `mimeType` + `size`.

## Videos & links (frontend behavior, already implemented)

- `type: "video"` + YouTube URL → embedded iframe player.
- `type: "video"` + `url`/`filePath` pointing to mp4 → `<video controls>`.
- `type: "link"` → "فتح الرابط" button (opens in a new tab), shown with an
  `خارجي` badge.
- Only `downloadable` resources render a تحميل button.

## Migration notes

- Demo content (legacy) uses `/lessons/lesson-XX/…`; **new real content must use
  `/resources/{stage}/{subject}/…`**.
- Adding a video later requires no schema change — just add a resource row with
  `type: "video"`.
