// src/lib/format.ts
import { Decimal } from "@prisma/client/runtime/library";

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

// Formats using the row's own currency; no FX normalization.
export function formatMoney(
  amount: Decimal | number | string,
  currency: string
) {
  try {
    const n = amount instanceof Decimal ? Number(amount.toString()) : Number(amount);
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    // Fallback if currency code is unknown
    const n = amount instanceof Decimal ? amount.toFixed(2) : Number(amount).toFixed(2);
    return `${n} ${currency}`;
  }
}