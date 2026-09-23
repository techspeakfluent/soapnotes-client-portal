import type { ReactElement } from "react";
import {
  CalendarDotsIcon,
  DashboardIcon,
  FileTextIcon,
  User,
  Wallet,
} from "@/components/icons";
import { RouteConstants } from "@/shared/constants/routes";

export interface SidebarItem {
  label: string;
  icon: ReactElement;
  path: string;
  /** Only highlight on an exact match — for `/`, which prefixes everything. */
  end?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: RouteConstants.dashboard.home.path,
    end: true,
  },
  {
    label: "Invoices",
    icon: <FileTextIcon />,
    path: RouteConstants.invoices.list.path,
  },
  {
    label: "Bookings",
    icon: <CalendarDotsIcon />,
    path: RouteConstants.bookings.list.path,
  },
  {
    label: "Payments",
    icon: <Wallet />,
    path: RouteConstants.payments.base.path,
  },
  {
    label: "Profile",
    icon: <User />,
    path: RouteConstants.profile.base.path,
  },
];
