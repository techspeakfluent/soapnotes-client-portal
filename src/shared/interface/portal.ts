// Shapes the client-portal endpoints return. Wherever soapnotes already has
// the entity, these are `Pick`s of its interface so the two can't drift; the
// shapes with no soapnotes counterpart are proposals, listed in
// docs/api-needed.md for the backend team.
import type { IClientActivity } from "./activity";
import type { IClient, IClientEmail, IBooking } from "./common";
import type { IInvoice, IInvoiceItem } from "./invoice";
import type { IOrganization } from "./organization";
import type { IPurchasedPackage } from "./purchased-package";
import type { IService } from "./service";
import type { ISubscriptionCard } from "./subscription";
import type { ITransaction } from "./transaction";
import type { IUser } from "./user";

export type IPortalOrganization = Pick<
  IOrganization,
  "id" | "name" | "slug" | "logo_url" | "currency_code"
>;

export type IPortalClient = Pick<
  IClient,
  | "id"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "display_name"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "state"
  | "country"
  | "postal_code"
  | "dob"
  | "organization_id"
> & {
  client_emails: IClientEmail[];
  organization: IPortalOrganization;
};

export type IPortalProvider = Pick<
  IUser,
  "id" | "first_name" | "last_name" | "avatar_url"
>;

export type IPortalBooking = Pick<
  IBooking,
  | "id"
  | "created_dt"
  | "email"
  | "event"
  | "assigned_to"
  | "appointment"
  | "start_time"
  | "end_time"
  | "time_zone"
  | "status"
  | "conference_provider"
  | "meet_link"
  | "reason_for_cancelling"
  | "invoice_id"
> & {
  service: Pick<IService, "id" | "name" | "duration_minutes">;
  slp: IPortalProvider;
  /** Proposed: street address for in-person sessions. Null when virtual. */
  location: string | null;
};

export type IPortalInvoiceItem = Pick<
  IInvoiceItem,
  "id" | "product_name" | "description" | "quantity" | "price" | "tax_value"
>;

export type IPortalInvoice = Pick<
  IInvoice,
  | "id"
  | "invoice_number"
  | "invoice_date"
  | "due_date"
  | "status"
  | "currency_code"
  | "total_price"
  | "amount_due"
  | "amount_paid"
  | "discount"
  | "tax_value"
  | "memo"
> & {
  items: IPortalInvoiceItem[];
};

export type IPortalInvoicePayment = Pick<
  ITransaction,
  | "id"
  | "transaction_date"
  | "transaction_type"
  | "payment_method"
  | "status"
  | "currency_code"
> & {
  /** What this payment contributes to the invoice — not its face value. */
  allocated_amount: number;
};

export type IPortalInvoiceDetail = IPortalInvoice & {
  payments: IPortalInvoicePayment[];
};

export type IPortalTransaction = Pick<
  ITransaction,
  | "id"
  | "amount"
  | "currency_code"
  | "transaction_date"
  | "transaction_type"
  | "payment_method"
  | "status"
> & {
  invoice: Pick<IInvoice, "id" | "invoice_number"> | null;
  /** Proposed: the card charged, when paid by card. */
  card: { brand: string; last4: string } | null;
};

export type IPortalPaymentMethod = Pick<ISubscriptionCard, "id"> & {
  card: Pick<
    ISubscriptionCard["card"],
    "brand" | "display_brand" | "last4" | "exp_month" | "exp_year"
  >;
  /** Proposed: which card the practice charges by default. */
  is_default: boolean;
};

export interface IInvoiceFilter extends IPageFilter {
  search?: string;
  status?: string;
  sort_by?: "invoice_date" | "due_date" | "total_price" | "amount_due";
  sort_order?: "ASC" | "DESC";
}

/** Proposed. `payment_method_id` is a saved card or one Stripe created in the browser. */
export interface IPayInvoicePayload {
  invoice_id: string;
  payment_method_id: string;
  save_card?: boolean;
}

export type IUpdateProfilePayload = Partial<
  Pick<
    IPortalClient,
    | "first_name"
    | "middle_name"
    | "last_name"
    | "display_name"
    | "phone"
    | "dob"
    | "address"
    | "city"
    | "state"
    | "country"
    | "postal_code"
  >
>;

/** Proposed: what the practice may email the client about. */
export interface INotificationPreferences {
  session_reminders: boolean;
  invoice_emails: boolean;
  payment_receipts: boolean;
  marketing_emails: boolean;
}

export type IPortalPackage = Pick<
  IPurchasedPackage,
  "id" | "package_name" | "status" | "total_sessions" | "redeemed_sessions"
>;

// ── Dashboard (proposed) ──

export interface IOutstandingBalance {
  currency_code: string;
  amount_due: number;
  invoice_count: number;
  invoice_ids: string[];
}

export interface IDashboardMetrics {
  upcoming_sessions: number;
  attended_sessions: number;
  package_sessions_remaining: number;
  outstanding: IOutstandingBalance[];
}

export type ActionItemType =
  "invoice_overdue" | "invoice_unpaid" | "form_pending";

export interface IActionItem {
  id: string;
  type: ActionItemType;
  title: string;
  due_date: string | null;
  invoice_id?: string;
  amount_due?: number;
  currency_code?: string;
  form_url?: string;
}

export interface IClientDashboard {
  next_booking: IPortalBooking | null;
  metrics: IDashboardMetrics;
  action_items: IActionItem[];
}

export type IPortalActivity = IClientActivity;

export interface IPageFilter {
  page?: number;
  limit?: number;
}
