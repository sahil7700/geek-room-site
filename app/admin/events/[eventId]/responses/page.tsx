import { getFormSubmissions, exportSubmissionsCSV } from "@/app/actions/eventActions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import ResponsesClient from "./ResponsesClient";

interface FormField {
  id: string;
  label: string;
}
export const dynamic = "force-dynamic";

export default async function EventResponsesPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      FormField: true,
      title: true,
    }
  });

  if (!event) notFound();
  
  const submissions = await getFormSubmissions(eventId);
  const formSchema = (event.FormField && event.FormField.length > 0) ? (event.FormField as unknown as FormField[]) : null;

  const fieldLabels = formSchema
    ? formSchema.map((f: FormField) => f.label)
    : ["Name", "Email", "Phone", "College"];

  const fieldKeys = formSchema
    ? formSchema.map((f: FormField) => f.id)
    : ["name", "email", "phone", "college"];

  return (
    <main className="min-h-screen text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#4F9EFF] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {submissions.length} registration{submissions.length !== 1 ? "s" : ""}
            </p>
          </div>

          {submissions.length > 0 && (
            <form action={async () => {
              "use server";
              const csv = await exportSubmissionsCSV(eventId);
              // This will be handled client-side
            }}>
              <a
                href={`/api/events/${eventId}/responses/csv`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F9EFF]/10 border border-[#4F9EFF]/30 text-[#4F9EFF] rounded-lg hover:bg-[#4F9EFF]/20 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </a>
            </form>
          )}
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400">No registrations yet.</p>
          </div>
        ) : (
          <ResponsesClient
            submissions={submissions}
            fieldLabels={fieldLabels}
            fieldKeys={fieldKeys}
            eventId={eventId}
          />
        )}
      </div>
    </main>
  );
}
