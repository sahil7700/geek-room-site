"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Film, Image } from "lucide-react";

interface MediaArchiveProps {
  images: string[];
}

export default function MediaArchive({ images }: MediaArchiveProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const duplicatedImages = useMemo(() => {
    if (images.length === 0) return [];
    return [...images, ...images, ...images, ...images];
  }, [images]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const getMediaElement = (src: string, index: number) => {
    const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm') || src.toLowerCase().endsWith('.mov');

    if (isVideo) {
      return (
        <div key={`${src}-${index}`} className="relative flex-shrink-0 w-48 h-32 md:w-64 md:h-40 overflow-hidden rounded-lg border border-[#00F2FF]/20 bg-[#0a0a0a]">
          <video
            src={src}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay={!isHovered}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <Film className="h-6 w-6 text-[#00F2FF]" />
          </div>
          {/* Tech corner */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00F2FF]/50" />
        </div>
      );
    }

    return (
      <div key={`${src}-${index}`} className="relative flex-shrink-0 w-48 h-32 md:w-64 md:h-40 overflow-hidden rounded-lg border border-[#FF8C00]/20 bg-[#0a0a0a] group">
        <img
          src={src}
          alt="Media archive"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-2">
            <Image className="h-4 w-4 text-[#FF8C00]" />
          </div>
        </div>
        {/* Tech corner */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF8C00]/50" />
      </div>
    );
  };

  if (images.length === 0) return null;

  return (
    <section
      className="py-8 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00F2FF]/50" />
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-[#00F2FF] animate-pulse" />
          <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-white">
            Media Archive
          </h3>
          <Film className="h-5 w-5 text-[#FF8C00] animate-pulse" />
        </div>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#FF8C00]/50" />
      </div>

      {/* Tech stats */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="text-center">
          <span className="block text-xs font-mono text-white/40 uppercase tracking-wider">Media Count</span>
          <span className="block text-sm font-bold text-[#00F2FF]">{images.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="text-center">
          <span className="block text-xs font-mono text-white/40 uppercase tracking-wider">Status</span>
          <span className="block text-sm font-bold text-[#FF8C00] animate-pulse">LIVE</span>
        </div>
      </div>

      {/* Scrolling Container - Left to Right */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />

        <motion.div
          ref={scrollRef}
          className="flex gap-4"
          animate={{
            x: isHovered ? 0 : [0, -50 * (duplicatedImages.length / 4)]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear"
            }
          }}
          style={{
            width: `${duplicatedImages.length * 260}px`
          }}
        >
          {duplicatedImages.map((img, index) => getMediaElement(img, index))}
        </motion.div>
      </div>

      {/* Bottom tech decoration */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-0.5 w-1 bg-[#00F2FF]/30"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
