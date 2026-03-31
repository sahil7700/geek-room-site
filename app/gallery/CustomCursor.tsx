"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef(Array.from({ length: 6 }, () => ({ x: -100, y: -100 })));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = "ontouchstart" in window;
    if (prefersReduced || isTouchDevice) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button, a, [role='button'], input, textarea, select, .cursor-pointer, [data-clickable]")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button, a, [role='button'], input, textarea, select, .cursor-pointer, [data-clickable]")
      ) {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const animate = () => {
      const pos = posRef.current;
      const trail = trailRef.current;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }

      for (let i = 0; i < trail.length; i++) {
        const prev = i === 0 ? pos : trail[i - 1];
        trail[i].x = lerp(trail[i].x, prev.x, 0.25 - i * 0.03);
        trail[i].y = lerp(trail[i].y, prev.y, 0.25 - i * 0.03);
        if (trailRefs.current[i]) {
          trailRefs.current[i]!.style.transform = `translate(${trail[i].x}px, ${trail[i].y}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      {/* Trail dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="absolute top-0 left-0 rounded-full will-change-transform"
          style={{
            width: isHovering ? 8 : 4,
            height: isHovering ? 8 : 4,
            background: `rgba(0, 242, 255, ${0.3 - i * 0.05})`,
            transition: "width 0.2s, height 0.2s",
            marginLeft: -(isHovering ? 4 : 2),
            marginTop: -(isHovering ? 4 : 2),
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ marginLeft: -12, marginTop: -12 }}
      >
        {/* Outer ring */}
        <div
          className="absolute rounded-full border transition-all duration-200"
          style={{
            width: isHovering ? 48 : 24,
            height: isHovering ? 48 : 24,
            borderColor: isHovering ? "rgba(255, 140, 0, 0.8)" : "rgba(0, 242, 255, 0.5)",
            top: isHovering ? -12 : 0,
            left: isHovering ? -12 : 0,
            boxShadow: isHovering
              ? "0 0 20px rgba(255, 140, 0, 0.3), inset 0 0 10px rgba(255, 140, 0, 0.1)"
              : "0 0 10px rgba(0, 242, 255, 0.2)",
          }}
        />
        {/* Inner dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: isHovering ? 6 : 4,
            height: isHovering ? 6 : 4,
            background: isHovering ? "#FF8C00" : "#00F2FF",
            top: isHovering ? 9 : 10,
            left: isHovering ? 9 : 10,
            boxShadow: isHovering
              ? "0 0 8px rgba(255, 140, 0, 0.6)"
              : "0 0 6px rgba(0, 242, 255, 0.5)",
            transition: "all 0.2s",
          }}
        />
      </div>
    </div>
  );
}
