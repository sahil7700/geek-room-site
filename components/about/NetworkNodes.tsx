"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── TIER DEFINITIONS ────────────────────────────────────────────────────────
// Core (white, biggest):  Ronit, Paras, Rudra Dutt Sharma (VP)
// Heads (orange, medium): Alok, Lakshita, Rudra Dutt Sharma (Management Head)
// Members (cyan, small):  everyone else

const MEMBERS = [
  { id: 1, name: "Ronit Mathur", role: "President", tier: "core" },
  { id: 2, name: "Paras Dudeja", role: "General Secretary", tier: "core" },
  { id: 3, name: "Punish Ahuja", role: "Treasurer", tier: "core" },
  { id: 4, name: "Rudra Dutt Sharma", role: "Vice President", tier: "core" },
  { id: 5, name: "Alok Sahoo", role: "Tech Head", tier: "head" },
  { id: 6, name: "Lakshita Parashar", role: "Publicity Head", tier: "head" },
  { id: 7, name: "Rudra Dutt Sharma", role: "Management Head", tier: "head" },
  { id: 8, name: "Sahil Singh", role: "Tech", tier: "member" },
  { id: 9, name: "Abhinav Jha", role: "Tech", tier: "member" },
  { id: 10, name: "Yachak Gupta", role: "Tech", tier: "member" },
  { id: 11, name: "Dhairya Jindal", role: "Tech", tier: "member" },
  { id: 12, name: "Divyanshi Tiwari", role: "Publicity", tier: "member" },
  { id: 13, name: "Arya Singh", role: "Publicity", tier: "member" },
  { id: 14, name: "Aishwarya Singh", role: "Publicity", tier: "member" },
  { id: 15, name: "Manvi Yadav", role: "Publicity", tier: "member" },
  { id: 16, name: "Bhavya Kokaria", role: "Publicity", tier: "member" },
  { id: 17, name: "Mokshya Dangwal", role: "Design", tier: "member" },
  { id: 18, name: "Rajat Popli", role: "Design", tier: "member" },
  { id: 19, name: "Pushp Singla", role: "Design", tier: "member" },
  { id: 20, name: "Sudhanshu Verma", role: "Design", tier: "member" },
  { id: 23, name: "Shailendra Pal", role: "Management", tier: "member" },
  { id: 24, name: "Abhinav Sharma", role: "Management", tier: "member" },
];

const TIER = {
  core: { color: "#FFFFFF", radius: 13 },
  head: { color: "#FF8C00", radius: 9 },
  member: { color: "#00F2FF", radius: 5 },
} as const;

type Tier = keyof typeof TIER;

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  tier: Tier;
  name: string;
  role: string;
}

const PADDING = 20; // pixels from canvas edge — keeps all nodes inside

export function NetworkNodes() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const hoveredRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const [tooltip, setTooltip] = useState<{
    visible: boolean; x: number; y: number;
    name: string; role: string; tier: Tier;
  }>({ visible: false, x: 0, y: 0, name: "", role: "", tier: "member" });

  // ── init ──────────────────────────────────────────────────────────────────
  const initNodes = (W: number, H: number) => {
    nodesRef.current = MEMBERS.map((m) => {
      const cfg = TIER[m.tier as Tier];
      const r = cfg.radius;
      return {
        id: m.id,
        x: PADDING + r + Math.random() * (W - 2 * (PADDING + r)),
        y: PADDING + r + Math.random() * (H - 2 * (PADDING + r)),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: r,
        color: cfg.color,
        tier: m.tier as Tier,
        name: m.name,
        role: m.role,
      };
    });
  };

  // ── draw loop ─────────────────────────────────────────────────────────────
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const nodes = nodesRef.current;
    const hovered = hoveredRef.current;

    const CONNECT_DIST = 280;
    const IDLE_DIST = 140;

    ctx.clearRect(0, 0, W, H);

    // Move + strict boundary bounce
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;

      const minX = PADDING + n.radius;
      const maxX = W - PADDING - n.radius;
      const minY = PADDING + n.radius;
      const maxY = H - PADDING - n.radius;

      if (n.x <= minX) { n.x = minX; n.vx = Math.abs(n.vx); }
      if (n.x >= maxX) { n.x = maxX; n.vx = -Math.abs(n.vx); }
      if (n.y <= minY) { n.y = minY; n.vy = Math.abs(n.vy); }
      if (n.y >= maxY) { n.y = maxY; n.vy = -Math.abs(n.vy); }
    });

    // ── connections ───────────────────────────────────────────────────────
    if (hovered !== null) {
      const hn = nodes.find((n) => n.id === hovered);
      if (hn) {
        nodes.forEach((n) => {
          if (n.id === hovered) return;
          const dx = n.x - hn.x;
          const dy = n.y - hn.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.75;
            const lineColor =
              hn.tier === "core" ? `255,255,255` :
                hn.tier === "head" ? `255,140,0` :
                  `0,242,255`;
            const grad = ctx.createLinearGradient(hn.x, hn.y, n.x, n.y);
            grad.addColorStop(0, `rgba(${lineColor},${alpha})`);
            grad.addColorStop(1, `rgba(${lineColor},${alpha * 0.2})`);
            ctx.beginPath();
            ctx.moveTo(hn.x, hn.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        });
      }
    } else {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < IDLE_DIST) {
            const alpha = (1 - dist / IDLE_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(180,180,180,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // ── draw nodes (members first, then heads, then core on top) ──────────
    const renderOrder: Tier[] = ["member", "head", "core"];
    const sorted = [...nodes].sort(
      (a, b) => renderOrder.indexOf(a.tier) - renderOrder.indexOf(b.tier)
    );

    sorted.forEach((n) => {
      const isHovered = n.id === hovered;
      const isConnected = !isHovered && hovered !== null && (() => {
        const hn = nodes.find((x) => x.id === hovered);
        if (!hn) return false;
        const dx = n.x - hn.x, dy = n.y - hn.y;
        return Math.sqrt(dx * dx + dy * dy) < CONNECT_DIST;
      })();

      const size = isHovered ? n.radius * 1.7 : n.radius;

      const glowRadius =
        n.tier === "core" ? (isHovered ? 55 : isConnected ? 35 : 22) :
          n.tier === "head" ? (isHovered ? 40 : isConnected ? 26 : 16) :
            (isHovered ? 28 : isConnected ? 18 : 10);

      const opacity =
        n.tier === "core" ? (isHovered ? 1.0 : isConnected ? 0.95 : 0.85) :
          n.tier === "head" ? (isHovered ? 1.0 : isConnected ? 0.90 : 0.70) :
            (isHovered ? 1.0 : isConnected ? 0.85 : 0.45);

      // Glow halo
      const glowAlpha =
        n.tier === "core" ? (isHovered ? 0.35 : 0.18) :
          n.tier === "head" ? (isHovered ? 0.45 : 0.22) :
            (isHovered ? 0.35 : 0.12);

      const glowRGB =
        n.color === "#FFFFFF" ? "255,255,255" :
          n.color === "#FF8C00" ? "255,140,0" :
            "0,242,255";

      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius);
      halo.addColorStop(0, `rgba(${glowRGB},${glowAlpha})`);
      halo.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      // White inner highlight (core + head only)
      if (n.tier === "core" || n.tier === "head") {
        const hl = ctx.createRadialGradient(
          n.x - size * 0.3, n.y - size * 0.3, 0,
          n.x, n.y, size
        );
        hl.addColorStop(0, "rgba(255,255,255,0.55)");
        hl.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fillStyle = hl;
        ctx.globalAlpha = opacity * 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Hover ring
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${glowRGB},0.5)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    });

    rafRef.current = requestAnimationFrame(draw);
  };

  // ── mouse ─────────────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top) * sy;

    // Priority: core > head > member
    const priority: Tier[] = ["core", "head", "member"];
    const byPriority = [...nodesRef.current].sort(
      (a, b) => priority.indexOf(a.tier) - priority.indexOf(b.tier)
    );

    let found: Node | null = null;
    for (const n of byPriority) {
      const dx = n.x - mx, dy = n.y - my;
      if (Math.sqrt(dx * dx + dy * dy) < n.radius + 10) { found = n; break; }
    }

    hoveredRef.current = found ? found.id : null;
    if (found) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: found.name,
        role: found.role,
        tier: found.tier,
      });
    } else {
      setTooltip((p) => ({ ...p, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    hoveredRef.current = null;
    setTooltip((p) => ({ ...p, visible: false }));
  };

  // ── lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current!;
    const parent = canvas.parentElement!;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initNodes(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    gsap.fromTo(canvas, { opacity: 0 }, {
      opacity: 1, duration: 1.4, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── tooltip styles ────────────────────────────────────────────────────────
  const tipBorder =
    tooltip.tier === "core" ? "border-white/30" :
      tooltip.tier === "head" ? "border-[#FF8C00]/40" :
        "border-[#00F2FF]/30";
  const tipText =
    tooltip.tier === "core" ? "text-white" :
      tooltip.tier === "head" ? "text-[#FF8C00]" :
        "text-[#00F2FF]";

  return (
    <section ref={sectionRef} className="relative py-24 px-6 max-w-7xl mx-auto z-10">

      {/* Header */}
      <div className="mb-8">
        <span className="text-[#00F2FF] font-mono text-xs tracking-[0.3em] uppercase flex items-center gap-4 mb-5">
          <span className="w-8 h-px bg-[#00F2FF]" />
          Community Network
        </span>
        <div className="flex flex-wrap items-end gap-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
            THE <span className="text-[#00F2FF]">NETWORK</span>
          </h2>
          <p className="font-mono text-sm text-[#ededed]/30 mb-2 tracking-wider">
            Hover nodes to identify members
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[540px] rounded-2xl border border-white/5 bg-[#050505] overflow-hidden">
        <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white/10 rounded-tl-2xl pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/10 rounded-tr-2xl pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-[#FF8C00]/20 rounded-bl-2xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[#FF8C00]/20 rounded-br-2xl pointer-events-none z-10" />

        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {tooltip.visible && (
          <div
            className={`absolute pointer-events-none z-20 px-3 py-2 rounded-md border ${tipBorder} bg-[#050505]/95 backdrop-blur-sm font-mono whitespace-nowrap`}
            style={{ left: tooltip.x + 14, top: tooltip.y - 56 }}
          >
            <div className={`text-xs font-semibold tracking-wide ${tipText}`}>
              <span className="opacity-50 mr-1">▸</span>{tooltip.name}
            </div>
            {tooltip.role && (
              <div className="text-[10px] text-[#ededed]/40 mt-0.5 pl-3">
                {tooltip.role}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-white"
            style={{ boxShadow: "0 0 12px rgba(255,255,255,0.8)" }} />
          <span className="font-mono text-[10px] text-[#ededed]/30 tracking-widest uppercase">Core Team</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF8C00]"
            style={{ boxShadow: "0 0 8px #FF8C00" }} />
          <span className="font-mono text-[10px] text-[#ededed]/30 tracking-widest uppercase">Team Heads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00F2FF]"
            style={{ boxShadow: "0 0 6px #00F2FF" }} />
          <span className="font-mono text-[10px] text-[#ededed]/30 tracking-widest uppercase">Members</span>
        </div>
      </div>

    </section>
  );
}
