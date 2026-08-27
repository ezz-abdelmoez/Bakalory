import { describe, it, expect } from "vitest";

import { gradeQuiz, isAnswerCorrect } from "@/lib/quiz/grade-quiz";
import type { QuestionDto } from "@/lib/api/contracts/question";

const singleChoice: QuestionDto = {
  id: "q1",
  lessonId: "l1",
  type: "single-choice",
  question: "q?",
  options: [
    { id: "a", text: "A" },
    { id: "b", text: "B" },
  ],
  correctAnswers: ["a"],
  points: 1,
};

describe("grade-quiz pure engine", () => {
  it("single-choice: exactly one selected id must match", () => {
    expect(isAnswerCorrect("single-choice", ["a"], ["a"])).toBe(true);
    expect(isAnswerCorrect("single-choice", ["b"], ["a"])).toBe(false);
    expect(isAnswerCorrect("single-choice", ["a", "b"], ["a"])).toBe(false);
    expect(isAnswerCorrect("single-choice", [], ["a"])).toBe(false);
  });

  it("true-false behaves like single-choice", () => {
    expect(isAnswerCorrect("true-false", ["true"], ["true"])).toBe(true);
    expect(isAnswerCorrect("true-false", ["false"], ["true"])).toBe(false);
  });

  it("multiple-choice: set equality, order-insensitive", () => {
    expect(isAnswerCorrect("multiple-choice", ["a", "b"], ["b", "a"])).toBe(true);
    expect(isAnswerCorrect("multiple-choice", ["a"], ["a", "b"])).toBe(false);
    expect(isAnswerCorrect("multiple-choice", ["a", "b", "c"], ["a", "b"])).toBe(false);
    expect(isAnswerCorrect("multiple-choice", ["a", "x"], ["a", "b"])).toBe(false);
  });

  it("unanswered questions are marked incorrect", () => {
    const result = gradeQuiz([singleChoice], {});
    expect(result.answers[0].isCorrect).toBe(false);
    expect(result.score).toBe(0);
    expect(result.percent).toBe(0);
  });

  it("computes score, total and percent across mixed questions", () => {
    const questions: QuestionDto[] = [
      singleChoice,
      {
        id: "q2",
        lessonId: "l1",
        type: "multiple-choice",
        question: "q?",
        options: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
        ],
        correctAnswers: ["a", "b"],
        points: 3,
      },
    ];
    const result = gradeQuiz(questions, { q1: ["a"], q2: ["a", "b"] });
    expect(result.score).toBe(4);
    expect(result.total).toBe(4);
    expect(result.percent).toBe(100);
  });

  it("rounds percent to the nearest integer", () => {
    // 1 correct of 3 → 33.33% → 33
    const q2: QuestionDto = { ...singleChoice, id: "q2", points: 1 };
    const q3: QuestionDto = { ...singleChoice, id: "q3", points: 1 };
    const result = gradeQuiz([q2, q3, singleChoice], { q2: ["a"] });
    expect(result.score).toBe(1);
    expect(result.total).toBe(3);
    expect(result.percent).toBe(33);
  });

  it("preserves question order in the output", () => {
    const q2: QuestionDto = { ...singleChoice, id: "q2" };
    const result = gradeQuiz([singleChoice, q2], {});
    expect(result.answers.map((answer) => answer.questionId)).toEqual(["q1", "q2"]);
  });
});
