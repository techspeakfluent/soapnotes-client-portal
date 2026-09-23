const EMPTY = "—";

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

// The backend stores date-only fields (invoice_date, due_date, dob) as
// midnight-UTC timestamps. Read in a timezone west of UTC they'd show the
// previous day, so they're treated as calendar dates instead (same guard as
// soapnotes' useFormatDate).
const isMidnightUtc = (value: string) =>
  value.endsWith("T00:00:00+00:00") ||
  value.endsWith("T00:00:00.000Z") ||
  value.endsWith("T00:00:00Z") ||
  /\s00:00:00\+00$/.test(value);

export function parseDate(
  value: string | Date | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;

  const dateOnly = isMidnightUtc(value) ? value.slice(0, 10) : value;
  const match = DATE_ONLY.exec(dateOnly);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Spelled out rather than taken from Intl: en-GB prints "Sept" in some
// browsers and "Sep" in others, and the portal wants one format everywhere.
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateFormat = {
  format: (date: Date) =>
    `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
};
const weekdayDateFormat = {
  format: (date: Date) =>
    `${WEEKDAYS[date.getDay()]}, ${dateFormat.format(date)}`,
};
const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});
const zoneFormat = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" });

type DateInput = string | Date | null | undefined;

export const formatDate = (value: DateInput) => {
  const date = parseDate(value);
  return date ? dateFormat.format(date) : EMPTY;
};

export const formatWeekdayDate = (value: DateInput) => {
  const date = parseDate(value);
  return date ? weekdayDateFormat.format(date) : EMPTY;
};

/** `2:30 PM – 3:15 PM EDT`, in the viewer's own timezone. */
export const formatTimeRange = (start: DateInput, end: DateInput) => {
  const from = parseDate(start);
  if (!from) return EMPTY;
  const to = parseDate(end);
  const zone =
    zoneFormat.formatToParts(from).find((p) => p.type === "timeZoneName")
      ?.value ?? "";
  const range = to
    ? `${timeFormat.format(from)} – ${timeFormat.format(to)}`
    : timeFormat.format(from);
  return zone ? `${range} ${zone}` : range;
};

export const formatDateTime = (value: DateInput) => {
  const date = parseDate(value);
  return date
    ? `${dateFormat.format(date)}, ${timeFormat.format(date)}`
    : EMPTY;
};

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const DAY_MS = 86_400_000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatRelativeDays = (value: DateInput, now = new Date()) => {
  const date = parseDate(value);
  if (!date) return EMPTY;
  const days = Math.round((startOfDay(date) - startOfDay(now)) / DAY_MS);
  if (Math.abs(days) >= 30) return formatDate(date);
  return relativeFormat.format(days, "day");
};

export const formatTimeAgo = (value: DateInput, now = new Date()) => {
  const date = parseDate(value);
  if (!date) return EMPTY;
  const minutes = Math.round((date.getTime() - now.getTime()) / 60_000);
  if (Math.abs(minutes) < 1) return "just now";
  if (Math.abs(minutes) < 60) return relativeFormat.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormat.format(hours, "hour");
  return formatRelativeDays(date, now);
};
