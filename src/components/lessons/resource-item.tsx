import {
  Download,
  Eye,
  FileArchive,
  FileCode2,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Presentation,
  type LucideIcon,
} from "lucide-react";

import type { ResourceDto } from "@/lib/api/contracts/lesson";
import { resourceTypeLabels } from "@/types";
import { Button } from "@/components/ui/button";

const resourceIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  slides: Presentation,
  code: FileCode2,
  exercise: ListChecks,
  image: ImageIcon,
  zip: FileArchive,
  doc: FileText,
};

export function ResourceItem({ resource }: { resource: ResourceDto }) {
  const Icon = resourceIcons[resource.type] ?? FileText;

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold">{resource.title}</h3>
          <p className="text-xs text-muted-foreground">
            {resourceTypeLabels[resource.type]} • {resource.size}
          </p>
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {resource.viewable ? (
          <Button asChild variant="outline" size="sm">
            <a
              href={resource.filePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              عرض
            </a>
          </Button>
        ) : null}
        <Button asChild size="sm">
          <a href={resource.filePath} download={resource.fileName}>
            <Download className="h-4 w-4" aria-hidden="true" />
            تحميل
          </a>
        </Button>
      </div>
    </div>
  );
}
