// src/lib/money.ts
import { Decimal } from "@prisma/client/runtime/library";

export function parseCostToDecimal(input: number | string): Decimal {
  if (typeof input === "number") {
    if (!Number.isFinite(input) || input < 0) {
      throw new Error("Invalid cost value");
    }
    // Convert via string to avoid FP issues
    return new Decimal(input.toFixed(2));
  }
  const trimmed = input.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    throw new Error("Invalid cost format");
  }
  return new Decimal(trimmed);
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}