import type {
  INotificationPreferences,
  IPortalActivity,
  IPortalBooking,
  IPortalClient,
  IPortalInvoice,
  IPortalPackage,
  IPortalPaymentMethod,
  IPortalTransaction,
} from "@/shared/interface/portal";
import { mockScenario } from "./config";
import {
  activityWithHistory,
  packagesWithHistory,
  pendingForms,
} from "./fixtures/activity";
import { bookingsWithHistory } from "./fixtures/bookings";
import { clientWithHistory, newClient } from "./fixtures/client";
import { invoicesWithHistory } from "./fixtures/invoices";
import {
  defaultPreferences,
  paymentMethodsWithHistory,
  transactionsFor,
} from "./fixtures/payments";

export interface MockPendingForm {
  id: string;
  title: string;
  due_date: string | null;
  form_url: string;
}

interface MockDb {
  client: IPortalClient;
  invoices: IPortalInvoice[];
  bookings: IPortalBooking[];
  packages: IPortalPackage[];
  activity: IPortalActivity[];
  forms: MockPendingForm[];
  transactions: IPortalTransaction[];
  paymentMethods: IPortalPaymentMethod[];
  preferences: INotificationPreferences;
}

const seed = (): MockDb =>
  mockScenario === "empty"
    ? {
        client: newClient,
        invoices: [],
        bookings: [],
        packages: [],
        activity: [],
        forms: [],
        transactions: [],
        paymentMethods: [],
        preferences: defaultPreferences,
      }
    : {
        client: clientWithHistory,
        invoices: invoicesWithHistory,
        bookings: bookingsWithHistory,
        packages: packagesWithHistory,
        activity: activityWithHistory,
        forms: pendingForms,
        transactions: transactionsFor(invoicesWithHistory),
        paymentMethods: paymentMethodsWithHistory,
        preferences: defaultPreferences,
      };

// In memory, so mock mutations show on every screen; resets on reload.
export const db: MockDb = structuredClone(seed());

let sequence = 0;
export const nextId = (prefix: string) =>
  `${prefix}-${Date.now()}-${++sequence}`;
