const DEFAULT_CURRENCY = "CAD";

// Copied from soapnotes: the backend sometimes leaks Postgres cast artifacts
// (e.g. `'USD'::text`) into currency codes, which make Intl throw.
const sanitizeCurrency = (raw?: string | null): string => {
  if (!raw) return DEFAULT_CURRENCY;
  const cleaned = String(raw)
    .replace(/::.*$/, "")
    .replace(/['"]/g, "")
    .trim()
    .toUpperCase();
  return /^[A-Z]{3}$/.test(cleaned) ? cleaned : DEFAULT_CURRENCY;
};

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// en-US prints USD as a bare "$", which reads as Canadian dollars in a
// Canadian practice. Every currency gets a prefix that names it.
const EXPLICIT_SYMBOLS: Record<string, string> = { USD: "US$" };

const symbolFor = (currency: string) => {
  if (EXPLICIT_SYMBOLS[currency]) return EXPLICIT_SYMBOLS[currency];
  try {
    return (
      new Intl.NumberFormat("en-US", { style: "currency", currency })
        .formatToParts(1)
        .find((p) => p.type === "currency")?.value ?? currency
    );
  } catch {
    return currency;
  }
};

export function formatMoney(
  amount: number | string | null | undefined,
  currencyCode?: string | null,
): string {
  if (amount === null || amount === undefined || amount === "") return "—";
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "—";

  const sign = value < 0 ? "-" : "";
  const symbol = symbolFor(sanitizeCurrency(currencyCode));
  return `${sign}${symbol}${numberFormat.format(Math.abs(value))}`;
}
