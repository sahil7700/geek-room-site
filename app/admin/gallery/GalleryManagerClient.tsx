"use client";

import { useState, useCallback } from "react";
import { EventItem, updateEvent } from "@/app/actions/eventActions";
import { Trash2, Image as ImageIcon, Loader2, ArrowLeft, AlertTriangle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryManagerClient({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [loadingEvent, setLoadingEvent] = useState<string | null>(null);
  const [localEvents, setLocalEvents] = useState<EventItem[]>(events);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ eventId: string; url: string; gallery: string[] } | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleAddImage = async (eventId: string, urlToAdd: string, currentGallery: string[] = []) => {
    if (!urlToAdd) return;

    setLoadingEvent(eventId);
    const updatedGallery = [...currentGallery, urlToAdd];

    setLocalEvents(prev => prev.map(e => e.id === eventId ? { ...e, gallery: updatedGallery } : e));

    const res = await updateEvent(eventId, { gallery: updatedGallery });
    if (!res.success) {
      showToast("Failed to add image.");
      router.refresh();
    } else {
      showToast("Image added.");
    }
    setLoadingEvent(null);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    const { eventId, url, gallery } = confirmDelete;
    setConfirmDelete(null);

    setLoadingEvent(eventId);
    const updatedGallery = gallery.filter(u => u !== url);

    setLocalEvents(prev => prev.map(e => e.id === eventId ? { ...e, gallery: updatedGallery } : e));

    const res = await updateEvent(eventId, { gallery: updatedGallery });
    if (!res.success) {
      showToast("Failed to remove image.");
      router.refresh();
    } else {
      showToast("Image removed.");
    }
    setLoadingEvent(null);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#00F2FF] text-black font-mono text-sm px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold">Remove Image</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-6">Are you sure you want to remove this image? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAndDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6 cursor-pointer"
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
                      <div key={url} className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-black">
                        <Image 
                          src={url} 
                          alt={`${event.title} gallery photo ${index + 1}`} 
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover group-hover:opacity-50 transition-opacity"
                        />
                        <button 
                          onClick={() => setConfirmDelete({ eventId: event.id, url, gallery })}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove Image"
                          aria-label={`Remove image ${index + 1} from ${event.title}`}
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
