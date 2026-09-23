import type { IUser } from "./user";

export type ServiceStatus = "ACTIVE" | "INACTIVE";

export interface IServiceGroup {
  id: string;
  name: string;
  color?: string;
}

export interface IService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  status: ServiceStatus;
  currency_code?: string;
  tax_ids?: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  users?: Array<IUser>;
  /** Assigned team groups (user groups). */
  user_groups?: Array<IServiceGroup>;
}
