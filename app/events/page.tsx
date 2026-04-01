import type { Metadata } from "next";
import { getEvents, EventItem } from "@/app/actions/eventActions";
import EventsClient from "./EventsClient";
import ScrambleText from "@/components/ScrambleText";
import { TechDecorations } from "@/components/TechDecorations";
import { EventDetails } from "./data";
import { Geist, Geist_Mono, Inter } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Events — GeekRoom JIMS EMTC",
  description: "Upcoming and past events by GeekRoom JIMS EMTC.",
};

export const dynamic = "force-dynamic";

// Tech Background Pattern Component
function TechBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4F9EFF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF8C00]/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mainGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4F9EFF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mainGrid)" />
      </svg>

      {/* Animated scanline */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
        <div className="w-full h-[2px] bg-[#4F9EFF] absolute animate-[scanline-full_8s_linear_infinite]" />
      </div>

    </div>
  );
}

export default async function EventsPage() {
  const customEvents = await getEvents();

  const mappedEvents: EventDetails[] = customEvents.map((e: EventItem) => ({
    slug: e.id,
    title: e.title,
    date: e.date,
    type: e.status,
    description: e.description,
    image: e.image,
    registrationLink: e.registrationLink,
    location: e.location,
    time: e.time,
    category: (e.category as "hackathon" | "workshop" | "talk" | "other" | "tech-event") || "tech-event",
    registrationOpen: e.registrationOpen,
    gallery: e.gallery,
    winners: e.winners
  }));

  return (
    <main className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 relative ${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <TechBackground />

      {/* Page Header with Tech Styling */}
      <div className="text-center relative z-10">
        {/* Top Tech Decoration */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#4F9EFF]/50" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#4F9EFF] rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-[#FF8C00] rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-[#4F9EFF] rounded-full animate-pulse delay-150" />
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#4F9EFF]/50" />
        </div>

        {/* Main Title */}
        <div className="relative inline-block mb-2">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight font-['var(--font-geist-sans)']"
          >
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <span className="text-[#4F9EFF] opacity-80 mr-2">{'<'}</span>
              EVENTS
              <span className="text-[#FF8C00] opacity-80 ml-2">{'/>'}</span>
            </span>
          </h1>
          {/* Glowing underline */}
          <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F9EFF] to-transparent" />
        </div>

        {/* Subtitle with terminal style */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-mono text-white/40">
          <span className="text-[#4F9EFF]">{'>>> '}</span>
          <ScrambleText text="Initialize Event Stream Protocol..." delay={300} speed={15} />
        </div>

        <p className="mt-8 max-w-2xl mx-auto text-sm font-mono text-gray-400 uppercase tracking-widest mb-8">
          <ScrambleText text="Discover our upcoming workshops, hackathons, and tech talks, or explore the highlights of our past events." delay={500} speed={10} />
        </p>
      </div>

      {/* Interactive Tabs & Event Cards */}
      <EventsClient events={mappedEvents} />

      {/* Tech Corner Decorations */}
      <TechDecorations />
    </main>
  );
}
