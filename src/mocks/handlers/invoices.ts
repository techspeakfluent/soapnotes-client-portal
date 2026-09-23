import type {
  IInvoiceFilter,
  IPayInvoicePayload,
  IPortalInvoice,
  IPortalInvoiceDetail,
} from "@/shared/interface/portal";
import { parseDate } from "@/utils/format-date";
import { isInvoiceOpen, isInvoiceOverdue } from "@/utils/invoice";
import {
  mockBadRequest,
  mockNotFound,
  type MockListQuery,
} from "../mock-response";
import { db, nextId } from "../store";
import { takeTokenisedCard } from "./payments";

const matchesStatus = (invoice: IPortalInvoice, status?: string) => {
  switch (status) {
    case undefined:
    case "":
      return true;
    case "UNPAID":
      return isInvoiceOpen(invoice);
    case "OVERDUE":
      return isInvoiceOverdue(invoice);
    default:
      return String(invoice.status).toUpperCase() === status;
  }
};

const time = (value?: string | null) => parseDate(value)?.getTime() ?? 0;

export const invoiceListQuery = (
  filter: IInvoiceFilter,
): MockListQuery<IPortalInvoice> => {
  const sortBy = filter.sort_by ?? "invoice_date";
  const direction = filter.sort_order === "ASC" ? 1 : -1;
  return {
    page: filter.page,
    limit: filter.limit,
    search: filter.search,
    searchFields: (invoice) => [
      invoice.invoice_number,
      ...invoice.items.map((item) => item.product_name),
    ],
    filter: (invoice) => matchesStatus(invoice, filter.status),
    sort: (a, b) => {
      const av = sortBy.endsWith("date")
        ? time(String(a[sortBy] ?? ""))
        : Number(a[sortBy] ?? 0);
      const bv = sortBy.endsWith("date")
        ? time(String(b[sortBy] ?? ""))
        : Number(b[sortBy] ?? 0);
      return (av - bv) * direction;
    },
  };
};

const findInvoice = (id: string) => {
  const invoice = db.invoices.find((i) => i.id === id);
  if (!invoice) throw mockNotFound("invoice");
  return invoice;
};

export function getInvoiceDetail(id: string): IPortalInvoiceDetail {
  const invoice = findInvoice(id);
  return {
    ...invoice,
    payments: db.transactions
      .filter((t) => t.invoice?.id === id)
      .map((t) => ({
        id: t.id,
        transaction_date: t.transaction_date,
        transaction_type: t.transaction_type,
        payment_method: t.payment_method,
        status: t.status,
        currency_code: t.currency_code,
        allocated_amount:
          t.transaction_type === "REFUND" ? -t.amount : t.amount,
      })),
  };
}

export function payInvoice({
  invoice_id,
  payment_method_id,
  save_card,
}: IPayInvoicePayload) {
  const invoice = findInvoice(invoice_id);
  if (!isInvoiceOpen(invoice))
    throw mockBadRequest("This invoice has already been paid.");

  const saved = db.paymentMethods.find((m) => m.id === payment_method_id);
  const method = saved ?? takeTokenisedCard(payment_method_id);
  if (!method) throw mockNotFound("card");
  if (!saved && save_card) {
    db.paymentMethods.push({
      ...method,
      is_default: db.paymentMethods.length === 0,
    });
  }

  const amount = Number(invoice.amount_due ?? 0);
  const now = new Date().toISOString();
  invoice.amount_paid = Number(invoice.amount_paid ?? 0) + amount;
  invoice.amount_due = 0;
  invoice.status = "PAID";

  db.transactions.unshift({
    id: nextId("txn"),
    amount,
    currency_code: invoice.currency_code ?? "CAD",
    transaction_date: now,
    transaction_type: "PAYMENT",
    payment_method: "CREDIT_CARD",
    status: "SUCCESS",
    invoice: { id: invoice.id, invoice_number: invoice.invoice_number },
    card: { brand: method.card.brand, last4: method.card.last4 },
  });
  db.activity.unshift({
    id: nextId("act"),
    client_id: db.client.id,
    activity_type: "transaction_created",
    activity_date: now,
    created_at: now,
    details: {
      amount,
      currency_code: invoice.currency_code,
      payment_method: "CREDIT_CARD",
      invoice_number: invoice.invoice_number,
    },
  });
  return getInvoiceDetail(invoice.id);
}
