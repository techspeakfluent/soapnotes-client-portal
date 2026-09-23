import { Box, Text } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Money } from "@/components/icons";
import {
  ListCard,
  ListCardSkeleton,
  ResponsiveTable,
  type TablePagination,
} from "@/components/table";
import {
  EmptyState,
  ErrorState,
  SectionCard,
  StatusChip,
} from "@/components/ui";
import { PAYMENT_METHOD_LABELS } from "@/features/invoices/constants";
import { RouteConstants } from "@/shared/constants/routes";
import type { IPortalTransaction } from "@/shared/interface/portal";
import { describeCard } from "@/utils/card";
import { formatDate } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import { useGetPaymentHistory } from "../api/query";

const PAGE_SIZE = 10;

const methodLabel = (t: IPortalTransaction) =>
  t.card
    ? describeCard(t.card)
    : (PAYMENT_METHOD_LABELS[t.payment_method] ?? "Other");

const amountLabel = (t: IPortalTransaction) =>
  formatMoney(
    t.transaction_type === "REFUND" ? -t.amount : t.amount,
    t.currency_code,
  );

const invoiceLink = (t: IPortalTransaction) =>
  t.invoice ? (
    <Box
      asChild
      color="primary.400"
      _hover={{ textDecoration: "underline" }}
      position="relative"
      zIndex={1}
    >
      <Link to={RouteConstants.invoices.details.generate({ id: t.invoice.id })}>
        {t.invoice.invoice_number}
      </Link>
    </Box>
  ) : (
    "—"
  );

const columns: ColumnDef<IPortalTransaction, any>[] = [
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.transaction_date),
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) =>
      row.original.transaction_type === "REFUND" ? "Refund" : "Payment",
  },
  {
    id: "method",
    header: "Method",
    cell: ({ row }) => methodLabel(row.original),
  },
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) => invoiceLink(row.original),
  },
  {
    id: "amount",
    header: "Amount",
    meta: { numeric: true },
    cell: ({ row }) => (
      <Text as="span" textStyle="small-semibold">
        {amountLabel(row.original)}
      </Text>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusChip status={row.original.status} />,
  },
];

export function PaymentHistory() {
  const [page, setPage] = useState(1);
  const query = useGetPaymentHistory({ page, limit: PAGE_SIZE });
  const meta = query.data?.metadata;

  const pagination: TablePagination | undefined = meta && {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
    pageCount: meta.total_pages,
    totalItems: meta.total_count,
    hasNextPage: meta.hasNextPage,
    hasPrevPage: meta.hasPrevPage,
    setPageIndex: (index) => setPage(index + 1),
  };

  return (
    <SectionCard
      title="Payment history"
      subtitle="Payments and refunds on your account."
    >
      {query.error && !query.data ? (
        <ErrorState
          error={query.error}
          title="We couldn't load your payments"
          onRetry={() => query.refetch()}
          isRetrying={query.isRefetching}
        />
      ) : (
        <ResponsiveTable
          caption="Payment history"
          data={query.data?.data ?? []}
          columns={columns}
          getRowId={(t) => t.id}
          getKey={(t) => t.id}
          loading={query.isPending}
          pagination={pagination}
          emptyState={
            <EmptyState
              icon={Money}
              title="No payments yet"
              description="When you pay an invoice, the payment will be listed here."
            />
          }
          cardSkeleton={<ListCardSkeleton />}
          renderCard={(t) => (
            <ListCard
              row={t}
              title={t.transaction_type === "REFUND" ? "Refund" : "Payment"}
              badge={<StatusChip status={t.status} />}
              highlight={amountLabel(t)}
              fields={[
                { label: "Date", value: formatDate(t.transaction_date) },
                { label: "Method", value: methodLabel(t) },
                { label: "Invoice", value: invoiceLink(t) },
              ]}
            />
          )}
        />
      )}
    </SectionCard>
  );
}
