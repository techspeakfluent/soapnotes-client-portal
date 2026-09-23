import type { RouteObject } from "react-router-dom";
import { RouteConstants } from "@/shared/constants/routes";
import { lazyImport } from "@/utils/lazy-import";

const { ProfilePage } = lazyImport(
  () => import("../pages/ProfilePage"),
  "ProfilePage",
);

export const ProfileRouteList: RouteObject[] = [
  { path: RouteConstants.profile.base.path, element: <ProfilePage /> },
];
