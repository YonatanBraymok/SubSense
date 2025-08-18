// src/app/api/subscriptions/route.ts
import { NextResponse } from "next/server";
import { auth } from "auth";
import { subscriptionCreateSchema } from "@/lib/validation/subscription";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // Require auth
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Parse & validate JSON with Zod
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = subscriptionCreateSchema.safeParse(body);
  if (!parsed.success) {
    // Send field-level errors back (zod format)
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, cost, currency, billingCycle, nextRenewal } = parsed.data;

  try {
    const created = await prisma.subscription.create({
      data: {
        name,
        cost, // Prisma Decimal will accept number; you can also send as string if your schema prefers
        currency,
        billingCycle,
        nextRenewal,
        userId: session.user.id,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Create subscription failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}