import { PageContainer } from "@/components/shared/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLoading() {
  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full max-w-sm" />
      <div className="flex flex-col gap-4 rounded-xl border p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </PageContainer>
  );
}
