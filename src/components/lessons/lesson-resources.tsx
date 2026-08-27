import { FolderDown } from "lucide-react";

import type { ResourceDto } from "@/lib/api/contracts/lesson";
import { ResourceItem } from "./resource-item";
import { EmptyState } from "@/components/shared/empty-state";

export function LessonResources({ resources }: { resources: ResourceDto[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <FolderDown className="h-5 w-5 text-primary" aria-hidden="true" />
        ملفات وموارد الدرس
      </h2>

      {resources.length > 0 ? (
        <div className="flex flex-col gap-3">
          {resources.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد ملفات"
          description="لا توجد موارد قابلة للتحميل لهذا الدرس بعد."
        />
      )}
    </section>
  );
}
