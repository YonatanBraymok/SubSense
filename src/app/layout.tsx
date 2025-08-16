// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import AuthButtons from "@/components/auth-buttons";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <header className="p-4 flex justify-between border-b">
            <div>SubSense</div>
            <AuthButtons />
          </header>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}