"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const timeline = [
  { year: "2019", title: "System Boot",     desc: "Founded at JIMS EMTC." },
  { year: "2021", title: "First Hackathon", desc: "100+ builders, zero sleep." },
  { year: "2023", title: "Scale‑Up",        desc: "150+ members. First OSS project." },
  { year: "2025", title: "Still Evolving",  desc: "200+ members. 50+ events." },
];

export function AboutStory() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".bento-card", { opacity: 0, y: 40, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%", toggleActions: "play none none reverse" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-24 z-10 max-w-6xl mx-auto px-6">

      <span className="text-[#00F2FF] font-mono text-xs tracking-[0.3em] uppercase flex items-center gap-4 mb-10">
        <span className="w-8 h-px bg-[#00F2FF]" />
        About the System
      </span>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-auto gap-3">

        {/* 1 — Big mission statement (2×2) */}
        <div className="bento-card col-span-2 row-span-2 relative rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] p-8 flex flex-col justify-between min-h-[260px] group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F2FF]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#00F2FF]/60 via-[#00F2FF]/20 to-transparent" />
          <span className="font-mono text-[10px] text-[#00F2FF]/50 tracking-widest uppercase">01 // Mission</span>
          <div>
            <p className="text-[#ededed] text-3xl md:text-4xl font-black tracking-tighter leading-tight">
              Architects of the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] to-[#FF8C00]">
                digital frontier.
              </span>
            </p>
            <p className="text-[#ededed]/35 text-sm mt-3 font-mono">
              Building what&apos;s next — one commit at a time.
            </p>
          </div>
        </div>

        {/* 2 — Stat: Members */}
        <div className="bento-card relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 flex flex-col justify-between group overflow-hidden">
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#00F2FF]/10 rounded-full blur-2xl" />
          <span className="font-mono text-[10px] text-[#ededed]/25 tracking-widest uppercase">Members</span>
          <div>
            <p className="text-5xl font-black text-[#00F2FF] leading-none">200<span className="text-2xl">+</span></p>
            <p className="text-[#ededed]/30 text-xs font-mono mt-1">active engineers</p>
          </div>
        </div>

        {/* 3 — Stat: Events */}
        <div className="bento-card relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 flex flex-col justify-between group overflow-hidden">
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#FF8C00]/10 rounded-full blur-2xl" />
          <span className="font-mono text-[10px] text-[#ededed]/25 tracking-widest uppercase">Events</span>
          <div>
            <p className="text-5xl font-black text-[#FF8C00] leading-none">50<span className="text-2xl">+</span></p>
            <p className="text-[#ededed]/30 text-xs font-mono mt-1">workshops & hacks</p>
          </div>
        </div>

        {/* 4 — Curiosity pill */}
        <div className="bento-card col-span-2 relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 flex items-center gap-5 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#FF8C00]/40 to-transparent" />
          <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FF8C00]/10 border border-[#FF8C00]/20 flex items-center justify-center text-lg">⚡</div>
          <div>
            <p className="text-[#ededed] font-bold text-lg tracking-tight">Driven by curiosity.</p>
            <p className="text-[#ededed]/35 text-xs font-mono">Fueled by logic. Powered by community.</p>
          </div>
        </div>

        {/* 5 — Timeline (2×2) */}
        <div className="bento-card col-span-2 row-span-2 relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-7 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF8C00]/30 to-transparent" />
          <span className="font-mono text-[10px] text-[#FF8C00]/60 tracking-widest uppercase mb-6 block">
            02 // System History
          </span>
          <div className="relative space-y-5">
            {/* Track */}
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[#00F2FF]/40 via-[#FF8C00]/40 to-transparent" />
            {timeline.map((t, i) => (
              <div key={i} className="pl-6 relative group/tl">
                <div
                  className="absolute left-0 top-[6px] w-2.5 h-2.5 rounded-full border-2 border-[#050505]"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#00F2FF" : "#FF8C00",
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "#00F2FF" : "#FF8C00"}`,
                  }}
                />
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-mono text-[10px] tracking-widest" style={{ color: i % 2 === 0 ? "#00F2FF" : "#FF8C00" }}>{t.year}</span>
                  <span className="text-[#ededed] text-sm font-bold">{t.title}</span>
                </div>
                <p className="text-[#ededed]/35 text-xs font-mono leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6 — Open Source tag */}
        <div className="bento-card relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 flex flex-col justify-between group overflow-hidden">
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#00F2FF]/8 rounded-full blur-xl" />
          <span className="font-mono text-[10px] text-[#ededed]/25 tracking-widest uppercase">Projects</span>
          <div>
            <p className="text-5xl font-black text-[#ededed] leading-none">30<span className="text-2xl text-[#00F2FF]">+</span></p>
            <p className="text-[#ededed]/30 text-xs font-mono mt-1">shipped to prod</p>
          </div>
        </div>

        {/* 7 — Status pill */}
        <div className="bento-card relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 flex flex-col justify-between overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#FF8C00]/8 rounded-full blur-xl" />
          <span className="font-mono text-[10px] text-[#ededed]/25 tracking-widest uppercase">Status</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#28C840] animate-pulse" />
            <span className="font-mono text-sm text-[#28C840] font-bold tracking-wider">ONLINE</span>
          </div>
        </div>

      </div>
    </section>
  );
}
