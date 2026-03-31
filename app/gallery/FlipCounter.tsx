"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface FlipDigitProps {
  value: string;
  color: string;
  delay: number;
}

function FlipDigit({ value, color, delay }: FlipDigitProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const [isFlipping, setIsFlipping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const target = parseInt(value);
    const current = parseInt(displayValue);
    if (target === current) return;

    const timeout = setTimeout(() => {
      let count = current;
      const step = () => {
        if (count < target) {
          count++;
          setIsFlipping(true);
          setDisplayValue(count.toString());
          setTimeout(() => setIsFlipping(false), 150);
          intervalRef.current = setTimeout(step, 60 + Math.random() * 40);
        }
      };
      step();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: "1.8em",
        height: "2.4em",
        perspective: "300px",
      }}
    >
      {/* Background panel */}
      <div
        className="absolute inset-0 rounded-lg border border-white/10"
        style={{ background: "rgba(10, 10, 10, 0.8)" }}
      />

      {/* Split line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-black/40 z-10" />

      {/* Flip animation layer */}
      <motion.div
        className="absolute inset-0 rounded-lg overflow-hidden z-5"
        animate={{
          rotateX: isFlipping ? [0, -90, 0] : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center font-mono font-black text-3xl"
          style={{ color, textShadow: `0 0 15px ${color}40` }}
        >
          {displayValue}
        </div>
      </motion.div>

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: isFlipping ? `0 0 20px ${color}30` : "none",
          transition: "box-shadow 0.3s",
        }}
      />
    </div>
  );
}

interface FlipCounterProps {
  total: number;
  photos: number;
  videos: number;
}

export default function FlipCounter({ total, photos, videos }: FlipCounterProps) {
  const totalStr = total.toString().padStart(2, "0");
  const photosStr = photos.toString().padStart(2, "0");
  const videosStr = videos.toString().padStart(2, "0");

  return (
    <div className="flex w-full md:w-auto justify-between md:justify-start gap-4 md:gap-8 flex-wrap">
      {/* Total */}
      <div className="flex flex-col items-center md:items-start group cursor-default">
        <div className="flex">
          {totalStr.split("").map((d, i) => (
            <FlipDigit key={`t-${i}`} value={d} color="#ffffff" delay={500 + i * 100} />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 group-hover:text-white transition-colors duration-300 mt-1">
          Total
        </span>
      </div>

      <div className="w-px h-10 bg-white/10 hidden md:block self-center"></div>

      {/* Photos */}
      <div className="flex flex-col items-center md:items-start group cursor-default">
        <div className="flex">
          {photosStr.split("").map((d, i) => (
            <FlipDigit key={`p-${i}`} value={d} color="#00F2FF" delay={700 + i * 100} />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 group-hover:text-white transition-colors duration-300 mt-1">
          Photos
        </span>
      </div>

      <div className="w-px h-10 bg-white/10 hidden md:block self-center"></div>

      {/* Videos */}
      <div className="flex flex-col items-center md:items-start group cursor-default">
        <div className="flex">
          {videosStr.split("").map((d, i) => (
            <FlipDigit key={`v-${i}`} value={d} color="#FF8C00" delay={900 + i * 100} />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 group-hover:text-white transition-colors duration-300 mt-1">
          Videos
        </span>
      </div>
    </div>
  );
}
