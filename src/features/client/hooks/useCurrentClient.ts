import { createContext, useContext } from "react";
import type { IPortalClient } from "@/shared/interface/portal";

export const CurrentClientContext = createContext<IPortalClient | null>(null);

export function useCurrentClient(): IPortalClient {
  const client = useContext(CurrentClientContext);
  if (!client) {
    throw new Error("useCurrentClient must be used inside the app shell");
  }
  return client;
}
