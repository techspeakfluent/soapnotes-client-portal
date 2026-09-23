/**
 * Transaction allocations — how much of one payment belongs to one invoice.
 *
 * An invoice is paid by the allocations pointing at it, never by summing the
 * face `amount` of the payments linked to it. One $260 payment covering two
 * $130 sessions is two allocations of $130; crediting $260 to both invoices is
 * exactly the bug this table exists to fix.
 *
 * `transaction.invoice_id` still exists but is a DERIVED pointer at the largest
 * allocation, maintained by the database. Read it for a "mainly about invoice
 * X" label; never write it, and never use it to decide what an invoice is paid.
 */

import type { ITransaction } from "./transaction";

/**
 * The money numbers come back as Postgres `numeric` strings — parse before
 * doing arithmetic. The transaction-level totals (`amount`/`allocated`/
 * `remaining`) are real numbers.
 */
export interface ITransactionAllocationRow {
  invoice_id: string;
  invoice_number: string | null;
  invoice_total: string | null;
  invoice_status: string | null;
  allocated_amount: string;
  note: string | null;
}

/** GET /transactions/:id/allocations — how one payment is currently split. */
export interface ITransactionAllocations {
  transaction_id: string;
  amount: number;
  allocated: number;
  /** Money received but not yet applied to anything — available credit. */
  remaining: number;
  allocations: ITransactionAllocationRow[];
}

/** One payment's contribution to an invoice, as listed by the invoice side. */
export interface IInvoiceAllocationPayment {
  transaction_id: string;
  /** What THIS invoice takes — the figure to display. */
  allocated_amount: string;
  /** The payment's face value, which may fund other invoices too. */
  amount: string | null;
  transaction_date: string | null;
  payment_method: string | null;
  status: string;
  reference_id: string | null;
  note: string | null;
}

/** GET /invoices/:id/allocations — which payments fund this invoice. */
export interface IInvoiceAllocations {
  invoice_id: string;
  total_price: number;
  /** Live payments only: voided and failed ones are listed but contribute 0. */
  paid: number;
  outstanding: number;
  payments: IInvoiceAllocationPayment[];
}

/**
 * An allocation row as embedded in the invoice detail payload
 * (`invoice.allocations`, with its `transaction` joined).
 */
export interface IEmbeddedAllocation {
  id: string;
  organization_id?: string;
  transaction_id: string;
  invoice_id: string;
  allocated_amount: string;
  note: string | null;
  created_at?: string;
  updated_at?: string;
  transaction?: ITransaction | null;
}

/** One row of the split editor, as the user is editing it. */
export interface IAllocationDraft {
  /** Client-side row key — allocations have no stable id before saving. */
  key: string;
  invoice_id: string;
  /** Free text while editing; parsed on validate/submit. */
  amount: string;
  note: string;
}

/** PUT /transactions/:id/allocations — REPLACES the whole set. */
export interface ISetTransactionAllocations {
  allocations: Array<{
    invoice_id: string;
    amount: number;
    note?: string;
  }>;
}
