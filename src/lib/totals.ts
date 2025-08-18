// src/lib/totals.ts
import type { BillingCycle, Prisma } from "@prisma/client";
// Prisma v5 Decimal import:
import { Decimal } from "@prisma/client/runtime/library";

export type TotalsInput = Array<{
  cost: Prisma.Decimal | Decimal;
  billingCycle: BillingCycle;
}>;

export type Totals = {
  monthlyTotal: Decimal;
  yearlyTotal: Decimal;
};

const D = (x: Decimal | number | string) => new Decimal(x);

/**
 * Sum totals with conversions:
 * - MONTHLY contributes cost to monthly, cost*12 to yearly
 * - YEARLY contributes cost/12 to monthly, cost to yearly
 */
export function computeTotals(list: TotalsInput): Totals {
  let monthly = new Decimal(0);
  let yearly = new Decimal(0);

  for (const s of list) {
    const cost = D(s.cost);
    if (s.billingCycle === "MONTHLY") {
      monthly = monthly.plus(cost);
      yearly = yearly.plus(cost.mul(12));
    } else {
      monthly = monthly.plus(cost.div(12));
      yearly = yearly.plus(cost);
    }
  }
  return { monthlyTotal: monthly, yearlyTotal: yearly };
}