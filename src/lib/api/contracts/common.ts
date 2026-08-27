export type ApiScope = "student" | "admin";

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PageResult<T> {
  items: T[];
  meta: PageMeta;
}

export interface ApiProblem {
  status: number;
  code: string;
  title: string;
  detail?: string;
  fields?: Record<string, string[]>;
  requestId?: string;
}

export interface ListFilter {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface Envelope<T> {
  data: T;
}
