import type { Metadata } from "next";
import { getSettings } from "@/app/actions/settings";
import { AdminControls } from "./AdminControls";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin — GEEKROOM",
  description: "Private dashboard for content management.",
  robots: "noindex, nofollow",
};
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const email = user?.emailAddresses?.[0]?.emailAddress;
  
  const isAdminOrOwner = role === "admin" || role === "owner" || email === "sahilnwal975@gmail.com";
  const isOwner = role === "owner" || email === "sahilnwal975@gmail.com";

  if (!isAdminOrOwner) {
    redirect("/");
  }

  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl text-[#00F2FF]">Admin Dashboard</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 mb-2">
        Private content management dashboard. Control public system nodes and view messages.
      </p>
      {isOwner && (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#B026FF]/20 to-[#00F2FF]/20 border border-[#B026FF]/40 rounded-full text-xs font-mono uppercase tracking-widest text-[#B026FF]">
          <span className="w-2 h-2 rounded-full bg-[#B026FF] animate-pulse" />
          Owner Access Granted
        </span>
      )}
      
      <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
        {/* Toggle Controls */}
        <AdminControls initialHideJoin={settings.hideJoin} />

        {isOwner && (
          <Link
            href="/admin/roles"
            className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-[#B026FF] transition-colors group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#B026FF]/5 to-transparent pointer-events-none" />
            <h2 className="text-xl font-bold mb-2 group-hover:text-[#B026FF] transition-colors">Role Management</h2>
            <p className="text-zinc-400 text-sm">Owner exclusive. Assign, demote, or evaluate registered staff permissions across the database.</p>
          </Link>
        )}

        <Link
          href="/admin/events"
          className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-blue-500 transition-colors group cursor-pointer"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Event Management</h2>
          <p className="text-zinc-400 text-sm">Create, edit, and manage upcoming and past events.</p>
        </Link>

        <Link
          href="/admin/gallery"
          className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-[#FF8C00] transition-colors group cursor-pointer"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-[#FF8C00] transition-colors">Gallery Management</h2>
          <p className="text-zinc-400 text-sm">Add and remove photos globally across all past events.</p>
        </Link>
        
        <div className="rounded-lg border border-foreground/10 p-5 sm:p-6 bg-zinc-900/50">
          <h3 className="font-semibold text-xl mb-2">Messages</h3>
          <p className="mt-1 text-sm text-zinc-400">View contact inquiries.</p>
        </div>
        
        <Link
          href="/admin/team"
          className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-[#00F2FF] transition-colors group cursor-pointer"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-[#00F2FF] transition-colors">Team Management</h2>
          <p className="text-zinc-400 text-sm">Update team members and leads.</p>
        </Link>
      </div>
    </main>
  );
}
