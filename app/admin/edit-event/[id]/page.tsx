import { getEvents } from "@/app/actions/eventActions";
import EditEventForm from "./EditEventForm";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const events = await getEvents();
  const { id } = await params;
  
  const event = events.find(e => e.id === id);

  if (!event) {
    notFound();
  }

  return <EditEventForm initialEvent={event} />;
}
