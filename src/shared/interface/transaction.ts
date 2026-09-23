import type { IClient } from "./common";
import type { IInvoice } from "./invoice";
import type { ITransactionAllocationRow } from "./allocation";

export type TransactionStatus =
  | "PAID"
  | "SUCCESS"
  | "COMPLETED"
  | "PARTIALLY_PAID"
  | "AWAITING_PAYMENT"
  | "PENDING"
  | "FAILED"
  | "REFUNDED"
  | "DELETED";

export type TransactionType = "PAYMENT" | "REFUND" | "DEPOSIT" | "CHARGE_BACK";

export type TransactionPaymentMethod =
  "CREDIT_CARD" | "CASH" | "E_TRANSFER" | "BANK_TRANSFER" | "PAYPAL" | "OTHERS";

export type TransactionLinkStatus = "linked" | "unlinked";

export type TransactionSortBy =
  | "id"
  | "created_at"
  | "transaction_date"
  | "amount"
  | "status"
  | "transaction_type"
  | "payment_method";

export interface ITransaction {
  id: string;
  client_id: string;
  /** DERIVED pointer at the payment's largest allocation, maintained by the
   *  database.
   *
   *  DO NOT use this to decide which invoice a payment is applied to — read
   *  `allocations`. A payment covering two invoices names only the bigger
   *  share here, and a payment showing an invoice may still have money free.
   *  Its absence no longer means "applied to nothing" either: that is
   *  `allocations.length === 0`, or `remaining` for "has money available".
   *
   *  It is good for one thing only: a "mainly about invoice X" label. Never
   *  write it. */
  invoice_id?: string | null;
  amount: number;
  currency_code: string;
  transaction_type: TransactionType;
  payment_method: TransactionPaymentMethod;
  transaction_date: string;
  note?: string;
  reference_id?: string | null;
  stripe_intent_id?: string | null;
  status: TransactionStatus;
  client?: IClient;
  invoice?: IInvoice;
  /** What this payment actually pays for — the authoritative answer, and the
   *  field to render. Every read endpoint attaches it (list, by-id, and the
   *  client's transactions), so a picker or a column never needs to ask
   *  separately. Empty means the payment is applied to nothing at all. */
  allocations?: Array<ITransactionAllocationRow>;
  /** THIS invoice's share of the payment, present only when the transaction
   *  is embedded in an invoice payload (`invoice.transactions[]`) that carries
   *  no separate `allocations` array. Numeric string from Postgres.
   *
   *  It is the figure to display and to sum there — `amount` is the payment's
   *  face value and may fund other invoices too. */
  allocated_amount?: string | number | null;
  /** The allocation's own note (why the split), on that same embedded shape. */
  allocation_note?: string | null;
  /** Sum of the allocated shares. */
  allocated?: number;
  /** `amount - allocated` — money received but not yet applied to anything,
   *  i.e. available credit. Non-zero is what "unlinked" now means. */
  remaining?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ITransactionMetricBucket {
  count: number;
  total: number;
}

/**
 * `linked.total` is money APPLIED to invoices and `unlinked.total` is money
 * STILL AVAILABLE, so the two add up to `all.total` even when payments are
 * half applied. The COUNTS can overlap — a part-applied payment is counted in
 * both because it genuinely belongs in both — so never render
 * `linked.count + unlinked.count` as a total.
 */
export interface ITransactionMetrics {
  all?: ITransactionMetricBucket;
  linked?: ITransactionMetricBucket;
  unlinked?: ITransactionMetricBucket;
  currency_code?: string;
  [key: string]: unknown;
}
