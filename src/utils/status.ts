export type StatusTone = "success" | "warning" | "error" | "neutral" | "info";

// Refunds are neutral: from the client's side a refund isn't a failure.
const TONES: Record<string, StatusTone> = {
  paid: "success",
  completed: "success",
  complete: "success",
  success: "success",
  succeeded: "success",
  confirmed: "success",
  booked: "success",
  scheduled: "success",
  attended: "success",
  rescheduled: "success",

  awaiting_payment: "warning",
  pending: "warning",
  partially_paid: "warning",
  unpaid: "warning",
  due: "warning",
  due_within_30_days: "warning",
  incomplete: "warning",

  overdue: "error",
  failed: "error",
  cancelled: "error",
  canceled: "error",
  expired: "error",
  declined: "error",
  no_show: "error",

  draft: "neutral",
  void: "neutral",
  refunded: "neutral",
  partially_refunded: "neutral",
  inactive: "neutral",
};

const LABELS: Record<string, string> = {
  awaiting_payment: "Awaiting payment",
  partially_paid: "Partially paid",
  partially_refunded: "Partially refunded",
  due_within_30_days: "Due soon",
  no_show: "No-show",
};

const normalize = (status: string) =>
  status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

export const getStatusTone = (status?: string | null): StatusTone =>
  status ? (TONES[normalize(status)] ?? "neutral") : "neutral";

export const getStatusLabel = (status?: string | null): string => {
  if (!status) return "—";
  const key = normalize(status);
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};
