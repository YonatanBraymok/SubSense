// app/api/subscriptions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "@/lib/prisma";
import { subscriptionUpdateSchema } from "@/lib/validation/subscription";
import { parseCostToDecimal } from "@/lib/money";
import { revalidatePath } from "next/cache";

// If your table is not static, keep API dynamic:
export const dynamic = "force-dynamic";

async function requireOwner(id: string, userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { id, userId },
  });
  return sub; // null if not found or not owner
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const sub = await requireOwner(id, session.user.id);
  if (!sub) {
    // 404 to not leak existence
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(sub, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = subscriptionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const sub = await requireOwner(id, session.user.id);
  if (!sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};

  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.currency !== undefined) data.currency = parsed.data.currency;
  if (parsed.data.billingCycle !== undefined) data.billingCycle = parsed.data.billingCycle;
  if (parsed.data.nextRenewal !== undefined) {
    data.nextRenewal =
      typeof parsed.data.nextRenewal === "string"
        ? new Date(parsed.data.nextRenewal)
        : parsed.data.nextRenewal;
  }
  if (parsed.data.cost !== undefined) {
    data.cost = parseCostToDecimal(parsed.data.cost);
  }

  const updated = await prisma.subscription.update({
    where: { id },
    data,
  });

  // Ensure server-rendered list/totals reflect the change
  revalidatePath("/subscriptions");

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const sub = await requireOwner(id, session.user.id);
  if (!sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.subscription.delete({ where: { id } });

  // Keep server data in sync
  revalidatePath("/subscriptions");

  return NextResponse.json({ ok: true }, { status: 200 });
}