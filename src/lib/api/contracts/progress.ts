export interface LessonScoreDto {
  bestScore: number;
  attempts: number;
  lastScore: number;
  lastAttemptAt: string;
}

export interface ProgressDto {
  version: 1;
  completedLessons: string[];
  quizScores: Record<string, LessonScoreDto>;
  lastVisitedLessonId?: string;
  updatedAt: string;
}
