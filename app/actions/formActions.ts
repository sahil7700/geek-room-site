"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type FormFieldType = {
  id?: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "url" | "file" | "select";
  required: boolean;
  options?: string[];
  order: number;
};

export type FormFieldWithId = FormFieldType & { id: string };

export type FormSubmissionData = Record<string, string>;

export type FormSubmissionEntry = {
  id: string;
  eventId: string;
  data: FormSubmissionData;
  submitted: string;
};

export async function getFormFields(eventId: string): Promise<FormFieldWithId[]> {
  try {
    if (!process.env.DATABASE_URL) return [];

    const fields = await prisma.formField.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    });

    return fields.map((f) => ({
      id: f.id,
      label: f.label,
      type: f.type as FormFieldType["type"],
      required: f.required,
      options: f.options,
      order: f.order,
    }));
  } catch (error) {
    console.error("Failed to fetch form fields:", error);
    return [];
  }
}

export async function saveFormFields(
  eventId: string,
  fields: FormFieldType[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: false, error: "Database not configured." };
    }

    // Delete all existing fields for this event
    await prisma.formField.deleteMany({ where: { eventId } });

    // Create new fields
    if (fields.length > 0) {
      await prisma.formField.createMany({
        data: fields.map((f, i) => ({
          eventId,
          label: f.label,
          type: f.type,
          required: f.required,
          options: f.options || [],
          order: f.order ?? i,
        })),
      });
    }

    revalidatePath("/admin/create-event");
    revalidatePath("/admin/edit-event");
    revalidatePath("/admin/events");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save form fields:", error);
    return { success: false, error: error.message };
  }
}

export async function submitFormResponse(
  eventId: string,
  data: FormSubmissionData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: false, error: "Database not configured." };
    }

    // Verify event exists and registration is open
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { registrationOpen: true },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    if (!event.registrationOpen) {
      return { success: false, error: "Registration is closed for this event." };
    }

    await prisma.formSubmission.create({
      data: {
        eventId,
        data: data,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit form response:", error);
    return { success: false, error: error.message };
  }
}

export async function getFormSubmissions(
  eventId: string
): Promise<FormSubmissionEntry[]> {
  try {
    if (!process.env.DATABASE_URL) return [];

    const submissions = await prisma.formSubmission.findMany({
      where: { eventId },
      orderBy: { submitted: "desc" },
    });

    return submissions.map((s) => ({
      id: s.id,
      eventId: s.eventId,
      data: s.data as FormSubmissionData,
      submitted: s.submitted.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch form submissions:", error);
    return [];
  }
}

export async function getFormSubmissionCount(
  eventId: string
): Promise<number> {
  try {
    if (!process.env.DATABASE_URL) return 0;

    return await prisma.formSubmission.count({
      where: { eventId },
    });
  } catch (error) {
    return 0;
  }
}

export async function deleteFormSubmission(
  submissionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: false, error: "Database not configured." };
    }

    await prisma.formSubmission.delete({ where: { id: submissionId } });

    revalidatePath("/admin/events");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete submission:", error);
    return { success: false, error: error.message };
  }
}
