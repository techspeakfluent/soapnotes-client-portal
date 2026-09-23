import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import type { TablePagination } from "@/components/table";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import type { IInvoiceFilter } from "@/shared/interface/portal";
import { useGetMyInvoices } from "../api/query";
import { INVOICES_PAGE_SIZE } from "../constants";

const SORTABLE = [
  "invoice_date",
  "due_date",
  "total_price",
  "amount_due",
] as const;
type SortBy = (typeof SORTABLE)[number];

export function useInvoiceList() {
  const [filters, setFilters] = useUrlFilters({
    page: 1,
    search: "",
    status: "",
    sort: "invoice_date",
    order: "DESC",
  });

  const sortBy: SortBy = (SORTABLE as readonly string[]).includes(filters.sort)
    ? (filters.sort as SortBy)
    : "invoice_date";
  const sortOrder = filters.order === "ASC" ? "ASC" : "DESC";

  const request: IInvoiceFilter = {
    page: filters.page,
    limit: INVOICES_PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  };
  const query = useGetMyInvoices(request);
  const meta = query.data?.metadata;

  const pagination: TablePagination | undefined = meta && {
    pageIndex: filters.page - 1,
    pageSize: INVOICES_PAGE_SIZE,
    pageCount: meta.total_pages,
    totalItems: meta.total_count,
    hasNextPage: meta.hasNextPage,
    hasPrevPage: meta.hasPrevPage,
    setPageIndex: (index) => setFilters({ page: index + 1 }),
  };

  const sorting = useMemo<SortingState>(
    () => [{ id: sortBy, desc: sortOrder === "DESC" }],
    [sortBy, sortOrder],
  );

  const hasFilters = !!filters.search || !!filters.status;

  return {
    invoices: query.data?.data ?? [],
    isPending: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    retry: () => query.refetch(),
    isRetrying: query.isRefetching,
    pagination,
    sorting,
    setSorting: (next: SortingState) => {
      const [first] = next;
      setFilters({
        sort: first?.id ?? "invoice_date",
        order: first && !first.desc ? "ASC" : "DESC",
        page: 1,
      });
    },
    search: filters.search,
    setSearch: (search: string) => setFilters({ search, page: 1 }),
    status: filters.status,
    setStatus: (status: string) => setFilters({ status, page: 1 }),
    hasFilters,
    clearFilters: () => setFilters({ search: "", status: "", page: 1 }),
  };
}
