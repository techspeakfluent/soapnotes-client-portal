// Fixture dates are relative to today, so "upcoming" stays upcoming and
// "overdue" stays overdue whenever the portal is opened.

const MINUTE_MS = 60_000;

export const daysFromNow = (days: number, hour = 10, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const plusMinutes = (iso: string, minutes: number) =>
  new Date(new Date(iso).getTime() + minutes * MINUTE_MS).toISOString();

/** A date-only field, stored the way the backend stores it: midnight UTC. */
export const dateOnlyFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T00:00:00.000Z`;
};
