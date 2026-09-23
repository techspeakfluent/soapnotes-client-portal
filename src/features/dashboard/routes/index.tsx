import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";

const { DashboardPage } = lazyImport(
  () => import("../pages/DashboardPage"),
  "DashboardPage",
);

export const DashboardRouteList: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
  },
];
