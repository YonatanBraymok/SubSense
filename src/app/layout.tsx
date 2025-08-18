// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import AuthButtons from "@/components/auth-buttons";

export const metadata = {
  title: "SubSense",
  description: "Track and manage your subscriptions",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 rounded bg-black px-3 py-2 text-white"
        >
          Skip to content
        </a>

        <Providers>
          <header className="border-b">
            <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
              <div className="text-lg font-semibold">SubSense</div>
              <AuthButtons />
            </div>
          </header>

          <main id="main" className="mx-auto w-full max-w-5xl p-4">
            {children}
          </main>

          <footer className="mt-10 border-t">
            <div className="mx-auto max-w-5xl p-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} SubSense
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}