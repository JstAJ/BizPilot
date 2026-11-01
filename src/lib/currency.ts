import { CURRENCY_LOCALE, CURRENCY_CODE } from "@/constants/app";

const formatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY_CODE,
  maximumFractionDigits: 0,
});

const formatterWithDecimals = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY_CODE,
  maximumFractionDigits: 2,
});

export function formatINR(amount: number, withDecimals = false): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return withDecimals ? formatterWithDecimals.format(value) : formatter.format(value);
}

export function formatCompactINR(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return formatter.format(value);
}
