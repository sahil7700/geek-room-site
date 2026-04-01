"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Github, Linkedin, ArrowRight } from "lucide-react";
import { TeamMember } from "@/app/actions/teamActions";

export function TeamPreview({ members }: { members: TeamMember[] }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const displayMembers = members.slice(0, 12);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMember(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      id="core-team"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
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
                style={{ color: "#4F9EFF", fontFamily: "'Inter', sans-serif" }}
              >
                Core Team
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="leading-[1.05]"
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}
            >
              The people behind it.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#4F9EFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              View full team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Team Grid */}
        {displayMembers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayMembers.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                index={i}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.9rem",
              }}
            >
              Team information coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function MemberCard({
  member,
  index,
  onClick,
}: {
  member: TeamMember;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group text-left w-full rounded-2xl p-4 transition-all duration-300"
      style={{
        background: "transparent",
        border: "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.borderColor = "transparent";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Avatar */}
      <div
        className="w-full aspect-square rounded-xl overflow-hidden mb-3"
        style={{ background: "#111111" }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            style={{ filter: "grayscale(20%)" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.75rem",
              color: "rgba(0,242,255,0.3)",
            }}
          >
            {member.name[0]}
          </div>
        )}
      </div>

      {/* Name + Role */}
      <div>
        <h3
          className="leading-snug truncate"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#ededed",
            letterSpacing: "-0.01em",
          }}
        >
          {member.name}
        </h3>
        <p
          className="mt-0.5 truncate"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.38)",
          }}
        >
          {member.role || "Core Member"}
        </p>
      </div>
    </motion.button>
  );
}

function MemberModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(5,5,5,0.88)", backdropFilter: "blur(16px)" }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "#0A0A0A",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg transition-all duration-200"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.color = "#ededed";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden"
              style={{ background: "#111111" }}
            >
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "rgba(0,242,255,0.3)",
                  }}
                >
                  {member.name[0]}
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="flex gap-2 mt-3">
              <a
                href="#"
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#ededed";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#ededed";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,242,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-4 text-xs font-medium"
              style={{
                background: "rgba(0,242,255,0.07)",
                border: "1px solid rgba(0,242,255,0.14)",
                color: "#4F9EFF",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Core Member
            </div>

            <h2
              className="leading-tight mb-1"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "1.75rem",
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}
            >
              {member.name}
            </h2>
            <p
              className="mb-5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {member.role || "Core Developer"}
            </p>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.65,
              }}
            >
              A builder and contributor within the Geek Room community at JIMS EMTC — working
              on projects, events, and helping grow the tech culture on campus.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
