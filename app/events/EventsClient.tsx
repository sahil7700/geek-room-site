"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { EventDetails } from "./data";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Cpu, Activity, Waves } from "lucide-react";
import ScrambleText from "@/components/ScrambleText";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { y: -5 }
};

// Tech grid pattern component
function TechGridPattern() {
  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F2FF" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#techGrid)" />
      </svg>
    </div>
  );
}

// Scanline effect component
function ScanlineEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div className="w-full h-full" style={{
        backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.5) 1px, transparent 1px)',
        backgroundSize: '100% 2px',
        animation: 'scanline 8s linear infinite'
      }} />
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}

// Glitch text component
function GlitchText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span className="absolute inset-0 text-[#FF8C00] translate-x-[2px] translate-y-[-1px] opacity-0 group-hover:opacity-50 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-100" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function EventsClient({ events }: { events: EventDetails[] }) {
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("upcoming");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredEvents = events.filter((e) => e.type === activeTab);

  // Format date
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return { day, month, year };
  };

  // Generate tech decoration binary string
  const generateBinary = () => {
    return Array.from({ length: 32 }, () => Math.random() > 0.5 ? '1' : '0').join('');
  };

  return (
    <div className="mt-8 sm:mt-12 relative">
      <TechGridPattern />
      <ScanlineEffect />

      {/* Page Header with Tech Elements */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00F2FF]" />
          <Cpu className="h-5 w-5 text-[#00F2FF] animate-pulse" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00F2FF]" />
        </div>
        <div className="inline-flex items-center gap-2 bg-[#00F2FF]/5 border border-[#00F2FF]/20 rounded-full px-4 py-1.5 mb-6">
 <Activity className="h-4 w-4 text-[#00F2FF]" />
          <span className="text-xs font-mono text-[#00F2FF] uppercase tracking-widest">
            <ScrambleText text="System Active" delay={100} speed={25} />
          </span>
        </div>
      </div>

      {/* Enhanced Tab System */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="relative flex w-full max-w-md overflow-hidden rounded-lg bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#00F2FF]/20 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
          {/* Animated background line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF8C00] to-[#00F2FF]"
            initial={false}
            animate={{ width: activeTab === "upcoming" ? "50%" : "50%", x: activeTab === "upcoming" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="flex w-full relative z-10">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 relative py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border-r border-white/5 ${
                activeTab === "upcoming"
                  ? "text-[#00F2FF] bg-[#00F2FF]/10"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {activeTab === "upcoming" && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-[#00F2FF]/5 blur-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <ScrambleText text="Upcoming" delay={0} speed={30} />
              </span>
              {activeTab === "upcoming" && (
                <div className="absolute inset-x-0 bottom-2 mx-auto w-8 h-0.5 bg-[#00F2FF]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 relative py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === "past"
                  ? "text-[#FF8C00] bg-[#FF8C00]/10"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {activeTab === "past" && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-[#FF8C00]/5 blur-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <ScrambleText text="Past Events" delay={0} speed={30} />
              </span>
              {activeTab === "past" && (
                <div className="absolute inset-x-0 bottom-2 mx-auto w-8 h-0.5 bg-[#FF8C00]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Events Count Display */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="flex items-center gap-3 bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 rounded-md px-4 py-2">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            <ScrambleText text="Data Stream:" delay={50} speed={20} />
          </span>
          <span className="text-xs font-mono text-[#00F2FF]">
            {filteredEvents.length.toString().padStart(2, '0')} / {events.length.toString().padStart(2, '0')}
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-[#00F2FF] animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-[#FF8C00] animate-pulse delay-75" />
            <div className="w-1 h-1 rounded-full bg-[#00F2FF] animate-pulse delay-150" />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                const { day, month, year } = formatEventDate(event.date);
                const isHovered = hoveredCard === event.slug;
                const borderColor = activeTab === "upcoming" ? "#00F2FF" : "#FF8C00";

                return (
                  <motion.div
                    key={event.slug}
                    id={event.slug}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    onHoverStart={() => setHoveredCard(event.slug)}
                    onHoverEnd={() => setHoveredCard(null)}
                    custom={index}
                  >
                    <Link
                      href={`/events/${event.slug}`}
                      className="group block relative"
                    >
                      {/* Card Container */}
                      <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#00F2FF]/20 bg-[#050505]/90 backdrop-blur-sm transition-all duration-500 hover:border-[#00F2FF]/60 hover:shadow-[0_0_40px_rgba(0,242,255,0.15)]">
                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-xl p-[1px]">
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00F2FF]/20 via-transparent to-[#FF8C00]/20" />
                        </div>

                        {/* Scanline overlay */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
                          <div className="w-full h-full" style={{
                            backgroundImage: 'linear-gradient(rgb(0, 242, 255, 0.3) 1px, transparent 1px)',
                            backgroundSize: '100% 2px'
                          }} />
                        </div>

                        {/* Image Section */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden">
                          {event.image ? (
                            <>
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-40 group-hover:scale-105"
                              />
                              {/* Tech overlay on image */}
                              <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-[#050505]/20 transition-all duration-500" />
                              {/* Grid overlay */}
                              <div className="absolute inset-0 opacity-20">
                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <pattern id={`grid-${event.slug}`} width="8" height="8" patternUnits="userSpaceOnUse">
                                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#00F2FF" strokeWidth="0.3"/>
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill={`url(#grid-${event.slug})`} />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00F2FF]/10 to-[#FF8C00]/10">
                              <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <pattern id={`grid-pattern-${event.slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00F2FF" strokeWidth="0.5"/>
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#grid-pattern-${event.slug})`} />
                              </svg>
                            </div>
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

                          {/* Tech labels at top */}
                          <div className="absolute top-0 left-0 right-0 p-3">
                            <div className="flex justify-between items-start gap-2">
                              {/* Status Badge */}
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-2"
                              >
                                <div className="relative">
                                  <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: borderColor }} />
                                  <div className="absolute inset-0 w-2 h-2 rounded-full" style={{ backgroundColor: borderColor }} />
                                </div>
                                <span className="inline-flex items-center rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-mono uppercase tracking-widest" style={{ color: borderColor, border: `1px solid ${borderColor}40` }}>
                                  0x{index.toString(16).toUpperCase().padStart(2, '0')}
                                </span>
                              </motion.div>

                              {/* Date Badge */}
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-2 rounded-md bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1"
                              >
                                <Calendar className="h-3 w-3 text-[#FF8C00]" />
                                <span className="text-[10px] font-mono text-white/90">
                                  {day}
                                </span>
                                <span className="text-[10px] font-mono text-white/60">
                                  {month}
                                </span>
                              </motion.div>
                            </div>
                          </div>

                          {/* Tech corner brackets */}
                          <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
                            <div className="w-3 h-3 border-t border-l transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor }} />
                            <div className="w-3 h-3 border-t border-l transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor }} />
                          </div>
                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                            <div className="w-3 h-3 border-t border-r transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor }} />
                            <div className="w-3 h-3 border-t border-r transition-all duration-300 opacity-30 group-hover:opacity-100" style={{ borderColor }} />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="relative p-4 bg-[#050505]/80 backdrop-blur-sm border-t border-white/5">
                          {/* Tech Header Line */}
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F2FF]/30 to-transparent" />

                          {/* Binary decoration */}
                          <div className="absolute bottom-0 left-0 right-0 overflow-hidden opacity-5 font-mono text-[8px] text-[#00F2FF] leading-tight pointer-events-none">
                            {generateBinary()}
                          </div>

                          {isHovered ? (
                            <AnimatePresence mode="wait">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative z-10 space-y-3"
                              >
                                {/* Event Title with tech styling */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-[#00F2FF]/30" />
                                    <Waves className="h-3 w-3 text-[#00F2FF] animate-pulse" />
                                    <div className="h-px flex-1 bg-[#00F2FF]/30" />
                                  </div>
                                  <h3 className="text-lg font-bold text-white leading-tight tracking-tight">
                                    <GlitchText>
                                      <ScrambleText text={event.title} delay={0} speed={15} />
                                    </GlitchText>
                                  </h3>
                                </div>

                                {/* Event Details with icons */}
                                <div className="space-y-2 text-[10px] font-mono">
                                  {event.time && (
                                    <div className="flex items-center gap-2 text-white/70">
                                      <Clock className="h-3 w-3 text-[#FF8C00]" />
                                      <span className="bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                        <ScrambleText text={event.time} delay={30} speed={15} />
                                      </span>
                                    </div>
                                  )}
                                  {event.location && (
                                    <div className="flex items-center gap-2 text-white/70">
                                      <MapPin className="h-3 w-3 text-[#FF8C00]" />
                                      <span className="bg-black/40 px-2 py-0.5 rounded border border-white/5 truncate">
                                        <ScrambleText text={event.location} delay={50} speed={15} />
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-light">
                                  <ScrambleText text={event.description} delay={80} speed={15} />
                                </p>

                                {/* Action Row */}
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: borderColor }}>
                                      <ScrambleText text="Access" delay={120} speed={20} />
                                    </span>
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" style={{ color: borderColor }} />
                                  </div>

                                  {event.type === "upcoming" ? (
                                    event.registrationOpen === false ? (
                                      <div className="inline-flex items-center gap-1.5 rounded bg-[#FF8C00]/10 border border-[#FF8C00]/40 px-2 py-1 text-[10px] font-mono font-bold text-[#FF8C00]">
                                        <ScrambleText text="REGISTRATION CLOSED" delay={150} speed={20} />
                                      </div>
                                    ) : (
                                      event.registrationLink && (
                                        <Link
                                          href={event.registrationLink}
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1.5 rounded bg-[#00F2FF]/10 hover:bg-[#00F2FF]/20 border border-[#00F2FF]/40 px-2 py-1 text-[10px] font-mono font-bold text-[#00F2FF] transition-colors"
                                        >
                                          <span className="animate-pulse">►</span>
                                          <ScrambleText text="REGISTER" delay={150} speed={20} />
                                        </Link>
                                      )
                                    )
                                  ) : (
                                    <div className="inline-flex items-center gap-1.5 rounded bg-[#FF8C00]/10 border border-[#FF8C00]/40 px-2 py-1 text-[10px] font-mono font-bold text-[#FF8C00]">
                                      <ScrambleText text="Event Completed" delay={150} speed={20} />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          ) : (
                            <div className="relative z-10 text-center py-4">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-white/90 group-hover:text-[#00F2FF] transition-colors">
                                  <ScrambleText text={event.title} delay={0} speed={15} />
                                </p>
                                <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 font-mono">
                                  <span>[</span>
                                  <ScrambleText text="Hover for details" delay={50} speed={20} />
                                  <span>]</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Category Tag */}
                          {event.category && (
                            <div className="absolute bottom-2 left-2 z-20">
                              <span className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white/40 bg-black/40 border border-white/5">
                                <ScrambleText text={event.category || "EVENT"} delay={0} speed={30} />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Glowing corners on hover */}
                        <div className="absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0">
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor, filter: 'drop-shadow(0 0 4px ' + borderColor + ')' }} />
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0">
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor, filter: 'drop-shadow(0 0 4px ' + borderColor + ')' }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full flex min-h-[300px] flex-col items-center justify-center text-center relative"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <div className="w-64 h-64 border border-[#00F2FF] rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute w-48 h-48 border border-[#FF8C00] rotate-45 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                </div>
                <Sparkles className="h-12 w-12 text-[#00F2FF]/30 mb-4" />
                <p className="text-lg font-medium text-white/40 font-mono">
                  <ScrambleText text="// No Data Stream Found" delay={100} speed={20} />
                </p>
                <p className="text-sm text-white/20 mt-2 font-mono">
                  0x00_NULL
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Tech Decoration */}
      <div className="flex justify-center mt-12 relative z-10">
        <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <ScrambleText text="System Status:" delay={0} speed={20} />
          <ScrambleText text="Online" delay={50} speed={20} />
          <span className="text-[#00F2FF]">●</span>
          <ScrambleText text={`v24.03.${activeTab === "upcoming" ? "01" : "02"}`} delay={100} speed={20} />
        </div>
      </div>
    </div>
  );
}
