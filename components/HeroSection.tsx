"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Users, Calendar, MapPin } from "lucide-react";
import { AsciiVisual } from "@/components/AsciiVisual";

const SupportRobotCanvas = dynamic(
  () => import("@/components/SupportRobotCanvas").then((mod) => mod.SupportRobotCanvas),
  { ssr: false, loading: () => null }
);

export function HeroSection({ eventsCount, membersCount }: { eventsCount?: number; membersCount?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const METRICS = [
    { icon: Calendar, value: eventsCount != null ? `${eventsCount}+` : "6+", label: "Signature Events" },
    { icon: Users, value: membersCount != null ? `${membersCount}+` : "100+", label: "Active Members" },
    { icon: MapPin, value: "JIMS EMTC", label: "Campus, Greater Noida" },
  ];

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#050505]"
      style={{ paddingTop: "80px" }}
    >
      {/* Ambient background — subtle orbs, no hard grids */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(0,242,255,0.06) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(255,140,0,0.04) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Subtle ambient moving orb */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(0,242,255,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* Floating Robot Ticket CTA */}
      <motion.div
        className="fixed right-6 bottom-6 md:right-10 md:bottom-10 z-[100] flex flex-col items-center cursor-pointer hidden sm:flex"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1200 }}
      >
        <Link href="/support" className="flex flex-col items-center group">
          {/* Speech Bubble */}
          <motion.div 
            className="relative mb-4 px-4 py-2 bg-[#4F9EFF]/10 border border-[#4F9EFF]/50 backdrop-blur-xl rounded-2xl opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 shadow-[0_4px_25px_rgba(79,158,255,0.25)]"
            animate={{ rotateZ: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[11px] font-bold text-[#4F9EFF] tracking-widest font-mono uppercase drop-shadow-[0_0_8px_rgba(79,158,255,0.8)]">
              Raise a Ticket
            </span>
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-2xl bg-[#4F9EFF] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
            {/* Triangle tail */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[10px] border-t-[#4F9EFF]/40 border-r-[8px] border-r-transparent"></div>
          </motion.div>
          
          {/* Robot WebGL Canvas */}
          <motion.div 
            className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 relative transition-all duration-500"
            animate={{ 
              rotateY: [-15, 15, -15],
              rotateX: [8, -8, 8],
              rotateZ: [-3, 3, -3]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <SupportRobotCanvas className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(79,158,255,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_40px_rgba(184,41,247,0.7)]" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24"
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Copy */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 mb-8"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#4F9EFF", boxShadow: "0 0 8px rgba(0,242,255,0.6)" }}
              />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase"
                style={{ color: "#4F9EFF", fontFamily: "var(--font-inter), sans-serif" }}
              >
                GEEKROOM — JIMS EMTC
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 leading-[1.05]"
              style={{
                fontFamily: "var(--font-syne), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 7vw, 5rem)",
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}
            >
              Where students{" "}
              <em
                style={{
                  fontStyle: "normal",
                  color: "#4F9EFF",
                }}
              >
                build,
              </em>
              <br />
              compete, and{" "}
              <em
                style={{
                  fontStyle: "normal",
                  color: "#4F9EFF",
                }}
              >
                grow
              </em>{" "}
              in tech.
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 max-w-md leading-relaxed"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1.0625rem",
                color: "rgba(255,255,255,0.6)",
                fontWeight: 400,
              }}
            >
              Geek Room is a builder-led student tech community at JIMS EMTC. We run hackathons,
              workshops, and events that turn curiosity into real-world skills.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-16"
            >
              <Link
                id="hero-cta-primary"
                href="/join"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300"
                style={{
                  backgroundColor: "#4F9EFF",
                  color: "#050505",
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#33F5FF";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,242,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#4F9EFF";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Join the Community
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                id="hero-cta-secondary"
                href="/events"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-medium text-sm transition-all duration-300"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#ededed";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,242,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                Explore Events
              </Link>
            </motion.div>

            {/* Proof Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap gap-8"
            >
              {METRICS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,242,255,0.07)", border: "1px solid rgba(0,242,255,0.12)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#4F9EFF" }} />
                  </div>
                  <div>
                    <div
                      className="font-bold leading-none"
                      style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.125rem", color: "#ededed" }}
                    >
                      {value}
                    </div>
                    <div
                      className="text-xs leading-snug mt-0.5"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Abstract Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <AsciiVisual />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="w-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.4)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

