"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUserRole() {
  const user = await currentUser();
  if (!user) return { success: false, reason: "No active user" };

  const role = user.publicMetadata?.role;
  const email = user.emailAddresses?.[0]?.emailAddress;

  if (!role && email) {
    const isMember = await prisma.teamMember.findFirst({ where: { gmail: email } });
    if (isMember) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: { role: "member" }
      });
      return { success: true, updated: true };
    }
  }

  return { success: true, updated: false };
}
