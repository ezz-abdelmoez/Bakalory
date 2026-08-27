import { Check, X } from "lucide-react";

import type {
  GradedAnswerDto,
  QuizQuestionDto,
} from "@/lib/api/contracts/question";
import { cn } from "@/lib/utils";

export function AnswerReview({
  question,
  graded,
  index,
}: {
  question: QuizQuestionDto;
  graded: GradedAnswerDto;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold leading-snug">
          <span className="text-muted-foreground">{index + 1}.</span>{" "}
          {question.question}
        </h3>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            graded.isCorrect
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive"
          )}
        >
          {graded.isCorrect ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {graded.isCorrect ? "صحيح" : "خطأ"}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {question.options.map((option) => {
          const isCorrectOption = graded.correctOptionIds.includes(option.id);
          const isSelected = graded.selectedOptionIds.includes(option.id);
          const isWrongSelection = isSelected && !isCorrectOption;

          return (
            <li
              key={option.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3",
                isCorrectOption
                  ? "border-success/50 bg-success/10"
                  : isWrongSelection
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-input"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  isCorrectOption
                    ? "bg-success text-success-foreground"
                    : isWrongSelection
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isCorrectOption ? (
                  <Check className="h-3 w-3" />
                ) : isWrongSelection ? (
                  <X className="h-3 w-3" />
                ) : null}
              </span>
              <span className="flex-1">{option.text}</span>
              {isCorrectOption ? (
                <span className="text-xs font-semibold text-success">
                  الإجابة الصحيحة
                </span>
              ) : null}
              {isWrongSelection ? (
                <span className="text-xs font-semibold text-destructive">
                  إجابتك
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      {graded.explanation ? (
        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">الشرح: </span>
          {graded.explanation}
        </div>
      ) : null}
    </div>
  );
}
