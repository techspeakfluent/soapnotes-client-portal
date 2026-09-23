import type { IPortalInvoice } from "@/shared/interface/portal";
import { dateOnlyFromNow } from "./dates";

const THERAPY = "Speech Therapy Session";
const ASSESSMENT =
  "Initial Assessment — Comprehensive Articulation, Language & Fluency Evaluation";
const PACKAGE =
  "10-Session Therapy Package (Articulation & Expressive Language)";

const invoice = (
  id: string,
  number: string,
  issuedDaysAgo: number,
  dueInDays: number,
  lines: Array<[name: string, price: number, qty?: number]>,
  paid: number,
  status: string,
  extra: Partial<IPortalInvoice> = {},
): IPortalInvoice => {
  const items = lines.map(([product_name, price, quantity = 1], index) => ({
    id: `${id}-item-${index + 1}`,
    product_name,
    description: undefined,
    quantity,
    price,
    tax_value: 0,
  }));
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return {
    id,
    invoice_number: number,
    invoice_date: dateOnlyFromNow(-issuedDaysAgo),
    due_date: dateOnlyFromNow(dueInDays),
    status,
    currency_code: "CAD",
    total_price: total,
    amount_paid: paid,
    amount_due: Math.max(0, total - paid),
    discount: undefined,
    tax_value: 0,
    memo: undefined,
    items,
    ...extra,
  };
};

export const invoicesWithHistory: IPortalInvoice[] = [
  invoice(
    "inv-0041",
    "202609-0041",
    3,
    11,
    [[THERAPY, 185]],
    0,
    "AWAITING_PAYMENT",
  ),
  invoice(
    "inv-0037",
    "202608-0037",
    40,
    -10,
    [[ASSESSMENT, 420]],
    0,
    "AWAITING_PAYMENT",
  ),
  invoice(
    "inv-0033",
    "202608-0033",
    30,
    15,
    [[PACKAGE, 1480]],
    740,
    "PARTIALLY_PAID",
  ),
  invoice("inv-0029", "202607-0029", 55, -41, [[THERAPY, 185]], 185, "PAID"),
  invoice(
    "inv-0025",
    "202607-0025",
    62,
    -48,
    [["Parent Coaching", 95]],
    0,
    "REFUNDED",
    {
      amount_due: 0,
      memo: "Session cancelled by the practice — refunded in full.",
    },
  ),
  invoice("inv-0019", "202606-0019", 84, -70, [[THERAPY, 185]], 185, "PAID"),
  invoice(
    "inv-0014",
    "202606-0014",
    96,
    -82,
    [["Telepractice Consultation (US-licensed provider)", 150]],
    150,
    "PAID",
    { currency_code: "USD" },
  ),
  invoice("inv-0011", "202605-0011", 110, -96, [[THERAPY, 185]], 185, "PAID"),
  invoice(
    "inv-0008",
    "202605-0008",
    124,
    -110,
    [
      [THERAPY, 185],
      ["Home practice materials", 24.5, 2],
    ],
    234,
    "PAID",
  ),
  invoice("inv-0005", "202604-0005", 138, -124, [[THERAPY, 185]], 185, "PAID"),
  invoice("inv-0003", "202604-0003", 152, -138, [[THERAPY, 185]], 185, "PAID"),
  invoice(
    "inv-0001",
    "202603-0001",
    170,
    -156,
    [[ASSESSMENT, 420]],
    420,
    "PAID",
  ),
];
