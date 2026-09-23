import type { ITax } from "./tax";

export type PackageOfferingStatus = "ACTIVE" | "INACTIVE";

export interface IPackageItem {
  id?: string;
  service_name: string;
  service_description?: string;
  quantity: number;
  price_per_service?: number;
  duration_per_service?: number;
  service_id?: string;
  /** Display order within the offering (0-based). */
  position?: number;
}

export interface IPackageOffering {
  id: string;
  name: string;
  package_name: string;
  package_description: string;
  description?: string;
  price: number;
  tax_id?: string;
  tax?: ITax;
  discount?: number;
  status?: PackageOfferingStatus;
  currency_code?: string;
  services?: IPackageItem[];
  created_at?: string;
  updated_at?: string;
  package_items?: IPackageItem[]; // for backward compatibility, to be removed in the future
  // Org user this package is assigned to (the SLP / provider who owns
  // the sale). Admin-only — non-admins implicitly own their own
  // packages, so the field isn't sent on their writes and isn't shown
  // in the form.
  user_id?: string;
}
