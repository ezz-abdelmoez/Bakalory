export type QueryValue = string | number | boolean | undefined;

export function withQuery(
  path: string,
  query?: Record<string, QueryValue>
): string {
  if (!query) return path;

  const params: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        params.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
        );
      }
    } else {
      params.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      );
    }
  }

  if (params.length === 0) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${params.join("&")}`;
}
