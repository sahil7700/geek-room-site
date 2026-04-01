"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Zap, Network, Globe } from "lucide-react";

export function SystemInterface() {
  const [text, setText] = useState("> ");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    "> Building projects...",
    "> Running hackathons...",
    "> Shipping ideas...",
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && text === "> ") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setText(
          currentPhrase.substring(
            0,
            text.length + (isDeleting ? -1 : 1)
          )
        );
        if (isDeleting && text.length <= 2) {
            setText("> ");
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases]);

  const panels = [
    { title: "BUILD", icon: <Terminal className="w-6 h-6" />, desc: "Shipping real-world projects" },
    { title: "INNOVATE", icon: <Zap className="w-6 h-6" />, desc: "Hackathons & experiments" },
    { title: "CONNECT", icon: <Network className="w-6 h-6" />, desc: "Community of devs" },
    { title: "IMPACT", icon: <Globe className="w-6 h-6" />, desc: "Real-world solutions" },
  ];

  return (
    <section className="relative w-full py-24 min-h-screen flex items-center bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.08)_0%,transparent_60%)] rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between">
          <div className="flex-1 w-full max-w-xl flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F2FF] to-white tracking-wider mb-4 drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                SYSTEM: GEEK ROOM
              </h2>
              <p className="font-mono text-sm md:text-base text-gray-400 uppercase tracking-widest border-l-2 border-[#00F2FF] pl-4 py-1">
                Initializing builders, hackers, and creators...
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,242,255,0.1)] relative group">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto text-[10px] font-mono text-gray-500 uppercase tracking-widest">root@geekroom:~</div>
              </div>
              <div className="p-6 h-40 font-mono text-sm sm:text-base text-[#00F2FF] flex flex-col">
                <div className="text-gray-500 mb-2">Connected to secure server. Starting sequence.</div>
                <div className="flex items-center">
                  <span>{text}</span>
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2.5 h-5 bg-[#00F2FF] ml-1 inline-block" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 perspective-[1000px]">
            {panels.map((panel, idx) => (
              <motion.div key={panel.title} initial={{ opacity: 0, y: 30, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + (idx * 0.1), duration: 0.6, type: "spring", stiffness: 100 }} whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02, zIndex: 10 }} className="group relative h-40 sm:h-48 p-6 flex flex-col justify-between rounded-2xl bg-[#0A0A0A]/50 backdrop-blur-md border border-white/5 overflow-hidden transition-all duration-300 hover:border-[#00F2FF]/40 hover:shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:bg-[#0A0A0A]/80">
                <div className="flex justify-between items-start z-10">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#00F2FF]/10 group-hover:border-[#00F2FF]/30 group-hover:text-[#00F2FF] text-gray-400 transition-all duration-300">
                    {panel.icon}
                  </div>
                  <div className="text-[10px] font-mono text-gray-600 group-hover:text-[#00F2FF]/50 transition-colors">[{idx + 1}]</div>
                </div>
                <div className="z-10 mt-4">
                  <h3 className="text-xl font-bold font-mono tracking-wider text-white group-hover:text-[#00F2FF] transition-colors duration-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{panel.title}</h3>
                  <p className="text-sm font-mono text-gray-400 mt-2 group-hover:text-gray-300 transition-colors opacity-80 group-hover:opacity-100">{panel.desc}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#00F2FF]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 transform origin-left" />
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(0,242,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
