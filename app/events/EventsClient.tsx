"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EventDetails } from "./data";
import { 
  Calendar, MapPin, ArrowRight, Search, 
  Users, Trophy, ChevronDown, MonitorPlay, Zap
} from "lucide-react";
import ScrambleText from "@/components/ScrambleText";
import MinimalEventCard from "@/components/MinimalEventCard";
import LunarRunwayBackground from "@/components/LunarRunwayBackground";
// Utility formatting
const formatEventDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return { day, month, year };
};

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Arbitrary target time (end of the day of the event)
    const target = new Date(`${targetDate}T23:59:59`).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}


export default function EventsClient({ events }: { events: EventDetails[] }) {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "ending-soon">("latest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const categories = ["all", "hackathon", "workshop", "talk", "tech-event"];

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter(e => e.type === activeTab)
      .filter(e => activeCategory === "all" || (e.category && e.category === activeCategory))
      .filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        // Mock sorting for "popular" and "ending-soon"
        if (sortBy === "popular") return a.title.length - b.title.length; 
        if (sortBy === "ending-soon") return new Date(a.date).getTime() - new Date(b.date).getTime();
        return 0;
      });
  }, [events, activeTab, activeCategory, searchQuery, sortBy]);

  // Featured Event
  const featuredEvent = filteredEvents.length > 0 ? filteredEvents[0] : events[0];
  const countdown = useCountdown(featuredEvent.date);
  const isUpcoming = featuredEvent.type === "upcoming";

  return (
    <div className="relative mt-8 sm:mt-12 w-full font-['var(--font-inter)']">
      <LunarRunwayBackground />

      {/* ============== HERO / FEATURED SECTION ============== */}
      <div className="relative z-10 flex flex-col items-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-2 h-2 rounded-full bg-[#00F2FF] animate-pulse" />
          <span className="text-xs font-medium text-white/80">
            System Online
          </span>
        </div>

        {/* Featured Card */}
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0A0A0A]/40 backdrop-blur-2xl overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
          
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] min-h-[350px]">
            {/* Content Side */}
            <div className="p-8 md:p-10 flex flex-col justify-center relative order-2 md:order-1 border-t md:border-t-0 md:border-r border-white/5">
              <div className="flex items-center gap-3 mb-6 text-xs">
                <span className="text-white font-medium bg-white/10 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  {featuredEvent.category ? featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1).replace('-', ' ') : "Event"}
                </span>
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatEventDate(featuredEvent.date).month} {formatEventDate(featuredEvent.date).day}, {formatEventDate(featuredEvent.date).year}
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight font-['var(--font-geist-sans)']">
                {featuredEvent.title}
              </h2>
              
              <p className="text-sm text-gray-400 mb-8 line-clamp-3 leading-relaxed max-w-md">
                {featuredEvent.description}
              </p>

              {isUpcoming ? (
                <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="flex gap-4">
                    {Object.entries(countdown).map(([unit, value]) => (
                      <div key={unit} className="flex flex-col items-start">
                        <span className="text-2xl font-semibold text-white tracking-tight">
                          {value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{unit}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={featuredEvent.registrationLink || `/events/${featuredEvent.slug}`} className="sm:ml-auto inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-colors gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    <Zap className="w-4 h-4" />
                    Register Now
                  </Link>
                </div>
              ) : (
                <div className="mt-auto">
                  <Link href={`/events/${featuredEvent.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors pb-1 border-b border-white/20">
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Banner Side */}
            <div className="relative h-64 md:h-full w-full overflow-hidden order-1 md:order-2 bg-[#050505]">
              {featuredEvent.image ? (
                <>
                  <img src={featuredEvent.image} alt={featuredEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111] to-[#050505]">
                  <MonitorPlay className="w-16 h-16 text-white/5" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[10px] font-medium text-white uppercase tracking-wider">
                {isUpcoming ? "Featured" : "Archive"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============== FILTER & CONTROLS ============== */}
      <div className="relative flex flex-col items-center z-20 mb-12">
        {/* Toggle Status (Past/Upcoming) */}
        <div className="relative flex w-full max-w-sm overflow-hidden rounded-full bg-white/5 backdrop-blur-xl border border-white/10 p-1 mb-8 shadow-sm">
          <motion.div
            className="absolute bottom-1 top-1 h-auto bg-white/10 rounded-full shadow-sm"
            initial={false}
            animate={{ width: "calc(50% - 4px)", x: activeTab === "past" ? "4px" : "calc(100% + 4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          <div className="flex w-full relative z-10">
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 relative py-2 text-sm font-medium transition-colors rounded-full ${
                activeTab === "past" ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Past Events
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 relative py-2 text-sm font-medium transition-colors rounded-full ${
                activeTab === "upcoming" ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Action Bar (Search, Category, Sort) */}
        <div className="w-full flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#0a0a0a]/50 border border-white/10 p-2 lg:p-3 rounded-2xl backdrop-blur-xl sticky top-20 z-40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-72 max-w-md group/search">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within/search:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="block w-full pl-9 pr-3 py-2 border-transparent rounded-xl leading-5 bg-white/5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/10 transition-all font-medium"
            />
          </div>

          {/* Filter Chips (Scrollable on mobile) */}
          <div className="flex w-full lg:w-auto overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-hide flex-1 justify-start lg:justify-center items-center px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-white text-black shadow-sm"
                    : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex w-full lg:w-auto items-center justify-end gap-3 mt-2 lg:mt-0 px-2 lg:px-0">
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Sort by: <span className="text-white capitalize">{sortBy.replace('-', ' ')}</span> <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-[#111] border border-white/10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden z-50 flex flex-col p-1 backdrop-blur-xl"
                  >
                    {(["latest", "popular", "ending-soon"] as const).map(opt => (
                      <button 
                        key={opt}
                        onClick={() => { setSortBy(opt); setDropdownOpen(false); }}
                        className={`text-left px-3 py-2 text-xs font-medium capitalize rounded-lg transition-colors ${sortBy === opt ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                      >
                        {opt.replace('-', ' ')}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ============== EVENTS BENTO GRID ============== */}
      <div className="relative z-10 w-full mb-20 min-h-[40vh]">
        <AnimatePresence mode="wait">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Search className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-lg text-white font-medium">No events found</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[380px]"
            >
              {filteredEvents.map((event, idx) => {
                // Determine bento sizing
                // Make the 1st item of every 5-item group large, except if filtered count <= 2
                const isLarge = (idx % 5 === 0) && filteredEvents.length > 2;
                
                return (
                  <MinimalEventCard 
                    key={event.slug} 
                    event={event} 
                    index={idx} 
                    isLarge={isLarge}
                  />
                );
              })}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// ============== SUBCOMPONENTS ==============


