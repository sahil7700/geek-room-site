import { getEventById } from "@/app/actions/eventActions";
import { getFormFields } from "@/app/actions/formActions";
import { notFound } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default async function RegisterEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const formFields = await getFormFields(eventId);

  return <RegisterForm eventId={eventId} eventTitle={event.title} formFields={formFields} registrationOpen={event.registrationOpen ?? true} />;
}
