"use client";
import React, { useState, useEffect } from "react";

// Wrapper to handle mounting/unmounting and scroll locking
export default function StartupAnimation() {
  const [show, setShow] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Only show once per session to not annoy returning users, or comment out for development
    if (sessionStorage.getItem("homeAnimationPlayed")) {
      setTimeout(() => setShow(false), 0);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleComplete = () => {
    document.body.style.overflow = "";
    sessionStorage.setItem("homeAnimationPlayed", "true");
    setIsClosing(true);
    setTimeout(() => {
      setShow(false);
    }, 800);
  };

  if (!show) return null;

  return <StartupAnimationContent onComplete={handleComplete} isClosing={isClosing} />;
}

// Deterministic pseudo-random values to avoid hydration mismatch
const PARTICLE_OFFSETS = [
  { tx: -180, ty: -120 }, { tx: 200, ty: -80 }, { tx: -90, ty: 160 },
  { tx: 150, ty: 140 }, { tx: -220, ty: 50 }, { tx: 60, ty: -200 },
  { tx: -140, ty: -180 }, { tx: 240, ty: 100 }, { tx: -60, ty: 220 },
  { tx: 170, ty: -160 }, { tx: -200, ty: 80 }, { tx: 100, ty: 190 },
  { tx: -160, ty: -60 }, { tx: 190, ty: -140 }, { tx: -80, ty: 180 },
  { tx: 120, ty: -100 }, { tx: -240, ty: 140 }, { tx: 80, ty: -220 },
  { tx: -110, ty: 100 }, { tx: 210, ty: -50 }, { tx: -170, ty: -140 },
  { tx: 130, ty: 170 }, { tx: -50, ty: -190 }, { tx: 220, ty: 60 },
];

const SPARK_OFFSETS = [
  { sx: -25, sy: -35 }, { sx: 15, sy: -45 }, { sx: -10, sy: -30 },
  { sx: 20, sy: -40 }, { sx: -30, sy: -25 }, { sx: 5, sy: -50 },
  { sx: 25, sy: -35 }, { sx: -15, sy: -45 },
];

const CODE_SYMBOLS = ["</>", "{}", "//", "=>", "( )", "[]", "&&", "!=", "++", "::"];

function StartupAnimationContent({ onComplete, isClosing }: { onComplete: () => void, isClosing?: boolean }) {
  const [phase, setPhase] = useState<
    "init" | "brackets" | "slash" | "flash" | "text" | "settle" | "hero"
  >("init");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    t(() => setPhase("brackets"), 300);
    t(() => setPhase("slash"), 1200);
    t(() => setPhase("flash"), 1700);
    t(() => setPhase("text"), 2200);
    t(() => setPhase("settle"), 3000);
    t(() => {
      setPhase("hero");
      onComplete();
    }, 4200);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="logo-anim-root" data-phase={phase} style={{ opacity: isClosing ? 0 : 1, pointerEvents: isClosing ? 'none' : 'auto' }}>
      <style dangerouslySetInnerHTML={{ __html: `
         .logo-anim-root {
           position: fixed;
           inset: 0;
           z-index: 99999;
           display: flex;
           align-items: center;
           justify-content: center;
           background: #050505;
           overflow: hidden;
           perspective: 1200px;
           font-family: var(--font-space-grotesk), sans-serif;
          transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1), background 1s ease;
        }
        .logo-anim-root[data-phase="hero"] {
          position: absolute;
          bottom: auto;
          height: 100vh;
          background: transparent;
          pointer-events: none;
        }

        .logo-anim-root[data-phase="hero"] .la-bg-orb,
        .logo-anim-root[data-phase="hero"] .la-grid,
        .logo-anim-root[data-phase="hero"] .la-scanline,
        .logo-anim-root[data-phase="hero"] .la-code-particle,
        .logo-anim-root[data-phase="hero"] .la-flash {
            opacity: 0 !important;
            transition: opacity 1s ease;
        }

        /* ── Ambient background ── */
        .la-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .logo-anim-root:not([data-phase="init"]) .la-bg-orb { opacity: 1; }
        .la-bg-orb--1 { width: 600px; height: 600px; top: -200px; left: -150px; background: radial-gradient(circle, rgba(0,242,255,0.25), transparent 70%); animation: la-orbit 12s ease-in-out infinite; }
        .la-bg-orb--2 { width: 500px; height: 500px; bottom: -200px; right: -100px; background: radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%); animation: la-orbit 15s ease-in-out infinite reverse; }
        .la-bg-orb--3 { width: 350px; height: 350px; top: 30%; left: 60%; background: radial-gradient(circle, rgba(0,242,255,0.12), transparent 70%); animation: la-orbit 10s ease-in-out infinite 2s; }

        @keyframes la-orbit {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-50px) scale(1.1); }
          66% { transform: translate(-30px,40px) scale(0.9); }
        }

        /* ── Grid lines ── */
        .la-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,242,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,242,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(600px) rotateX(45deg) translateY(30%);
          transform-origin: center bottom;
          opacity: 0;
          transition: opacity 1.5s ease 0.5s;
        }
        .logo-anim-root:not([data-phase="init"]) .la-grid { opacity: 1; }

        /* ── Screen flash ── */
        .la-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(0,242,255,0.5) 0%, rgba(255,255,255,0.3) 30%, transparent 70%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.12s ease;
        }
        .logo-anim-root[data-phase="flash"] .la-flash { opacity: 1; }

        /* ── Shake on flash ── */
        .la-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          transform-style: preserve-3d;
        }
        .logo-anim-root[data-phase="flash"] .la-stage {
          animation: la-shake 0.4s ease;
        }
        @keyframes la-shake {
          0% { transform: translate(0,0) rotate(0deg); }
          20% { transform: translate(-6px,3px) rotate(-1deg); }
          40% { transform: translate(5px,-4px) rotate(1deg); }
          60% { transform: translate(-3px,5px) rotate(-0.5deg); }
          80% { transform: translate(4px,-2px) rotate(0.5deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }

        /* ── 3D logo container ── */
        .la-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(5rem, 12vw, 9rem);
          font-weight: 700;
          line-height: 1;
          position: relative;
          transform: translateZ(0);
          transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Brackets ── */
        .la-bracket {
          display: inline-block;
          color: #00F2FF;
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1);
          text-shadow: 0 0 30px rgba(0,242,255,0.6), 0 0 60px rgba(0,242,255,0.3);
          filter: drop-shadow(0 0 15px rgba(0,242,255,0.5));
        }
        .logo-anim-root:not([data-phase="init"]) .la-bracket { opacity: 1; }

        .la-bracket--left {
          transform: translateX(50px) rotateY(40deg);
        }
        .logo-anim-root:not([data-phase="init"]) .la-bracket--left {
          transform: translateX(-20px) rotateY(0deg);
        }
        .la-bracket--right {
          transform: translateX(-50px) rotateY(-40deg);
        }
        .logo-anim-root:not([data-phase="init"]) .la-bracket--right {
          transform: translateX(20px) rotateY(0deg);
        }

        /* Fade brackets in text/settle/hero */
        .logo-anim-root[data-phase="text"] .la-bracket,
        .logo-anim-root[data-phase="settle"] .la-bracket,
        .logo-anim-root[data-phase="hero"] .la-bracket {
          opacity: 0;
          transform: translateX(0) scale(0.5);
        }

        /* ── Sword / Slash ── */
        .la-sword-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          pointer-events: none;
          transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }

         .la-sword {
           display: block;
           color: #00F2FF;
           font-size: clamp(5rem, 12vw, 9rem);
           font-weight: 700;
           font-family: var(--font-space-grotesk), sans-serif;
          line-height: 1;
          opacity: 0;
          transform: rotate(0deg) scale(1);
          transition: all 0.6s cubic-bezier(0.34,1.56,0.64,1);
          text-shadow: 0 0 20px rgba(0,242,255,0.6);
        }

        /* Show sword */
        .logo-anim-root[data-phase="brackets"] .la-sword {
          opacity: 1;
        }

        /* Slash! - elongate and rotate */
        .logo-anim-root[data-phase="slash"] .la-sword,
        .logo-anim-root[data-phase="flash"] .la-sword {
          opacity: 1;
          color: #fff;
          transform: rotate(55deg) scaleY(3) scaleX(1.3);
          text-shadow: 0 0 60px #fff, 0 0 120px #00F2FF, 0 0 200px rgba(0,242,255,0.6);
          filter: drop-shadow(0 0 40px rgba(255,255,255,0.8));
          transition-duration: 0.35s;
        }

        /* Rest as underline below text - absolute positioning to sit directly under GEEKROOM */
        .logo-anim-root[data-phase="text"] .la-sword-wrapper,
        .logo-anim-root[data-phase="settle"] .la-sword-wrapper,
        .logo-anim-root[data-phase="hero"] .la-sword-wrapper {
          top: calc(50% + 70px);
          left: 50%;
          transform: translate(-50%, 0);
          transition-duration: 0.9s;
        }

        .logo-anim-root[data-phase="text"] .la-sword,
        .logo-anim-root[data-phase="settle"] .la-sword,
        .logo-anim-root[data-phase="hero"] .la-sword {
          opacity: 0.9;
          color: #4F9EFF;
          /* Rotate to horizontal (90deg), stretch wide, flatten thin */
          transform: rotate(0deg) scaleX(8) scaleY(0.15);
          text-shadow: 0 0 30px rgba(79,158,255,0.8), 0 0 60px rgba(79,158,255,0.4);
          filter: drop-shadow(0 0 15px rgba(79,158,255,0.6));
          transition-duration: 0.9s;
        }

        /* ── Hero Underline Particles ── */
        .la-hero-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800%;
          height: 10px;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
        }

        .logo-anim-root[data-phase="text"] .la-hero-particles,
        .logo-anim-root[data-phase="settle"] .la-hero-particles,
        .logo-anim-root[data-phase="hero"] .la-hero-particles {
          opacity: 1;
          transition: opacity 1s ease 1s;
        }
        
        .la-hero-particle {
          position: absolute;
          top: 50%;
          width: 20px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          box-shadow: 0 0 10px #fff, 0 0 20px #00F2FF, 0 0 30px #00F2FF;
          transform: translateY(-50%);
          opacity: 0;
        }

        .logo-anim-root[data-phase="settle"] .la-hero-particle.p1, .logo-anim-root[data-phase="hero"] .la-hero-particle.p1 { animation: particle-flow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .logo-anim-root[data-phase="settle"] .la-hero-particle.p2, .logo-anim-root[data-phase="hero"] .la-hero-particle.p2 { animation: particle-flow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.8s; }
        .logo-anim-root[data-phase="settle"] .la-hero-particle.p3, .logo-anim-root[data-phase="hero"] .la-hero-particle.p3 { animation: particle-flow 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.5s; }
        .logo-anim-root[data-phase="settle"] .la-hero-particle.p4, .logo-anim-root[data-phase="hero"] .la-hero-particle.p4 { animation: particle-flow 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.1s; }
        .logo-anim-root[data-phase="settle"] .la-hero-particle.p5, .logo-anim-root[data-phase="hero"] .la-hero-particle.p5 { animation: particle-flow 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.4s; }

        @keyframes particle-flow {
          0% { left: -5%; opacity: 0; transform: translateY(-50%) scaleX(1); }
          15% { opacity: 1; transform: translateY(-50%) scaleX(2); }
          85% { opacity: 1; transform: translateY(-50%) scaleX(2); }
          100% { left: 105%; opacity: 0; transform: translateY(-50%) scaleX(0.5); }
        }

        /* ── Trail particles ── */
        .la-trail {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 3px;
          height: 3px;
          background: #00F2FF;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 0 6px #00F2FF;
        }
        .logo-anim-root[data-phase="slash"] .la-trail,
        .logo-anim-root[data-phase="flash"] .la-trail {
          animation: la-particle 0.8s ease-out forwards;
        }
        @keyframes la-particle {
          0% { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }

        /* ── Slash line across screen ── */
        .la-slash-line {
          position: absolute;
          top: 50%;
          left: -50%;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(0,242,255,0.1) 20%, rgba(255,255,255,0.9) 50%, rgba(0,242,255,0.1) 80%, transparent 100%);
          transform: rotate(45deg);
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(0,242,255,0.6), 0 0 60px rgba(0,242,255,0.3);
        }
        .logo-anim-root[data-phase="slash"] .la-slash-line,
        .logo-anim-root[data-phase="flash"] .la-slash-line {
          opacity: 1;
          animation: la-slash-sweep 0.6s ease-out forwards;
        }
        @keyframes la-slash-sweep {
          0% { transform: rotate(45deg) translateX(-100%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: rotate(45deg) translateX(100%); opacity: 0; }
        }

        /* ── Text: "GEEKROOM" ── */
        .la-text-block {
          text-align: center;
          opacity: 0;
          transform: translateY(40px) rotateX(15deg);
          transition: all 0.9s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          z-index: 20;
        }
        .logo-anim-root[data-phase="text"] .la-text-block,
        .logo-anim-root[data-phase="settle"] .la-text-block,
        .logo-anim-root[data-phase="hero"] .la-text-block {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
        }

        .la-title {
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.15em;
          text-shadow: 0 0 40px rgba(0,242,255,0.3);
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        .la-title span {
          display: inline-block;
          opacity: 0;
          transform: translateY(25px) rotateX(40deg);
          animation: la-letter-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        .logo-anim-root:not([data-phase="text"]):not([data-phase="settle"]):not([data-phase="hero"]) .la-title span {
          animation: none;
          opacity: 0;
        }

        @keyframes la-letter-in {
          to { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }

        /* ── Sparks ── */
        .la-spark {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #00F2FF;
          border-radius: 50%;
          opacity: 0;
          box-shadow: 0 0 8px #00F2FF, 0 0 16px rgba(0,242,255,0.4);
        }
        .logo-anim-root[data-phase="settle"] .la-spark {
          animation: la-spark-anim 1.2s ease-out forwards;
        }
        @keyframes la-spark-anim {
          0% { opacity: 1; transform: translate(0,0) scale(1); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
        }

        /* ── Floating code particles ── */
        .la-code-particle {
          position: absolute;
           font-family: var(--font-space-grotesk), monospace;
          color: rgba(0,242,255,0.08);
          pointer-events: none;
          opacity: 0;
          transition: opacity 2s ease;
        }
        .logo-anim-root:not([data-phase="init"]) .la-code-particle {
          opacity: 1;
          animation: la-float-code 8s linear infinite;
        }
        @keyframes la-float-code {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(20deg); }
        }

        /* ── Scanline ── */
        .la-scanline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(0,242,255,0.15), transparent);
          opacity: 0;
          pointer-events: none;
        }
        .logo-anim-root:not([data-phase="init"]):not([data-phase="hero"]) .la-scanline {
          opacity: 1;
          animation: la-scan 3s linear infinite;
        }
        @keyframes la-scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}} />

      {/* Background elements */}
      <div className="la-bg-orb la-bg-orb--1" />
      <div className="la-bg-orb la-bg-orb--2" />
      <div className="la-bg-orb la-bg-orb--3" />
      <div className="la-grid" />
      <div className="la-scanline" />

      {/* Floating code snippets - deterministic positions */}
      {CODE_SYMBOLS.map((code, i) => (
        <div
          key={i}
          className="la-code-particle"
          style={{
            left: (8 + i * 9) + "%",
            top: (60 + (i % 3) * 20) + "%",
            animationDelay: (i * 0.7).toFixed(1) + "s",
            fontSize: (0.7 + (i % 5) * 0.12).toFixed(2) + "rem",
          }}
        >
          {code}
        </div>
      ))}

      {/* Flash overlay */}
      <div className="la-flash" />

      {/* Slash line */}
      <div className="la-slash-line" />

      {/* Main stage */}
      <div className="la-stage">
        <div className="la-logo">
          <span className="la-bracket la-bracket--left">&lt;</span>
          <span className="la-bracket la-bracket--right">&gt;</span>

          {/* Sword - absolutely positioned so it can move independently to underline position */}
          <div className="la-sword-wrapper">
            <span className="la-sword">/</span>
            <div className="la-hero-particles">
              <div className="la-hero-particle p1"></div>
              <div className="la-hero-particle p2"></div>
              <div className="la-hero-particle p3"></div>
              <div className="la-hero-particle p4"></div>
              <div className="la-hero-particle p5"></div>
            </div>
          </div>

          {/* Particles during slash - deterministic offsets */}
          {PARTICLE_OFFSETS.map((p, i) => (
            <div
              key={i}
              className="la-trail"
              style={({
                "--tx": p.tx + "px",
                "--ty": p.ty + "px",
                animationDelay: (i * 0.012).toFixed(3) + "s",
              } as React.CSSProperties)}
            />
          ))}
        </div>

        {/* GEEKROOM text */}
        <div className="la-text-block">
          <h1 className="la-title">
            {"GEEKROOM".split("").map((char, i) => (
              <span
                key={i}
                style={{
                  animationDelay: (i * 0.05).toFixed(2) + "s",
                  ...(char === " " ? { width: "0.4em" } : {}),
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          {/* Sparks on settle - deterministic offsets */}
          {SPARK_OFFSETS.map((s, i) => (
            <div
              key={i}
              className="la-spark"
              style={({
                left: (20 + i * 8) + "%",
                bottom: "-8px",
                "--sx": s.sx + "px",
                "--sy": s.sy + "px",
                animationDelay: (i * 0.1).toFixed(1) + "s",
              } as React.CSSProperties)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
