// src/components/auth-buttons.tsx
"use client";

import { useEffect, useState } from "react";
import { signIn as clientSignIn, signOut as clientSignOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const [pending, setPending] = useState(false);

  if (status === "loading") return <button disabled>Loading…</button>;

  if (!session) {
    return (
      <button
        onClick={async () => {
          setPending(true);
          await clientSignIn("github");
          setPending(false);
        }}
        disabled={pending}
        className="px-3 py-1 rounded bg-black text-white"
      >
        Sign in with GitHub
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img src={session.user?.image ?? ""} alt="" className="h-6 w-6 rounded-full" />
      <span>{session.user?.name ?? session.user?.email}</span>
      <button
        onClick={async () => {
          setPending(true);
          await clientSignOut();
          setPending(false);
        }}
        disabled={pending}
        className="px-3 py-1 rounded border"
      >
        Sign out
      </button>
    </div>
  );
}