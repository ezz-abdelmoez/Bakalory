"use client";

import { useUnits } from "@/lib/api/modules/units/hooks";
import { UnitCard } from "./unit-card";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";

export function UnitsPage() {
  const { data, isLoading, isError, error, refetch } = useUnits();

  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <PageHeader
        title="الوحدات"
        description="أربع وحدات تغطي منهج البرمجة والذكاء الاصطناعي للصف الثاني بكالوريا."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ApiQueryError error={error} onRetry={() => refetch()} />
      ) : data && data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : (
        <EmptyState title="لا توجد وحدات" description="لم يتم العثور على أي وحدات." />
      )}
    </PageContainer>
  );
}
