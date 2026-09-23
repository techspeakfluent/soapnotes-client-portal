import type { RouteObject } from "react-router-dom";
import { RouteConstants } from "@/shared/constants/routes";
import { lazyImport } from "@/utils/lazy-import";

const { SignInPage } = lazyImport(
  () => import("../pages/SignInPage"),
  "SignInPage",
);

export const AuthRouteList: RouteObject[] = [
  {
    path: RouteConstants.auth.signIn.path,
    element: <SignInPage />,
  },
];
