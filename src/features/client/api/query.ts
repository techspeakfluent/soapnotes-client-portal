import type { QueryConfigType } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import { getMe } from "./service";

// Fetched once by the shell; profile mutations write this cache directly.
export const useGetMe = (config?: QueryConfigType<typeof getMe>) =>
  useQuery({
    queryKey: [customQueryKey.client.me],
    queryFn: getMe,
    staleTime: Infinity,
    ...config,
  });
