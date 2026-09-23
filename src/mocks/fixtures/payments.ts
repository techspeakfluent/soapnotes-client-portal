import type {
  INotificationPreferences,
  IPortalInvoice,
  IPortalPaymentMethod,
  IPortalTransaction,
} from "@/shared/interface/portal";
import { parseDate } from "@/utils/format-date";

const card = (
  id: string,
  brand: string,
  last4: string,
  exp_month: number,
  exp_year: number,
  is_default = false,
): IPortalPaymentMethod => ({
  id,
  card: { brand, display_brand: brand, last4, exp_month, exp_year },
  is_default,
});

export const paymentMethodsWithHistory: IPortalPaymentMethod[] = [
  card("pm_visa_4242", "visa", "4242", 8, 2028, true),
  card("pm_mc_4444", "mastercard", "4444", 1, 2025),
  card("pm_amex_0005", "amex", "0005", 11, 2027),
];

const addDays = (iso: string, days: number) => {
  const date = parseDate(iso) ?? new Date();
  date.setDate(date.getDate() + days);
  date.setHours(14, 20, 0, 0);
  return date.toISOString();
};

export const transactionsFor = (
  invoices: IPortalInvoice[],
): IPortalTransaction[] =>
  invoices.flatMap((invoice, index) => {
    const base = {
      currency_code: invoice.currency_code ?? "CAD",
      invoice: { id: invoice.id, invoice_number: invoice.invoice_number },
    };
    const byCard = index % 3 !== 2;
    const rows: IPortalTransaction[] = [];
    const paid =
      invoice.status === "REFUNDED" ? invoice.total_price : invoice.amount_paid;
    if (paid) {
      rows.push({
        ...base,
        id: `txn-${invoice.id}`,
        amount: Number(paid),
        transaction_date: addDays(invoice.invoice_date, 2),
        transaction_type: "PAYMENT",
        payment_method: byCard ? "CREDIT_CARD" : "E_TRANSFER",
        status: "SUCCESS",
        card: byCard ? { brand: "visa", last4: "4242" } : null,
      });
    }
    if (invoice.status === "REFUNDED") {
      rows.push({
        ...base,
        id: `txn-${invoice.id}-refund`,
        amount: Number(invoice.total_price),
        transaction_date: addDays(invoice.invoice_date, 6),
        transaction_type: "REFUND",
        payment_method: "CREDIT_CARD",
        status: "REFUNDED",
        card: { brand: "visa", last4: "4242" },
      });
    }
    return rows;
  });

export const defaultPreferences: INotificationPreferences = {
  session_reminders: true,
  invoice_emails: true,
  payment_receipts: true,
  marketing_emails: false,
};
