// app/page.tsx
import { auth } from "auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeTotals } from "@/lib/totals";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SubscriptionsPreview } from "@/components/dashboard/subscriptions-preview";
import { UpcomingRenewals } from "@/components/dashboard/upcoming-renewals";
import { TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react";

export default async function Home() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Get user data
  let userId: string | undefined = session.user.id;
  if (!userId && session.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    userId = user?.id;
  }

  if (!userId) {
    return (
      <main className="p-6">
      <p className="text-red-600">Could not resolve user id.</p>
      </main>
    );
  }

  // Get user's subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      cost: true,
      currency: true,
      billingCycle: true,
      nextRenewal: true,
      createdAt: true,
    },
    orderBy: { nextRenewal: 'asc' },
  });

  // Calculate totals
  const totals = computeTotals(
    subscriptions.map((s) => ({ cost: s.cost, billingCycle: s.billingCycle }))
  );

  // Format totals for display
  const monthlyTotal = totals.monthlyTotal.toFixed(2);
  const yearlyTotal = totals.yearlyTotal.toFixed(2);
  const subscriptionCount = subscriptions.length;

  return (
    <main className="min-h-screen bg-background">
      {/* Welcome Header */}
      <section className="px-6 py-12 border-b">
        <WelcomeHeader 
          userName={session.user.name || undefined}
          userEmail={session.user.email || undefined}
        />
      </section>

      {/* Dashboard Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Monthly Spend"
              value={`$${monthlyTotal}`}
              description="Total monthly recurring costs"
              icon="dollar"
              trend="neutral"
              className="md:col-span-2 lg:col-span-1"
            />
            <StatCard
              title="Yearly Spend"
              value={`$${yearlyTotal}`}
              description="Total yearly recurring costs"
              icon="bar"
              trend="neutral"
              className="md:col-span-2 lg:col-span-1"
            />
            <StatCard
              title="Active Subscriptions"
              value={subscriptionCount.toString()}
              description="Total subscriptions tracked"
              icon="trending"
              trend="neutral"
              className="md:col-span-2 lg:col-span-1"
            />
            <StatCard
              title="Next Renewal"
              value={subscriptions.length > 0 ? "Soon" : "None"}
              description={subscriptions.length > 0 ? "Upcoming subscription renewals" : "No active subscriptions"}
              icon="calendar"
              trend="neutral"
              className="md:col-span-2 lg:col-span-1"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscriptions Preview - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            <SubscriptionsPreview 
              subscriptions={subscriptions}
              isLoading={false}
            />
          </div>

          {/* Upcoming Renewals - Takes up 1/3 of the space */}
          <div className="lg:col-span-1">
            <UpcomingRenewals 
              subscriptions={subscriptions}
            />
          </div>
        </section>
      </div>
    </main>
  );
}