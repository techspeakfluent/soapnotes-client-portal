import type {
  IPortalActivity,
  IPortalPackage,
} from "@/shared/interface/portal";
import { daysFromNow } from "./dates";

const activity = (
  id: string,
  activity_type: string,
  daysAgo: number,
  hour: number,
  details: Record<string, unknown>,
): IPortalActivity => {
  const at = daysFromNow(-daysAgo, hour, 12);
  return {
    id,
    client_id: "client-1001",
    activity_type,
    activity_date: at,
    created_at: at,
    details,
  };
};

export const activityWithHistory: IPortalActivity[] = [
  activity("act-12", "invoice_sent", 3, 9, {
    invoice_id: "inv-0041",
    invoice_number: "202609-0041",
    total_price: 185,
    currency_code: "CAD",
  }),
  activity("act-11", "booking_created", 4, 16, {
    booking_id: "bk-104",
    event: "Speech Therapy Session",
    appointment: daysFromNow(23, 10),
    status: "scheduled",
  }),
  activity("act-10", "transaction_created", 9, 11, {
    amount: 740,
    currency_code: "CAD",
    payment_method: "CREDIT_CARD",
    invoice_number: "202608-0033",
  }),
  activity("act-09", "booking_cancelled", 13, 18, {
    booking_id: "bk-090",
    event: "Speech Therapy Session",
    appointment: daysFromNow(-12, 15),
    status: "cancelled",
  }),
  activity("act-08", "form_submitted", 20, 20, {
    form_name: "Consent to Telepractice Services",
  }),
  activity("act-07", "package_created", 30, 10, {
    package_name:
      "10-Session Therapy Package (Articulation & Expressive Language)",
  }),
  activity("act-06", "invoice_sent", 40, 9, {
    invoice_id: "inv-0037",
    invoice_number: "202608-0037",
    total_price: 420,
    currency_code: "CAD",
  }),
  activity("act-05", "transaction_created", 55, 14, {
    amount: 185,
    currency_code: "CAD",
    payment_method: "CREDIT_CARD",
    invoice_number: "202607-0029",
  }),
  activity("act-04", "package_refunded", 60, 10, {
    amount: 95,
    currency_code: "CAD",
    invoice_number: "202607-0025",
  }),
];

export const packagesWithHistory: IPortalPackage[] = [
  {
    id: "pkg-1",
    package_name:
      "10-Session Therapy Package (Articulation & Expressive Language)",
    status: "ACTIVE",
    total_sessions: 10,
    redeemed_sessions: 3,
  },
];

export const pendingForms = [
  {
    id: "form-1",
    title: "Pre-assessment intake questionnaire",
    due_date: daysFromNow(1),
    form_url:
      "https://forms.example.com/form/northshore-slt/intake-questionnaire",
  },
];
