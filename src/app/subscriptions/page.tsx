// src/app/subscriptions/page.tsx
import AddSubscriptionForm from "./add-subscription-form";
import { auth } from "auth";           // ← use your app alias
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";   // ← named export from your prisma singleton

// Format money with graceful fallback for unknown currency codes
function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default async function SubscriptionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/subscriptions");
  }

  // Prefer the id we place on session.user in NextAuth callbacks
  let userId: string | null = session.user.id;

  // (Optional) Fallback by email if you ever hit an older session without id
  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!dbUser) {
      return <div className="p-6">No database user found for this session.</div>;
    }
    userId = dbUser.id;
  }

  if (!userId) {
    return <div className="p-6">Unable to resolve user. Please sign out and sign in again.</div>;
  }

  const subs = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextRenewal: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your subscriptions</h1>
      </div>

      {/* Step 5 form (client component). On success it calls router.refresh() */}
      <AddSubscriptionForm />

      {subs.length === 0 ? (
        <p className="text-sm text-gray-600">No subscriptions yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {subs.map((s) => (
            <li key={s.id} className="py-3 px-4 flex items-center justify-between">
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