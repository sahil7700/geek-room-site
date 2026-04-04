import { getEvents, getSubmissionCount } from "@/app/actions/eventActions";
import Link from "next/link";
import { Edit2, Plus, Calendar, Eye } from "lucide-react";
import DeleteEventButton from "./DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getEvents();
  
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const pastEvents = events.filter(e => e.status === "past");

  return (
    <main className="min-h-screen text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-[#4F9EFF]">Event Management</h1>
          <div className="flex gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Admin
            </Link>
            <Link 
              href="/admin/create-event" 
              className="flex items-center gap-2 bg-[#4F9EFF] hover:bg-[#4F9EFF]/80 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Event
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#4F9EFF] border-b border-zinc-800 pb-2">Upcoming Events</h2>
          <div className="grid gap-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
              <div key={event.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-[#4F9EFF]/20 transition">
                <div className="flex items-center gap-4">
                  {event.image ? (
                    <img src={event.image} alt="" className="w-16 h-16 rounded object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-500">No Img</div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    {event.registrationOpen !== false ? (
                      <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">Reg Open</span>
                    ) : (
                      <span className="text-[#FF8C00] bg-[#FF8C00]/10 px-2 py-1 rounded">Reg Closed</span>
                    )}
                  </div>
                  <Link
                    href={`/admin/events/${event.id}/responses`}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#4F9EFF]/10 border border-[#4F9EFF]/20 text-[#4F9EFF] rounded-lg hover:bg-[#4F9EFF]/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Responses
                  </Link>
                  <div className="flex gap-2">
                    <Link href={`/admin/edit-event/${event.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition" title="Edit Event">
                      <Edit2 className="w-4 h-4 text-zinc-300" />
                    </Link>
                    <DeleteEventButton eventId={event.id} />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-zinc-500">No upcoming events.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#FF8C00] border-b border-zinc-800 pb-2">Past Events</h2>
          <div className="grid gap-4">
            {pastEvents.length > 0 ? pastEvents.map(event => (
              <div key={event.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-700 transition">
                <div className="flex items-center gap-4">
                  {event.image ? (
                    <img src={event.image} alt="" className="w-16 h-16 rounded object-cover grayscale" />
                  ) : (
                    <div className="w-16 h-16 bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-500">No Img</div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-zinc-300">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm flex gap-2">
                    {event.gallery && event.gallery.length > 0 && (
                      <span className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded">{event.gallery.length} Images</span>
                    )}
                    {event.winners && event.winners.length > 0 && (
                      <span className="text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">{event.winners.length} Winners</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/edit-event/${event.id}`} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition" title="Edit Event">
                      <Edit2 className="w-4 h-4 text-zinc-300" />
                    </Link>
                    <DeleteEventButton eventId={event.id} />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-zinc-500">No past events.</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
