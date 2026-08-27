import { z } from "zod";

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export const lessonStatusSchema = z.enum(["published", "draft"]);
export const lessonSortSchema = z.enum([
  "default",
  "newest",
  "duration",
  "difficulty",
]);
export const resourceTypeSchema = z.enum([
  "pdf",
  "slides",
  "code",
  "exercise",
  "image",
  "zip",
  "doc",
]);

export const unitColorSchema = z.enum(["blue", "green", "violet", "amber"]);

export const unitSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  order: z.number().int(),
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().min(1),
  color: unitColorSchema,
  lessonCount: z.number().int().nonnegative(),
  questionCount: z.number().int().nonnegative(),
});

export const lessonSummarySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  unitId: z.string().min(1),
  unitTitle: z.string().min(1),
  difficulty: difficultySchema,
  duration: z.number().int().nonnegative(),
  status: lessonStatusSchema,
  tags: z.array(z.string()),
  questionCount: z.number().int().nonnegative(),
  resourceCount: z.number().int().nonnegative(),
  updatedAt: z.string().min(1),
});

export const unitDetailSchema = unitSchema.extend({
  lessons: z.array(lessonSummarySchema),
});

export const lessonContentSchema = z.object({
  introduction: z.string(),
  objectives: z.array(z.string()),
  concepts: z.array(
    z.object({ title: z.string(), body: z.string() })
  ),
  explanation: z.string(),
  examples: z.array(
    z.object({
      title: z.string(),
      language: z.enum(["python", "sql", "pseudo", "text"]).optional(),
      code: z.string().optional(),
      markdown: z.string().optional(),
    })
  ),
  summary: z.string().optional(),
});

export const lessonSchema = lessonSummarySchema.extend({
  unitSlug: z.string().min(1),
  content: lessonContentSchema,
});

export const lessonFilterSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  search: z.string().optional(),
  unitId: z.string().optional(),
  difficulty: difficultySchema.optional(),
  status: lessonStatusSchema.optional(),
  sort: lessonSortSchema.optional(),
});

export const lessonNavigationSchema = z.object({
  previous: lessonSummarySchema.optional(),
  next: lessonSummarySchema.optional(),
});

export const resourceSchema = z.object({
  id: z.string().min(1),
  lessonId: z.string().min(1),
  title: z.string().min(1),
  type: resourceTypeSchema,
  fileName: z.string().min(1),
  filePath: z.string().min(1),
  size: z.string(),
  description: z.string(),
  downloadable: z.boolean(),
  viewable: z.boolean(),
});
