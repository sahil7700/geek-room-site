import CreateMemberForm from "./CreateMemberForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateMemberPage() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const email = user?.emailAddresses?.[0]?.emailAddress;
  
  const isAdminOrOwner = role === "admin" || role === "owner" || email === "sahilnwal975@gmail.com";

  if (!isAdminOrOwner) {
    redirect("/");
  }

  return (
    <main className="min-h-screen text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <CreateMemberForm />
    </main>
  );
}
