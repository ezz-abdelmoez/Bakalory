import type { LessonSummaryDto } from "./lesson";

export type UnitColor = "blue" | "green" | "violet" | "amber";

export interface UnitDto {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  icon: string;
  color: UnitColor;
  lessonCount: number;
  questionCount: number;
}

export interface UnitDetailDto extends UnitDto {
  lessons: LessonSummaryDto[];
}
