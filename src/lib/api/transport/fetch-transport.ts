import type { ApiTransport, RequestOptions } from "./types";
import { ApiError } from "./errors";
import { withQuery } from "./query";
import type { ApiProblem } from "../contracts/common";

export interface FetchTransportOptions {
  baseUrl: string;
  timeoutMs: number;
  /** Extra headers to merge into every request (e.g. forwarded cookies). */
  defaultHeaders?: HeadersInit;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

function buildProblem(
  status: number,
  title: string,
  detail?: string,
  requestId?: string
): ApiProblem {
  return { status, code: "UNKNOWN_ERROR", title, detail, requestId };
}

async function parseProblem(
  response: Response,
  requestId?: string
): Promise<ApiProblem> {
  const fallback: ApiProblem = {
    status: response.status,
    code: "UNKNOWN_ERROR",
    title: response.statusText || "طلب غير ناجح",
    detail: `فشل الطلب برمز الحالة ${response.status}`,
    requestId,
  };

  try {
    const text = await response.text();
    if (!text) return fallback;
    const parsed = JSON.parse(text) as Partial<ApiProblem>;
    if (typeof parsed !== "object" || parsed === null) {
      return { ...fallback, detail: text };
    }
    return {
      status: response.status,
      code: typeof parsed.code === "string" ? parsed.code : "UNKNOWN_ERROR",
      title: typeof parsed.title === "string" ? parsed.title : response.statusText || "خطأ",
      detail: typeof parsed.detail === "string" ? parsed.detail : undefined,
      fields: parsed.fields,
      requestId: typeof parsed.requestId === "string" ? parsed.requestId : requestId,
    };
  } catch {
    return fallback;
  }
}

export function createFetchTransport(
  options: FetchTransportOptions
): ApiTransport {
  const { baseUrl, timeoutMs, defaultHeaders } = options;

  return {
    async request<TResponse, TBody = unknown>(
      request: RequestOptions<TBody, TResponse>
    ): Promise<TResponse> {
      const url = withQuery(`${baseUrl}${request.path}`, request.query);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const requestId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : undefined;

      try {
        const response = await fetch(url, {
          method: request.method,
          headers: {
            Accept: "application/json",
            ...(request.body !== undefined ? JSON_HEADERS : {}),
            ...(defaultHeaders as Record<string, string>),
            ...(request.headers as Record<string, string>),
          },
          body:
            request.body !== undefined
              ? JSON.stringify(request.body)
              : undefined,
          credentials: "include",
          cache: request.cache,
          next: request.next as RequestInit["next"],
          signal: request.signal ?? controller.signal,
        });

        if (!response.ok) {
          throw new ApiError(await parseProblem(response, requestId));
        }

        let payload: unknown = null;
        const text = await response.text();
        if (text) {
          try {
            payload = JSON.parse(text);
          } catch {
            payload = text;
          }
        }

        // The api-client layer unwraps `{ data }` envelopes and validates the
        // response against its Zod contract; the transport stays a pure HTTP
        // boundary.
        return payload as TResponse;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new ApiError({
            status: 408,
            code: "REQUEST_TIMEOUT",
            title: "انتهت مهلة الطلب",
            detail: "استغرق الخادم وقتًا أطول من المتوقع، حاول مرة أخرى.",
            requestId,
          });
        }
        throw new ApiError(
          buildProblem(
            0,
            "فشل الاتصال بالخادم",
            error instanceof Error ? error.message : "خطأ غير معروف",
            requestId
          )
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
