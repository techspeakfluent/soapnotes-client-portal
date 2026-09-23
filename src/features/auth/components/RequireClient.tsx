import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";

export function RequireClient({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!getToken().accessToken) {
    const next = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={RouteConstants.auth.signIn.generate(
          {},
          next === "/" ? {} : { next },
        )}
        replace
      />
    );
  }

  return children;
}
