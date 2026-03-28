import type { Metadata } from "next";
import { getEvents } from "@/app/actions/eventActions";
import GalleryClient from "./GalleryClient";
import { EventDetails } from "../events/data";

export const metadata: Metadata = {
  title: "Media Archive — GeekRoom JEMTEC",
  description: "Explore photos and videos from all GeekRoom events",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const customEvents = await getEvents();
  
  // Filter only past events with a gallery for the media archive context.
  // The original component expects event structure roughly equivalent to EventDetails.
  const mappedEvents: EventDetails[] = customEvents
    .filter(e => e.status === "past")
    .map((e: any) => ({
      slug: e.id,
      title: e.title,
      date: e.date,
      type: e.status,
      description: e.description,
      image: e.image,
      registrationLink: e.registrationLink,
      location: e.location,
      time: e.time,
      category: e.category || "tech-event",
      registrationOpen: e.registrationOpen,
      gallery: e.gallery,
      winners: e.winners
    }));

  return <GalleryClient events={mappedEvents} />;
}
