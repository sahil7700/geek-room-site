import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

const mockEvents: Record<string, { title: string; date: string; description: string }> = {
  "hackathon-2025": {
    title: "Hackathon 2025",
    date: "2025-04-15",
    description: "A 24-hour hackathon bringing together developers, designers, and innovators.",
  },
  "workshop-react": {
    title: "React Workshop",
    date: "2025-03-20",
    description: "Learn React from basics to advanced patterns.",
  },
  "tech-talk-ai": {
    title: "Tech Talk: AI & ML",
    date: "2025-02-10",
    description: "Exploring the fundamentals of artificial intelligence and machine learning.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = mockEvents[slug];
  if (!event) return { title: "Event — GEEKROOM JIMSEMTC" };
  return {
    title: `${event.title} — GEEKROOM JIMSEMTC`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = mockEvents[slug];

  if (!event) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        href="/events"
        className="inline-flex min-h-[44px] items-center text-sm font-medium text-foreground/70 hover:text-foreground"
      >
        ← Back to Events
      </Link>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{event.title}</h1>
      <p className="mt-2 text-foreground/70">{event.date}</p>
      <p className="mt-6 text-base text-foreground/80 sm:mt-8 sm:text-lg">{event.description}</p>
    </main>
  );
}
