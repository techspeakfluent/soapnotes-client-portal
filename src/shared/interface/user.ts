import type { IOrganization } from "./organization";

export interface IBookingSettings {
  title?: string | null;
  description?: string | null;
  logo_url?: string | null;
}

export interface IUser {
  organization: IOrganization;
  organization_id: string;
  permissions?: Array<string>;
  last_login_dt?: string | null;
  is_test_user?: boolean;
  is_google_calendar_connected?: boolean;
  is_gmail_connected?: boolean;
  is_meet_connected?: boolean;
  is_docs_connected?: boolean;
  is_drive_connected?: boolean;
  is_impersonated?: boolean;
  owned_organization?: any;
  subscription?: any;
  calendar_refresh_token: string | null;
  avatar_url: string | null;
  meet_refresh_token: string | null;
  docs_refresh_token: string | null;
  drive_refresh_token: string | null;
  calendar_access_token: string | null;
  google_access_token: string | null;
  meet_access_token: string | null;
  docs_access_token: string | null;
  drive_access_token: string | null;
  google_refresh_token: string | null;
  office_title: string;
  timezone: string;
  calendar_token_expires_at: string | null;
  google_token_expires_at: string | null;
  meet_token_expires_at: string | null;
  docs_token_expires_at: string | null;
  drive_token_expires_at: string | null;

  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: IUserStatus;
  created_at: string;
  updated_at: string;
  user_role_id: string;
  role: string;
  registration: Array<string>;
  pay_rate: number | null;
  ax_comp_enabled: boolean;
  target_hr_per_month: string;

  event_slug: string;
  country: string | null;

  is_zoom_connected: boolean;
  zoom_refresh_token: string | null;
  zoom_access_token: string | null;
  is_fathom_connected?: boolean;
  preferred_conference_provider: string;
  zoom_token_expires_at: string | null;

  booking_settings: IBookingSettings | null;
  invoice_sent_by: null;
  holidays: Array<{ country: string; dates: string[] }> | null;
  invoice_settings: null;
  permissions_id: Array<string>;
  assigned_service_id: null;
  user_role: IRole;
}
export type IUserStatus =
  | "active"
  | "pending"
  | "inactive"
  | "deleted"
  | "suspended"
  | "locked"
  | "incomplete_profile";

export interface IUserMetricStat {
  count: number;
  percentage_change: number;
  direction: string;
}

export interface IUserStatusMetric extends IUserMetricStat {
  status: IUserStatus;
}

export interface IUserMetrics {
  total_users: IUserMetricStat;
  statuses: Array<IUserStatusMetric>;
  period: {
    start_date: string;
    end_date: string;
  };
}
export interface IUserPermissionState {
  id: string;
}
export interface IPermission {
  id: string;
  name: string;
  type: string;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IRole {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
  permissions: Array<IPermission>;
}

export interface IUserPayRates {
  id: string;
  user_id: string;
  rate: number;
  effective_date: string;
  reason: string | null;
  status: string;
  change: number;
  created_at: string;
  updated_at: string;
}
