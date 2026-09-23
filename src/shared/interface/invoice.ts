import type { IClient, IDiscount } from "./common";
import type { IPackageOffering } from "./package-offering";
import type { ITax } from "./tax";
import type { ITransaction } from "./transaction";
import type { IOrganization } from "./organization";
import type { IServicePurchase } from "./purchased-package";
import type { IEmbeddedAllocation } from "./allocation";

export type InvoiceDiscountType = "percentage" | "currency";

export interface IInvoiceDiscount {
  type: InvoiceDiscountType;
  value: number;
}

export interface IInvoiceItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  description?: string;
  package_id?: string;
  package_offering?: IPackageOffering;
  position?: number;
  tax_ids?: string[];
  /** BE-computed tax amount for this item (snapshot at create/edit).
   *  Caution: switching an invoice to overall-mode tax does NOT clear
   *  item-level tax fields — never sum these with the invoice-level
   *  tax_value. */
  tax_value?: string | number | null;
  service_id?: string;
}

/** A redemption line under a parent invoice — returned when the list
 *  endpoint is called with `include_sub_invoices`. Rendered as an
 *  expandable sub-row on the contact Invoices tab. */
export interface ISubInvoice {
  id: string;
  /** Parent invoice id — sub-rows link back to the parent's detail page. */
  invoice_id: string;
  invoice_number: string;
  redemption_count?: number;
  purchased_package_id?: string | null;
  service_id?: string | null;
  booking_id?: string | null;
  product?: string | null;
  status?: string;
  session_type?: string | null;
  price?: number | null;
  duration_minutes?: number | null;
  quantity?: number | null;
  invoice_date?: string | null;
  redeemed_at?: string | null;
  created_at?: string;
  client_id?: string | null;
  /** Who the redemption was used by — a linked family member on family
   *  packages, otherwise the parent invoice's own client. The API nests the
   *  full client record here; there is no flat `used_by_name`. */
  client?: IClient | null;
}

export interface IInvoice {
  id: string;
  invoice_number?: string;
  client_id: string;
  invoice_date: string;
  due_date?: string;
  name?: string;
  email?: string;
  slp?: string;
  session_type?: string;
  discount?: IInvoiceDiscount;
  status?: string;
  qty?: number;
  currency_code?: string;
  data_source?: string;
  memo?: string;
  internal_memo?: string;
  /** Last edit's audit note (sent as `change_reason` on PUT). The
   *  edit flow surfaces this so users can amend it rather than
   *  silently overwriting their previous reason. */
  change_reason?: string;
  /** ISO timestamp of the last time the invoice was emailed. The
   *  SendInvoiceCard header flips to "Resend Invoice" when set. */
  sent_at?: string | null;
  /** Display name of the user/mailbox that sent it last. */
  sent_by?: string | null;
  /** Invoice-level taxes (overall mode). Backend sends as `tax_ids`
   *  on the top-level invoice payload — when present, the form
   *  hydrates in `overall` tax mode with these ids selected. */
  tax_ids?: Array<string | number>;
  /** BE-computed total tax amount (snapshot at create/edit) — the
   *  authoritative tax figure in BOTH tax modes. */
  tax_value?: string | number | null;
  total_price?: number;
  items?: IInvoiceItem[];
  created_dt?: string;
  updated_dt?: string;
  client?: IClient;
  product?: string;
  amount_due?: number;
  /** What the invoice has actually been paid — the server's sum of the
   *  allocations pointing at it, excluding voided/failed payments. Prefer
   *  this over any client-side sum of `transactions`. */
  amount_paid?: number;
  /** Present only when the list is fetched with `include_sub_invoices`. */
  sub_invoices?: ISubInvoice[];
  service_purchases?: Array<IServicePurchase>;
  /** Payments whose derived `invoice_id` pointer names this invoice.
   *  Convenience only — a pointer is not a money fact, so never sum `amount`
   *  over this to decide what the invoice has been paid. Use `allocations`. */
  transactions?: Array<ITransaction>;
  /** What this invoice has actually been paid, per contributing payment.
   *  Returned by the invoice detail endpoint with `transaction` joined. */
  allocations?: Array<IEmbeddedAllocation>;
  client_purchases?: {
    packages: Array<
      IPackageOffering & { service_purchases: IServicePurchase[] }
    >;
    standaloneServices: Array<IServicePurchase>;
    summary: {
      totalPackages: number;
      totalStandaloneServices: number;
      totalPurchases: number;
    };
  };
}

export type InvoiceSortBy =
  | "id"
  | "created_dt"
  | "invoice_date"
  | "due_date"
  | "total_price"
  | "status"
  | "invoice_number";
export interface InvoiceItem {
  id?: string;
  product_name?: string;
  description?: string;
  quantity: number;
  price: number;
  /** Populated tax objects (legacy payload shape). */
  taxes?: ITax[];
  /** Tax ids as sent by the current API — resolved against the taxes
   *  catalog when `taxes` isn't populated. */
  tax_ids?: Array<string | number>;
  /** BE-computed tax amount for this item (snapshot at create/edit) —
   *  the authoritative per-item figure in per-item tax mode. */
  tax_value?: string | number | null;
  /** Display-only annotation under the line item ("GST 5%") — set by
   *  `prepareInvoicePdfData` in per-item tax mode. */
  taxLabel?: string;
}

export interface InvoicePDFData {
  customerName: string;
  customerEmail?: string;

  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;

  subtotal: number;
  discount?: IDiscount;
  discountAmount?: number;
  taxes: ITax[];
  total: number;
  amountPaid: number;
  amountDue: number;
  amountDueFormatted: string;

  items: InvoiceItem[];
  transactions?: ITransaction[];

  memo?: string;
  referral?: string;

  organization: IOrganization;

  currencyCode?: string;
  showPowerBy?: boolean;
  description?: string;
  isSfFlow?: boolean;
  paymentLink?: string | null;
  showTransactionDetails?: boolean;
  isPackage?: boolean;
}

export interface InvoicePDFProps {
  data: InvoicePDFData;
}

export interface SessionReceiptItem {
  id: string | number;
  product_name: string;
  description?: string;
  service_name?: string;
  duration?: string;
}

export interface SessionReceiptPDFData {
  customerName: string;
  customerEmail?: string;

  receiptNumber: string;
  sessionDate: string;

  packageName: string;
  packagePrice?: number;
  quantityRedeemed?: number;
  totalSessions?: number;
  redeemedSessions?: number;
  remainingSessions?: number;
  currencyCode?: string;
  sessionService: SessionReceiptItem;

  memo?: string;
  description?: string;
  organization: IOrganization;
  showPowerBy?: boolean;
}

export interface SessionReceiptPDFProps {
  data: SessionReceiptPDFData;
}
