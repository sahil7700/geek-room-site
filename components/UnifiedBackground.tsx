import React from "react";

/**
 * UnifiedBackground — fixed behind all page content.
 * Layer 1 (CSS on body):  #080a0f base + radial glows      → globals.css
 * Layer 2 (this file):    Dot grid + Noise SVG + Vignette  → position fixed, z-index: -1
 */
export function UnifiedBackground() {
  return (
    <>
      {/* ── Layer 2a: Dot Grid ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 20%, black 55%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 20%, black 55%, transparent 100%)",
        }}
      />

      {/* ── Layer 2b: Analog Noise (SVG grain) ────────────────────── */}
      <svg
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0.04,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="gr-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#gr-noise)" />
      </svg>

      {/* ── Layer 2c: Top ambient glow line ───────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,200,255,0.25), transparent)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 2d: Vignette ────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}
