"use client";

import { Target } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ObjectivesAccordion({ objectives }: { objectives: string[] }) {
  return (
    <Accordion type="single" collapsible className="rounded-xl border px-4">
      <AccordionItem value="objectives" className="border-b-0">
        <AccordionTrigger className="gap-3">
          <span className="inline-flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" aria-hidden="true" />
            أهداف التعلم
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-2">
            {objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
