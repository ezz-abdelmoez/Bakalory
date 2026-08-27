import { PageContainer } from "@/components/shared/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <PageContainer className="flex flex-col gap-8 py-8">
      <Skeleton className="h-5 w-64" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-2/3 max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </PageContainer>
  );
}
