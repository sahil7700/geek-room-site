import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { NetworkNodes } from "@/components/about/NetworkNodes";

import { AboutStory } from "@/components/about/AboutStory";

export const metadata: Metadata = {
  title: "About — GEEKROOM",
  description: "Learn about the GEEKROOM tech society.",
};

export const dynamic = "force-dynamic";

import { getMembers } from "@/app/actions/teamActions";
import { getEvents } from "@/app/actions/eventActions";

export default async function AboutPage() {
  const members = await getMembers();
  const events = await getEvents();

  return (
    <main className="relative min-h-screen text-[#ededed] overflow-hidden selection:bg-[#00F2FF]/30">
      
      <div className="relative z-10 w-full overflow-hidden">
        <AboutHero membersCount={members.length} eventsCount={events.length} />
        <AboutStory />
        <NetworkNodes />
      </div>
    </main>
  );
}
