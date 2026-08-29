import type { QuizQuestionDto } from "@/lib/api/contracts/question";
import { QuestionOption } from "./question-option";
import { Badge } from "@/components/ui/badge";

const typeLabels: Record<QuizQuestionDto["type"], string> = {
  "single-choice": "اختيار واحد",
  "multiple-choice": "اختيار متعدد",
  "true-false": "صح أو خطأ",
};

export function QuestionCard({
  question,
  index,
  selected,
  onSelect,
}: {
  question: QuizQuestionDto;
  index: number;
  selected: string[];
  onSelect: (selected: string[]) => void;
}) {
  const multiple = question.type === "multiple-choice";

  function toggle(optionId: string) {
    if (multiple) {
      onSelect(
        selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId]
      );
    } else {
      onSelect([optionId]);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug">{question.question}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">{typeLabels[question.type]}</Badge>
        <Badge variant="outline">{question.points} نقطة</Badge>
        {multiple ? (
          <span className="text-xs text-muted-foreground">يمكنك اختيار أكثر من إجابة</span>
        ) : null}
      </div>

      <div
        role={multiple ? "group" : "radiogroup"}
        aria-label={`خيارات السؤال ${index + 1}`}
        className="flex flex-col gap-3"
      >
        {question.options.map((option) => (
          <QuestionOption
            key={option.id}
            id={option.id}
            text={option.text}
            multiple={multiple}
            selected={selected.includes(option.id)}
            onToggle={() => toggle(option.id)}
          />
        ))}
      </div>
    </div>
  );
}
