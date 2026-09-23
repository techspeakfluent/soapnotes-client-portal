import {
  attachPaymentMethod,
  detachPaymentMethod,
  setDefaultPaymentMethod as mockSetDefault,
  tokeniseMockCard,
  type MockCardInput,
} from "@/mocks/handlers/payments";
import { mockListResponse, mockResponse } from "@/mocks/mock-response";
import { db } from "@/mocks/store";
import type { IPageFilter } from "@/shared/interface/portal";

// Real endpoint: GET /client-portal/payment-methods (docs/api-needed.md).
export const getPaymentMethods = async () =>
  mockResponse(() =>
    [...db.paymentMethods].sort(
      (a, b) => Number(b.is_default) - Number(a.is_default),
    ),
  );

// Real endpoint: POST /client-portal/payment-methods (docs/api-needed.md).
export const addPaymentMethod = async (paymentMethodId: string) =>
  mockResponse(() => attachPaymentMethod(paymentMethodId), "Card saved");

// Real endpoint: DELETE /client-portal/payment-methods/:id (docs/api-needed.md).
export const removePaymentMethod = async (id: string) =>
  mockResponse(() => detachPaymentMethod(id), "Card removed");

// Real endpoint: PUT /client-portal/payment-methods/:id/default (docs/api-needed.md).
export const setDefaultPaymentMethod = async (id: string) =>
  mockResponse(() => mockSetDefault(id));

// Real endpoint: GET /client-portal/transactions?page&limit (docs/api-needed.md).
export const getPaymentHistory = async (filter: IPageFilter) =>
  mockListResponse(() => db.transactions, {
    ...filter,
    sort: (a, b) => b.transaction_date.localeCompare(a.transaction_date),
  });

// With Stripe this becomes stripe.createPaymentMethod; card numbers never reach our API.
export const tokeniseCard = async (input: MockCardInput) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return tokeniseMockCard(input);
};
