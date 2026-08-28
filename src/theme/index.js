/**
 * Central design tokens. Tweak these to re-skin the whole app.
 */

export const colors = {
  background: "#ffffff",
  surface: "#f6f6f8",
  border: "#e6e6ea",
  text: "#1a1a1e",
  textMuted: "#6b6b76",
  primary: "#111827",
  primaryText: "#ffffff",
  accent: "#2563eb",
  danger: "#dc2626",
  success: "#16a34a",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: "700", color: colors.text },
  h2: { fontSize: 20, fontWeight: "700", color: colors.text },
  h3: { fontSize: 16, fontWeight: "600", color: colors.text },
  body: { fontSize: 15, color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
  price: { fontSize: 16, fontWeight: "700", color: colors.text },
};

/**
 * Formats a Shopify MoneyV2 ({ amount, currencyCode }) using the device locale.
 */
export function formatMoney(money) {
  if (!money) return "";
  const { amount, currencyCode } = money;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(Number(amount));
  } catch {
    // Fallback if Intl currency data is unavailable for this code.
    return `${Number(amount).toFixed(2)} ${currencyCode}`;
  }
}
