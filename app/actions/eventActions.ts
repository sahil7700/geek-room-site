"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type Winner = {
  rank: string;
  teamName: string;
  members?: string[];
  photo?: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  image: string;
  status: "upcoming" | "past";
  category?: string;
  time?: string;
  registrationOpen?: boolean;
  gallery?: string[];
  winners?: Winner[];
  hasFormFields?: boolean;
};

export async function addEvent(eventData: EventItem) {
  try {
    await prisma.event.create({
      data: {
        id: eventData.id || undefined,
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        location: eventData.location,
        registrationLink: eventData.registrationLink || null,
        image: eventData.image,
        status: eventData.status,
        category: eventData.category,
        time: eventData.time,
        registrationOpen: eventData.registrationOpen ?? true,
        gallery: eventData.gallery || [],
        winners: {
          create: eventData.winners?.map(w => ({
            rank: w.rank,
            teamName: w.teamName,
            members: w.members || [],
            photo: w.photo || null
          })) || []
        }
      }
    });

    revalidatePath("/events");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to add event:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEvent(id: string, eventData: Partial<EventItem>) {
  try {
    // If winners are provided, we overwrite the existing winners for simplicity
    if (eventData.winners) {
      await prisma.winner.deleteMany({ where: { eventId: id } });
    }

    await prisma.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date ? new Date(eventData.date) : undefined,
        location: eventData.location,
        registrationLink: eventData.registrationLink,
        image: eventData.image,
        status: eventData.status,
        category: eventData.category,
        time: eventData.time,
        registrationOpen: eventData.registrationOpen,
        gallery: eventData.gallery,
        winners: eventData.winners ? {
          create: eventData.winners.map(w => ({
            rank: w.rank,
            teamName: w.teamName,
            members: w.members || [],
            photo: w.photo || null
          }))
        } : undefined
      }
    });

    revalidatePath("/events");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update event:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({ where: { id } });

    revalidatePath("/events");
    revalidatePath("/admin");
    revalidatePath("/gallery");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete event:", error);
    return { success: false, error: error.message };
  }
}

export async function registerForEvent(registrationData: {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
}) {
  try {
    await prisma.eventRegistration.create({
      data: {
        eventId: registrationData.eventId,
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        college: registrationData.college,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Registration failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is missing. Falling back to local events.json");
      const fs = require('fs');
      const path = require('path');
      const dataPath = path.join(process.cwd(), 'data', 'events.json');
      if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as EventItem[];
      }
      return [];
    }

    const rawEvents = await prisma.event.findMany({
      include: { winners: true, _count: { select: { formFields: true } } },
      orderBy: { date: "asc" }
    });

    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);

    const upcoming: any[] = [];
    const past: any[] = [];

    for (const e of rawEvents) {
      let status = e.status;
      
      // Auto-transition to past
      if (status === "upcoming" && e.date < todayDate) {
        status = "past";
        // Update DB in background seamlessly
        prisma.event.update({ where: { id: e.id }, data: { status: "past" } }).catch(console.error);
      }

      const formatted = {
        ...e,
        date: e.date.toISOString().split('T')[0] || e.date.toISOString(), 
        status: status as "upcoming" | "past",
        category: e.category || undefined,
        time: e.time || undefined,
        registrationLink: e.registrationLink || undefined,
        hasFormFields: (e._count as any)?.formFields > 0,
        winners: e.winners.map((w: any) => ({
          rank: w.rank,
          teamName: w.teamName,
          members: w.members,
          photo: w.photo || undefined
        }))
      };

      if (status === "upcoming") {
        upcoming.push(formatted);
      } else {
        past.push(formatted);
      }
    }

    // Sort past descending
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return [...upcoming, ...past] as EventItem[];
  } catch (error: any) {
    console.error("Failed to fetch events", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<EventItem | null> {
  try {
    if (!process.env.DATABASE_URL) return null;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { winners: true, _count: { select: { formFields: true } } },
    });

    if (!event) return null;

    let status = event.status as "upcoming" | "past";
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (status === "upcoming" && event.date < todayDate) {
      status = "past";
      prisma.event.update({ where: { id }, data: { status: "past" } }).catch(console.error);
    }

    return {
      ...event,
      date: event.date.toISOString().split("T")[0] || event.date.toISOString(),
      status,
      category: event.category || undefined,
      time: event.time || undefined,
      registrationLink: event.registrationLink || undefined,
      hasFormFields: (event._count as any)?.formFields > 0,
      winners: event.winners.map((w: any) => ({
        rank: w.rank,
        teamName: w.teamName,
        members: w.members,
        photo: w.photo || undefined,
      })),
    };
  } catch (error: any) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}
