"use client";

import { useState } from "react";
import { EventItem, updateEvent } from "@/app/actions/eventActions";
import { Trash2, Plus, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

export default function GalleryManagerClient({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [loadingEvent, setLoadingEvent] = useState<string | null>(null);

  // Local state for fast optimistic updates
  const [localEvents, setLocalEvents] = useState<EventItem[]>(events);

  const handleAddImage = async (eventId: string, urlToAdd: string, currentGallery: string[] = []) => {
    if (!urlToAdd) return;

    setLoadingEvent(eventId);
    const updatedGallery = [...currentGallery, urlToAdd];

    // Optimistic Update
    setLocalEvents(prev => prev.map(e => e.id === eventId ? { ...e, gallery: updatedGallery } : e));

    const res = await updateEvent(eventId, { gallery: updatedGallery });
    if (!res.success) {
      alert("Failed to add image. Reverting.");
      router.refresh(); // revert
    }
    setLoadingEvent(null);
  };

  const handleRemoveImage = async (eventId: string, imageUrl: string, currentGallery: string[] = []) => {
    if (!confirm("Are you sure you want to remove this image?")) return;
    
    setLoadingEvent(eventId);
    const updatedGallery = currentGallery.filter(url => url !== imageUrl);

    // Optimistic Update
    setLocalEvents(prev => prev.map(e => e.id === eventId ? { ...e, gallery: updatedGallery } : e));

    const res = await updateEvent(eventId, { gallery: updatedGallery });
    if (!res.success) {
      alert("Failed to remove image. Reverting.");
      router.refresh(); // revert
    }
    setLoadingEvent(null);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
            <p className="text-zinc-400">Add or remove photos from your past events.</p>
          </div>
        </div>

        <div className="space-y-12">
          {localEvents.map((event) => {
            const gallery = event.gallery || [];
            const isLoading = loadingEvent === event.id;

            return (
              <div key={event.id} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 overflow-hidden relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#00F2FF] animate-spin" />
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
                  <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                      {event.title}
                    </h2>
                    <p className="text-sm text-zinc-500 font-mono mt-1">{new Date(event.date).toLocaleDateString()}</p>
                  </div>

                  <div className="w-full md:w-80">
                    <ImageUpload 
                      value="" 
                      onChange={(url) => {
                        if (url) {
                          handleAddImage(event.id, url, gallery);
                        }
                      }} 
                      folder={`events/gallery/${event.id}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {gallery.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl">
                      <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                      <p>No photos in this gallery yet.</p>
                    </div>
                  ) : (
                    gallery.map((url, index) => (
                      <div key={`${event.id}-${index}`} className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-black">
                        <img 
                          src={url} 
                          alt={`${event.title} ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                        />
                        <button 
                          onClick={() => handleRemoveImage(event.id, url, gallery)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Image"
                        >
                          <div className="bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white p-3 rounded-full transition-colors backdrop-blur-md">
                            <Trash2 className="w-6 h-6" />
                          </div>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {localEvents.length === 0 && (
             <div className="text-center py-24 text-zinc-500">
               <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
               <h2 className="text-xl font-bold mb-2">No Past Events</h2>
              <p>Create a past event with the Tech Event or Hackathon category to start adding gallery images.</p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
}
