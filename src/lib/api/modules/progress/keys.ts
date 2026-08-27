export const progressKeys = {
  all: ["progress"] as const,
  root: () => [...progressKeys.all] as const,
};
