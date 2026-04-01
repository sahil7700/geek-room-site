import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegisterForm from "./RegisterForm";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  accept?: string;
  options?: string[];
}
export const dynamic = "force-dynamic";

export default async function RegisterEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      FormField: true,
      title: true,
      registrationOpen: true,
    }
  });

  if (!event) notFound();

  const formSchema = (event.FormField && event.FormField.length > 0) ? (event.FormField as unknown as FormField[]) : null;

  return (
    <RegisterForm
      eventId={event.id}
      eventTitle={event.title}
      formSchema={formSchema}
      registrationOpen={event.registrationOpen}
    />
  );
}
