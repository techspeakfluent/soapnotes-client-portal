import type { IPortalInvoice } from "@/shared/interface/portal";
import { parseDate } from "./format-date";

const SETTLED = new Set(["PAID", "REFUNDED", "VOID", "PARTIALLY_REFUNDED"]);

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const isInvoiceOpen = (invoice: IPortalInvoice) =>
  Number(invoice.amount_due ?? 0) > 0 &&
  !SETTLED.has(String(invoice.status).toUpperCase());

// Soapnotes never stores OVERDUE; it's an unpaid invoice past its due date.
export const isInvoiceOverdue = (invoice: IPortalInvoice) => {
  if (!isInvoiceOpen(invoice)) return false;
  const due = parseDate(invoice.due_date);
  return !!due && due < startOfToday();
};

export const getInvoiceDisplayStatus = (invoice: IPortalInvoice) =>
  isInvoiceOverdue(invoice) ? "OVERDUE" : (invoice.status ?? "");
