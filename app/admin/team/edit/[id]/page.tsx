import { getMembers } from "@/app/actions/teamActions";
import EditMemberForm from "./EditMemberForm";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const members = await getMembers();
  const { id } = await params;
  const targetId = parseInt(id, 10);
  
  if (isNaN(targetId)) {
    return notFound();
  }

  const member = members.find((m) => m.id === targetId);

  if (!member) {
    return notFound();
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminOrOwner = role === "admin" || role === "owner" || userEmail === "sahilnwal975@gmail.com";

  // Authorization check: Only admin/owner or the exact team member can access this page
  if (!isAdminOrOwner && (!userEmail || member.gmail !== userEmail)) {
    redirect("/team");
  }


  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <EditMemberForm member={member} isAdmin={isAdminOrOwner} />
    </main>
  );
}
