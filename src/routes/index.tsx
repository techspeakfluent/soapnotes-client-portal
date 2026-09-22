import { Suspense } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import { SectionLoader } from "@/components/ui";
import { HomeRouteList } from "@/features/home/routes";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<SectionLoader h="100dvh" />}>
        <Outlet />
      </Suspense>
    ),
    children: [...HomeRouteList],
  },
];

const router = createBrowserRouter(routes);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
