import type { IPortalPaymentMethod } from "@/shared/interface/portal";

const BRAND_NAMES: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  jcb: "JCB",
  unionpay: "UnionPay",
  diners: "Diners Club",
};

const getCardBrandName = (brand?: string | null) =>
  (brand && BRAND_NAMES[brand.toLowerCase()]) || "Card";

export const describeCard = (card: { brand: string; last4: string }) =>
  `${getCardBrandName(card.brand)} ending ${card.last4}`;

/** Cards are valid through the last day of their expiry month. */
export const isCardExpired = (
  method: Pick<IPortalPaymentMethod, "card">,
  now = new Date(),
) => {
  const { exp_month, exp_year } = method.card;
  return (
    exp_year < now.getFullYear() ||
    (exp_year === now.getFullYear() && exp_month < now.getMonth() + 1)
  );
};

export const formatExpiry = (method: Pick<IPortalPaymentMethod, "card">) =>
  `${String(method.card.exp_month).padStart(2, "0")}/${String(method.card.exp_year).slice(-2)}`;
