// src/lib/validation/subscription.ts
import { z } from "zod";

export const BillingCycleEnum = z.enum(["MONTHLY", "YEARLY"]);
export const CurrencyEnum = z.enum(["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK"]);

export const subscriptionCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  cost: z.union([
    z.number().finite().nonnegative("Cost must be ≥ 0"),
    z.string().regex(/^\d+(\.\d{1,2})?$/, "Use a number like 9.99"),
  ]),
  currency: z.string().length(3, "Use a 3-letter currency code (e.g., USD)"),
  billingCycle: BillingCycleEnum,
  nextRenewal: z.string().or(z.date()),
});

// For PATCH (partial update) — but require at least one field:
export const subscriptionUpdateSchema = subscriptionCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "Provide at least one field to update." }
);

// Types derived from zod:
export type SubscriptionCreateInput = z.infer<typeof subscriptionCreateSchema>;
export type SubscriptionUpdateInput = z.infer<typeof subscriptionUpdateSchema>;