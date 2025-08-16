import "@/app/globals.css";
import SiteHeader from "@/components/site-header";
import { SessionProvider } from "next-auth/react"; // optional if you use useSession

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* SessionProvider is required if any descendant uses useSession() */}
        <SessionProvider>
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}