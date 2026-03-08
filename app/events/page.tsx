import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events — GEEKROOM JIMSEMTC",
  description: "Upcoming and past events by GEEKROOM JIMSEMTC.",
};

const mockEvents = [
  { slug: "hackathon-2025", title: "Hackathon 2025", date: "2025-04-15", type: "upcoming" },
  { slug: "workshop-react", title: "React Workshop", date: "2025-03-20", type: "upcoming" },
  { slug: "tech-talk-ai", title: "Tech Talk: AI & ML", date: "2025-02-10", type: "past" },
] as const;

export default function EventsPage() {
  const upcoming = mockEvents.filter((e) => e.type === "upcoming");
  const past = mockEvents.filter((e) => e.type === "past");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold sm:text-4xl">Events</h1>
      <p className="mt-3 text-base text-foreground/80 sm:mt-4 sm:text-lg">
        Workshops, hackathons, and tech talks by GEEKROOM.
      </p>

      <section className="mt-8 sm:mt-12">
        <h2 className="text-xl font-semibold sm:text-2xl">Upcoming</h2>
        <ul className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
          {upcoming.map((event) => (
            <li key={event.slug}>
              <Link
                href={`/events/${event.slug}`}
                className="block min-h-[48px] rounded-lg border border-foreground/10 p-4 transition active:bg-foreground/5 hover:border-foreground/20"
              >
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-foreground/70">{event.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 sm:mt-12">
        <h2 className="text-xl font-semibold sm:text-2xl">Archive</h2>
        <ul className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
          {past.map((event) => (
            <li key={event.slug}>
              <Link
                href={`/events/${event.slug}`}
                className="block min-h-[48px] rounded-lg border border-foreground/10 p-4 transition active:bg-foreground/5 hover:border-foreground/20"
              >
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-foreground/70">{event.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
