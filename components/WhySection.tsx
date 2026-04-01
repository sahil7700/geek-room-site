"use client";

import { motion, Variants } from "framer-motion";
import { Hammer, Zap, Users } from "lucide-react";

const PILLARS = [
  {
    icon: Hammer,
    number: "01",
    title: "Build Real Things",
    body:
      "We don't just study tech — we ship it. From personal projects to team hackathons, building is how we learn.",
  },
  {
    icon: Zap,
    number: "02",
    title: "Learn by Doing",
    body:
      "Workshops, competitive events, and live challenges replace passive learning with active execution.",
  },
  {
    icon: Users,
    number: "03",
    title: "Grow Together",
    body:
      "Mentorship, collaboration, and peer leadership develop skills that no classroom can replicate.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function WhySection() {
  return (
    <section
      id="why-geekroom"
      className="relative py-32 overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Subtle section divider at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.07) 60%, transparent)" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,242,255,0.04) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Label */}
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
            style={{ color: "#4F9EFF", fontFamily: "'Inter', sans-serif" }}
          >
            Why Geek Room
          </span>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — Headline block */}
          <div className="lg:sticky lg:top-32">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 leading-[1.08]"
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 5vw, 3.75rem)",
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}
            >
              Not just a club.
              <br />
              <span style={{ color: "rgba(255,255,255,0.45)" }}>A launchpad.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="leading-relaxed max-w-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 400,
              }}
            >
              Geek Room is where JIMS EMTC students with ambition find their people, sharpen their
              craft, and build things they&apos;re proud of.
            </motion.p>

            {/* Decorative quote line */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 pl-5"
              style={{ borderLeft: "2px solid #4F9EFF" }}
            >
              <p
                className="italic leading-snug"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                }}
              >
                &quot;The best way to learn tech is to build something that matters.&quot;
              </p>
            </motion.div>
          </div>

          {/* Right — Pillars */}
          <div className="flex flex-col gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="group relative p-7 rounded-2xl transition-all duration-300 cursor-default"
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.18)";
                  (e.currentTarget as HTMLElement).style.background = "#111111";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.background = "#0A0A0A";
                }}
              >
                <div className="flex items-start gap-5">
                  {/* Number + Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(0,242,255,0.08)", border: "1px solid rgba(0,242,255,0.14)" }}
                    >
                      <pillar.icon className="w-4.5 h-4.5" style={{ color: "#4F9EFF", width: 18, height: 18 }} />
                    </div>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "rgba(0,242,255,0.35)" }}
                    >
                      {pillar.number}
                    </span>
                  </div>

                  {/* Text */}
                  <div>
                    <h3
                      className="mb-2 leading-snug"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.1875rem",
                        color: "#ededed",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9375rem",
                        color: "rgba(255,255,255,0.48)",
                        lineHeight: 1.65,
                        fontWeight: 400,
                      }}
                    >
                      {pillar.body}
                    </p>
                  </div>
                </div>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-7 right-7 h-px transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(90deg, #4F9EFF, transparent)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
