export interface IContact {
  id: string;
  created_at: string;
  updated_at: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  active_slp: IContactActiveSlp | null;
  company: string;
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
  affiliate: null;
  lead_created: string;
  last_consultation_date: string | null;
  ax_date: string | null;
  first_tx: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  ltv: string | null;
  stripe: string | null;
  notes_text: string | null;
  slp_notes_text: string | null;
  slp: string | null;
  goals: string | null;
  referral_source: string | null;
  attribution: string | null;
  waitlist: string | null;
  middle_name: string | null;
  display_name: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  dob: string | null;
  postal_code: string | null;
  address: string | null;
  email_marketing_consent: boolean;
  stripe_customer_id: string | null;
  status: string | null;
  organization_id: string | null;
  active_slp_id: string | null;
  client_emails: Array<IContactEmail>;
  // Newer BE fields powering the Last Session / Last Booking / Active Package
  // columns. Optional so older responses still parse cleanly.
  last_session?: IContactBookingRef | null;
  last_booking?: IContactBookingRef | null;
  active_packages?: Array<IContactActivePackage>;
}

// A booking reference (last session / last booking) on a contact row.
export interface IContactBookingRef {
  id: string;
  appointment: string | null;
  status: string | null;
}

// A client's active package, as returned for the contacts list (slim shape).
export interface IContactActivePackage {
  id: string;
  package_name: string;
  total_sessions: number;
  redeemed_sessions: number;
}

/**
 * The assigned-provider sub-shape attached to a contact response.
 * Mirrors the org-user listing shape — only the fields we actually
 * consume are required; the rest are optional so the type tolerates
 * the backend adding more without a frontend bump.
 */
export interface IContactActiveSlp {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  office_title?: string | null;
  role?: string | null;
}
export interface IContactEmail {
  id: string;
  created_at: string;
  email: string;
  is_primary_email: boolean;
  organization_id: string;
  client_id: string;
}

export interface IClientGroup {
  id: string;
  name: string;
  description: string;
  color: string;

  organization_id: string;
  created_at: string;
  updated_at: string;
  clients: Array<any>;
}

export interface IClientDocument {
  id: string;
  url: string;
  name: string;
  type: string;
  client_id?: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface IClientProfileMetrics {
  client_since: {
    lead_created: string | null;
  };
  sessions: {
    done: number;
    scheduled: number;
  };
  paid_to_date: {
    amount: number;
    last_payment_date: string | null;
  };
  amount_due: {
    amount: number;
    overdue_count: number;
  };
  /** Successful payments not yet applied to an invoice. Optional: older
   *  deployments of the endpoint omit it. */
  credit_balance?: {
    amount: number;
  };
}
