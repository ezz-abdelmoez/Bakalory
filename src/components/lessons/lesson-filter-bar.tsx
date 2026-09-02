"use client";

import { useUnits } from "@/lib/api/modules/units/hooks";
import type { Difficulty, LessonSort } from "@/lib/api/contracts/lesson";
import { difficultyLabels } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const difficultyOptions: Difficulty[] = ["beginner", "intermediate", "advanced"];

const sortOptions: { value: LessonSort; label: string }[] = [
  { value: "default", label: "الترتيب الافتراضي" },
  { value: "newest", label: "الأحدث" },
  { value: "duration", label: "حسب المدة" },
  { value: "difficulty", label: "حسب الصعوبة" },
];

export function LessonFilterBar({
  unitId,
  difficulty,
  sort,
  onUnitChange,
  onDifficultyChange,
  onSortChange,
}: {
  unitId: string;
  difficulty: string;
  sort: LessonSort;
  onUnitChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onSortChange: (value: LessonSort) => void;
}) {
  const { data: units } = useUnits();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="unit-filter">الوحدة</Label>
        <Select value={unitId} onValueChange={onUnitChange}>
          <SelectTrigger id="unit-filter" aria-label="تصفية حسب الوحدة">
            <SelectValue placeholder="كل الوحدات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الوحدات</SelectItem>
            {units?.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="difficulty-filter">المستوى</Label>
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger id="difficulty-filter" aria-label="تصفية حسب المستوى">
            <SelectValue placeholder="كل المستويات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المستويات</SelectItem>
            {difficultyOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {difficultyLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sort-filter">الترتيب</Label>
        <Select value={sort} onValueChange={(value) => onSortChange(value as LessonSort)}>
          <SelectTrigger id="sort-filter" aria-label="ترتيب الدروس">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
