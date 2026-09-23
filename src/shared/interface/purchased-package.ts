import type { IBooking, IClient } from "./common";
import type { IPackageItem, IPackageOffering } from "./package-offering";
import type { IService } from "./service";

export interface IPurchasedPackageItem extends IPackageItem {
  redeemed_quantity?: number;
  remaining_quantity?: number;
}

// export interface IPurchasedPackage {
//   client?: IClient;
//   client_id: string;
//   completed_at: string | null;
//   created_at?: string;
//   id: string;
//   invoice_id?: string;
//   invoice_item_id?: string;
//   organization_id?: string;
//   package_description?: string;
//   package_name?: string;
//   price?: string;
//   purchased_at?: string;
//   package_offering_id?: string;}
export interface IServicePurchase {
  id: string;
  created_at: string;
  updated_at: string;
  service_id: string;
  invoice_item_id: string;
  status: string;
  booking_id: string | null;
  organization_id: string;
  user_id: string;
  client_id: string;
  invoice_id: string;
  purchased_package_id: string;
  session_type: string | null;
  description: string | null;
  memo: string | null;
  invoice_date: string | null;
  redemption_count: number | null;
  service_name: string;
  service_description: string;
  price: string;
  duration_minutes: number;
  redeemed_at: string | null;
  /** Display order inherited from the offering item this session came from. */
  position?: number | null;
  booking?: IBooking;
  name?: string;
  product?: string;
  service: IService;
  /**
   * Who the redemption was FOR — the linked client when an SLP redeemed
   * this purchase for one, else the purchase owner. Unconfirmed whether the
   * backend populates this on redemption; verify before relying on it.
   */
  client: IClient;

  purchased_package: IPurchasedPackage;

  type: string;
}

export interface IPurchasedPackage {
  id: string;
  client_id: number | string;
  invoice_id?: number | string | null;
  package_offering_id?: number | string | null;
  organization_id?: string;
  user_id?: string;
  invoice_item_id?: string;
  status: string;
  expiry_date?: string | null;
  package_name?: string;
  package_description?: string;
  total_sessions?: number;
  redeemed_sessions?: number;
  purchased_at?: string;
  completed_at?: string | null;
  price?: string;
  /**
   * Expiry as the purchases payload sends it. `expiry_date` was the earlier
   * name and is kept as a fallback; `is_expired` is the backend's own verdict
   * and beats comparing dates here.
   */
  expires_at?: string | null;
  is_expired?: boolean;
  /** Per-package money, nested. See IPurchasedPackageBilling. */
  billing?: IPurchasedPackageBilling | null;
  /**
   * Duplicate of `service_purchases` in the same payload. Read
   * `service_purchases` — this is here so the extra key is typed, not so it
   * gets used.
   */
  services?: IServicePurchase[];
  package_offering?: IPackageOffering;
  client?: IClient;
  items?: IPurchasedPackageItem[];
  service_purchases?: IServicePurchase[];
  created_at?: string;
  updated_at?: string;
}

/**
 * A package's money, as `/purchased-packages/client/:id/purchases` returns
 * it. Only the fields we consume are named; the rest are left off so the
 * type tolerates the backend adding more.
 *
 * `balance` is what the card reads. In the payloads seen so far it equals
 * the invoice's own figures because the invoice held nothing but the
 * package — whether it stays the PACKAGE's share on a multi-item invoice is
 * the open question against the backend.
 */
export interface IPurchasedPackageBilling {
  invoice?: {
    id: string;
    invoice_number?: string;
    invoice_date?: string;
    due_date?: string;
    status?: string;
    currency_code?: string;
    total_price?: number;
    amount_paid?: number;
    amount_due?: number;
  } | null;
  transactions?: Array<{
    id: string;
    transaction_date?: string;
    transaction_type?: string;
    payment_method?: string;
    status?: string;
    currency_code?: string;
    amount?: number;
    allocated_amount?: number;
    applied_amount?: number;
  }>;
  balance?: {
    total_price?: number;
    amount_paid?: number;
    amount_due?: number;
    is_paid?: boolean;
    currency_code?: string;
  } | null;
}

export interface IClientPurchasesResponse {
  packages: IPurchasedPackage[];
  standaloneServices: IServicePurchase[];
}

export interface IRedeemedService {
  id: string;
  service_id: string;
  slp_id: string;
  client_id: string;
  purchased_package_id: string;
  redeemed_date: string;
  quantity?: number;
  created_at?: string;
}
