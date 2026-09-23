import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { StatusChip } from "@/components/ui";
import { RouteConstants } from "@/shared/constants/routes";
import type { IPortalInvoice } from "@/shared/interface/portal";
import { formatDate } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import { getInvoiceDisplayStatus } from "@/utils/invoice";

export const invoiceColumns: ColumnDef<IPortalInvoice, any>[] = [
  {
    id: "invoice_number",
    header: "Invoice",
    cell: ({ row }) => (
      <Box
        asChild
        color="primary.400"
        textStyle="small-semibold"
        _hover={{ textDecoration: "underline" }}
      >
        <Link
          to={RouteConstants.invoices.details.generate({ id: row.original.id })}
        >
          {row.original.invoice_number}
        </Link>
      </Box>
    ),
  },
  {
    id: "invoice_date",
    accessorKey: "invoice_date",
    header: "Date",
    enableSorting: true,
    cell: ({ row }) => formatDate(row.original.invoice_date),
  },
  {
    id: "due_date",
    accessorKey: "due_date",
    header: "Due",
    enableSorting: true,
    cell: ({ row }) => formatDate(row.original.due_date),
  },
  {
    id: "total_price",
    accessorKey: "total_price",
    header: "Amount",
    enableSorting: true,
    meta: { numeric: true },
    cell: ({ row }) =>
      formatMoney(row.original.total_price, row.original.currency_code),
  },
  {
    id: "amount_due",
    accessorKey: "amount_due",
    header: "Amount due",
    enableSorting: true,
    meta: { numeric: true },
    cell: ({ row }) => (
      <Box as="span" textStyle="small-semibold">
        {formatMoney(row.original.amount_due, row.original.currency_code)}
      </Box>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusChip status={getInvoiceDisplayStatus(row.original)} />
    ),
  },
];
