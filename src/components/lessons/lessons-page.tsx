"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";

import { useLessons } from "@/lib/api/modules/lessons/hooks";
import type {
  Difficulty,
  LessonFilter,
  LessonSort,
} from "@/lib/api/contracts/lesson";
import { LessonGrid } from "./lesson-grid";
import { LessonGridSkeleton } from "./lesson-card-skeleton";
import { LessonSearch } from "./lesson-search";
import { LessonFilterBar } from "./lesson-filter-bar";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PageContainer } from "@/components/shared/page-container";

export function LessonsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 300);
  const [unitId, setUnitId] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState<LessonSort>("default");

  const filter: LessonFilter = {
    search: debouncedSearch.trim() || undefined,
    unitId: unitId === "all" ? undefined : unitId,
    difficulty: difficulty === "all" ? undefined : (difficulty as Difficulty),
    status: "published",
    sort,
    pageSize: 100,
  };

  const { data, isLoading, isError, error, refetch } = useLessons(filter);

  const total = data?.meta.total ?? 0;
  const hasSearch = Boolean(debouncedSearch.trim());

  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <PageHeader
        title="الدروس"
        description="استعرض دروس البرمجة والذكاء الاصطناعي، وابحث وصفِّ حسب الوحدة والمستوى."
      >
        <div className="mt-4">
          <LessonSearch value={searchInput} onChange={setSearchInput} />
        </div>
      </PageHeader>

      <LessonFilterBar
        unitId={unitId}
        difficulty={difficulty}
        sort={sort}
        onUnitChange={setUnitId}
        onDifficultyChange={setDifficulty}
        onSortChange={setSort}
      />

      <div aria-live="polite">
        {hasSearch ? (
          <p className="text-muted-foreground">
            نتائج البحث عن: <span className="font-semibold">«{debouncedSearch.trim()}»</span> — وجدنا{" "}
            <span className="font-semibold">{total}</span> {total === 1 ? "درس" : "دروس"}
          </p>
        ) : (
          <p className="text-muted-foreground">
            وجدنا <span className="font-semibold">{total}</span>{" "}
            {total === 1 ? "درس" : "دروس"}
          </p>
        )}
      </div>

      {isLoading ? (
        <LessonGridSkeleton count={6} />
      ) : isError ? (
        <ApiQueryError error={error} onRetry={() => refetch()} />
      ) : data && data.items.length > 0 ? (
        <LessonGrid lessons={data.items} />
      ) : (
        <EmptyState
          title="لم نجد أي نتائج"
          description="جرّب البحث بكلمة أخرى أو غيّر الفلاتر."
        />
      )}
    </PageContainer>
  );
}
