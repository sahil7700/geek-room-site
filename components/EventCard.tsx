import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EventItem } from "@/app/actions/eventActions";

export function EventCard({ event }: { event: EventItem }) {
  const isUpcoming = event.status === "upcoming";

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors group flex flex-col">
      <div className="relative h-48 overflow-hidden bg-zinc-800">
        {event.image ? (
          <Image
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">No Image</div>
        )}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          {isUpcoming ? (
            <span className="text-blue-400">Upcoming</span>
          ) : (
            <span className="text-zinc-400">Past</span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center text-zinc-400 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(event.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', timeZone: "UTC" })}
        </div>
        
        <div className="flex items-center text-zinc-400 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          {event.location}
        </div>
        
        <p className="text-zinc-300 text-sm mb-6 flex-grow line-clamp-3">
          {event.description}
        </p>
        
        {isUpcoming ? (
          <Link 
            href={`/register/${event.id}`}
            className="w-full py-3 px-4 bg-white text-black text-center rounded-lg font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center"
          >
            Register <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        ) : (
          <div className="w-full py-3 px-4 bg-zinc-800 text-zinc-500 text-center rounded-lg font-semibold cursor-not-allowed">
            Event Completed
          </div>
        )}
      </div>
    </div>
  );
}
