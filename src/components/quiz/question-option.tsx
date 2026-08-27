import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function QuestionOption({
  text,
  selected,
  multiple,
  onToggle,
}: {
  id: string;
  text: string;
  selected: boolean;
  multiple: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role={multiple ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10"
          : "border-input bg-card hover:bg-accent/50"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
          multiple ? "rounded" : "rounded-full",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 bg-transparent"
        )}
      >
        {selected ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <span>{text}</span>
    </button>
  );
}
