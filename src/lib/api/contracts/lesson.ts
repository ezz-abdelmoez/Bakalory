import type { ListFilter } from "./common";

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonStatus = "published" | "draft";
export type LessonSort = "default" | "newest" | "duration" | "difficulty";
export type ResourceType =
  | "pdf"
  | "slides"
  | "code"
  | "exercise"
  | "image"
  | "zip"
  | "doc";

export interface LessonSummaryDto {
  id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  unitId: string;
  unitTitle: string;
  difficulty: Difficulty;
  duration: number;
  status: LessonStatus;
  tags: string[];
  questionCount: number;
  resourceCount: number;
  updatedAt: string;
}

export interface LessonContentDto {
  introduction: string;
  objectives: string[];
  concepts: { title: string; body: string }[];
  explanation: string;
  examples: {
    title: string;
    language?: "python" | "sql" | "pseudo" | "text";
    code?: string;
    markdown?: string;
  }[];
  summary?: string;
}

export interface LessonDto extends LessonSummaryDto {
  unitSlug: string;
  content: LessonContentDto;
}

export interface LessonFilter extends ListFilter {
  unitId?: string;
  difficulty?: Difficulty;
  status?: LessonStatus;
  sort?: LessonSort;
}

export interface ResourceDto {
  id: string;
  lessonId: string;
  title: string;
  type: ResourceType;
  fileName: string;
  filePath: string;
  size: string;
  description: string;
  downloadable: boolean;
  viewable: boolean;
}

export interface LessonNavigationDto {
  previous?: LessonSummaryDto;
  next?: LessonSummaryDto;
}
