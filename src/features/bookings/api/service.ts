import { mockListResponse } from "@/mocks/mock-response";
import { db } from "@/mocks/store";
import type { IPageFilter } from "@/shared/interface/portal";
import { getBookingStart } from "@/utils/booking";

const start = (b: Parameters<typeof getBookingStart>[0]) =>
  getBookingStart(b)?.getTime() ?? 0;

// Real endpoint: GET /client-portal/bookings?page&limit (docs/api-needed.md).
export const getMyBookings = async (filter: IPageFilter) =>
  mockListResponse(() => db.bookings, {
    ...filter,
    sort: (a, b) => start(b) - start(a),
  });
