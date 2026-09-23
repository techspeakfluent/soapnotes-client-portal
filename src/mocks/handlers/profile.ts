import type {
  INotificationPreferences,
  IUpdateProfilePayload,
} from "@/shared/interface/portal";
import { mockBadRequest, mockNotFound } from "../mock-response";
import { db, nextId } from "../store";

const logActivity = (details: Record<string, unknown>) => {
  const now = new Date().toISOString();
  db.activity.unshift({
    id: nextId("act"),
    client_id: db.client.id,
    activity_type: "profile_updated",
    activity_date: now,
    created_at: now,
    details,
  });
};

export function updateProfile(payload: IUpdateProfilePayload) {
  db.client = { ...db.client, ...payload };
  logActivity({ type: "data_updated" });
  return db.client;
}

export function addEmail(email: string) {
  const normalised = email.trim().toLowerCase();
  if (
    db.client.client_emails.some((e) => e.email.toLowerCase() === normalised)
  ) {
    throw mockBadRequest("That email is already on your account.");
  }
  db.client.client_emails.push({
    id: nextId("email"),
    email: email.trim(),
    is_primary_email: false,
  });
  return db.client;
}

export function removeEmail(id: string) {
  const email = db.client.client_emails.find((e) => e.id === id);
  if (!email) throw mockNotFound("email");
  if (email.is_primary_email)
    throw mockBadRequest(
      "Make another email primary before removing this one.",
    );
  db.client.client_emails = db.client.client_emails.filter((e) => e.id !== id);
  return db.client;
}

export function setPrimaryEmail(id: string) {
  if (!db.client.client_emails.some((e) => e.id === id))
    throw mockNotFound("email");
  db.client.client_emails.forEach((e) => (e.is_primary_email = e.id === id));
  return db.client;
}

export function updatePreferences(payload: Partial<INotificationPreferences>) {
  db.preferences = { ...db.preferences, ...payload };
  return db.preferences;
}
