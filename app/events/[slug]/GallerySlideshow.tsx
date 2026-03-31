"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

export default function GallerySlideshow({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ perspective: "1000px" }}
    >
      {/* Slideshow Images with 3D transition */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Event photo ${currentIndex + 1} of ${images.length}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.08, rotateY: 5 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotateY: -5 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        />
      </AnimatePresence>

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-20">
        <div className="absolute inset-0 bg-white/10" />
        <motion.div
          className="h-full bg-gradient-to-r from-[#00F2FF] to-[#FF8C00]"
          initial={{ width: "100%" }}
          animate={{ width: 0 }}
          transition={{ duration: 4, ease: "linear" }}
          key={currentIndex}
        />
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-foreground/10">
        <Camera className="h-4 w-4 text-foreground/70" />
        <span className="text-sm font-semibold text-white">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 border border-foreground/10 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-[#00F2FF] hover:text-black cursor-pointer"
        style={{ transition: "background-color 0.2s, color 0.2s, opacity 0.3s" }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Next image"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 border border-foreground/10 text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-[#00F2FF] hover:text-black cursor-pointer"
        style={{ transition: "background-color 0.2s, color 0.2s, opacity 0.3s" }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Thumbnail indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? "w-8 bg-[#00F2FF]"
                : "w-2 bg-white/50 hover:bg-white/80 hover:w-4"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
