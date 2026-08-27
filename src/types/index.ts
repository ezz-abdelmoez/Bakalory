import type { Difficulty, ResourceType } from "@/lib/api/contracts/lesson";
import type { UnitColor } from "@/lib/api/contracts/unit";

/**
 * UI-only presentation metadata derived from domain values. These are view
 * mappings, not DTOs — DTOs live exclusively under `src/lib/api/contracts`.
 */

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export const difficultyOrder: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export const resourceTypeLabels: Record<ResourceType, string> = {
  pdf: "ملف PDF",
  slides: "عرض تقديمي",
  code: "ملف برمجي",
  exercise: "تمارين",
  image: "صورة",
  zip: "أرشيف",
  doc: "مستند",
};

export const unitColorTokens: Record<UnitColor, string> = {
  blue: "blue",
  green: "green",
  violet: "violet",
  amber: "amber",
};
