import type { ICountry, IPlace, IStage } from "./common";

export interface IOrganization {
  id: string;
  name: string;
  plan: string;
  slug: string;
  owner: string;
  taxes: Array<any>;
  logo_url: string;
  created_at: string;
  date_format: Record<string, any> | null;
  billing_info: {
    city: IPlace;
    phone: string;
    /** Server also returns a flat `telephone` string alongside `phone`. */
    telephone?: string;
    state: IPlace;
    country: ICountry;
    website: string;
    address: string;
    postal_code?: string;
    organization_email: string;
    registration_number: string;
  };
  currency_code: string;
  contact_stages: Array<IStage>;
  stripe_user_id: string;
  klaviyo_details: any;
  calendly_auth_code: string;
  calendly_access_token: string;
  calendly_organization: string;
  klaviyo_code_verifier: string;
  calendly_refresh_token: string;
  calendly_webhook_connected: boolean;
  stripe_customer_id: string;
  is_klaviyo_connected?: boolean;
  invoice_settings?: {
    default_subject: string;
    default_filename: string;
  } | null;
  terms_of_use?: string;
  privacy_notice?: string;
  /**
   * When true (default), "Powered by SOAP" branding is shown on PDFs
   * (invoices, receipts). Unchecking it hides the footer for white-label use.
   */
  use_soap_branding?: boolean;
  /** Org-wide expiry policy for purchased packages. */
  package_settings?: {
    /** Whether purchased packages expire at all. */
    packages_expire?: boolean;
    /** Months after purchase before a package expires (1–1200). Only
     * meaningful when `packages_expire` is true. */
    expiry_months?: number;
  } | null;
  /** Org-wide opt-ins for the tasks the backend raises on its own. */
  todo_settings?: ITodoSettings | null;
  /** Which sections the session page hides, for everyone in the org. */
  session_page_settings?: ISessionPageSettings | null;
}

/**
 * Also the body of `PUT /organizations/info/session-page-settings`. Ids are
 * `SessionPageSectionId`s (see the bookings feature); anything not listed is
 * shown, and `[]` shows everything.
 */
export interface ISessionPageSettings {
  hidden_sections: string[];
}

/**
 * Which system todos the organization gets. Also the body of
 * `PUT /organizations/info/todo-settings`.
 */
export interface ITodoSettings {
  /** "Create invoice for <client>" when a note is saved or linked to a booking. */
  auto_create_invoice_todo: boolean;
  /** "Send invoice email to <client>" when an invoice is linked to a booking. */
  auto_create_send_invoice_email_todo: boolean;
}
export type TIsPublic = "true" | "false";
