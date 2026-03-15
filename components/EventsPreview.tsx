"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { EventItem } from "@/app/actions/eventActions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function EventsPreview({ events }: { events: EventItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide every 4 seconds loop
  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const handleNext = () => {
    if (events.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    if (events.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const getVisibleEvents = () => {
    if (events.length === 0) return [];
    if (events.length === 1) return [null, events[0], null];
    if (events.length === 2) return [events[(currentIndex - 1 + 2) % 2], events[currentIndex], events[(currentIndex + 1) % 2]];
    
    return [
      events[(currentIndex - 1 + events.length) % events.length],
      events[currentIndex],
      events[(currentIndex + 1) % events.length]
    ];
  };

  const visibleEvents = getVisibleEvents();

  const transitionSettings = { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const };
  const hoverTransition = { duration: 0.25, ease: "easeOut" as const };

  const centerVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
      y: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      y: 0,
      zIndex: 50,
      transition: transitionSettings,
    },
    exit: (dir: number) => ({
      opacity: 0.6,
      scale: 0.95,
      x: 0,
      y: 0,
      zIndex: 40,
      transition: transitionSettings,
    }),
    hover: {
      y: -6,
      transition: hoverTransition,
    },
  };

  const leftVariants = {
    enter: { opacity: 0, scale: 0.8, x: "-80%" },
    center: { opacity: 0.4, scale: 0.85, x: "-80%", zIndex: 30, transition: transitionSettings },
    exit: { opacity: 0, scale: 0.8, x: "-80%", transition: transitionSettings },
  };

  const rightVariants = {
    enter: { opacity: 0, scale: 0.8, x: "80%" },
    center: { opacity: 0.4, scale: 0.85, x: "80%", zIndex: 30, transition: transitionSettings },
    exit: { opacity: 0, scale: 0.8, x: "80%", transition: transitionSettings },
  };

  const imageVariants = {
    enter: (custom: { dir: number; isMobile: boolean }) => ({
      x: custom.isMobile ? 0 : custom.dir > 0 ? -40 : 40,
      scale: 1,
    }),
    center: {
      x: 0,
      scale: 1,
      transition: transitionSettings,
    },
    exit: {
      x: 0,
      scale: 1,
      transition: transitionSettings,
    },
    hover: {
      scale: 1.05,
      transition: hoverTransition,
    },
  };

  const borderVariants = {
    center: { 
      borderColor: "transparent", 
      boxShadow: "inset 0 0 20px rgba(0, 242, 255, 0)",
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
    hover: { 
      borderColor: "rgba(0, 242, 255, 0.5)", 
      boxShadow: "inset 0 0 20px rgba(0, 242, 255, 0.2)",
      transition: hoverTransition
    }
  };

  return (
    <section className="relative py-32 bg-[#050505] min-h-[90vh] overflow-hidden border-b border-white/5 flex flex-col items-center justify-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#020202] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00F2FF]/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="text-center z-10 mb-12 cursor-default px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-mono text-gray-300 uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,255,0.1)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#00F2FF] shadow-[0_0_8px_#00F2FF] animate-pulse" />
          Event_Log
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mix-blend-screen text-white mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00F2FF]">Innovations</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-gray-400 text-sm md:text-base max-w-xl mx-auto uppercase tracking-widest font-mono"
        >
          A glimpse into the events that shaped Geek Room
        </motion.p>
      </div>

      {events.length > 0 ? (
        <div className="relative w-full max-w-[1400px] mx-auto px-0 h-[500px] flex justify-center items-center overflow-hidden perspective-[1200px]">
          
          {/* Navigation Controls */}
          {events.length > 1 && (
            <>
              <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-8 z-[60]">
                <button onClick={handlePrev} className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-8 z-[60]">
                <button onClick={handleNext} className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          )}

          <div className="relative flex justify-center items-center w-full h-full">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {visibleEvents.map((event, offsetIndex) => {
                if (!event) return null;
                
                const isCenter = offsetIndex === 1;
                const isLeft = offsetIndex === 0;
                const isRight = offsetIndex === 2;
                
                // key includes event.id and offsetIndex so cards literally unmount/remount
                // and transition purely via enter/exit instead of sliding sideways over multiple slots.
                const key = `${event.id || event.title}-${offsetIndex}`;
                
                let activeVariants;
                if (isCenter) activeVariants = centerVariants;
                else if (isLeft) activeVariants = leftVariants;
                else activeVariants = rightVariants;

                return (
                  <motion.div
                    key={key}
                    custom={direction}
                    variants={activeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    whileHover={isCenter ? "hover" : undefined}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={isCenter ? (e, { offset, velocity }) => {
                      if (offset.x < -50 || velocity.x < -500) handleNext();
                      else if (offset.x > 50 || velocity.x > 500) handlePrev();
                    } : undefined}
                    className={`absolute flex-col h-[450px] rounded-3xl bg-[#0A0A0A] border overflow-hidden shadow-2xl cursor-pointer backdrop-blur-xl ${isCenter ? 'flex w-[90vw] md:w-[450px] lg:w-[500px] border-[#00F2FF]/30' : 'hidden md:flex w-[450px] lg:w-[500px] border-white/5 pointer-events-none'}`}
                    style={{
                      boxShadow: isCenter ? '0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,242,255,0.05)' : 'none'
                    }}
                    onClick={() => {
                      if (isLeft) handlePrev();
                      else if (isRight) handleNext();
                      else if (isCenter) router.push(`/events/${event.id || event.title}`);
                    }}
                  >
                    <div className="h-[220px] w-full relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#00F2FF]/10 mix-blend-overlay z-10 pointer-events-none opacity-0 transition-opacity duration-500 hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />
                      
                      <motion.img 
                        src={(event.gallery && event.gallery.length > 0) ? event.gallery[0] : (event.image || "/placeholder.jpg")} 
                        alt={event.title} 
                        custom={{ dir: direction, isMobile }}
                        variants={isCenter ? imageVariants : undefined}
                        className="w-full h-full object-cover opacity-90" 
                        style={{ willChange: "transform" }}
                        draggable={false}
                      />
                    </div>

                    <div className="p-8 relative z-20 flex flex-col flex-grow bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,1)_20%)] -mt-10">
                      <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4 text-white line-clamp-1 transition-colors hover:text-[#00F2FF] drop-shadow-lg">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-col gap-3 mb-4 text-xs font-mono text-gray-400">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00F2FF]/10 flex items-center justify-center border border-[#00F2FF]/20">
                            <Calendar className="w-4 h-4 text-[#00F2FF]" />
                          </div>
                          <span className="truncate transition-colors hover:text-white">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FF8C00]/10 flex items-center justify-center border border-[#FF8C00]/20">
                            <MapPin className="w-4 h-4 text-[#FF8C00]" />
                          </div>
                          <span className="truncate transition-colors hover:text-white">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-auto transition-colors hover:text-gray-300">
                        {event.description}
                      </p>
                    </div>
                    
                    {/* Hover Glow Border Overlay */}
                    <motion.div 
                      variants={isCenter ? borderVariants : undefined}
                      className="absolute inset-0 rounded-3xl border-2 z-30 pointer-events-none" 
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 font-mono text-sm py-20 uppercase tracking-widest">No events found in archive_</div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 z-20"
      >
        <Link 
          href="/events" 
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-[#00F2FF]/30 rounded-full hover:bg-[#00F2FF] hover:border-[#00F2FF] transition-all duration-300 relative overflow-hidden shadow-[0_0_20px_rgba(0,242,255,0.1)] hover:shadow-[0_0_30px_rgba(0,242,255,0.4)]"
        >
          <div className="absolute inset-0 bg-[#00F2FF] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <span className="font-mono uppercase tracking-widest text-sm font-bold text-[#00F2FF] group-hover:text-black relative z-10 transition-colors duration-300">Explore All Events</span>
          <ArrowRight className="w-5 h-5 text-[#00F2FF] group-hover:text-black group-hover:translate-x-1 transition-all duration-300 relative z-10" />
        </Link>
      </motion.div>
    </section>
  );
}
