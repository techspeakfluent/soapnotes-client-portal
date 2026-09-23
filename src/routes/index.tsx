import { Suspense } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { NotFound } from "@/components/layout/NotFound";
import { SectionLoader } from "@/components/ui";
import { RequireClient } from "@/features/auth/components/RequireClient";
import { AuthRouteList } from "@/features/auth/routes";
import { BookingRouteList } from "@/features/bookings/routes";
import { DashboardRouteList } from "@/features/dashboard/routes";
import { InvoiceRouteList } from "@/features/invoices/routes";
import { PaymentRouteList } from "@/features/payments/routes";
import { ProfileRouteList } from "@/features/profile/routes";

const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SectionLoader h="100dvh" />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      ...AuthRouteList,
      {
        element: (
          <RequireClient>
            <AppLayout />
          </RequireClient>
        ),
        children: [
          ...DashboardRouteList,
          ...InvoiceRouteList,
          ...BookingRouteList,
          ...PaymentRouteList,
          ...ProfileRouteList,
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
