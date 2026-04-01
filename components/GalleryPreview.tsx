"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { EventItem } from "@/app/actions/eventActions";

export function GalleryPreview({ events }: { events: EventItem[] }) {
  // Extract all gallery images from all events, preserving event context
  const allImages: Array<{ src: string; eventTitle: string }> = [];
  events.forEach(evt => {
    (evt.gallery || []).forEach(src => {
      allImages.push({ src, eventTitle: evt.title });
    });
  });

  // Split images into two rows for the infinite sliders.
  const half = Math.ceil(allImages.length / 2);
  const topRow = allImages.slice(0, half);
  const bottomRow = allImages.slice(half);

  // Fallback demo images if the database is empty
  const fallbackImages = [
    { src: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80&w=800", eventTitle: "Hackathon Event" },
    { src: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800", eventTitle: "Tech Workshop" },
    { src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800", eventTitle: "Community Meetup" }
  ];

  const finalTopRow = topRow.length > 0 ? topRow : fallbackImages;
  const finalBottomRow = bottomRow.length > 0 ? bottomRow : fallbackImages;

  // Duplicating the array to create a seamless infinite scroll loop
  const duplicatedTop = [...finalTopRow, ...finalTopRow];
  const duplicatedBottom = [...finalBottomRow, ...finalBottomRow];

  return (
    <section className="relative py-32 bg-[#020202] overflow-hidden flex flex-col items-center">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF8C00]/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#4F9EFF]/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="text-center z-10 mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-4"
        >
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <ImageIcon className="w-8 h-8 text-white/80" />
          </div>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Memory</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 font-mono text-sm max-w-lg mx-auto mt-4"
        >
          Fragments of the moments we built, learned, and celebrated together.
        </motion.p>
      </div>

      {/* INFINITE SCROLL CAROUSELS */}
      <div className="w-full flex flex-col gap-6 relative z-10 perspective-[1000px]">
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-20 pointer-events-none" />

        {/* Row 1: Left to Right */}
        <div className="overflow-hidden flex w-[150vw] -ml-[25vw]" style={{ transform: "rotate(-2deg)" }}>
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            className="flex gap-6 w-max will-change-transform"
          >
            {duplicatedTop.map((item, i) => (
              <GalleryImage key={`top-${i}`} src={item.src} eventTitle={item.eventTitle} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="overflow-hidden flex w-[150vw] -ml-[25vw]" style={{ transform: "rotate(-2deg)" }}>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            className="flex gap-6 w-max will-change-transform"
          >
            {duplicatedBottom.map((item, i) => (
              <GalleryImage key={`bottom-${i}`} src={item.src} eventTitle={item.eventTitle} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 z-20"
      >
        <Link 
          href="/gallery" 
          className="group flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white group-hover:text-black">
            <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
            View Full Gallery
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

function GalleryImage({ src, eventTitle, index }: { src: string; eventTitle: string; index: number }) {
  return (
    <div className="relative w-[300px] md:w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 group border border-white/5 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500 z-10" />
      <Image 
        src={src} 
        alt={`${eventTitle} gallery photo ${index + 1}`}
        fill
        sizes="(max-width: 768px) 300px, 450px"
        className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
      />
    </div>
  );
}
