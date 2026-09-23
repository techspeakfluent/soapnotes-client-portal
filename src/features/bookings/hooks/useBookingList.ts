import type { TablePagination } from "@/components/table";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useGetMyBookings } from "../api/query";

const PAGE_SIZE = 10;

export function useBookingList() {
  const [filters, setFilters] = useUrlFilters({ page: 1 });
  const query = useGetMyBookings({ page: filters.page, limit: PAGE_SIZE });
  const meta = query.data?.metadata;

  const pagination: TablePagination | undefined = meta && {
    pageIndex: filters.page - 1,
    pageSize: PAGE_SIZE,
    pageCount: meta.total_pages,
    totalItems: meta.total_count,
    hasNextPage: meta.hasNextPage,
    hasPrevPage: meta.hasPrevPage,
    setPageIndex: (index) => setFilters({ page: index + 1 }),
  };

  return {
    bookings: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    retry: () => query.refetch(),
    isRetrying: query.isRefetching,
    pagination,
  };
}
