import { RouteConstants } from "@/shared/constants/routes";
import { useGetDashboard } from "../api/query";

const getPayTarget = (invoiceIds: string[]) => {
  if (invoiceIds.length === 0) return null;
  if (invoiceIds.length === 1) {
    return RouteConstants.invoices.details.generate(
      { id: invoiceIds[0]! },
      { pay: 1 },
    );
  }
  return RouteConstants.invoices.list.generate({}, { status: "UNPAID" });
};

export function useDashboard() {
  const query = useGetDashboard();
  const dashboard = query.data?.data;
  const balances = dashboard?.metrics.outstanding ?? [];

  return {
    dashboard,
    balances,
    payTarget: getPayTarget(balances.flatMap((b) => b.invoice_ids)),
    isPending: query.isPending,
    error: query.error,
    retry: () => query.refetch(),
    isRetrying: query.isRefetching,
  };
}
