import type { RouteObject } from "react-router-dom";
import { RouteConstants } from "@/shared/constants/routes";
import { lazyImport } from "@/utils/lazy-import";

const { PaymentsPage } = lazyImport(
  () => import("../pages/PaymentsPage"),
  "PaymentsPage",
);

export const PaymentRouteList: RouteObject[] = [
  { path: RouteConstants.payments.base.path, element: <PaymentsPage /> },
];
