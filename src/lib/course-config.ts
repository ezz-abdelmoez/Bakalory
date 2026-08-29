import type { ResourceType } from "@/lib/api/contracts/lesson";

/**
 * The educational hierarchy the platform serves, and the canonical storage
 * convention for lesson files. This is the single source of truth that the
 * future backend must mirror (see docs/backend-handoff).
 *
 * Hierarchy:
 *   Stage (المرحلة) → Subject (المادة/المسار) → Unit (الوحدة) → Lesson (الدرس) → Resource (الملف)
 *
 * For the current MVP there is exactly ONE course:
 *   السنة الثانية باكالوريا → مسار الهندسة والحاسب
 */
export const courseConfig = {
  slug: "2bac-engineering-cs",
  stage: {
    slug: "2bac",
    title: "السنة الثانية باكالوريا",
  },
  subject: {
    slug: "engineering-cs",
    title: "الهندسة والحاسب",
  },
  title: "برمجة — الهندسة والحاسب",
} as const;

/**
 * Canonical path convention for uploaded files:
 *
 *   /resources/{stage}/{subject}/{lesson-slug}/{category}/{file-name}
 *
 * Example:
 *   /resources/2bac/engineering-cs/introduction-to-it/explanation/شرح-الدرس.pdf
 *
 * Additive by design: if tracks/sections appear later, insert one extra
 * segment between `subject` and `lesson` without breaking existing links.
 */
export function buildResourcePath(
  lessonSlug: string,
  type: ResourceType,
  fileName: string
): string {
  const category = resourceCategoryByType[type];
  return `/resources/${courseConfig.stage.slug}/${courseConfig.subject.slug}/${lessonSlug}/${category}/${fileName}`;
}

/** Category folder inside a lesson, derived from the resource type. */
export const resourceCategoryByType: Record<ResourceType, string> = {
  pdf: "explanation",
  slides: "slides",
  code: "code",
  exercise: "exercises",
  image: "images",
  zip: "exercises",
  doc: "documents",
  video: "videos",
  link: "external",
};
