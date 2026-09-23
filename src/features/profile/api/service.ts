import { mockListResponse, mockResponse } from "@/mocks/mock-response";
import {
  addEmail as mockAddEmail,
  removeEmail as mockRemoveEmail,
  setPrimaryEmail as mockSetPrimaryEmail,
  updatePreferences as mockUpdatePreferences,
  updateProfile as mockUpdateProfile,
} from "@/mocks/handlers/profile";
import { db } from "@/mocks/store";
import type {
  INotificationPreferences,
  IPageFilter,
  IUpdateProfilePayload,
} from "@/shared/interface/portal";

// Real endpoint: PATCH /client-portal/me (docs/api-needed.md).
export const updateProfile = async (payload: IUpdateProfilePayload) =>
  mockResponse(() => mockUpdateProfile(payload), "Profile updated");

// Real endpoint: POST /client-portal/me/emails (docs/api-needed.md).
export const addEmail = async (email: string) =>
  mockResponse(() => mockAddEmail(email), "Email added");

// Real endpoint: DELETE /client-portal/me/emails/:id (docs/api-needed.md).
export const removeEmail = async (id: string) =>
  mockResponse(() => mockRemoveEmail(id), "Email removed");

// Real endpoint: PUT /client-portal/me/emails/:id/primary (docs/api-needed.md).
export const setPrimaryEmail = async (id: string) =>
  mockResponse(() => mockSetPrimaryEmail(id), "Primary email updated");

// Real endpoint: GET /client-portal/me/notification-preferences (docs/api-needed.md).
export const getPreferences = async () => mockResponse(() => db.preferences);

// Real endpoint: PUT /client-portal/me/notification-preferences (docs/api-needed.md).
export const updatePreferences = async (
  payload: Partial<INotificationPreferences>,
) => mockResponse(() => mockUpdatePreferences(payload));

// Real endpoint: GET /client-portal/activity?page&limit (docs/api-needed.md).
export const getActivity = async (filter: IPageFilter) =>
  mockListResponse(() => db.activity, {
    ...filter,
    sort: (a, b) => b.activity_date.localeCompare(a.activity_date),
  });
