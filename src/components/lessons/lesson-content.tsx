import { Lightbulb } from "lucide-react";

import type { LessonContentDto } from "@/lib/api/contracts/lesson";
import { MarkdownContent } from "./markdown-content";
import { CodeBlock } from "./code-block";
import { ObjectivesAccordion } from "./objectives-accordion";
import { Separator } from "@/components/ui/separator";

export function LessonContent({ content }: { content: LessonContentDto }) {
  return (
    <article className="flex flex-col gap-8">
      <MarkdownContent content={content.introduction} />

      <ObjectivesAccordion objectives={content.objectives} />

      {content.concepts.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">مفاهيم أساسية</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.concepts.map((concept) => (
              <div
                key={concept.title}
                className="flex flex-col gap-2 rounded-xl border bg-card p-4"
              >
                <h3 className="flex items-center gap-2 font-semibold">
                  <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                  {concept.title}
                </h3>
                <p className="text-sm text-muted-foreground">{concept.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Separator />

      <MarkdownContent content={content.explanation} />

      {content.examples.length > 0 ? (
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">أمثلة تطبيقية</h2>
          {content.examples.map((example, index) => (
            <div key={`${example.title}-${index}`} className="flex flex-col gap-3">
              <h3 className="font-semibold">
                مثال {index + 1}: {example.title}
              </h3>
              {example.code ? (
                <CodeBlock code={example.code} language={example.language} />
              ) : null}
              {example.markdown ? (
                <MarkdownContent content={example.markdown} />
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {content.summary ? (
        <>
          <Separator />
          <MarkdownContent content={content.summary} />
        </>
      ) : null}
    </article>
  );
}
