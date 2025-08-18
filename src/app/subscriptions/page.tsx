import { auth } from "auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { BillingCycle, Prisma } from "@prisma/client";
import { computeTotals } from "@/lib/totals";
import { formatDate, formatMoney } from "@/lib/format";
import Filters from "./filters";
import type { SubscriptionRow } from "@/types/subscription";
import { RowActions } from "@/app/subscriptions/RowActions";
import Link from "next/link";

type PageSearchParams = {
  sort?: "nextRenewal" | "createdAt";
  dir?: "asc" | "desc";
  cycle?: "ALL" | "MONTHLY" | "YEARLY";
};

export const dynamic = "force-dynamic"; // ensure fresh data after mutations if needed

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/subscriptions");
  }

  let userId: string | undefined = session.user.id;

  if (!userId && session.user.email) {
    const u = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    userId = u?.id;
  }

  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <p className="mt-2 text-sm text-red-600">Could not resolve user id.</p>
      </div>
    );
  }

  // Defaults
  const sort = (searchParams.sort ?? "nextRenewal") as "nextRenewal" | "createdAt";
  const dir = (searchParams.dir ?? "asc") as "asc" | "desc";
  const cycle = (searchParams.cycle ?? "ALL") as "ALL" | BillingCycle;

  // Build where/orderBy safely
  const where: Prisma.SubscriptionWhereInput = {
    userId,
    ...(cycle !== "ALL" ? { billingCycle: cycle as BillingCycle } : {}),
  };

  const orderBy: Prisma.SubscriptionOrderByWithRelationInput =
    sort === "nextRenewal"
      ? { nextRenewal: dir }
      : { createdAt: dir };

  const subscriptions = (await prisma.subscription.findMany({
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
  })) as SubscriptionRow[];

  const totals = computeTotals(
    subscriptions.map((s) => ({ cost: s.cost, billingCycle: s.billingCycle }))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <Filters defaultSort={sort} defaultDir={dir} defaultCycle={cycle} />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Monthly Spend (sum)</div>
          <div className="text-xl font-semibold">
            {totals.monthlyTotal.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            *Mixed currencies not normalized; this is a raw sum.
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Yearly Spend (sum)</div>
          <div className="text-xl font-semibold">
            {totals.yearlyTotal.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            *Mixed currencies not normalized; this is a raw sum.
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <Th>Name</Th>
              <Th>Cost</Th>
              <Th>Currency</Th>
              <Th>Billing Cycle</Th>
              <Th>
                <SortHeader
                  label="Next Renewal"
                  field="nextRenewal"
                  active={sort === "nextRenewal"}
                  dir={dir}
                  cycle={cycle}
                />
              </Th>
              <Th>
                <SortHeader
                  label="Created"
                  field="createdAt"
                  active={sort === "createdAt"}
                  dir={dir}
                  cycle={cycle}
                />
              </Th>
              <Th>Actions</Th> {/* 👈 NEW */}
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No subscriptions yet.
                </td>
              </tr>
            ) : (
              subscriptions.map((s) => (
                <tr key={s.id} className="border-t">
                  <Td className="font-medium">{s.name}</Td>
                  <Td>{formatMoney(s.cost, s.currency)}</Td>
                  <Td>{s.currency}</Td>
                  <Td>{s.billingCycle}</Td>
                  <Td>{formatDate(s.nextRenewal)}</Td>
                  <Td>{formatDate(s.createdAt)}</Td>
                  <Td className="text-right">
                    <RowActions id={s.id} defaultName={s.name} />
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-600">
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
  );
}

/** Sort header link (server component) */
function SortHeader({
  label,
  field,
  active,
  dir,
  cycle,
}: {
  label: string;
  field: "nextRenewal" | "createdAt";
  active: boolean;
  dir: "asc" | "desc";
  cycle: "ALL" | "MONTHLY" | "YEARLY";
}) {
  const nextDir = active && dir === "asc" ? "desc" : "asc";
  const params = new URLSearchParams({
    sort: field,
    dir: nextDir,
    cycle,
  });
  return (
    <a
      className={`inline-flex items-center gap-1 ${
        active ? "font-semibold" : ""
      }`}
      href={`/subscriptions?${params.toString()}`}
    >
      {label}
      <span className="text-gray-400 text-[10px]">
        {active ? (dir === "asc" ? "▲" : "▼") : "▪"}
      </span>
    </a>
  );
}