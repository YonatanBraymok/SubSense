// src/lib/validation/subscription.ts
import { z } from "zod";

export const BillingCycleEnum = z.enum(["MONTHLY", "YEARLY"]);
export type BillingCycle = z.infer<typeof BillingCycleEnum>;

// Keep currencies small and concrete for now; you can expand later.
export const CurrencyEnum = z.enum(["USD", "EUR", "ILS"]);
export type Currency = z.infer<typeof CurrencyEnum>;

/**
 * Use z.coerce so form strings become the right types.
 * - cost: coerce to number (positive, 2 decimal places UI constraint is at the form level)
 * - nextRenewal: coerce to Date (ISO string from <input type="date">)
 */
export const subscriptionCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  cost: z.coerce
    .number() // no options object here
    .refine((v) => Number.isFinite(v), { message: "Cost must be a number" })
    .positive("Cost must be greater than 0"),
  currency: CurrencyEnum,
  billingCycle: BillingCycleEnum,
  nextRenewal: z.coerce.date(), // keep as-is unless you see a similar error
});

export type SubscriptionCreateInput = z.infer<typeof subscriptionCreateSchema>;