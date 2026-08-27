import "server-only";

import { apiConfig } from "../config";
import { createMockTransport } from "../mock/mock-transport";
import { createFetchTransport } from "../transport/fetch-transport";
import { createApiClient } from "./api-client";
import type { ApiClient } from "../transport/types";
import type { ApiScope } from "../contracts/common";

async function forwardCookieHeaders(): Promise<HeadersInit | undefined> {
  // Only relevant in HTTP mode; calling cookies() in mock mode would force
  // every page into dynamic rendering for no reason.
  if (apiConfig.mode !== "http") return undefined;

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return cookie ? { cookie } : undefined;
}

export async function createServerApiClient(scope: ApiScope): Promise<ApiClient> {
  const transport =
    apiConfig.mode === "mock"
      ? createMockTransport()
      : createFetchTransport({
          baseUrl: apiConfig.serverOrigin || apiConfig.browserBasePath,
          timeoutMs: apiConfig.timeoutMs,
          defaultHeaders: await forwardCookieHeaders(),
        });

  return createApiClient(transport, scope);
}
