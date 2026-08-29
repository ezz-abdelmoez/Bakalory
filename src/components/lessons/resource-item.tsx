import {
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  FileCode2,
  FileText,
  Image as ImageIcon,
  ListChecks,
  PlayCircle,
  Presentation,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { ResourceDto } from "@/lib/api/contracts/lesson";
import { resourceTypeLabels } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resourceIcons: Record<string, LucideIcon> = {
  pdf: FileText,
  slides: Presentation,
  code: FileCode2,
  exercise: ListChecks,
  image: ImageIcon,
  zip: FileArchive,
  doc: FileText,
  video: Video,
  link: ExternalLink,
};

function toYouTubeEmbed(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

/** The playable/watchable location, regardless of delivery source. */
function resourceHref(resource: ResourceDto): string | undefined {
  return resource.url ?? resource.filePath;
}

export function ResourceItem({ resource }: { resource: ResourceDto }) {
  const Icon = resourceIcons[resource.type] ?? FileText;
  const href = resourceHref(resource);
  const isVideo = resource.type === "video";
  const isLink = resource.type === "link";
  const youtubeEmbed = isVideo && href ? toYouTubeEmbed(href) : null;

  const metaParts: string[] = [resourceTypeLabels[resource.type]];
  if (resource.size) metaParts.push(resource.size);
  if (resource.duration) metaParts.push(`${resource.duration} دقيقة`);

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="flex items-center gap-2 font-semibold">
              {resource.title}
              {resource.source === "external" ? (
                <Badge variant="secondary" className="text-[10px]">
                  خارجي
                </Badge>
              ) : null}
            </h3>
            <p className="text-xs text-muted-foreground">
              {metaParts.join(" • ")}
            </p>
            <p className="text-sm text-muted-foreground">{resource.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isLink && href ? (
            <Button asChild size="sm">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                فتح الرابط
              </a>
            </Button>
          ) : null}

          {!isLink && resource.viewable && href ? (
            <Button asChild variant="outline" size="sm">
              <a href={href} target="_blank" rel="noopener noreferrer">
                {isVideo ? (
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
                {isVideo ? "تشغيل" : "عرض"}
              </a>
            </Button>
          ) : null}

          {resource.downloadable && href ? (
            <Button asChild size="sm">
              <a href={href} download={resource.fileName}>
                <Download className="h-4 w-4" aria-hidden="true" />
                تحميل
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      {isVideo && resource.viewable && href ? (
        <div className="overflow-hidden rounded-lg border">
          {youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title={resource.title}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video controls className="w-full" src={href}>
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          )}
        </div>
      ) : null}
    </div>
  );
}
