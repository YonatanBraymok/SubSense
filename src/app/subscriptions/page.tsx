// src/app/subscriptions/page.tsx
import { auth } from 'auth'; // or wherever you exported NextAuth's auth()
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default async function SubscriptionsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/api/auth/signin?callbackUrl=/subscriptions');
  }

  // Find the DB user by email to get the id
  const dbUser = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    select: { id: true, name: true, email: true },
  });

  if (!dbUser) {
    return <div className="p-6">No database user found for this session.</div>;
  }

  const subs = await prisma.subscription.findMany({
    where: { userId: dbUser.id },
    orderBy: { nextRenewal: 'asc' },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your subscriptions</h1>
        <button
          disabled
          className="rounded-md border px-3 py-2 text-sm opacity-60 cursor-not-allowed"
          title="Coming soon"
        >
          Add Subscription
        </button>
      </div>

      {subs.length === 0 ? (
        <p>No subscriptions yet.</p>
      ) : (
        <ul className="divide-y">
          {subs.map((s) => (
            <li key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500">
                  Next renewal: {new Date(s.nextRenewal).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm font-medium">
                {formatMoney(Number(s.cost), s.currency)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}