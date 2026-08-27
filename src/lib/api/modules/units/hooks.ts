"use client";

import { useQuery } from "@tanstack/react-query";
import { unitKeys } from "./keys";
import { studentApi } from "../../client/scoped-client";

export function useUnits() {
  return useQuery({
    queryKey: unitKeys.lists(),
    queryFn: () => studentApi.units.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUnit(idOrSlug: string) {
  return useQuery({
    queryKey: unitKeys.detail(idOrSlug),
    queryFn: () => studentApi.units.get(idOrSlug),
    enabled: Boolean(idOrSlug),
    staleTime: 5 * 60 * 1000,
  });
}
