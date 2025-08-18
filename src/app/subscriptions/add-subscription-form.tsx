"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  subscriptionCreateSchema,
  BillingCycleEnum,
  CurrencyEnum,
} from "@/lib/validation/subscription";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Use Zod input type so raw form values (e.g., date string) match the form.
type FormValues = z.input<typeof subscriptionCreateSchema>;

export default function AddSubscriptionForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helpers for defaults
  const today = new Date();
  const plus30 = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 30);
  const toYYYYMMDD = (d: Date) => d.toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(subscriptionCreateSchema),
    defaultValues: {
      name: "",
      cost: 9.99, // number is fine; RHF can also coerce via valueAsNumber
      currency: "USD",
      billingCycle: "MONTHLY",
      nextRenewal: toYYYYMMDD(plus30), // for <input type="date"> must be "YYYY-MM-DD"
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setServerSuccess(null);

    // nextRenewal is a "YYYY-MM-DD" string; API zod will coerce to Date
    const payload = { ...values };

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setServerError("You must be signed in to add a subscription.");
          return;
        }
        if (res.status === 400 && data?.issues) {
          setServerError("Please fix the highlighted fields and try again.");
          return;
        }
        setServerError(data?.error ?? "Something went wrong.");
        return;
      }

      // Success — refresh list and reset form
      startTransition(() => {
        router.refresh();
      });
      reset({
        name: "",
        cost: 9.99,
        currency: "USD",
        billingCycle: "MONTHLY",
        nextRenewal: toYYYYMMDD(plus30),
      });
      setServerSuccess("Subscription added!");
    } catch (err) {
      console.error(err);
      setServerError("Network error. Please try again.");
    }
  };

  const todayStr = toYYYYMMDD(today);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md p-4 rounded-xl border"
      aria-describedby="form-status"
    >
      <h2 className="text-xl font-semibold">Add Subscription</h2>

      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Name
        </label>
        <input
          id="name"
          placeholder="e.g., Netflix"
          className="w-full rounded border px-3 py-2"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cost" className="block mb-1 font-medium">
            Cost
          </label>
          <input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            placeholder="9.99"
            className="w-full rounded border px-3 py-2"
            aria-invalid={!!errors.cost}
            // valueAsNumber ensures RHF gives a number (Zod also coerces if string)
            {...register("cost", { valueAsNumber: true })}
          />
          {errors.cost && (
            <p className="mt-1 text-sm text-red-600">
              {errors.cost.message as string}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="block mb-1 font-medium">
            Currency
          </label>
          <select
            id="currency"
            className="w-full rounded border px-3 py-2 bg-white"
            aria-invalid={!!errors.currency}
            {...register("currency")}
          >
            {CurrencyEnum.options.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currency.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="billingCycle" className="block mb-1 font-medium">
            Billing Cycle
          </label>
          <select
            id="billingCycle"
            className="w-full rounded border px-3 py-2 bg-white"
            aria-invalid={!!errors.billingCycle}
            {...register("billingCycle")}
          >
            {BillingCycleEnum.options.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.billingCycle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.billingCycle.message as string}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="nextRenewal" className="block mb-1 font-medium">
            Next Renewal
          </label>
          <input
            id="nextRenewal"
            type="date"
            min={todayStr}
            className="w-full rounded border px-3 py-2"
            aria-invalid={!!errors.nextRenewal}
            {...register("nextRenewal")}
          />
          {errors.nextRenewal && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nextRenewal.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="rounded-lg px-4 py-2 border font-medium disabled:opacity-60"
        >
          {isSubmitting || isPending ? "Adding..." : "Add Subscription"}
        </button>
      </div>

      <div id="form-status" className="space-y-2" aria-live="polite">
        {serverSuccess && (
          <p className="text-sm text-green-700">{serverSuccess}</p>
        )}
        {serverError && (
          <p className="text-sm text-red-700">{serverError}</p>
        )}
      </div>
    </form>
  );
}