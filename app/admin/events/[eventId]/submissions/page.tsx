"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getFormSubmissions, getFormFields, FormSubmissionEntry, FormFieldWithId } from "@/app/actions/formActions";
import { getEvents } from "@/app/actions/eventActions";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SubmissionsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [eventTitle, setEventTitle] = useState("");
  const [formFields, setFormFields] = useState<FormFieldWithId[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmissionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [events, fields, subs] = await Promise.all([
        getEvents(),
        getFormFields(eventId),
        getFormSubmissions(eventId),
      ]);
      const event = events.find((e) => e.id === eventId);
      setEventTitle(event?.title || eventId);
      setFormFields(fields);
      setSubmissions(subs);
      setLoading(false);
    }
    loadData();
  }, [eventId]);

  function downloadCSV() {
    if (submissions.length === 0) return;

    const headers = ["#", "Submitted At"];
    if (formFields.length > 0) {
      formFields.forEach((f) => headers.push(f.label));
    } else {
      headers.push("Name", "Email", "Phone", "College");
    }

    const rows = submissions.map((sub, i) => {
      const row = [String(i + 1), new Date(sub.submitted).toLocaleString()];
      if (formFields.length > 0) {
        formFields.forEach((f) => {
          row.push(sub.data[f.label] || "");
        });
      } else {
        row.push(sub.data["name"] || "", sub.data["email"] || "", sub.data["phone"] || "", sub.data["college"] || "");
      }
      return row;
    });

    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventTitle.replace(/[^a-z0-9]/gi, "_")}_submissions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-zinc-400">Loading submissions...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{eventTitle}</h1>
            <p className="text-zinc-400 mt-1">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          {submissions.length > 0 && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          )}
        </div>

        {submissions.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
            <p className="text-zinc-400 text-lg">No submissions yet.</p>
            <p className="text-zinc-500 text-sm mt-2">Submissions will appear here once participants register for the event.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-zinc-400 font-medium">#</th>
                  <th className="text-left p-4 text-zinc-400 font-medium">Submitted</th>
                  {formFields.length > 0 ? (
                    formFields.map((f) => (
                      <th key={f.id} className="text-left p-4 text-zinc-400 font-medium">{f.label}</th>
                    ))
                  ) : (
                    <>
                      <th className="text-left p-4 text-zinc-400 font-medium">Name</th>
                      <th className="text-left p-4 text-zinc-400 font-medium">Email</th>
                      <th className="text-left p-4 text-zinc-400 font-medium">Phone</th>
                      <th className="text-left p-4 text-zinc-400 font-medium">College</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={sub.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 text-zinc-500">{i + 1}</td>
                    <td className="p-4 text-zinc-400 whitespace-nowrap">{new Date(sub.submitted).toLocaleString()}</td>
                    {formFields.length > 0 ? (
                      formFields.map((f) => {
                        const value = sub.data[f.label] || "";
                        return (
                          <td key={f.id} className="p-4 text-white max-w-xs truncate" title={value}>
                            {f.type === "url" || f.type === "file" ? (
                              <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                {value.length > 40 ? value.slice(0, 40) + "..." : value}
                              </a>
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })
                    ) : (
                      <>
                        <td className="p-4 text-white">{sub.data["name"]}</td>
                        <td className="p-4 text-white">{sub.data["email"]}</td>
                        <td className="p-4 text-white">{sub.data["phone"]}</td>
                        <td className="p-4 text-white">{sub.data["college"]}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
