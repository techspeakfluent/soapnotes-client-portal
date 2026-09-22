import { defineRoute } from "@/utils/route";

// Routes grouped by feature module.
const HomeRoutes = {
  home: defineRoute("/" as const),
} as const;

export const RouteConstants = {
  home: HomeRoutes,
} as const;
