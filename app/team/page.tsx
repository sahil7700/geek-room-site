import TeamClient from "./TeamClient";
import { getMembers } from "@/app/actions/teamActions";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await getMembers();
  const user = await currentUser();
  // Clerk sometimes doesn't populate primaryEmailAddress directly depending on version, so fallback to first email or match ID.
  const loggedInEmail = user?.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)?.emailAddress 
    || user?.emailAddresses?.[0]?.emailAddress 
    || null;

  return (
    <section id="team">
      <TeamClient members={members} loggedInEmail={loggedInEmail} />
    </section>
  );
}