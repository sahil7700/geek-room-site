"use client";

import { motion } from "framer-motion";

const PRINCIPLES = [
  {
    number: "01",
    statement: "We build in public.",
    detail:
      "Projects over perfection. We ship, iterate, and share — because real learning happens when you put work out into the world.",
  },
  {
    number: "02",
    statement: "Everyone teaches, everyone learns.",
    detail:
      "There is no hierarchy of knowledge here. A first-year with a solid project earns the same respect as a senior with experience.",
  },
  {
    number: "03",
    statement: "Leadership is earned by doing.",
    detail:
      "The people who step up, organise events, and drive projects become the backbone of Geek Room — no titles required.",
  },
];

export function CultureSection() {
  return (
    <section
      id="culture"
      className="relative py-32 overflow-hidden"
      style={{ background: "#0A0A0A" }}
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
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(0,242,255,0.04) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section label */}
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
            Culture
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 leading-[1.05]"
          style={{
            fontFamily: "var(--font-syne), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            color: "#ededed",
            letterSpacing: "-0.02em",
            maxWidth: "700px",
          }}
        >
          Built by students.{" "}
          <span style={{ color: "rgba(255,255,255,0.35)" }}>Driven by ambition.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-20 max-w-lg leading-relaxed"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 400,
          }}
        >
          Geek Room is not just a place to attend events. It is a high-performing student
          movement — a community where builders and organisers grow into their potential.
        </motion.p>

        {/* Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 lg:p-10 group transition-all duration-300"
              style={{ background: "#0A0A0A" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#111111";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#0A0A0A";
              }}
            >
              {/* Number */}
              <div
                className="mb-6 font-mono text-xs"
                style={{ color: "rgba(0,242,255,0.3)" }}
              >
                {p.number}
              </div>

              {/* Lime accent line */}
              <div
                className="mb-6 h-px w-12 transition-all duration-500 group-hover:w-20"
                style={{ backgroundColor: "#4F9EFF" }}
              />

              {/* Statement */}
              <h3
                className="mb-4 leading-[1.2]"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#ededed",
                  letterSpacing: "-0.01em",
                }}
              >
                {p.statement}
              </h3>

              {/* Detail */}
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.9375rem",
                  color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}
              >
                {p.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
