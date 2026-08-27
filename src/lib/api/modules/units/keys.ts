export const unitKeys = {
  all: ["units"] as const,
  lists: () => [...unitKeys.all, "list"] as const,
  detail: (idOrSlug: string) => [...unitKeys.all, "detail", idOrSlug] as const,
};
