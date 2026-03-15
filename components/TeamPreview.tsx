"use client";

import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import Link from "next/link";
import { Cpu } from "lucide-react";
import { useState } from "react";
import { TeamMember } from "@/app/actions/teamActions";

export function TeamPreview({ members }: { members: TeamMember[] }) {
  const [hoveredNode, setHoveredNode] = useState<number | string | null>(null);
  const [centerHovered, setCenterHovered] = useState(false);

  const getRoleColor = (role: string = "") => {
    const r = role.toLowerCase();
    if (r.includes("president") || r.includes("lead")) return "#00F2FF";
    if (r.includes("tech") || r.includes("dev")) return "#00FF66";
    if (r.includes("design") || r.includes("creative")) return "#B026FF";
    return "#FF8C00";
  };

  // Adjust radius for the circular layout
  const radius = 280;

  // Add Framer motion hooks
  const baseAngle = useMotionValue(0);
  const isPaused = hoveredNode !== null || centerHovered;

  // 360 degrees / 15 seconds = 24 degrees / second = 0.024 / ms
  useAnimationFrame((time, delta) => {
    if (!isPaused) {
      baseAngle.set((baseAngle.get() + delta * 0.024) % 360);
    }
  });

  // Sort members so President is always at the top
  const sortedMembers = [...members].sort((a, b) => {
    if ((a.role || "").toLowerCase() === "president") return -1;
    if ((b.role || "").toLowerCase() === "president") return 1;
    return 0;
  });

  return (
    <section id="team-preview" className="relative pt-48 pb-32 bg-[#050505] min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
      {/* Dynamic Background glow */}
      <motion.div 
        animate={{ 
          opacity: centerHovered ? 0.3 : 0.15,
          scale: centerHovered ? 1.2 : 1
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,242,255,0.15)_0%,transparent_60%)] pointer-events-none"
      />

      <div className="absolute top-[8%] left-0 w-full text-center z-20 pointer-events-none">
        <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-wider mix-blend-overlay opacity-20" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          The Architects
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[500px] md:min-h-[700px]">
        {/* DESKTOP VIEW - Orbital Layout */}
        <div className="hidden md:flex relative w-full h-[600px] max-w-[800px] items-center justify-center perspective-[1000px]">
          
          
          {/* SVG Connection Lines & Nodes Rotating Wrapper */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-[800px] h-[600px] pointer-events-none z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ overflow: "visible" }}>
              {sortedMembers.map((member, i) => (
                <OrbitLine
                  key={`line-${member.id}`}
                  member={member}
                  index={i}
                  total={sortedMembers.length}
                  radius={radius}
                  baseAngle={baseAngle}
                  hoveredNode={hoveredNode}
                  centerHovered={centerHovered}
                  getRoleColor={getRoleColor}
                />
              ))}
            </svg>

            {/* Member Nodes */}
            {sortedMembers.map((member, i) => (
              <OrbitNode
                key={member.id}
                member={member}
                index={i}
                total={sortedMembers.length}
                radius={radius}
                baseAngle={baseAngle}
                hoveredNode={hoveredNode}
                setHoveredNode={setHoveredNode}
                centerHovered={centerHovered}
                getRoleColor={getRoleColor}
              />
            ))}
          </div>

          {/* Central Node */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            onMouseEnter={() => setCenterHovered(true)}
            onMouseLeave={() => setCenterHovered(false)}
            className="absolute z-50 flex flex-col items-center justify-center w-48 h-48 rounded-full bg-black/40 backdrop-blur-md border duration-500 overflow-visible group cursor-default"
            style={{ 
              borderColor: centerHovered ? '#00F2FF' : 'rgba(255,255,255,0.1)',
              boxShadow: centerHovered ? '0 0 50px rgba(0,242,255,0.4), inset 0 0 20px rgba(0,242,255,0.2)' : '0 0 20px rgba(0,0,0,0.5)',
              scale: centerHovered ? 1.05 : 1
            }}
          >
            {/* Rotating Glow Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-dashed border-[#00F2FF]/30 pointer-events-none"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,242,255,0.5))' }}
            />
            {/* Inner pulsing ring */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-[#00F2FF]/20 bg-[#00F2FF]/5 pointer-events-none"
            />

            <div className="flex flex-col items-center justify-center text-center px-4 relative z-10 pointer-events-none">
              <Cpu className="w-10 h-10 text-[#00F2FF] mb-2" />
              <span className="font-mono font-bold text-sm tracking-widest text-[#00F2FF] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Geek Room<br/>Core</span>
            </div>
          </motion.div>
        </div>

        {/* MOBILE VIEW - Vertical Stacked Layout */}
        <div className="flex flex-col md:hidden w-full gap-4 relative z-40 mt-12 items-center">
          {sortedMembers.map((member, i) => {
             const color = getRoleColor(member.role || member.category);
             const isCenterNode = i === 1;

             return (
               <div key={`mob-${member.id}`} className="flex flex-col items-center">
                 {isCenterNode && (
                   <div className="my-6">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-50 flex flex-col items-center justify-center w-40 h-40 rounded-full bg-black/60 backdrop-blur-md border border-[#00F2FF]/40 shadow-[0_0_30px_rgba(0,242,255,0.2)]"
                      >
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                          className="absolute -inset-2 rounded-full border border-dashed border-[#00F2FF]/30 pointer-events-none"
                        />
                        <Cpu className="w-8 h-8 text-[#00F2FF] mb-2" />
                        <span className="font-mono font-bold text-xs tracking-widest text-[#00F2FF] uppercase">Geek Room<br/>Core</span>
                      </motion.div>
                      {/* Connection Line */}
                      <div className="w-px h-8 bg-gradient-to-b from-[#00F2FF]/50 to-transparent mx-auto mt-6" />
                   </div>
                 )}

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.05 }}
                   className="w-[280px] p-2 pr-4 rounded-full flex items-center gap-4 transition-all duration-300 backdrop-blur-md bg-[#0A0A0A]/80 border"
                   style={{ borderColor: `${color}40`, boxShadow: `0 4px 15px rgba(0,0,0,0.3)` }}
                 >
                   <div className="w-14 h-14 rounded-full border-2 overflow-hidden shrink-0 flex items-center justify-center" style={{ borderColor: color }}>
                     {member.photo ? (
                       <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-gray-800 flex items-center justify-center font-mono text-white text-xs">{member.name[0]}</div>
                     )}
                   </div>
                   <div className="flex flex-col text-left overflow-hidden">
                     <p className="text-base font-bold text-white truncate w-full">{member.name}</p>
                     <p className="text-[10px] font-mono uppercase tracking-widest truncate w-full mt-0.5" style={{ color: color }}>
                       {member.role || "Core Member"}
                     </p>
                   </div>
                 </motion.div>

                 {/* Connection Line below card, except after the central node block which provides its own */}
                 {!isCenterNode && i < sortedMembers.length - 1 && i !== 0 && (
                   <div className="w-px h-6 bg-gradient-to-b from-white/10 to-transparent mx-auto my-1" />
                 )}
                 {i === 0 && (
                   <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent mx-auto my-1" />
                 )}
               </div>
             )
          })}
        </div>
      </div>
      {/* Button placed properly below section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 relative z-30"
      >
        <Link href="/team" className="flex flex-col items-center gap-2 group/btn">
          <span className="font-mono text-sm uppercase tracking-widest font-bold text-white bg-[#00F2FF]/10 px-8 py-3 rounded-full border border-[#00F2FF]/50 transition-all duration-300 group-hover/btn:bg-[#00F2FF] group-hover/btn:text-black shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]">
            View Full Team
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

function OrbitLine({ member, index, total, radius, baseAngle, hoveredNode, centerHovered, getRoleColor }: any) {
  const angleOffset = (index * 360) / total - 90;
  const isHovered = hoveredNode === member.id;
  const color = getRoleColor(member.role || member.category);

  const endX = useTransform(baseAngle, (v: number) => 400 + Math.cos((v + angleOffset) * (Math.PI / 180)) * radius);
  const endY = useTransform(baseAngle, (v: number) => 300 + Math.sin((v + angleOffset) * (Math.PI / 180)) * radius);

  return (
    <motion.line
      x1="400"
      y1="300"
      x2={endX}
      y2={endY}
      stroke={isHovered || centerHovered ? color : `${color}66`}
      strokeWidth={isHovered || centerHovered ? "3" : "1.5"}
      strokeDasharray={isHovered ? "none" : "4 4"}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: index * 0.1 }}
      style={{ filter: isHovered || centerHovered ? `drop-shadow(0 0 10px ${color})` : 'none', transition: 'stroke 0.3s, filter 0.3s, stroke-width 0.3s' }}
    />
  );
}

function OrbitNode({ member, index, total, radius, baseAngle, hoveredNode, setHoveredNode, centerHovered, getRoleColor }: any) {
  const angleOffset = (index * 360) / total - 90;
  // Calculate raw position on the circle path
  const rawX = useTransform(baseAngle, (v: number) => Math.cos((v + angleOffset) * (Math.PI / 180)) * (radius * 1.05));
  const rawY = useTransform(baseAngle, (v: number) => Math.sin((v + angleOffset) * (Math.PI / 180)) * (radius * 1.05));

  const isHovered = hoveredNode === member.id;
  const color = getRoleColor(member.role || member.category);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.5 + index * 0.1 }}
      onMouseEnter={() => setHoveredNode(member.id)}
      onMouseLeave={() => setHoveredNode(null)}
      className="absolute top-1/2 left-1/2 -mt-[30px] -ml-[110px] z-40 pointer-events-auto"
      style={{ x: rawX, y: rawY, zIndex: isHovered ? 60 : 40 }}
    >
      <div
        className="w-[220px] p-2 pr-4 rounded-full flex items-center gap-3 transition-all duration-300 backdrop-blur-md cursor-default border"
        style={{ 
          transform: isHovered ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
          backgroundColor: isHovered ? 'rgba(15,15,15,0.95)' : 'rgba(10,10,10,0.7)',
          borderColor: isHovered ? color : `${color}40`, 
          boxShadow: isHovered ? `0 15px 35px rgba(0,0,0,0.6), 0 0 20px ${color}80` : `0 4px 15px rgba(0,0,0,0.3)`,
        }}
      >
        <div 
          className="w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 flex items-center justify-center transition-all duration-300"
          style={{ 
            borderColor: isHovered ? color : `${color}80`,
            boxShadow: isHovered ? `0 0 20px ${color}` : 'none',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {member.photo ? (
            <img src={member.photo} alt={member.name} className="w-full h-full object-cover transition-transform duration-500" style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }} />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center font-mono text-white text-xs">{member.name[0]}</div>
          )}
        </div>
        <div className="flex flex-col text-left overflow-hidden pb-1">
          <p className="text-sm font-bold text-white truncate w-full transition-shadow leading-tight" style={{ textShadow: isHovered ? `0 0 8px ${color}80` : 'none' }}>
            {member.name}
          </p>
          <p className="text-[9px] font-mono uppercase tracking-widest truncate w-full transition-colors mt-0.5" style={{ color: isHovered ? '#fff' : color }}>
            {member.role || "Core Member"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


