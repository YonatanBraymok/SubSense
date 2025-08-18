// src/app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { auth } from 'auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ subscriptions: [] });
  }

  const subs = await prisma.subscription.findMany({
    where: { userId: user.id },
    orderBy: { nextRenewal: 'asc' },
  });

  // Convert Prisma.Decimal/Date to JSON-friendly
  const json = subs.map((s) => ({
    id: s.id,
    name: s.name,
    cost: Number(s.cost),
    currency: s.currency,
    billingCycle: s.billingCycle,
    nextRenewal: s.nextRenewal.toISOString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  return NextResponse.json({ subscriptions: json });
}

export async function POST(req: Request) {
  // Stub: no-op create for now
  return NextResponse.json({
    ok: true,
    message: 'Create subscription is not implemented yet. (Stub)',
  });
}