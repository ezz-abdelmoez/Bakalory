"use client";

import { useQuery } from "@tanstack/react-query";
import { homeKeys } from "./keys";
import { studentApi } from "../../client/scoped-client";

export function useHomeContent() {
  return useQuery({
    queryKey: homeKeys.content(),
    queryFn: () => studentApi.home.content(),
    staleTime: 60 * 1000,
  });
}
