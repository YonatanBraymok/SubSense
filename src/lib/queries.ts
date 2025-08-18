// src/lib/queries.ts
import { prisma } from "@/lib/prisma";
import type { BillingCycle, Prisma } from "@prisma/client";

export async function getUserSubscriptions(
  userId: string,
  opts: {
    cycle?: "ALL" | BillingCycle;
    sort?: "nextRenewal" | "createdAt";
    dir?: "asc" | "desc";
  } = {}
) {
  const where: Prisma.SubscriptionWhereInput = {
    userId,
    ...(opts.cycle && opts.cycle !== "ALL" ? { billingCycle: opts.cycle } : {}),
  };

  const orderBy: Prisma.SubscriptionOrderByWithRelationInput =
    (opts.sort ?? "nextRenewal") === "nextRenewal"
      ? { nextRenewal: opts.dir ?? "asc" }
      : { createdAt: opts.dir ?? "asc" };

  return prisma.subscription.findMany({
    where,
    orderBy,
    select: {
      id: true,
      name: true,
      cost: true,
      currency: true,
      billingCycle: true,
      nextRenewal: true,
      createdAt: true,
    },
  });
}