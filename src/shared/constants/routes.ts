import { defineRoute } from "@/utils/route";

// Routes grouped by feature module.
const AuthRoutes = {
  signIn: defineRoute("/sign-in" as const),
} as const;

const DashboardRoutes = {
  home: defineRoute("/" as const),
} as const;

const InvoiceRoutes = {
  list: defineRoute("/invoices" as const),
  details: defineRoute("/invoices/:id" as const),
} as const;

const BookingRoutes = {
  list: defineRoute("/bookings" as const),
} as const;

const PaymentRoutes = {
  base: defineRoute("/payments" as const),
} as const;

const ProfileRoutes = {
  base: defineRoute("/profile" as const),
} as const;

export const RouteConstants = {
  auth: AuthRoutes,
  dashboard: DashboardRoutes,
  invoices: InvoiceRoutes,
  bookings: BookingRoutes,
  payments: PaymentRoutes,
  profile: ProfileRoutes,
} as const;
