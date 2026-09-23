import type {
  IActionItem,
  IClientDashboard,
  IOutstandingBalance,
} from "@/shared/interface/portal";
import {
  getBookingStart,
  isBookingCancelled,
  isBookingUpcoming,
} from "@/utils/booking";
import { parseDate } from "@/utils/format-date";
import { isInvoiceOpen, isInvoiceOverdue } from "@/utils/invoice";
import { db } from "../store";

const byDate = (a?: string | null, b?: string | null) =>
  (parseDate(a)?.getTime() ?? Infinity) - (parseDate(b)?.getTime() ?? Infinity);

// What GET /client-portal/dashboard will compute on the server.
export function buildDashboard(): IClientDashboard {
  const now = new Date();

  const upcoming = db.bookings
    .filter((b) => isBookingUpcoming(b, now))
    .sort((a, b) => byDate(a.start_time, b.start_time));
  const attended = db.bookings.filter(
    (b) => !isBookingCancelled(b) && (getBookingStart(b) ?? now) < now,
  );

  const openInvoices = db.invoices
    .filter(isInvoiceOpen)
    .sort((a, b) => byDate(a.due_date, b.due_date));

  const outstanding = new Map<string, IOutstandingBalance>();
  for (const invoice of openInvoices) {
    const currency =
      invoice.currency_code ?? db.client.organization.currency_code;
    const entry = outstanding.get(currency) ?? {
      currency_code: currency,
      amount_due: 0,
      invoice_count: 0,
      invoice_ids: [],
    };
    entry.amount_due += Number(invoice.amount_due ?? 0);
    entry.invoice_count += 1;
    entry.invoice_ids.push(invoice.id);
    outstanding.set(currency, entry);
  }
  const orgCurrency = db.client.organization.currency_code;
  const balances = [...outstanding.values()].sort(
    (a, b) =>
      Number(b.currency_code === orgCurrency) -
      Number(a.currency_code === orgCurrency),
  );

  const invoiceItems: IActionItem[] = openInvoices.map((invoice) => ({
    id: `invoice-${invoice.id}`,
    type: isInvoiceOverdue(invoice) ? "invoice_overdue" : "invoice_unpaid",
    title: `Invoice ${invoice.invoice_number}`,
    due_date: invoice.due_date ?? null,
    invoice_id: invoice.id,
    amount_due: invoice.amount_due,
    currency_code: invoice.currency_code,
  }));
  const formItems: IActionItem[] = db.forms.map((form) => ({
    id: `form-${form.id}`,
    type: "form_pending",
    title: form.title,
    due_date: form.due_date,
    form_url: form.form_url,
  }));

  return {
    next_booking: upcoming[0] ?? null,
    metrics: {
      upcoming_sessions: upcoming.length,
      attended_sessions: attended.length,
      package_sessions_remaining: db.packages
        .filter((p) => p.status === "ACTIVE")
        .reduce(
          (sum, p) =>
            sum +
            Math.max(0, (p.total_sessions ?? 0) - (p.redeemed_sessions ?? 0)),
          0,
        ),
      outstanding: balances,
    },
    action_items: [...invoiceItems, ...formItems].sort(
      (a, b) =>
        Number(b.type === "invoice_overdue") -
          Number(a.type === "invoice_overdue") ||
        byDate(a.due_date, b.due_date),
    ),
  };
}
