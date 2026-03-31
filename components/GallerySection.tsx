"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { Image as ImageIcon, Maximize, X, ChevronLeft, ChevronRight } from "lucide-react";

function TechPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="techPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00F2FF" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#techPattern)" />
    </svg>
  );
}

interface GallerySectionProps {
  images: string[];
  title?: string;
  imageLabels?: string[];
}

export default function GallerySection({ images, title = "Event Gallery", imageLabels }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [tilt, setTilt] = useState<Record<number, { x: number; y: number }>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((prev) => ({ ...prev, [index]: { x: y * -8, y: x * 8 } }));
  };

  const handleMouseLeave = (index: number) => {
    setTilt((prev) => ({ ...prev, [index]: { x: 0, y: 0 } }));
  };

  const getAltText = (index: number) => {
    if (imageLabels && imageLabels[index]) return imageLabels[index];
    return `Gallery photo ${index + 1} of ${images.length}`;
  };

  return (
    <section className="relative overflow-hidden">
      {/* Tech Background */}
      <div className="absolute inset-0 bg-black/30 blur-3xl" />
      <TechPattern />

      {/* Section Header */}
      <div className="relative z-10 flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <ImageIcon className="h-6 w-6 text-[#00F2FF]" />
            </motion.div>
            <div className="absolute inset-0 blur-md bg-[#00F2FF]/30" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white">
            {title}
          </h2>
          <span className="text-sm font-mono text-[#FF8C00] bg-[#FF8C00]/10 px-3 py-1 rounded-full border border-[#FF8C00]/30">
            {images.length} FILES
          </span>
        </div>

        {/* Animated data stream indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-4 bg-[#00F2FF]"
                animate={{
                  scaleY: [0.3, 1, 0.3],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-white/40">LIVE FEED</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4" style={{ perspective: "1200px" }}>
        {images.map((img, index) => {
          const isLoaded = loadedImages.has(index);
          const cardTilt = tilt[index] || { x: 0, y: 0 };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedIndex(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Image Container with 3D Tilt Effect */}
              <motion.div
                className="relative aspect-square overflow-hidden rounded-lg border border-[#00F2FF]/20 bg-[#0a0a0a]"
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.15s ease-out",
                  boxShadow: `
                    0 2px 4px rgba(0, 0, 0, 0.3),
                    0 8px 16px rgba(0, 0, 0, 0.25),
                    0 24px 48px rgba(0, 0, 0, 0.2),
                    0 0 0 1px rgba(0, 242, 255, 0.05)
                  `,
                }}
                whileHover={{
                  boxShadow: `
                    0 4px 8px rgba(0, 0, 0, 0.3),
                    0 16px 32px rgba(0, 0, 0, 0.25),
                    0 32px 64px rgba(0, 0, 0, 0.2),
                    0 0 0 1px rgba(0, 242, 255, 0.15),
                    0 0 30px rgba(0, 242, 255, 0.1)
                  `,
                }}
              >
                {/* Loading State */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                    <motion.div
                      className="w-8 h-8 border-2 border-[#00F2FF] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                )}

                {/* Image */}
                <NextImage
                  src={img}
                  alt={getAltText(index)}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(index)}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.2 }}
                      className="bg-[#00F2FF]/20 backdrop-blur-sm border border-[#00F2FF] rounded-full p-3"
                    >
                      <Maximize className="h-5 w-5 text-[#00F2FF]" />
                    </motion.div>
                  </div>

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/80">
                        IMG_{(index + 1).toString().padStart(3, "0")}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#00F2FF]/40 group-hover:border-[#00F2FF] transition-colors rounded-tl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#FF8C00]/40 group-hover:border-[#FF8C00] transition-colors rounded-tr" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#FF8C00]/40 group-hover:border-[#FF8C00] transition-colors rounded-bl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#00F2FF]/40 group-hover:border-[#00F2FF] transition-colors rounded-br" />
              </motion.div>

              {/* Glow Floor */}
              <div
                className="absolute -bottom-1 left-4 right-4 h-3 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse, rgba(0, 242, 255, 0.4), transparent)",
                  filter: "blur(6px)",
                  transform: "scaleX(0.7)",
                }}
              />

              {/* Index Badge */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border border-[#00F2FF]/30 rounded px-2 py-1 text-[10px] font-mono text-[#00F2FF]">
                #{(index + 1).toString().padStart(2, "0")}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            >
              {/* Close Button */}
              <motion.button
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                onClick={() => setSelectedIndex(null)}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-[#FF8C00]/20 hover:bg-[#FF8C00]/30 border border-[#FF8C00] text-[#FF8C00] rounded-full p-3 transition-colors z-50 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </motion.button>

              {/* Navigation Arrows */}
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-[#00F2FF]/20 hover:bg-[#00F2FF]/30 border border-[#00F2FF] text-[#00F2FF] rounded-full p-3 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-[#00F2FF]/20 hover:bg-[#00F2FF]/30 border border-[#00F2FF] text-[#00F2FF] rounded-full p-3 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>

              {/* Image with 3D entrance */}
              <motion.div
                key={selectedIndex}
                initial={{ scale: 0.7, opacity: 0, rotateY: 15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{ transformPerspective: 1000 }}
                className="relative max-w-full max-h-[80vh] aspect-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <NextImage
                  src={images[selectedIndex]}
                  alt={getAltText(selectedIndex)}
                  fill
                  sizes="100vw"
                  className="object-contain rounded-lg"
                  priority
                />
                {/* Glow border around lightbox image */}
                <div className="absolute inset-0 rounded-lg border-2 border-[#00F2FF]/30 shadow-[0_0_50px_rgba(0,242,255,0.3)] pointer-events-none" />
              </motion.div>

              {/* Image Counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 text-sm font-mono text-white">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Decorative Bottom Line */}
      <div className="relative z-10 mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00F2FF]" />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#00F2FF]"
          />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#FF8C00]" />
        </div>
      </div>
    </section>
  );
}
