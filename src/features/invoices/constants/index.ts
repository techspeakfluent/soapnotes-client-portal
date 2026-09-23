// OVERDUE and UNPAID are derived by the server, not stored statuses.
export const INVOICE_STATUS_FILTER_OPTIONS = [
  { label: "All invoices", value: "" },
  { label: "Unpaid", value: "UNPAID" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Partially paid", value: "PARTIALLY_PAID" },
  { label: "Paid", value: "PAID" },
  { label: "Refunded", value: "REFUNDED" },
];

export const INVOICES_PAGE_SIZE = 10;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CREDIT_CARD: "Card",
  CASH: "Cash",
  E_TRANSFER: "e-Transfer",
  BANK_TRANSFER: "Bank transfer",
  PAYPAL: "PayPal",
  OTHERS: "Other",
};
