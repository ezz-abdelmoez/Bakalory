import type { Metadata } from "next";

import { UnitsPage } from "@/components/units/units-page";

export const metadata: Metadata = {
  title: "الوحدات",
  description: "استعرض وحدات منهج البرمجة والذكاء الاصطناعي للصف الثاني بكالوريا.",
};

export default function UnitsRoute() {
  return <UnitsPage />;
}
