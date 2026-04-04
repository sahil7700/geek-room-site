import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Users } from "lucide-react";
import { getAllUsers } from "@/app/actions/userActions";
import RoleManagerClient from "./RoleManagerClient";

export const dynamic = "force-dynamic";

export default async function RolesManagementPage() {
  const user = await currentUser();

  // Enforce rigid user session
  if (!user) {
    redirect("/sign-in");
  }

  const role = user.publicMetadata?.role as string | undefined;
  const email = user.emailAddresses?.[0]?.emailAddress;

  // The role management page is strictly for the owner.
  // TEMPORARILY DISABLED redirect so you can access it without email match issues
  // if (role !== "owner" && email !== "sahilnwal975@gmail.com") {
  //   redirect("/admin");
  // }

  const allUsers = await getAllUsers();
  const admins = allUsers.filter(u => u.role === "admin");
  const members = allUsers.filter(u => u.role === "member");
  const owners = allUsers.filter(u => u.role === "owner");
  const unassigned = allUsers.filter(u => !u.role);

  return (
    <main className="min-h-screen text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="w-8 h-8 text-[#B026FF]" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F2FF] to-[#B026FF]">
                Owner Directory
              </h1>
            </div>
            <p className="text-zinc-400">Total Registered Users: {allUsers.length}</p>
          </div>
          
          <Link 
            href="/admin" 
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
            <p className="text-[#B026FF] font-mono text-sm uppercase mb-1">Owners</p>
            <p className="text-3xl font-bold">{owners.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
            <p className="text-[#00F2FF] font-mono text-sm uppercase mb-1">Admins</p>
            <p className="text-3xl font-bold">{admins.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
            <p className="text-[#00FF66] font-mono text-sm uppercase mb-1">Members</p>
            <p className="text-3xl font-bold">{members.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
            <p className="text-zinc-400 font-mono text-sm uppercase mb-1">Unassigned</p>
            <p className="text-3xl font-bold">{unassigned.length}</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <Users className="w-5 h-5 text-zinc-400" />
            <h2 className="text-xl font-bold">User Permission Roster</h2>
          </div>
          <div className="p-6">
            <RoleManagerClient users={allUsers} activeOwnerId={user.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
