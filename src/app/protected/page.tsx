// app/protected/page.tsx
import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return <div className="p-6">Super secret content 🎉</div>;
}