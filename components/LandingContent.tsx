"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function LandingContent() {
  return (
    <div className="relative z-20 bg-[#050505] text-[#ededed]">
      {/* Decorative Top Border to separate canvas area */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F2FF]/50 to-transparent" />
      
      {/* SECTION 1: ABOUT / THE MISSION */}
      <section className="relative py-32 px-6 lg:px-24 mx-auto max-w-7xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00F2FF]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-sm font-mono tracking-widest text-[#FF8C00] mb-4 uppercase">
              // Core Precept 01
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
              A NEXUS FOR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] to-[#00A3FF]">
                DIGITAL ARCHITECTS
              </span>
            </h3>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Geekroom isn't just a tech society. It's an incubator for high-performance 
              developers, designers, and systems thinkers. We bridge the gap between 
              theoretical computer science and production-grade engineering.
            </p>
            <div className="flex gap-4">
              <div className="border border-white/10 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#00F2FF] mb-1">500+</div>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Active Nodes</div>
              </div>
              <div className="border border-white/10 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#FF8C00] mb-1">50+</div>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Deployments</div>
              </div>
            </div>
          </motion.div>

          {/* Abstract visualizer card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-[400px] rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden group"
          >
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Animated gradient orbs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00F2FF]/20 blur-[80px] rounded-full group-hover:bg-[#00F2FF]/30 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FF8C00]/20 blur-[80px] rounded-full group-hover:bg-[#FF8C00]/30 transition-colors duration-700" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border border-white/5 m-4 rounded-xl backdrop-blur-md">
              <div className="w-16 h-16 border border-[#00F2FF]/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                <div className="w-8 h-8 bg-[#00F2FF] rounded-full animate-pulse" />
              </div>
              <h4 className="text-xl font-bold mb-2">System Active</h4>
              <p className="font-mono text-xs text-gray-500">Awaiting runtime instructions...</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: FEATURES/DOMAINS */}
      <section className="relative py-24 bg-[#0A0A0A] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-24">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4"
            >
              OPERATIONAL DOMAINS
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 font-mono text-sm max-w-2xl mx-auto"
            >
              We operate across the entire modern stack. From low-level systems 
              to high-fidelity frontend rendering engines.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Frontend Engineering",
                desc: "React, Next.js, Framer Motion, Three.js, and modern CSS architecture.",
                color: "from-[#00F2FF]/20 to-transparent",
                border: "group-hover:border-[#00F2FF]/50"
              },
              {
                title: "Backend & Systems",
                desc: "Node.js, Go, Rust, microservices architecture, and scalable databases.",
                color: "from-[#FF8C00]/20 to-transparent",
                border: "group-hover:border-[#FF8C00]/50"
              },
              {
                title: "AI & Machine Learning",
                desc: "Neural networks, LLM integrations, PyTorch, and data pipelines.",
                color: "from-[#B026FF]/20 to-transparent",
                border: "group-hover:border-[#B026FF]/50"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`group relative p-8 rounded-2xl border border-white/5 bg-[#050505] overflow-hidden transition-all duration-300 ${feature.border}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full`} />
                
                <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">
                  {feature.desc}
                </p>
                
                <div className="mt-8 relative z-10 flex items-center text-xs font-mono text-gray-600 group-hover:text-white transition-colors cursor-pointer">
                  EXPLORE MODULE <span className="ml-2">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[800px] h-[800px] border border-[#00F2FF]/30 rounded-full" />
          <div className="absolute w-[600px] h-[600px] border border-[#FF8C00]/30 rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-4xl text-center px-6"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            READY TO INITIALIZE?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Join a network of passionate builders. Access mentorship, build open-source 
            software, and elevate your engineering capabilities.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold tracking-wide rounded-full hover:scale-105 hover:bg-[#00F2FF] hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all duration-300"
          >
            START DEPLOYMENT
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
