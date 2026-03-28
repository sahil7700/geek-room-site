"use client";

import { useState } from "react";
import { addEvent } from "@/app/actions/eventActions";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<"upcoming" | "past">("upcoming");
  const [category, setCategory] = useState<string>("hackathon");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const [winners, setWinners] = useState([{ rank: "1st", teamName: "", members: "", photo: "" }]);

  function handleWinnerChange(index: number, field: string, value: string) {
    const newWinners = [...winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinners(newWinners);
  }

  function addWinnerField() {
    setWinners([...winners, { rank: "", teamName: "", members: "", photo: "" }]);
  }

  function removeWinnerField(index: number) {
    setWinners(winners.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    
    // Generate an ID from the title
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newEvent: any = {
      id,
      title,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      image: mainImage,
      status, // from state
      category,
      registrationLink: `/register/${id}`,
    };

    if (status === "upcoming") {
      newEvent.registrationOpen = category === "workshop" ? false : registrationOpen;
    } else {
      newEvent.gallery = galleryUrls.filter(Boolean);
      
      if (category !== "workshop") {
        newEvent.winners = winners
          .filter(w => w.teamName.trim() !== "")
          .map(w => ({
            rank: w.rank,
            teamName: w.teamName,
            photo: w.photo,
            members: w.members ? w.members.split(",").map(m => m.trim()).filter(Boolean) : []
          }));
      }
    }

    const result = await addEvent(newEvent);

    if (result.success) {
      router.push("/admin/events");
      router.refresh(); // to ensure the new list shows up
    } else {
      setError(result.error || "Failed to create event.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-2">Event Title</label>
            <input type="text" id="title" name="title" required className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea id="description" name="description" required rows={4} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-zinc-400 mb-2">Date</label>
              <input type="date" id="date" name="date" required className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]" />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
              <input type="text" id="location" name="location" required className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Main Image</label>
            <ImageUpload 
              value={mainImage} 
              onChange={setMainImage} 
              folder="events/main"
            />
            {/* Hidden input to ensure HTML validation gets an image if needed, though we handle it in JS */}
            <input type="hidden" name="image" value={mainImage} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-zinc-400 mb-2">Status</label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "upcoming" | "past")}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="hackathon">Hackathon</option>
                <option value="workshop">Workshop</option>
                <option value="tech-event">Tech Event</option>
                <option value="talk">Talk</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields */}
          {status === "upcoming" && category !== "workshop" && (
            <div className="flex items-center gap-3 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <input 
                type="checkbox" 
                id="registrationOpen" 
                checked={registrationOpen}
                onChange={(e) => setRegistrationOpen(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="registrationOpen" className="font-medium text-zinc-200 cursor-pointer">
                Registration Open
              </label>
            </div>
          )}

          {status === "past" && (
            <div className="space-y-6 bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Gallery Images</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryUrls.map((url, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-zinc-700 aspect-video">
                        <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGalleryUrls(galleryUrls.filter((_, index) => index !== i))}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload 
                    value="" 
                    onChange={(url) => {
                      if (url) setGalleryUrls([...galleryUrls, url]);
                    }} 
                    folder="events/gallery"
                  />
                </div>
              </div>

              {category !== "workshop" && category !== "talk" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-zinc-400">Winners</label>
                    <button 
                      type="button" 
                      onClick={addWinnerField}
                      className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded transition"
                    >
                      <Plus className="w-3 h-3" /> Add Winner
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {winners.map((winner, index) => (
                      <div key={index} className="flex flex-col gap-3 bg-black p-3 rounded-lg border border-zinc-800 relative">
                        <button 
                          type="button" 
                          onClick={() => removeWinnerField(index)}
                          className="absolute right-2 top-2 p-1 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center pr-8">
                          <input 
                            type="text" 
                            placeholder="Rank (e.g. 1st)" 
                            value={winner.rank}
                            onChange={(e) => handleWinnerChange(index, "rank", e.target.value)}
                            className="w-full sm:w-24 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                          />
                          <input 
                            type="text" 
                            placeholder="Team / Person Name" 
                            value={winner.teamName}
                            onChange={(e) => handleWinnerChange(index, "teamName", e.target.value)}
                            className="w-full flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <input 
                            type="text" 
                            placeholder="Members (comma separated)" 
                            value={winner.members}
                            onChange={(e) => handleWinnerChange(index, "members", e.target.value)}
                            className="w-full flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
                          />
                        </div>
                        <div className="mt-3">
                          <label className="block text-xs text-zinc-500 mb-2">Winner Photo</label>
                          <ImageUpload 
                            value={winner.photo} 
                            onChange={(url) => handleWinnerChange(index, "photo", url)} 
                            folder="events/winners/new"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
