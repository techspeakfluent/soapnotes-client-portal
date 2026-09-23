import type { QueryConfigType } from "@/lib/react-query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import type { IPageFilter } from "@/shared/interface/portal";
import { getMyBookings } from "./service";

export const useGetMyBookings = (
  filter: IPageFilter,
  config?: QueryConfigType<typeof getMyBookings>,
) =>
  useQuery({
    queryKey: [customQueryKey.bookings.list, filter],
    queryFn: () => getMyBookings(filter),
    placeholderData: keepPreviousData,
    ...config,
  });
