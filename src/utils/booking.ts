import type { IPortalBooking } from "@/shared/interface/portal";
import { parseDate } from "./format-date";

export const isBookingCancelled = (booking: IPortalBooking) =>
  String(booking.status).toLowerCase() === "cancelled";

export const getBookingStart = (booking: IPortalBooking) =>
  parseDate(booking.start_time || booking.appointment);

export const isBookingUpcoming = (
  booking: IPortalBooking,
  now = new Date(),
) => {
  const start = getBookingStart(booking);
  return !isBookingCancelled(booking) && !!start && start >= now;
};

export const isVirtualBooking = (booking: IPortalBooking) =>
  !!booking.meet_link;
