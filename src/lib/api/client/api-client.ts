import type { ZodError } from "zod";
import { ApiError } from "../transport/errors";
import type {
  ApiClient,
  ApiTransport,
  RequestOptions,
} from "../transport/types";
import type { ApiScope } from "../contracts/common";

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "body";
    if (!fields[key]) fields[key] = [];
    fields[key].push(issue.message);
  }
  return fields;
}

function isEnvelope<T>(value: unknown): value is { data: T } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value
  );
}

export function createApiClient(
  transport: ApiTransport,
  scope: ApiScope
): ApiClient {
  async function request<TResponse, TBody = unknown>(
    options: RequestOptions<TBody, TResponse>
  ): Promise<TResponse> {
    // 1. Validate the request body against its contract before hitting the
    //    transport. Failure → 422 INVALID_API_REQUEST with Arabic messages.
    if (options.requestSchema && options.body !== undefined) {
      const result = options.requestSchema.safeParse(options.body);
      if (!result.success) {
        throw new ApiError({
          status: 422,
          code: "INVALID_API_REQUEST",
          title: "بيانات غير صالحة",
          detail: "البيانات المرسلة لا تطابق العقد المتفق عليه.",
          fields: formatZodErrors(result.error),
        });
      }
    }

    // 2. Tag every request with its surface (observability context only).
    const headers: HeadersInit = {
      "X-Client-Surface": scope,
      ...(options.headers as Record<string, string>),
    };

    // 3. Delegate to the transport (mock or fetch).
    const payload = await transport.request<TResponse, TBody>({
      ...options,
      headers,
    });

    // 4. Unwrap `{ data }` envelopes.
    const decoded = isEnvelope<TResponse>(payload) ? payload.data : payload;

    // 5. Validate the response against its contract. Failure →
    //    502 INVALID_API_RESPONSE.
    if (options.responseSchema) {
      const result = options.responseSchema.safeParse(decoded);
      if (!result.success) {
        throw new ApiError({
          status: 502,
          code: "INVALID_API_RESPONSE",
          title: "البيانات غير مطابقة للعقد",
          detail: `الاستجابة لم تطابق العقد المتفق عليه: ${result.error.message}`,
        });
      }
      return result.data;
    }

    return decoded as TResponse;
  }

  return {
    scope,
    request,
    get: <TResponse>(
      path: string,
      options?: Omit<RequestOptions<never, TResponse>, "method" | "path" | "body">
    ) => request<TResponse, never>({ ...options, method: "GET", path } as RequestOptions<never, TResponse>),
    post: <TResponse, TBody>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
    ) => request<TResponse, TBody>({ ...options, method: "POST", path, body } as RequestOptions<TBody, TResponse>),
    put: <TResponse, TBody>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
    ) => request<TResponse, TBody>({ ...options, method: "PUT", path, body } as RequestOptions<TBody, TResponse>),
    patch: <TResponse, TBody>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
    ) => request<TResponse, TBody>({ ...options, method: "PATCH", path, body } as RequestOptions<TBody, TResponse>),
    delete: <TResponse, TBody>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
    ) => request<TResponse, TBody>({ ...options, method: "DELETE", path, body } as RequestOptions<TBody, TResponse>),
  };
}
