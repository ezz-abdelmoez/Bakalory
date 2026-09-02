"use client";

import { useUnits } from "@/lib/api/modules/units/hooks";
import { UnitCard } from "@/components/units/unit-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiQueryError } from "@/components/shared/api-query-error";

export function UnitsSection() {
  const { data, isLoading, isError, error, refetch } = useUnits();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">الوحدات الدراسية</h2>
          <p className="text-muted-foreground">
            أربع وحدات تغطي منهج البرمجة والذكاء الاصطناعي للصف الثاني بكالوريا.
          </p>
        </div>
      </div>

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
      ) : null}
    </section>
  );
}
