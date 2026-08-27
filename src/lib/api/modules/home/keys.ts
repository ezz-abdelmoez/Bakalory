export const homeKeys = {
  all: ["home"] as const,
  content: () => [...homeKeys.all, "content"] as const,
};
