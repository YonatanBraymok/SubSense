// src/lib/date.ts
export function toISOStringDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  // Normalize to ISO; if invalid, let API validation handle
  return d.toISOString();
}