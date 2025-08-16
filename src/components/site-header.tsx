import { auth } from "@/lib/auth";
import Link from "next/link";
import UserMenu from "@/components/user-menu"; // client component
import Image from "next/image";

export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* Light “logo” for now */}
            <div className="h-6 w-6 rounded bg-black" />
            <span className="font-semibold tracking-tight">SubSense</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 ml-6 text-sm">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/subscriptions" className="hover:underline">Subscriptions</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <UserMenu
              name={session.user.name ?? session.user.displayName ?? ""}
              email={session.user.email ?? ""}
              image={session.user.image ?? undefined}
            />
          ) : (
            <Link
              href="/api/auth/signin"
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}