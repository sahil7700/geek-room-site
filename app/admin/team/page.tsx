import { getMembers } from "@/app/actions/teamActions";
import Link from "next/link";
import { Edit2, Plus, Users } from "lucide-react";
import DeleteMemberButton from "./DeleteMemberButton";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const isAdminOrOwner = role === "admin" || role === "owner" || email === "sahilnwal975@gmail.com";

  if (!isAdminOrOwner) {
    redirect("/");
  }

  const members = await getMembers();
  
  const categories = ["Core", "Heads", "Tech", "Publicity", "Design", "Management"];

  return (
    <main className="min-h-screen text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <div className="flex gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Admin
            </Link>
            <Link 
              href="/admin/team/create" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Member
            </Link>
          </div>
        </div>

        {categories.map((category) => {
          const categoryMembers = members.filter(m => m.category === category);
          if (categoryMembers.length === 0) return null;

          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-zinc-800 pb-2 flex items-center gap-2">
                <Users className="w-5 h-5" /> {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryMembers.map(member => (
                  <div key={member.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-700 transition">
                    <div className="flex items-center gap-4">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-zinc-700" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl text-zinc-500 font-bold border border-zinc-700">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <div className="text-sm text-zinc-400 font-mono">
                          {member.role || "Member"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/team/edit/${member.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition" title="Edit Member">
                          <Edit2 className="w-4 h-4 text-zinc-300" />
                        </Link>
                        <DeleteMemberButton memberId={member.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No team members found. Start by adding one.
          </div>
        )}

      </div>
    </main>
  );
}
