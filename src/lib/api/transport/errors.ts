import type { ApiProblem } from "../contracts/common";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly title: string;
  readonly detail?: string;
  readonly fields?: Record<string, string[]>;
  readonly requestId?: string;

  constructor(problem: ApiProblem) {
    super(problem.detail || problem.title || "API error");
    this.name = "ApiError";
    this.status = problem.status;
    this.code = problem.code;
    this.title = problem.title;
    this.detail = problem.detail;
    this.fields = problem.fields;
    this.requestId = problem.requestId;
  }

  /** RFC-7807 style problem details, matching the backend handoff contract. */
  toProblem(): ApiProblem {
    const problem: ApiProblem = {
      status: this.status,
      code: this.code,
      title: this.title,
    };
    if (this.detail) problem.detail = this.detail;
    if (this.fields) problem.fields = this.fields;
    if (this.requestId) problem.requestId = this.requestId;
    return problem;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}
