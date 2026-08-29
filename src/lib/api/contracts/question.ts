export type QuestionType = "single-choice" | "multiple-choice" | "true-false";

export interface QuestionOptionDto {
  id: string;
  text: string;
}

export interface QuestionDto {
  id: string;
  lessonId: string;
  type: QuestionType;
  question: string;
  options: QuestionOptionDto[];
  correctAnswers: string[];
  explanation?: string;
  points: number;
}

export type QuizQuestionDto = Omit<QuestionDto, "correctAnswers">;

export interface GradeQuizInput {
  lessonId: string;
  answers: Record<string, string[]>;
  startedAt: string;
}

export interface GradedAnswerDto {
  questionId: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizResultDto {
  attemptId: string;
  lessonId: string;
  score: number;
  total: number;
  percent: number;
  correctCount: number;
  incorrectCount: number;
  answers: GradedAnswerDto[];
  completedAt: string;
}
