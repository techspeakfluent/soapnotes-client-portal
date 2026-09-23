/**
 * Client activity timeline types
 * --------------------------------------------------------------------------
 * Activities are heterogenous: every row has a stable envelope
 * ({id, activity_type, activity_date, details}) but `details` varies by
 * `activity_type`. We type the envelope strictly and leave `details` as
 * a permissive bag — the per-type renderer narrows it. Trying to
 * exhaustively type every variant would churn faster than the UI ships.
 */

export type ClientActivityType =
  | "booking_created"
  | "booking_updated"
  | "booking_rescheduled"
  | "booking_cancelled"
  | "booking_deleted"
  | "client_updated"
  | "client_archived"
  | "client_unarchived"
  | "client_deleted"
  | "client_email_added"
  | "client_email_updated"
  | "client_email_removed"
  | "client_primary_email_changed"
  | "invoice_updated"
  | "invoice_sent"
  | "invoice_deleted"
  | "transaction_updated"
  | "transaction_deleted"
  | "transaction_linked_to_invoice"
  | "transaction_unlinked_from_invoice"
  | "transaction_allocations_updated"
  | "estimate_created"
  | "estimate_sent"
  | "estimate_accepted"
  | "estimate_declined"
  | "estimate_converted"
  | "follow_up_completed"
  | "note_deleted"
  | "email_sent"
  | "email_received"
  | "note_created"
  | "note_modified"
  | "invoice_created"
  | "transaction_created"
  | "package_created"
  | "package_refunded"
  | "form_submitted"
  | "session_updated"
  | "client_created"
  | "client_merged"
  | "email_merged"
  | "consultation_notes_created"
  | "clients_merged"
  | "follow_up_created"
  | "client_purchases"
  | "linked_packages"
  | "linked_transactions"
  | "profile_updated"
  | "event_booked"
  // Catch-all — backend may emit unknown types we shouldn't break on.
  | (string & {});

export interface IClientActivity {
  id: string;
  client_id: string;
  organization_id?: string;
  activity_type: ClientActivityType | null;
  activity_date: string;
  created_at: string;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  /** Per-type payload — narrow at the render site. */
  details: Record<string, any> | null;
}

export interface IClientActivitiesFilter {
  client_id: string | number;
  page?: number;
  limit?: number;
  activity_type?: string;
  date_from?: string;
  date_to?: string;
}

/** Convenience filter buckets the UI exposes (maps one label to N
 *  backend activity_types in the renderer/dropdown logic). */
export type ActivityFilterKey =
  | "all"
  | "client"
  | "estimate"
  | "notes"
  | "emails"
  | "invoice"
  | "transaction"
  | "packages"
  | "forms"
  | "booking"
  | "consultation_notes";
