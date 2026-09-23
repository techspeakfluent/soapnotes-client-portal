import type { QueryConfigType } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import { getDashboard } from "./service";

export const useGetDashboard = (
  config?: QueryConfigType<typeof getDashboard>,
) =>
  useQuery({
    queryKey: [customQueryKey.dashboard.summary],
    queryFn: getDashboard,
    ...config,
  });
