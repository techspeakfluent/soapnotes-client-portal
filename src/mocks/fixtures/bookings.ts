import type {
  IPortalBooking,
  IPortalProvider,
} from "@/shared/interface/portal";
import { daysFromNow, plusMinutes } from "./dates";

const drAdebayo: IPortalProvider = {
  id: "slp-1",
  first_name: "Oluwaseun",
  last_name: "Adebayo-Richardson",
  avatar_url: null,
};

const priya: IPortalProvider = {
  id: "slp-2",
  first_name: "Priya",
  last_name: "Raman",
  avatar_url: null,
};

const therapy = {
  id: "svc-1",
  name: "Speech Therapy Session",
  duration_minutes: 45,
};
const assessment = {
  id: "svc-2",
  name: "Initial Assessment — Comprehensive Articulation, Language & Fluency Evaluation",
  duration_minutes: 90,
};
const coaching = {
  id: "svc-3",
  name: "Parent Coaching",
  duration_minutes: 30,
};

const CLINIC =
  "Northshore SLT Clinic, 1450 Lonsdale Avenue, Suite 300, North Vancouver";

const booking = (
  id: string,
  days: number,
  hour: number,
  service: IPortalBooking["service"],
  slp: IPortalProvider,
  extra: Partial<IPortalBooking> = {},
): IPortalBooking => {
  const start = daysFromNow(days, hour);
  return {
    id,
    created_dt: daysFromNow(days - 14, 9),
    email: "alexandra.montgomery-beauchamp@northshore-family-services.ca",
    event: service.name,
    assigned_to: `${slp.first_name} ${slp.last_name}`,
    appointment: start,
    start_time: start,
    end_time: plusMinutes(start, service.duration_minutes),
    time_zone: null,
    status: "scheduled",
    conference_provider: null,
    meet_link: null,
    reason_for_cancelling: null,
    invoice_id: null,
    service,
    slp,
    location: CLINIC,
    ...extra,
  };
};

const virtual = (link: string): Partial<IPortalBooking> => ({
  conference_provider: "google_meet",
  meet_link: link,
  location: null,
});

export const bookingsWithHistory: IPortalBooking[] = [
  booking(
    "bk-101",
    2,
    10,
    therapy,
    drAdebayo,
    virtual("https://meet.google.com/abc-defg-hij"),
  ),
  booking("bk-102", 9, 15, therapy, drAdebayo),
  booking("bk-103", 16, 10, coaching, priya, {
    ...virtual("https://meet.google.com/klm-nopq-rst"),
    status: "rescheduled",
  }),
  booking(
    "bk-104",
    23,
    10,
    therapy,
    drAdebayo,
    virtual("https://meet.google.com/uvw-xyza-bcd"),
  ),
  booking("bk-091", -5, 10, therapy, drAdebayo, {
    ...virtual("https://meet.google.com/old-link-001"),
    invoice_id: "inv-0041",
  }),
  booking("bk-090", -12, 15, therapy, drAdebayo, {
    status: "cancelled",
    reason_for_cancelling: "Client was unwell",
  }),
  booking("bk-089", -19, 15, therapy, drAdebayo, { invoice_id: "inv-0033" }),
  booking(
    "bk-088",
    -26,
    10,
    coaching,
    priya,
    virtual("https://meet.google.com/old-link-002"),
  ),
  booking("bk-080", -40, 9, assessment, drAdebayo, { invoice_id: "inv-0037" }),
];
