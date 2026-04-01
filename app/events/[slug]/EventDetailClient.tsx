"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EventDetails, Winner } from "../data";
import { Calendar, MapPin, Clock, Trophy, Users, ArrowRight, ChevronDown, Share2 } from "lucide-react";
import GallerySlideshow from "./GallerySlideshow";
import MediaArchive from "@/components/MediaArchive";
import GallerySection from "@/components/GallerySection";
import LunarRunwayBackground from "@/components/LunarRunwayBackground";

// Winner Team Card
const WinnerTeamCard = ({ team, index }: { team: Winner; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const rankConfig: Record<string, { label: string; color: string; badge: string; icon: string }> = {
    "1st": {
      label: "CHAMPION",
      color: "from-yellow-400/20 to-yellow-600/10 border-yellow-400/30",
      badge: "bg-yellow-500 text-yellow-900",
      icon: "🏆"
    },
    "2nd": {
      label: "1ST RUNNER UP",
      color: "from-slate-300/20 to-slate-400/10 border-slate-300/30",
      badge: "bg-slate-300 text-slate-700",
      icon: "🥈"
    },
    "3rd": {
      label: "2ND RUNNER UP",
      color: "from-amber-600/20 to-amber-700/10 border-amber-600/30",
      badge: "bg-amber-600 text-amber-100",
      icon: "🥉"
    },
    "Champions": {
      label: "CHAMPIONS",
      color: "from-yellow-400/20 to-yellow-600/10 border-yellow-400/30",
      badge: "bg-yellow-500 text-yellow-900",
      icon: "🏆"
    }
  };

  const config = rankConfig[team.rank] || {
    label: `${team.rank}`,
    color: "from-foreground/10 to-transparent border-foreground/20",
    badge: "bg-foreground/20 text-foreground",
    icon: "🎖️"
  };

  return (
    <motion.li
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.color} border backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5 transition-colors hover:bg-white/5"
      >
        <div className="flex items-start gap-4">
          {/* Position Badge */}
          <motion.div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl ${config.badge} font-black shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {config.icon}
          </motion.div>

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                {config.label}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-5 w-5 text-white/40" />
              </motion.div>
            </div>

            <h4 className="text-lg md:text-xl font-black text-white break-words">
              {team.teamName}
            </h4>

            {team.banner && (
              <img src={team.banner} alt={`${team.rank} banner`} className="mt-3 w-full rounded-lg" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-white/[0.02]"
          >
            <div className="p-5">
              {team.photo && (
                <img src={team.photo} alt={`${team.rank} winner photo`} className="w-full rounded-lg mb-4" />
              )}
              {team.members && team.members.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#00F2FF]" />
                  <span className="text-sm font-medium text-white/80">
                    {team.members.join(" • ")}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

// Countdown Timer for Upcoming Events
const CountdownTimer = ({ date, time }: { date: string; time?: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(`${date} ${time || "00:00"}`);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  const timeUnit = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl md:text-4xl font-black text-white tabular-nums"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-xs font-bold uppercase tracking-widest text-white/50 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-4 md:gap-8 justify-center">
      {timeUnit(timeLeft.days, "Days")}
      {timeUnit(timeLeft.hours, "Hours")}
      {timeUnit(timeLeft.minutes, "Mins")}
      {timeUnit(timeLeft.seconds, "Secs")}
    </div>
  );
};

export default function EventDetailClient({ event }: { event: EventDetails }) {
  const isPast = event.type === "past";
  const eventDate = new Date(event.date);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main className="relative min-h-screen">
      <LunarRunwayBackground />
      {/* Back Navigation */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/70 hover:text-[#00F2FF] transition-colors"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ x: -5 }}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Events
            </motion.span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Title */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#00F2FF]/10 border border-[#00F2FF]/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#00F2FF]"
              >
                <span className="h-2 w-2 rounded-full bg-[#00F2FF] animate-pulse" />
                {isPast ? "Past Event" : "Upcoming Event"}
              </motion.span>

              <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                {event.title}
              </h1>
            </div>

            {/* Event Meta */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30">
                  <Calendar className="h-5 w-5 text-[#00F2FF]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">Date</p>
                  <p className="text-lg font-semibold text-white">{formatDate(eventDate)}</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8C00]/10 border border-[#FF8C00]/30">
                    <Clock className="h-5 w-5 text-[#FF8C00]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">Time</p>
                    <p className="text-lg font-semibold text-white">{event.time}</p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">Location</p>
                    <p className="text-lg font-semibold text-white truncate max-w-[200px]">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Countdown for upcoming events */}
            {!isPast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-8"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Event Starts In</p>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-[#00F2FF]/20" />
                    <div className="relative flex gap-6 md:gap-10 bg-[#0a0a0a] border border-white/10 rounded-2xl px-8 md:px-12 py-6">
                      <CountdownTimer date={event.date} time={event.time} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Main Image / Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          >
            {(isPast && event.gallery && event.gallery.length > 0) ? (
              <GallerySlideshow images={event.image ? [event.image, ...event.gallery] : event.gallery} />
            ) : event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F2FF]/10 via-[#0a0a0a] to-[#FF8C00]/10" />
            )}

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-12"
            >
              {/* About Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3 text-white">
                  <span className="h-1 w-8 bg-gradient-to-r from-[#00F2FF] to-[#FF8C00]" />
                  About This Event
                </h2>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
                  {event.description}
                </p>
              </section>

              {/* Gallery Section for past events */}
              {isPast && event.gallery && event.gallery.length > 0 && (
                <GallerySection images={event.gallery} />
              )}

              {/* Event Sections for past events */}
              {isPast && event.sections && (
                <>
                  {event.sections
                    .filter(s => s.type === "main" || s.type === "sub" || s.type === "winners")
                    .map((section, idx) => (
                      <GallerySection key={idx} images={section.images} title={section.title} />
                  ))}
                </>
              )}
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              {/* Action Card */}
              <div className="sticky top-24 rounded-3xl bg-gradient-to-b from-[#0d0d0d] to-[#080808] border border-white/10 p-6 md:p-8 shadow-xl">
                {isPast ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-wider text-white">Event Highlights</h3>
                    </div>

                    {event.category !== "workshop" && event.winners && event.winners.length > 0 ? (
                      <div>
                        <p className="text-white/60 mb-6">Congratulations to our winners!</p>
                        <ul className="space-y-4">
                          {event.winners.map((team, idx) => (
                            <WinnerTeamCard key={idx} team={team} index={idx} />
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-16 w-16 mx-auto mb-4 text-white/20" />
                        <p className="text-white/60">A fantastic event brought to you by GeekRoom JEMTEC!</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00F2FF]/20 border border-[#00F2FF]/30">
                        <Users className="h-6 w-6 text-[#00F2FF]" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-wider text-white">Register Now</h3>
                    </div>

                    <p className="text-white/60 mb-8">
                      Secure your spot! Limited seats available. Don&apos;t miss this opportunity to learn, network, and grow.
                    </p>

                    {event.registrationOpen === false ? (
                      <div className="text-center py-6 text-[#FF8C00] font-bold uppercase tracking-widest border border-[#FF8C00]/30 bg-[#FF8C00]/10 rounded-xl">
                        REGISTRATION CLOSED
                      </div>
                    ) : event.registrationLink ? (
                      <motion.a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#00F2FF] to-[#00F2FF]/80 px-6 py-4 font-black uppercase tracking-wider text-black text-lg transition-all hover:shadow-[0_0_40px_rgba(0,242,255,0.4)]"
                      >
                        <span>Register</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                        {/* Shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.a>
                    ) : (
                      <div className="text-center py-6 text-white/50">
                        Registration coming soon!
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-center gap-4 text-white/40">
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm">Share this event</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Media Archive Section */}
        {event.sections && event.sections.some(s => s.type === "media-archive") && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            {event.sections.filter(s => s.type === "media-archive").map((section, idx) => (
              <MediaArchive key={idx} images={section.images} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
