import type { IPortalPaymentMethod } from "@/shared/interface/portal";
import { mockNotFound } from "../mock-response";
import { db, nextId } from "../store";

export interface MockCardInput {
  number: string;
  expMonth: number;
  expYear: number;
}

const brandOf = (number: string) => {
  if (/^4/.test(number)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  if (/^6/.test(number)) return "discover";
  return "card";
};

const tokenised = new Map<string, IPortalPaymentMethod>();

export function tokeniseMockCard(input: MockCardInput): string {
  const digits = input.number.replace(/\D/g, "");
  const brand = brandOf(digits);
  const id = nextId("pm");
  tokenised.set(id, {
    id,
    card: {
      brand,
      display_brand: brand,
      last4: digits.slice(-4),
      exp_month: input.expMonth,
      exp_year: input.expYear,
    },
    is_default: false,
  });
  return id;
}

export const takeTokenisedCard = (id: string) => {
  const card = tokenised.get(id);
  tokenised.delete(id);
  return card;
};

export function attachPaymentMethod(paymentMethodId: string) {
  const card = takeTokenisedCard(paymentMethodId);
  if (!card) throw mockNotFound("card");
  const saved = { ...card, is_default: db.paymentMethods.length === 0 };
  db.paymentMethods.push(saved);
  return saved;
}

export function detachPaymentMethod(id: string) {
  const index = db.paymentMethods.findIndex((m) => m.id === id);
  if (index < 0) throw mockNotFound("card");
  const [removed] = db.paymentMethods.splice(index, 1);
  // The server promotes another card so there's always a default to charge.
  if (removed!.is_default && db.paymentMethods[0]) {
    db.paymentMethods[0].is_default = true;
  }
  return { id };
}

export function setDefaultPaymentMethod(id: string) {
  if (!db.paymentMethods.some((m) => m.id === id)) throw mockNotFound("card");
  db.paymentMethods.forEach((m) => (m.is_default = m.id === id));
  return { id };
}
