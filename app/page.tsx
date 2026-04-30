
import { HeroSection } from "@/components/HeroSection";
import { WhySection } from "@/components/WhySection";
import { TeamPreview } from "@/components/TeamPreview";
import { EventsPreview } from "@/components/EventsPreview";
import { GalleryPreview } from "@/components/GalleryPreview";
import { CultureSection } from "@/components/CultureSection";
import { JoinCTA } from "@/components/JoinCTA";
import nextDynamic from "next/dynamic";

import { getMembers } from "@/app/actions/teamActions";
import { getEvents } from "@/app/actions/eventActions";
export const dynamic = "force-dynamic";

const StartupAnimation = nextDynamic(() => import("@/components/StartupAnimation"), {
  loading: () => null,
});

export default async function Home() {
  const members = await getMembers();
  const events = await getEvents();

  // Show up to 12 members of any category if "Core" is empty, otherwise prefer Core.
  const coreMembers = members.filter((m) => m.category === "Core");
  const previewMembers = coreMembers.length > 0 ? coreMembers : members;

  // Prefer past events for signature, but fallback to any events if empty
  const pastEvents = events.filter((e) => e.status === "past");
  const previewEvents = pastEvents.length > 0 ? pastEvents : events;

  return (
    <main className="min-h-screen">
      {/* 0. Startup Screen (Plays once per browser session) */}
      <StartupAnimation />

      {/* 1. Hero */}
      <HeroSection eventsCount={events.length} membersCount={members.length} />

      {/* 2. Why Geek Room */}
      <WhySection />

      {/* 3. Core Team preview */}
      <TeamPreview members={previewMembers} />

      {/* 4. Signature Events */}
      <EventsPreview events={previewEvents} />

      {/* 5. Gallery */}
      <GalleryPreview events={events} />

      {/* 6. Culture / Values */}
      <CultureSection />

      {/* 7. Join CTA */}
      <JoinCTA />
    </main>
  );
}
