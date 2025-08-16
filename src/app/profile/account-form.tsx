"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateAccountSettings } from "./actions";
import { useSession } from "next-auth/react";

type Props = {
  initial: {
    displayName: string | null;
    defaultCurrency: string | null;
    timezone: string | null;
  };
};

export default function AccountForm({ initial }: Props) {
  const router = useRouter();
  const { update } = useSession(); // will refresh client session if needed
  const [displayName, setDisplayName] = React.useState(initial.displayName ?? "");
  const [defaultCurrency, setDefaultCurrency] = React.useState(initial.defaultCurrency ?? "");
  const [timezone, setTimezone] = React.useState(initial.timezone ?? "");
  const [pending, setPending] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success"|"error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData();
    form.set("displayName", displayName);
    form.set("defaultCurrency", defaultCurrency);
    form.set("timezone", timezone);

    const result = await updateAccountSettings(form);
    setPending(false);

    if (result.ok) {
      setMessage({ type: "success", text: "Settings saved." });

      // Refresh server data in the current route
      router.refresh();

      // OPTIONAL: update the client session snapshot (safe fields only)
      try {
        await update(); // re-fetch session on client
      } catch { /* ignore */ }

    } else {
      setMessage({ type: "error", text: result.error ?? "Something went wrong." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-4" aria-labelledby="account-settings">
      <h2 id="account-settings" className="text-lg font-semibold">Account Settings</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="displayName" className="text-sm text-gray-600">Display name</label>
          <input
            id="displayName"
            name="displayName"
            className="mt-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Yonatan"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="defaultCurrency" className="text-sm text-gray-600">Default currency</label>
          <input
            id="defaultCurrency"
            name="defaultCurrency"
            className="mt-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value.toUpperCase())}
            placeholder="USD"
            aria-describedby="currency-help"
          />
          <div id="currency-help" className="mt-1 text-xs text-gray-500">
            Use a 3-letter ISO code (e.g., USD, EUR, ILS).
          </div>
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="timezone" className="text-sm text-gray-600">Timezone</label>
          <input
            id="timezone"
            name="timezone"
            className="mt-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="e.g. Asia/Jerusalem"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          aria-busy={pending}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {message && (
          <div
            role="status"
            className={message.type === "success" ? "text-green-600 text-sm" : "text-red-600 text-sm"}
          >
            {message.text}
          </div>
        )}
      </div>
    </form>
  );
}