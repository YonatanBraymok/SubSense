// src/app/subscriptions/RowActions.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { EditSubscriptionDialog } from "../api/subscriptions/edit-subscription-dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type RowActionsProps = {
  id: string;
  defaultName?: string;
};

export function RowActions({ id, defaultName }: RowActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const handleDelete = React.useCallback(async () => {
    const ok = window.confirm(`Delete “${defaultName ?? "this subscription"}”?`);
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Delete failed (${res.status})`);
      }
      toast.success("Subscription removed");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }, [defaultName, id, router]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Row actions"
            aria-haspopup="menu"
            disabled={busy}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            // Prevent the menu from closing before we set state
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleDelete}
            aria-disabled={busy}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSubscriptionDialog
        id={id}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => {
          // Ensure list + totals are fresh after PATCH
          router.refresh();
        }}
      />
    </>
  );
}