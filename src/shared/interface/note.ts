import type { IClient } from "./common";
import type { IUser } from "./user";

export type NoteStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface INote {
  id: string;
  title: string;
  notes: string;
  status: NoteStatus;
  client_id: string;
  note_date: string;
  consulted_by?: string | null;
  client?: IClient;
  created_at?: string;
  updated_at?: string;
  author?: IUser;
}
