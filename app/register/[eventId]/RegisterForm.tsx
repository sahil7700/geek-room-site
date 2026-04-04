"use client";

import { useState } from "react";
import { submitFormResponse } from "@/app/actions/eventActions";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  accept?: string;
  options?: string[];
}

export default function RegisterForm({
  eventId,
  eventTitle,
  formSchema,
  registrationOpen,
}: {
  eventId: string;
  eventTitle: string;
  formSchema: FormField[] | null;
  registrationOpen: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileData, setFileData] = useState<Record<string, string>>({});

  const fields: FormField[] = formSchema && formSchema.length > 0
    ? formSchema
    : [
        { id: "name", label: "Full Name", type: "text", required: true },
        { id: "email", label: "Email Address", type: "email", required: true },
        { id: "phone", label: "Phone Number", type: "phone", required: true },
        { id: "college", label: "College Name", type: "text", required: true },
      ];

  if (!registrationOpen) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center p-4">
        <div className="text-center bg-zinc-900/50 p-12 rounded-2xl border border-zinc-800 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-[#FF8C00]">Registration Closed</h2>
          <p className="text-zinc-400">Registration for {eventTitle} is currently closed.</p>
        </div>
      </main>
    );
  }

  async function handleFileChange(fieldId: string, file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(prev => ({ ...prev, [fieldId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const responseData: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.type === "file") {
        responseData[field.id] = fileData[field.id] || "";
      } else {
        responseData[field.id] = (formData.get(field.id) as string) || "";
      }
    }

    const result = await submitFormResponse(eventId, responseData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/events"), 3000);
    } else {
      setError(result.error || "Registration failed.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center p-4">
        <div className="text-center bg-zinc-900/50 p-12 rounded-2xl border border-[#4F9EFF]/20 max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-[#4F9EFF] mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-zinc-400">You have registered for {eventTitle}. Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs text-[#4F9EFF] font-mono uppercase tracking-widest mb-2">Register for</p>
          <h1 className="text-3xl font-bold">{eventTitle}</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-[#4F9EFF]/10">
          {fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-zinc-400 mb-2">
                {field.label}
                {field.required && <span className="text-[#4F9EFF] ml-1">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  rows={3}
                  placeholder={field.placeholder}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#4F9EFF] transition-colors"
                />
              ) : field.type === "dropdown" ? (
                <select
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4F9EFF] transition-colors"
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <div className="relative">
                  <input
                    type="file"
                    id={field.id}
                    name={field.id}
                    accept={field.accept}
                    required={field.required}
                    onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor={field.id}
                    className="flex items-center justify-center gap-2 w-full bg-black border border-zinc-800 rounded-lg px-4 py-4 text-zinc-400 hover:border-[#4F9EFF]/50 hover:text-[#4F9EFF] cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {fileData[field.id] ? "File selected ✓" : `Choose file${field.accept ? ` (${field.accept})` : ""}`}
                  </label>
                </div>
              ) : (
                <input
                  type={field.type === "phone" ? "tel" : field.type}
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#4F9EFF] transition-colors"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F9EFF] hover:bg-[#4F9EFF]/80 text-black font-bold py-4 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </main>
  );
}
