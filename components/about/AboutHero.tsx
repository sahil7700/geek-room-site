"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// ── Font setup ────────────────────────────────────────────────────────────────
// Comfortaa Light → Google Fonts (add to layout.tsx <head>):
//   <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet" />
//
// Akira Expanded → self-host (drop AkiraExpanded-SuperBold.woff2 in /public/fonts/):
//   @font-face {
//     font-family: 'Akira Expanded';
//     src: url('/fonts/AkiraExpanded-SuperBold.woff2') format('woff2');
//     font-weight: 800; font-style: normal;
//   }
// ─────────────────────────────────────────────────────────────────────────────

// ── COLOUR TOKENS ─────────────────────────────────────────────────────────────
//  60 % → #050505 / #0a0a0a   black backgrounds
//  30 % → #4F9EFF             electric blue (Event-Management blue)
//  10 % → #FF8C00 / #E85A2A   orange accents
//  Text → #FFFFFF / #ededed
// ─────────────────────────────────────────────────────────────────────────────

export function AboutHero({ membersCount, eventsCount }: { membersCount?: number; eventsCount?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-line", { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, stagger: 0.12, duration: 0.9,
        ease: "power4.out", delay: 0.2,
      });
      gsap.fromTo(".hero-sub", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.7,
      });
      gsap.to(".logo-core", {
        filter: "drop-shadow(0 0 28px #4F9EFF) drop-shadow(0 0 56px #4F9EFF33)",
        duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(".orbit-wrapper-blue", {
        rotation: 360, duration: 12, repeat: -1,
        ease: "none", transformOrigin: "0px 0px",
      });
      gsap.to(".orbit-wrapper-orange", {
        rotation: -360, duration: 20, repeat: -1,
        ease: "none", transformOrigin: "0px 0px",
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const SIZE = 400;
  const OUTER_R = (SIZE - 20) / 2;
  const INNER_R = (SIZE - 140) / 2;

  return (
    <section ref={container} className="relative min-h-screen flex items-center px-6 max-w-7xl mx-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20 pb-10">

        {/* ── LEFT: Text ── */}
        <div className="flex flex-col justify-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4F9EFF]/25 bg-[#4F9EFF]/5 text-[#4F9EFF] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300, fontSize: "10px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9EFF] animate-pulse" />
              System Identity — Online
            </span>
          </motion.div>

          {/* Heading — Akira Expanded */}
          <h1 className="tracking-tighter leading-[0.9] mb-6" style={{ fontFamily: "'Akira Expanded', sans-serif" }}>
            <span className="hero-line block text-[clamp(2.5rem,8vw,6rem)] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              WE ARE
            </span>
            <span
              className="hero-line block text-[clamp(2.5rem,8vw,6rem)] text-[#4F9EFF]"
              style={{ textShadow: "0 0 40px rgba(79,158,255,0.4)" }}
            >
              GEEKROOM
            </span>
          </h1>

          {/* Description — Comfortaa Light */}
          <p
            className="hero-sub text-[#ededed]/50 text-base leading-relaxed max-w-sm mb-8"
            style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300 }}
          >
            The official tech society of JIMS EMTC — where innovation meets code.
          </p>

          {/* Stats */}
          <div className="hero-sub flex items-center gap-8">
            {[
              { val: membersCount != null ? `${membersCount}+` : "200+", lbl: "Members" },
              { val: eventsCount != null ? `${eventsCount}+` : "50+", lbl: "Events" },
              { val: "5+", lbl: "Years" },
            ].map((s) => (
              <div key={s.lbl} className="flex flex-col">
                <span className="text-2xl text-[#4F9EFF]" style={{ fontFamily: "'Akira Expanded', sans-serif" }}>
                  {s.val}
                </span>
                <span
                  className="text-[10px] text-white/25 tracking-widest uppercase"
                  style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300 }}
                >
                  {s.lbl}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <motion.div
            className="mt-14 flex items-center gap-3"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-8 h-px bg-gradient-to-r from-[#4F9EFF]/60 to-transparent" />
            <span
              className="text-[10px] text-white/20 tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300 }}
            >
              Scroll to explore
            </span>
          </motion.div>
        </div>

        {/* ── RIGHT: Logo widget ── */}
        <div className="flex items-center justify-center">
          <div className="relative transform scale-[0.7] sm:scale-90 md:scale-100 origin-center" style={{ width: SIZE, height: SIZE }}>

            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(#4F9EFF 1px, transparent 1px), linear-gradient(90deg, #4F9EFF 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Orbit rings */}
            <div className="absolute rounded-full border border-[#4F9EFF]/20" style={{ inset: 10 }} />
            <div className="absolute rounded-full border border-dashed border-[#4F9EFF]/25" style={{ inset: 70 }} />

            {/* Blue orbiting dot */}
            <div className="orbit-wrapper-blue absolute" style={{ left: "50%", top: "50%" }}>
              <div
                className="absolute rounded-full bg-[#4F9EFF]"
                style={{
                  width: 12, height: 12, top: -OUTER_R - 6, left: -6,
                  boxShadow: "0 0 14px #4F9EFF, 0 0 28px #4F9EFF66"
                }}
              />
            </div>

            {/* Orange orbiting dot */}
            <div className="orbit-wrapper-orange absolute" style={{ left: "50%", top: "50%" }}>
              <div
                className="absolute rounded-full bg-[#FF8C00]"
                style={{
                  width: 12, height: 12, top: -INNER_R - 6, left: -6,
                  boxShadow: "0 0 14px #FF8C00, 0 0 28px #FF8C0066"
                }}
              />
            </div>

            {/* Corner labels — Comfortaa Light */}
            <span className="absolute top-5 left-5 text-[#4F9EFF]/35 tracking-widest select-none"
              style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300, fontSize: "10px" }}>
              v2.11.26
            </span>
            <span className="absolute top-5 right-5 text-[#4F9EFF]/35 tracking-widest select-none flex items-center gap-1.5"
              style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300, fontSize: "10px" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9EFF]" style={{ boxShadow: "0 0 6px #4F9EFF" }} />
              @geekroom
            </span>
            <span className="absolute bottom-5 right-5 text-[#4F9EFF]/25 tracking-widest select-none"
              style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 300, fontSize: "10px" }}>
              www.geekroom.in
            </span>

            {/* SVG logo */}
            <div className="logo-core absolute inset-0 flex items-center justify-center">
              <svg width="180" height="112" viewBox="0 0 180 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M58 12 L14 56 L58 100" stroke="#4F9EFF" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M122 12 L166 56 L122 100" stroke="#4F9EFF" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="103" y1="6" x2="79" y2="106" stroke="#FF8C00" strokeWidth="14" strokeLinecap="round" />
                <circle cx="52" cy="56" r="9" fill="white" />
                <circle cx="128" cy="56" r="9" fill="white" />
              </svg>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}