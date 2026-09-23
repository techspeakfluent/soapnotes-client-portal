import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FileTextIcon } from "@/components/icons";
import {
  ListCard,
  ListCardSkeleton,
  ResponsiveTable,
} from "@/components/table";
import { EmptyState, StatusChip } from "@/components/ui";
import { RouteConstants } from "@/shared/constants/routes";
import type { IPortalInvoice } from "@/shared/interface/portal";
import { formatDate } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import { getInvoiceDisplayStatus, isInvoiceOpen } from "@/utils/invoice";
import { useInvoiceActions } from "../../hooks/useInvoiceActions";
import type { useInvoiceList } from "../../hooks/useInvoiceList";
import { PayInvoiceDialog } from "../pay/PayInvoiceDialog";
import { invoiceColumns } from "./invoice-columns";

type InvoiceList = ReturnType<typeof useInvoiceList>;

export function InvoicesTable({ list }: { list: InvoiceList }) {
  const navigate = useNavigate();
  const { actions, payingInvoice, closePay } = useInvoiceActions();
  const label = (invoice: IPortalInvoice) =>
    `invoice ${invoice.invoice_number}`;

  const emptyState = list.hasFilters ? (
    <EmptyState
      icon={FileTextIcon}
      title="No invoices match"
      description="Try a different search or status."
      action={
        <Button
          variant="outlineSecondary"
          mt="0.5rem"
          onClick={list.clearFilters}
        >
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={FileTextIcon}
      title="No invoices yet"
      description="When your practice sends you an invoice, it will appear here for you to view and pay."
    />
  );

  return (
    <>
      <ResponsiveTable
        caption="Your invoices"
        tableFrom="xl"
        data={list.invoices}
        columns={invoiceColumns}
        getRowId={(invoice) => invoice.id}
        getKey={(invoice) => invoice.id}
        loading={list.isPending}
        sorting={list.sorting}
        setSorting={list.setSorting}
        pagination={list.pagination}
        actions={actions}
        getRowLabel={label}
        emptyState={emptyState}
        onRowClick={(row) =>
          navigate(
            RouteConstants.invoices.details.generate({ id: row.original.id }),
          )
        }
        cardSkeleton={<ListCardSkeleton />}
        renderCard={(invoice) => (
          <ListCard
            row={invoice}
            to={RouteConstants.invoices.details.generate({ id: invoice.id })}
            title={`Invoice ${invoice.invoice_number}`}
            badge={<StatusChip status={getInvoiceDisplayStatus(invoice)} />}
            highlightLabel={isInvoiceOpen(invoice) ? "Amount due" : "Total"}
            highlight={formatMoney(
              isInvoiceOpen(invoice) ? invoice.amount_due : invoice.total_price,
              invoice.currency_code,
            )}
            fields={[
              { label: "Date", value: formatDate(invoice.invoice_date) },
              { label: "Due", value: formatDate(invoice.due_date) },
              ...(isInvoiceOpen(invoice)
                ? [
                    {
                      label: "Total",
                      value: formatMoney(
                        invoice.total_price,
                        invoice.currency_code,
                      ),
                    },
                  ]
                : []),
            ]}
            actions={actions}
            actionsLabel={label(invoice)}
            footer={
              isInvoiceOpen(invoice) ? (
                <Button
                  variant="primary"
                  w="100%"
                  onClick={() =>
                    actions.find((a) => a.value === "pay")?.onClick(invoice)
                  }
                >
                  Pay {formatMoney(invoice.amount_due, invoice.currency_code)}
                </Button>
              ) : undefined
            }
          />
        )}
      />
      <PayInvoiceDialog invoice={payingInvoice} onClose={closePay} />
    </>
  );
}
