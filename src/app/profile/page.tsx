import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AccountForm from "./account-form";

export const dynamic = "force-dynamic"; // ensures fresh server render after updates

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  // Read extra fields from DB (ensures source of truth)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      displayName: true,
      defaultCurrency: true,
      timezone: true,
    },
  });

  if (!user) {
    // Basic error UI
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="mt-2 text-red-600">Could not load your profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Profile</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.image ?? ""}
            alt=""
            className="h-32 w-32 rounded-full bg-gray-100 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{user.name ?? "—"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Display name</div>
            <div className="font-medium">{user.displayName ?? "—"}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Default currency</div>
              <div className="font-medium">{user.defaultCurrency ?? "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Timezone</div>
              <div className="font-medium">{user.timezone ?? "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ↓↓↓ Add the editable Account Settings form here ↓↓↓ */}
      <AccountForm
        initial={{
          displayName: user.displayName,
          defaultCurrency: user.defaultCurrency,
          timezone: user.timezone,
        }}
      />
    </div>
  );
}