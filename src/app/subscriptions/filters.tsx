// src/app/subscriptions/filters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Filters({
  defaultSort,
  defaultDir,
  defaultCycle,
}: {
  defaultSort: "nextRenewal" | "createdAt";
  defaultDir: "asc" | "desc";
  defaultCycle: "ALL" | "MONTHLY" | "YEARLY";
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  const sort = (search.get("sort") ?? defaultSort) as "nextRenewal" | "createdAt";
  const dir = (search.get("dir") ?? defaultDir) as "asc" | "desc";
  const cycle = (search.get("cycle") ?? defaultCycle) as "ALL" | "MONTHLY" | "YEARLY";

  const update = (next: Partial<{ sort: string; dir: string; cycle: string }>) => {
    const params = new URLSearchParams(search.toString());
    if (next.sort) params.set("sort", next.sort);
    if (next.dir) params.set("dir", next.dir);
    if (next.cycle) params.set("cycle", next.cycle);
    startTransition(() => {
      router.push(`/subscriptions?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600">Cycle</label>
      <select
        className="border rounded-md px-2 py-1 text-sm"
        value={cycle}
        onChange={(e) => update({ cycle: e.target.value })}
        disabled={pending}
      >
        <option value="ALL">ALL</option>
        <option value="MONTHLY">MONTHLY</option>
        <option value="YEARLY">YEARLY</option>
      </select>

      <div className="h-4 w-px bg-gray-300" />

      <label className="text-sm text-gray-600">Sort</label>
      <select
        className="border rounded-md px-2 py-1 text-sm"
        value={sort}
        onChange={(e) => update({ sort: e.target.value })}
        disabled={pending}
      >
        <option value="nextRenewal">Next Renewal</option>
        <option value="createdAt">Created</option>
      </select>

      <select
        className="border rounded-md px-2 py-1 text-sm"
        value={dir}
        onChange={(e) => update({ dir: e.target.value })}
        disabled={pending}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>
  );
}