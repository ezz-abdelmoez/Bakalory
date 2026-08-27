import { z } from "zod";

export const apiScopeSchema = z.enum(["student", "admin"]);

export const pageMetaSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const apiProblemSchema = z.object({
  status: z.number().int(),
  code: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  fields: z.record(z.string(), z.array(z.string())).optional(),
  requestId: z.string().optional(),
});

export const listFilterSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  search: z.string().optional(),
});

export function pageResultSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    meta: pageMetaSchema,
  });
}
