import type { IContact } from "./contact";
import type { IUser } from "./user";

export interface ISlpNote {
  id: string;
  booking_id: string;
  status: string;
  soap_note: string;
  note_date: string;
  // Backend stores images as objects with metadata, even though the
  // PUT/POST request bodies accept (and we send) plain URL strings.
  // Accept both shapes so consumers can normalize at the edges.
  images: Array<string | ISlpNoteImage>;
  invoice_memo: string;
  duration: string;
  referral: string;
  no_show: string;
  split_ax: string;
  session_count: string;
  client_id: string;
  organization_id: string;
  slp_id: string;
  invoice_id: string;
  linked_client_id: string;
  package_id: string;
  draft: string;
  created_at: string;
  updated_at: string;
  slp: IUser;
  client: IContact;
}

export interface ISlpNoteImage {
  url: string;
  name?: string;
  path?: string;
  type?: string;
}
