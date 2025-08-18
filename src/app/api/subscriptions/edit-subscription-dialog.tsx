// src/app/subscriptions/edit-subscription-dialog.tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  subscriptionCreateSchema,
  SubscriptionUpdateInput,
} from "@/lib/validation/subscription";
import { toISOStringDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

// ✅ Make the form type exactly match the schema's input type
type FormValues = z.input<typeof subscriptionCreateSchema>;

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

export function EditSubscriptionDialog({ id, open, onOpenChange, onSaved }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [initialLoaded, setInitialLoaded] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(subscriptionCreateSchema),
    defaultValues: {
      name: "",
      cost: "",               // schema accepts number | string → string is fine for inputs
      currency: "USD",
      billingCycle: "MONTHLY",
      nextRenewal: new Date().toISOString(), // schema accepts string | Date
    },
    mode: "onBlur",
  });

  const firstFieldRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/subscriptions/${id}`);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = (await res.json()) as {
          name: string;
          cost: string | number;
          currency: string;
          billingCycle: "MONTHLY" | "YEARLY";
          nextRenewal: string;
        };
        if (ignore) return;
        form.reset({
          name: data.name,
          cost: typeof data.cost === "number" ? data.cost.toFixed(2) : String(data.cost),
          currency: data.currency,
          billingCycle: data.billingCycle,
          nextRenewal: toISOStringDate(data.nextRenewal),
        });
        setInitialLoaded(true);
        setTimeout(() => firstFieldRef.current?.focus(), 0);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [open, id, form, onOpenChange]);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const payload: SubscriptionUpdateInput = {
        name: values.name,
        cost: values.cost,
        currency: values.currency,
        billingCycle: values.billingCycle,
        nextRenewal: values.nextRenewal,
      };

      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Update failed (${res.status})`);
      }

      toast.success("Subscription updated");
      onOpenChange(false);
      onSaved?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent aria-describedby="edit-subscription-desc">
        <DialogHeader>
          <DialogTitle>Edit subscription</DialogTitle>
          <DialogDescription id="edit-subscription-desc">
            Update the details and save. All fields are validated.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4 py-2"
          onSubmit={form.handleSubmit(onSubmit)}
          aria-busy={loading}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              ref={(el) => {
                form.register("name").ref(el);
                firstFieldRef.current = el;
              }}
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600" role="alert">
                {form.formState.errors.name.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              inputMode="decimal"
              placeholder="9.99"
              {...form.register("cost")}
              aria-invalid={!!form.formState.errors.cost}
            />
            {form.formState.errors.cost && (
              <p className="text-sm text-red-600" role="alert">
                {form.formState.errors.cost.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">Currency (ISO)</Label>
            <Input id="currency" maxLength={3} {...form.register("currency")} />
          </div>

          <div className="grid gap-2">
            <Label>Billing cycle</Label>
            <Select
              value={form.watch("billingCycle")}
              onValueChange={(v: "MONTHLY" | "YEARLY") =>
                form.setValue("billingCycle", v, { shouldDirty: true })
              }
            >
              <SelectTrigger aria-label="Billing cycle">
                <SelectValue placeholder="Choose…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.billingCycle && (
              <p className="text-sm text-red-600" role="alert">
                {form.formState.errors.billingCycle.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nextRenewal">Next renewal</Label>
            <Input
              id="nextRenewal"
              type="datetime-local"
              value={toLocalInputValue(form.watch("nextRenewal") as string)}
              onChange={(e) => {
                const v = e.target.value;
                form.setValue("nextRenewal", localToISO(v), { shouldDirty: true });
              }}
              aria-invalid={!!form.formState.errors.nextRenewal}
            />
            {form.formState.errors.nextRenewal && (
              <p className="text-sm text-red-600" role="alert">
                {form.formState.errors.nextRenewal.message as string}
              </p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !initialLoaded}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helpers to map ISO <-> input[type=datetime-local]
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function localToISO(local: string): string {
  return new Date(local).toISOString();
}