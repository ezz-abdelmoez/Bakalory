import type { ZodType } from "zod";
import type { ApiScope } from "../contracts/common";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type ResponseSchema<TResponse> = ZodType<TResponse>;

export interface RequestOptions<TBody = unknown, TResponse = unknown> {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  requestSchema?: ZodType<TBody>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
  responseSchema?: ResponseSchema<TResponse>;
}

export interface ApiTransport {
  request<TResponse, TBody = unknown>(
    request: RequestOptions<TBody, TResponse>
  ): Promise<TResponse>;
}

export interface ApiClient {
  readonly scope: ApiScope;
  request<TResponse, TBody = unknown>(
    request: RequestOptions<TBody, TResponse>
  ): Promise<TResponse>;
  get<TResponse>(
    path: string,
    options?: Omit<RequestOptions<never, TResponse>, "method" | "path" | "body">
  ): Promise<TResponse>;
  post<TResponse, TBody>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
  ): Promise<TResponse>;
  put<TResponse, TBody>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
  ): Promise<TResponse>;
  patch<TResponse, TBody>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
  ): Promise<TResponse>;
  delete<TResponse, TBody>(
    path: string,
    body?: TBody,
    options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">
  ): Promise<TResponse>;
}
