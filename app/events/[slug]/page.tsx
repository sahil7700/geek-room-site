import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvents, EventItem } from "@/app/actions/eventActions";
import EventDetailClient from "./EventDetailClient";
import { EventDetails } from "../data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const customEvents = await getEvents();
  const event = customEvents.find((e: EventItem) => e.id === slug);
  if (!event) return { title: "Event — GeekRoom JEMTEC" };

  return {
    title: `\${event.title} — GeekRoom JEMTEC`,
    description: event.description.substring(0, 160),
  };
}
export const dynamic = "force-dynamic";

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const customEvents = await getEvents();
  const rawEvent = customEvents.find((e: EventItem) => e.id === slug);

  if (!rawEvent) {
    notFound();
  }

  const event: EventDetails = {
    slug: rawEvent.id,
    title: rawEvent.title,
    date: rawEvent.date,
    type: rawEvent.status,
    description: rawEvent.description,
    image: rawEvent.image,
    registrationLink: rawEvent.registrationLink,
    location: rawEvent.location,
    time: rawEvent.time,
    category: (rawEvent.category as "hackathon" | "workshop" | "talk" | "other" | "tech-event") || "tech-event",
    winners: rawEvent.winners
  };

  return <EventDetailClient event={event} />;
}
