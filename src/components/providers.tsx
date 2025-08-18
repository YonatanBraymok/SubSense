// src/components/providers.tsx
"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

type ProvidersProps = { children: ReactNode };

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      {/* Global toast portal (one place only) */}
      <Toaster richColors closeButton expand />
    </SessionProvider>
  );
}