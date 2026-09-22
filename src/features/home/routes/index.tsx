import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/utils/lazy-import";

const { HomePage } = lazyImport(() => import("../pages/HomePage"), "HomePage");

export const HomeRouteList: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
];
