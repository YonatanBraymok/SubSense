"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateAccountSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Not authenticated." };
  }

  // Read & sanitize values
  const displayName = (formData.get("displayName") as string | null)?.trim() || null;
  const defaultCurrency = (formData.get("defaultCurrency") as string | null)?.trim() || null;
  const timezone = (formData.get("timezone") as string | null)?.trim() || null;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { displayName, defaultCurrency, timezone },
    });

    // Ensure server components refetch
    revalidatePath("/profile");

    // Return a payload the client can use
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Update failed. Please try again." };
  }
}