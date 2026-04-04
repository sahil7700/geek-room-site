import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If there's no active session, kick them back to sign-in or home
  if (!user) {
    redirect("/sign-in");
  }

  // Extract custom role strictly from publicMetadata
  const role = user.publicMetadata?.role as string | undefined;
  const email = user.emailAddresses?.[0]?.emailAddress;

  // The admin subtree requires EITHER "admin" OR "owner" privileges, or your specific email.
  // TEMPORARILY DISABLED to let you see the dashboard:
  // if (role !== "admin" && role !== "owner" && email !== "sahilnwal975@gmail.com") {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen text-white selection:bg-[#00F2FF]/30 selection:text-white">
      {children}
    </div>
  );
}
