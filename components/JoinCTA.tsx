"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function JoinCTA() {
  return (
    <section
      id="join-cta"
      className="relative py-36 overflow-hidden"
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

      {/* Large ambient glow — centred */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,242,255,0.055) 0%, transparent 70%)",
        }}
      />

      {/* Decorative large text behind */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(8rem, 22vw, 18rem)",
            color: "rgba(0,242,255,0.028)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          BUILD
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 mb-8"
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "#4F9EFF",
              boxShadow: "0 0 8px rgba(0,242,255,0.6)",
            }}
          />
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: "#4F9EFF", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Join Geek Room
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 leading-[1.05]"
          style={{
            fontFamily: "var(--font-syne), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
            color: "#ededed",
            letterSpacing: "-0.025em",
          }}
        >
          Ready to build
          <br />
          something{" "}
          <span style={{ color: "#4F9EFF" }}>real?</span>
        </motion.h2>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 mx-auto max-w-xl leading-relaxed"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "1.0625rem",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 400,
          }}
        >
          Join Geek Room — where students launch projects, win hackathons, and grow as
          technologists. No experience required; only the drive to build.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            id="join-primary-cta"
            href="/join"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300"
            style={{
              backgroundColor: "#4F9EFF",
              color: "#050505",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#33F5FF";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 12px 40px rgba(0,242,255,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#4F9EFF";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Apply Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            id="join-secondary-cta"
            href="/events"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-medium text-sm transition-all duration-300"
            style={{
              border: "1.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.35)";
              (e.currentTarget as HTMLElement).style.color = "#ededed";
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,242,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            Explore Events
          </Link>
        </motion.div>

        {/* Fine-print note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          Open to all JIMS EMTC students · Free to join
        </motion.p>
      </div>
    </section>
  );
}
