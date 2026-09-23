import type { RouteObject } from "react-router-dom";
import { RouteConstants } from "@/shared/constants/routes";
import { lazyImport } from "@/utils/lazy-import";

const { InvoicesPage } = lazyImport(
  () => import("../pages/InvoicesPage"),
  "InvoicesPage",
);
const { InvoiceDetailsPage } = lazyImport(
  () => import("../pages/InvoiceDetailsPage"),
  "InvoiceDetailsPage",
);

export const InvoiceRouteList: RouteObject[] = [
  { path: RouteConstants.invoices.list.path, element: <InvoicesPage /> },
  {
    path: RouteConstants.invoices.details.path,
    element: <InvoiceDetailsPage />,
  },
];
