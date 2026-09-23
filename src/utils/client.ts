import type { IPortalClient } from "@/shared/interface/portal";

type NameParts = {
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
};

export const getFullName = (person?: NameParts | null) =>
  [person?.first_name, person?.last_name].filter(Boolean).join(" ").trim() ||
  person?.display_name?.trim() ||
  "";

export const getPrimaryEmail = (client?: IPortalClient | null) =>
  client?.client_emails.find((e) => e.is_primary_email)?.email ??
  client?.client_emails[0]?.email ??
  client?.email ??
  "";
