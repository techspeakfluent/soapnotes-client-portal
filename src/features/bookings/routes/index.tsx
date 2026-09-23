import type { RouteObject } from "react-router-dom";
import { RouteConstants } from "@/shared/constants/routes";
import { lazyImport } from "@/utils/lazy-import";

const { BookingsPage } = lazyImport(
  () => import("../pages/BookingsPage"),
  "BookingsPage",
);

export const BookingRouteList: RouteObject[] = [
  { path: RouteConstants.bookings.list.path, element: <BookingsPage /> },
];
