import { AxiosError, AxiosHeaders } from "axios";
import type { ApiResponse, IMeta } from "@/shared/interface/api";
import { mockScenario } from "./config";

const MOCK_DELAY_MS = 450;
const DEFAULT_LIMIT = 10;

const delay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

const buildMeta = (page: number, limit: number, total: number): IMeta => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const count = Math.max(0, Math.min(limit, total - (page - 1) * limit));
  return {
    limit,
    page,
    count,
    exceedCount: false,
    exceedTotalPages: page > totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    totalPages,
    total_count: total,
    current_page: page,
    prev_page: page > 1 ? true : null,
    next_page: page < totalPages ? true : null,
    total_pages: totalPages,
    out_of_range: page > totalPages,
  };
};

const wrap = <T>(data: T, metadata: IMeta, message = "OK"): ApiResponse<T> => ({
  data,
  success: true,
  message,
  metadata,
  status: "success",
  status_code: 200,
  timestamp: new Date().toISOString(),
});

// Shaped like a real axios failure so getErrorMessage and the query error
// states treat it exactly as they will a server error.
const serverError = () => {
  const message = "We couldn't reach the server. Please try again.";
  return new AxiosError(message, "ERR_BAD_RESPONSE", undefined, undefined, {
    status: 500,
    statusText: "Internal Server Error",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { message, success: false, status_code: 500 },
  });
};

const clientError = (status: number, statusText: string, message: string) =>
  new AxiosError(message, "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText,
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { message, success: false, status_code: status },
  });

export const mockNotFound = (entity: string) =>
  clientError(404, "Not Found", `This ${entity} could not be found.`);

export const mockBadRequest = (message: string) =>
  clientError(422, "Unprocessable Entity", message);

export async function mockResponse<T>(
  getData: () => T,
  message?: string,
): Promise<ApiResponse<T>> {
  await delay();
  if (mockScenario === "error") throw serverError();
  return wrap(getData(), buildMeta(1, 1, 1), message);
}

export interface MockListQuery<T> {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: (item: T) => Array<string | null | undefined>;
  filter?: (item: T) => boolean;
  sort?: (a: T, b: T) => number;
}

export async function mockListResponse<T>(
  getItems: () => T[],
  query: MockListQuery<T> = {},
): Promise<ApiResponse<T[]>> {
  await delay();
  if (mockScenario === "error") throw serverError();

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.max(1, query.limit ?? DEFAULT_LIMIT);
  const term = query.search?.trim().toLowerCase();

  let items = getItems();
  if (query.filter) items = items.filter(query.filter);
  if (term && query.searchFields) {
    items = items.filter((item) =>
      query.searchFields!(item).some((field) =>
        field?.toLowerCase().includes(term),
      ),
    );
  }
  if (query.sort) items = [...items].sort(query.sort);

  const start = (page - 1) * limit;
  return wrap(
    items.slice(start, start + limit),
    buildMeta(page, limit, items.length),
  );
}
