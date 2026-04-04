"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type UserRole = "admin" | "member" | "owner" | null;

export interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  imageUrl: string;
  createdAt: number;
}

/**
 * Validates if the current executing user has the 'owner' role.
 * Requires strict server-side authentication.
 */
async function verifyOwnerAccess() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized: No active session.");

  const role = user.publicMetadata?.role as UserRole;
  const email = user.emailAddresses?.[0]?.emailAddress;

  if (role !== "owner" && email !== "sahilnwal975@gmail.com") {
    throw new Error("Forbidden: Access specifically requires 'owner' privileges.");
  }

  return user;
}

/**
 * Fetches all registered users from the Clerk Backend API.
 * This is an expensive operation and requires 'owner' access.
 */
export async function getAllUsers(): Promise<UserData[]> {
  await verifyOwnerAccess();

  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100,
      orderBy: "-created_at"
    });

    const parsedUsers: UserData[] = response.data.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress || "Unknown",
      firstName: u.firstName,
      lastName: u.lastName,
      role: (u.publicMetadata?.role as UserRole) || null,
      imageUrl: u.imageUrl,
      createdAt: u.createdAt,
    }));

    return parsedUsers;
  } catch (error) {
    console.error("Failed to fetch Clerk users:", error);
    throw new Error("Failed to retrieve user directory.");
  }
}

/**
 * Patches a target user's metadata to assign a specific role.
 * Requires 'owner' access.
 */
export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const activeUser = await verifyOwnerAccess();
  
  // Prevent self-demotion to avoid locking out the only owner
  if (targetUserId === activeUser.id && newRole !== "owner") {
    throw new Error("Action Denied: You cannot modify your own Owner privileges.");
  }

  try {
    const client = await clerkClient();
    
    if (newRole === "member") {
      const targetUser = await client.users.getUser(targetUserId);
      const email = targetUser.emailAddresses[0]?.emailAddress;
      if (!email) throw new Error("User has no email address.");

      const isTeamMember = await prisma.teamMember.findFirst({
        where: { gmail: email }
      });
      if (!isTeamMember) {
        throw new Error("Cannot assign 'member' role. This user's email is not registered in the Team Database.");
      }
    }

    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: newRole
      }
    });

    // Revalidate the admin portal paths to reflect new permissions immediately
    revalidatePath("/admin/roles");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to assign role to ${targetUserId}:`, error);
    throw new Error("Failed to update user role metadata.");
  }
}
