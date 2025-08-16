// app/page.tsx
import { auth } from "auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="p-6">
      {session ? (
        <p>Welcome, {session.user?.name ?? session.user?.email}!</p>
      ) : (
        <a
          className="inline-block px-3 py-1 rounded bg-black text-white"
          href="/api/auth/signin"
        >
          Sign in
        </a>
      )}
    </main>
  );
}