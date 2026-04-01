"use client";

import { useState } from "react";
import { registerForEvent } from "@/app/actions/eventActions";
import { submitFormResponse, FormFieldWithId } from "@/app/actions/formActions";
import { useRouter } from "next/navigation";

function getFieldInputType(fieldType: string): string {
  switch (fieldType) {
    case "email": return "email";
    case "phone": return "tel";
    case "number": return "number";
    case "url": return "url";
    default: return "text";
  }
}

export default function RegisterForm({
  eventId,
  eventTitle,
  formFields,
  registrationOpen,
}: {
  eventId: string;
  eventTitle: string;
  formFields: FormFieldWithId[];
  registrationOpen: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasCustomForm = formFields.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (hasCustomForm) {
      const data: Record<string, string> = {};
      for (const field of formFields) {
        data[field.label] = formData.get(field.label) as string || "";
      }

      const result = await submitFormResponse(eventId, data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/events"), 3000);
      } else {
        setError(result.error || "Failed to submit.");
        setLoading(false);
      }
    } else {
      const registrationData = {
        eventId,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        college: formData.get("college") as string,
      };

      const result = await registerForEvent(registrationData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/events"), 3000);
      } else {
        setError(result.error || "Failed to register.");
        setLoading(false);
      }
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center bg-zinc-900/50 p-12 rounded-2xl border border-green-500/30 max-w-md w-full">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-zinc-400">You have successfully registered for <span className="text-white font-medium">{eventTitle}</span>. Redirecting back to events...</p>
        </div>
      </main>
    );
  }

  if (!registrationOpen) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center bg-zinc-900/50 p-12 rounded-2xl border border-zinc-700 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Registration Closed</h2>
          <p className="text-zinc-400">Registration for <span className="text-white font-medium">{eventTitle}</span> is currently closed.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{eventTitle}</h1>
          <p className="text-lg text-zinc-400">Event Registration</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          {hasCustomForm ? (
            formFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-zinc-400 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.label}
                    required={field.required}
                    rows={3}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.label}
                    required={field.required}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select an option</option>
                    {(field.options || []).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <div>
                    <input
                      type="url"
                      id={field.id}
                      name={field.label}
                      required={field.required}
                      placeholder="Paste a link to your file (Google Drive, Dropbox, etc.)"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Upload your file to Google Drive/Dropbox and paste the shareable link here.</p>
                  </div>
                ) : (
                  <input
                    type={getFieldInputType(field.type)}
                    id={field.id}
                    name={field.label}
                    required={field.required}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                )}
              </div>
            ))
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="college" className="block text-sm font-medium text-zinc-400 mb-2">College / University</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/20"
          >
            {loading ? "Submitting..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </main>
  );
}
