import { getEvents } from "@/app/actions/eventActions";
import { getFormFields } from "@/app/actions/formActions";
import EditEventForm from "./EditEventForm";
import { notFound } from "next/navigation";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const events = await getEvents();
  const { id } = await params;
  
  const event = events.find(e => e.id === id);

  if (!event) {
    notFound();
  }

  const formFields = await getFormFields(id);

  return <EditEventForm initialEvent={event} initialFormFields={formFields} />;
}
