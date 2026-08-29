import { apiConfig } from "../config";
import { createMockTransport } from "../mock/mock-transport";
import { createFetchTransport } from "../transport/fetch-transport";
import { createApiClient } from "./api-client";
import type { ApiClient } from "../transport/types";
import type { ApiScope } from "../contracts/common";

const clientCache = new Map<ApiScope, ApiClient>();

export function createBrowserApiClient(scope: ApiScope): ApiClient {
  const cached = clientCache.get(scope);
  if (cached) return cached;

  const browserTransport =
    apiConfig.mode === "mock"
      ? createMockTransport()
      : createFetchTransport({
          baseUrl: apiConfig.browserBasePath,
          timeoutMs: apiConfig.timeoutMs,
        });

  const client = createApiClient(browserTransport, scope);
  clientCache.set(scope, client);
  return client;
}
