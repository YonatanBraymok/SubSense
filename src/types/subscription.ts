// src/types/subscription.ts
import type { BillingCycle } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export type SubscriptionRow = {
  id: string;
  name: string;
  cost: Prisma.Decimal;        // from DB as Decimal
  currency: string;
  billingCycle: BillingCycle;
  nextRenewal: Date;
  createdAt: Date;
};