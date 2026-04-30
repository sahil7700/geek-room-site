"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { EventItem } from "@/app/actions/eventActions";

const SIGNATURE_IDS = ["hackquanta", "geek-veek-2", "blockgen"];

function getSignatureEvents(events: EventItem[]): EventItem[] {
  const ordered: EventItem[] = [];
  for (const id of SIGNATURE_IDS) {
    const found = events.find((e) => e.id === id);
    if (found) ordered.push(found);
  }
  // Fill remaining spots from other events if needed
  const extras = events.filter((e) => !SIGNATURE_IDS.includes(e.id || ""));
  return [...ordered, ...extras].slice(0, 3);
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  hackathon: "Hackathon",
  "tech-event": "Tech Event",
  workshop: "Workshop",
  competition: "Competition",
};

export function EventsPreview({ events }: { events: EventItem[] }) {
  const displayEvents = getSignatureEvents(events);

  return (
    <section
      id="signature-events"
      className="relative py-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.07) 60%, transparent)",
        }}
      />

      {/* Ambient */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(0,242,255,0.04) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8" style={{ backgroundColor: "#4F9EFF" }} />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase"
                style={{ color: "#4F9EFF", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Signature Events
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="leading-[1.05]"
              style={{
                fontFamily: "var(--font-syne), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}
            >
              Events that define us.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#4F9EFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              See all events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Event Cards Grid */}
        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, i) => (
              <EventCard key={event.id || event.title} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.9rem",
              }}
            >
              No events available yet. Check back soon.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Link
            id="events-cta"
            href="/events"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-sm transition-all duration-300"
            style={{
              border: "1.5px solid rgba(0,242,255,0.25)",
              color: "#4F9EFF",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#4F9EFF";
              (e.currentTarget as HTMLElement).style.color = "#050505";
              (e.currentTarget as HTMLElement).style.borderColor = "#4F9EFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#4F9EFF";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.25)";
            }}
          >
            Explore All Events
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  const imageSrc =
    event.image ||
    (event.gallery && event.gallery.length > 0 ? event.gallery[0] : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/events/${event.id || event.title}`}
        className="group block rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "#0A0A0A",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.15)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,242,255,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#111111]">
          {imageSrc ? (
            <>
              <Image
                src={imageSrc}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ opacity: 0.85 }}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 40%, rgba(22,22,28,0.85) 100%)",
                }}
              />
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "rgba(0,242,255,0.04)" }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: "rgba(0,242,255,0.2)",
                }}
              >
                GR
              </span>
            </div>
          )}

          {/* Category badge */}
          {event.category && (
            <div className="absolute top-4 left-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "rgba(5,5,5,0.85)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-inter), sans-serif",
                  backdropFilter: "blur(8px)",
                }}
              >
                {CATEGORY_LABELS[event.category] || event.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            className="mb-3 leading-snug transition-colors duration-200"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "1.1875rem",
              color: "#ededed",
              letterSpacing: "-0.01em",
            }}
          >
            {event.title}
          </h3>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-4">
            {event.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(0,242,255,0.6)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {formatDate(event.date)}
                </span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: "rgba(255,140,0,0.6)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {event.location}
                </span>
              </div>
            )}
          </div>

          {/* Short description */}
          <p
            className="line-clamp-2 leading-relaxed"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.38)",
              fontWeight: 400,
            }}
          >
            {event.description}
          </p>

          {/* Arrow link */}
          <div
            className="mt-5 flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
            style={{ color: "rgba(0,242,255,0.5)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            View event
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
