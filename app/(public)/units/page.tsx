import type { Metadata } from "next";

import { UnitsPage } from "@/components/units/units-page";

export const metadata: Metadata = {
  title: "الوحدات",
  description: "استعرض وحدات منهج البرمجة للسنة الثانية باكالوريا.",
};

export default function UnitsRoute() {
  return <UnitsPage />;
}
