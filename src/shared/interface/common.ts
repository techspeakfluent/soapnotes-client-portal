import type { IInvoice } from "./invoice";
import type { INote } from "./note";
import type { IPurchasedPackage, IServicePurchase } from "./purchased-package";
import type { IService } from "./service";
import type { ISlpNote } from "./slp_note";
import type { IUser } from "./user";

export interface ITimeZone {
  tzName: string;
  zoneName: string;
  gmtOffset: number;
  abbreviation: string;
  gmtOffsetName: string;
}
export interface IPlace {
  name: string;
  latitude: string;
  longitude: string;
  stateCode: string;
  countryCode: string;
  isoCode?: string;
}
export interface IStage {
  id: string;
  label: string;
  isDefault: boolean;

  color: string;
  count: number;

  showAsCard: boolean;
}

export interface ICountry {
  flag: any;
  name: string;
  isoCode: string;
  currency: string;
  latitude: string;
  longitude: string;
  phonecode: string;
  timezones: Array<ITimeZone>;
}
export interface IDiscount {
  type: "percentage" | "fixed";
  value: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page_number: number;
    total_count: number;
    items_per_page: number;
  };
}

export type IGoogleServices = "gmail" | "calendar" | "docs" | "meet" | "drive";

export interface IClient {
  id: string;
  created_at: string;
  updated_at: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  stage: string;
  lead_quality: string | null;
  objection: string | null;
  consulted_by: string | null;
  province_old: string | null;
  fu_email: string | null;
  fu_call: string | null;
  last_emailed: string | null;
  last_called: string | null;
  insurance_company: string | null;
  province: string | null;
  job_title: string | null;
  interest: string | null;
  coverage: string | null;
  source: string | null;
  affiliate: string | null;
  lead_created: string | null;
  last_consultation_date: string | null;
  ax_date: string | null;
  first_tx: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  ltv: number | null;
  stripe: string | null;
  notes_text: string | null;
  slp_notes_text: string | null;
  slp: string | null;
  goals: string[];
  purchased_packages?: Array<IPurchasedPackage>;
  referral_source: string | null;
  attribution: string | null;
  waitlist: string | null;
  middle_name: string | null;
  display_name: string;
  country: string | null;
  state: string | null;
  city: string | null;
  dob: string | null;
  postal_code: string | null;
  address: string | null;
  email_marketing_consent: boolean;
  stripe_customer_id: string | null;
  status: string | null;
  organization_id: string;
  active_slp_id: string | null;
  /** Top-level `email` is often null; the canonical addresses live here.
   *  Use getPrimaryEmail() to pick the one flagged is_primary_email. */
  client_emails?: Array<IClientEmail>;
}

export interface IClientEmail {
  id?: string;
  email: string;
  is_primary_email?: boolean;
  organization_id?: string;
  client_id?: string;
}
export interface IBooking {
  id: string;
  email: string;
  booking_created_at_raw: string;
  event: string;
  assigned_to: string;
  appointment_raw: string;
  first_name: string;
  last_name: string;
  referral: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  phone: string | null;
  province: string | null;
  calendly_event_type: string;
  product: string | null;
  created_dt: string;
  created_at: string;
  updated_at: string;
  appointment: string;
  slp_id: string;
  organization_id: string;
  raw_data: any;
  event_id: string | null;
  start_time: string;
  end_time: string;
  time_zone: string | null;
  google_event_id: string | null;
  product_id: string | null;
  conference_provider: string | null;
  meet_link: string | null;
  buffer_after_event_id: string | null;
  buffer_before_event_id: string | null;
  status: string;
  reason_for_cancelling: string | null;
  invoice_sent_at: string | null;
  invoice_sent_by: string | null;
  invoice_sent_by_user: IUser | null;
  invoice_id: string | null;
  client_id: string;
  service_id: string;
  client: IClient;
  service: IService;
  service_purchases: Array<IServicePurchase>;
  slp: IUser;
  slp_note: ISlpNote;
  invoice: IInvoice;
  notes: INote[];
}
