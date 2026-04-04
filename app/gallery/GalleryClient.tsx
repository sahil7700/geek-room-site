"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Film, X, ChevronLeft, ChevronRight, Search, Download, Calendar, MapPin, FolderOpen, Share2, Layers, Check } from "lucide-react";
import Image from "next/image";
import { EventDetails } from "../events/data";

import CustomCursor from "./CustomCursor";
import FlipCounter from "./FlipCounter";

type MediaType = "all" | "photos" | "videos";

interface GalleryClientProps {
  events: EventDetails[];
}

export default function GalleryClient({ events }: GalleryClientProps) {
  const [filter, setFilter] = useState<MediaType>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [tilt, setTilt] = useState<Record<string, { x: number; y: number; mx: number; my: number }>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Collect all media from all passed events
  const mediaItems = events.flatMap(event => {
    const items: Array<{ src: string; type: "photo" | "video"; event: string; eventTitle: string; date: string }> = [];

    if (event.gallery) {
      event.gallery.forEach(img => {
        const isVideo = img.toLowerCase().endsWith('.mp4') || img.toLowerCase().endsWith('.webm') || img.toLowerCase().endsWith('.mov');
        items.push({
          src: img,
          type: isVideo ? "video" : "photo",
          event: event.slug,
          eventTitle: event.title,
          date: event.date
        });
      });
    }

    return items;
  });

  const filteredMedia = filter === "all"
    ? mediaItems
    : mediaItems.filter(item => item.type === (filter === "photos" ? "photo" : "video"));

  const groupedByEvent = useMemo(() => {
    const grouped: Record<string, typeof mediaItems> = {};
    filteredMedia.forEach(item => {
      if (!grouped[item.event]) {
        grouped[item.event] = [];
      }
      grouped[item.event].push(item);
    });
    return grouped;
  }, [filteredMedia]);

  const activeFolderItems = activeFolder ? groupedByEvent[activeFolder] || [] : [];

  // If active folder was filtered out, treat as no folder selected
  const effectiveFolder = activeFolder && groupedByEvent[activeFolder] ? activeFolder : null;

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => new Set([...prev, src]));
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const nextImage = () => {
    setDirection(1);
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % activeFolderItems.length;
    });
  };

  const prevImage = () => {
    setDirection(-1);
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + activeFolderItems.length) % activeFolderItems.length;
    });
  };

  useEffect(() => {
    if (selectedIndex !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowRight") {
          setDirection(1);
          setSelectedIndex((prev) => prev === null ? null : (prev + 1) % activeFolderItems.length);
        }
        if (e.key === "ArrowLeft") {
          setDirection(-1);
          setSelectedIndex((prev) => prev === null ? null : (prev - 1 + activeFolderItems.length) % activeFolderItems.length);
        }
        if (e.key === "Escape") setSelectedIndex(null);
      } else if (activeFolder) {
        if (e.key === "Escape") setActiveFolder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, activeFolder, groupedByEvent, activeFolderItems.length]);

  const handleDownload = (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async (e: React.MouseEvent, eventTitle: string, eventSlug: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/gallery?folder=${eventSlug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GeekRoom - ${eventTitle}`,
          text: `Check out the media archive for ${eventTitle} at GeekRoom!`,
          url: url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // Enhanced 3D tilt with parallax depth layers
  const handleTiltMove = (e: React.MouseEvent, slug: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((prev) => ({
      ...prev,
      [slug]: {
        x: ny * -10,
        y: nx * 10,
        mx: nx * 20,
        my: ny * 20,
      },
    }));
  };

  const handleTiltLeave = (slug: string) => {
    setTilt((prev) => ({
      ...prev,
      [slug]: { x: 0, y: 0, mx: 0, my: 0 },
    }));
  };

  return (
    <main className="min-h-screen text-[#ededed] relative overflow-hidden cursor-none">

      {/* === ADDON: Magnetic Custom Cursor === */}
      <CustomCursor />



      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#4F9EFF] text-black font-mono text-sm px-6 py-3 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Stats & Filters Header */}
      <div className="relative pt-24 pb-8 px-4 text-center z-10">
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                <span className="text-[#4F9EFF] opacity-80 mr-2">{'<'}</span>
                MEDIA ARCHIVE
                <span className="text-[#4F9EFF] opacity-80 ml-2">{'/>'}</span>
              </span>
            </h1>
            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">
              Explore past events & memories
            </p>
          </motion.div>

          {/* Stats + Filters Glass Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-6"
          >
            {/* === ADDON: 3D Flip Counter Stats === */}
            <FlipCounter
              total={mediaItems.length}
              photos={mediaItems.filter(m => m.type === "photo").length}
              videos={mediaItems.filter(m => m.type === "video").length}
            />

            {/* Right Box: Segmented Filters */}
            <div className="relative flex bg-[#050505] p-1.5 rounded-full border border-white/10 shadow-inner w-full md:w-auto justify-center">
              {(["all", "photos", "videos"] as MediaType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  data-clickable
                  className={`relative z-10 px-6 py-3 md:px-8 md:py-3 rounded-full font-mono text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-300 flex-1 md:flex-none cursor-pointer ${
                    filter === type
                      ? "text-black"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {filter === type && (
                    <motion.div
                      layoutId="filterTabIndicator"
                      className="absolute inset-0 bg-[#4F9EFF] shadow-[0_0_20px_rgba(0,242,255,0.6)] rounded-full"
                      style={{ zIndex: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative" style={{ zIndex: 1 }}>{type}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-12 min-h-[60vh]">
        <AnimatePresence mode="wait">
          {!effectiveFolder ? (
            /* ================= FOLDER GRID VIEW ================= */
            <motion.div
              key="folder-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              style={{ perspective: "1200px" }}
            >
              {Object.entries(groupedByEvent).map(([eventSlug, items], index) => {
                const eventData = events.find(e => e.slug === eventSlug);
                const thumbnail = items.find(i => i.type === "photo")?.src || items[0]?.src;
                const cardTilt = tilt[eventSlug] || { x: 0, y: 0, mx: 0, my: 0 };
                const isHovered = hoveredFolder === eventSlug;

                return (
                  <motion.div
                    key={`folder-${eventSlug}`}
                    layoutId={`folder-${eventSlug}`}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                    onClick={() => setActiveFolder(eventSlug)}
                    onMouseMove={(e) => handleTiltMove(e, eventSlug)}
                    onMouseLeave={() => { handleTiltLeave(eventSlug); setHoveredFolder(null); }}
                    onMouseEnter={() => setHoveredFolder(eventSlug)}
                    data-clickable
                    className="group cursor-pointer flex flex-col relative w-full rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden holo-border"
                    style={{
                      transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                      transformStyle: "preserve-3d",
                      transition: "transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s",
                      boxShadow: `
                        0 2px 4px rgba(0, 0, 0, 0.3),
                        0 8px 16px rgba(0, 0, 0, 0.25),
                        0 24px 48px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.03)
                      `,
                    }}
                  >
                    {/* Top Section: Thumbnail with parallax layers */}
                    <div className="relative w-full aspect-video bg-[#050505] overflow-hidden">
                      {thumbnail ? (
                        <>
                          {/* === Parallax Layer 1: Thumbnail (deepest) === */}
                          <div
                            className="absolute inset-0 transition-transform duration-150 ease-out"
                            style={{
                              transform: `translateX(${cardTilt.mx * 0.3}px) translateY(${cardTilt.my * 0.3}px) scale(1.08)`,
                              transformStyle: "preserve-3d",
                            }}
                          >
                            <Image
                              src={thumbnail}
                              alt={`${eventData?.title || eventSlug} cover photo`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>

                          {/* Dark Fade Overlay for Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/20 z-10" />

                          {/* === Parallax Layer 2: Hover Action Overlay (mid layer) === */}
                          <div
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 backdrop-blur-sm z-20"
                            style={{
                              transform: `translateX(${cardTilt.mx * 0.6}px) translateY(${cardTilt.my * 0.6}px) translateZ(30px)`,
                              transition: "opacity 0.3s, transform 0.15s ease-out",
                            }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-75 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#4F9EFF] hover:border-[#4F9EFF] hover:text-black hover:shadow-[0_0_15px_rgba(0,242,255,0.5)] cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); setActiveFolder(eventSlug); }}
                              aria-label={`Open ${eventData?.title || eventSlug} folder`}
                            >
                              <FolderOpen className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-100 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-pointer"
                              onClick={(e) => handleDownload(e, thumbnail, `${eventSlug}-cover`)}
                              aria-label="Download cover image"
                            >
                              <Download className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-150 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#FF8C00] hover:border-[#FF8C00] hover:text-black hover:shadow-[0_0_15px_rgba(255,140,0,0.5)] cursor-pointer"
                              onClick={(e) => handleShare(e, eventData?.title || eventSlug, eventSlug)}
                              aria-label="Share gallery"
                            >
                              <Share2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#050505] flex items-center justify-center">
                          <FolderOpen className="w-16 h-16 text-white/10" />
                        </div>
                      )}

                      {/* === ADDON: 3D Stacked Deck Preview === */}
                      {items.length > 1 && (
                        <div
                          className="absolute top-4 right-4 flex z-10"
                          style={{
                            transformStyle: "preserve-3d",
                            perspective: "500px",
                          }}
                        >
                          {items.slice(1, 4).map((mediaItem, i) => {
                            const fanAngle = isHovered ? (i - 1) * 15 : (i - 1) * 5;
                            const fanX = isHovered ? (i - 1) * 12 : 0;
                            const fanZ = isHovered ? (2 - i) * 8 : (15 - i * 5);
                            return (
                              <div
                                key={i}
                                className="deck-card w-8 h-8 rounded-md overflow-hidden border border-white/20 shadow-lg"
                                style={{
                                  background: mediaItem.src
                                    ? `url(${mediaItem.src}) center/cover`
                                    : "rgba(0, 242, 255, 0.08)",
                                  transform: `rotate(${fanAngle}deg) translateX(${fanX}px) translateZ(${fanZ}px)`,
                                  transformStyle: "preserve-3d",
                                  zIndex: 3 - i,
                                  opacity: isHovered ? 1 : 0.7,
                                  marginLeft: i > 0 ? (isHovered ? "-4px" : "-8px") : "0",
                                }}
                              >
                                {!mediaItem.src && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Layers className="w-3 h-3 text-white/50" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Glow Floor */}
                      <div
                        className="absolute -bottom-1 left-4 right-4 h-3 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: "radial-gradient(ellipse, rgba(0, 242, 255, 0.3), transparent)",
                          filter: "blur(6px)",
                          transform: "scaleX(0.8)",
                        }}
                      />
                    </div>

                    {/* === Parallax Layer 3: Info Section (front layer) === */}
                    <div
                      className="relative px-6 py-5 z-10 flex flex-col gap-2"
                      style={{
                        transform: `translateX(${cardTilt.mx * 1}px) translateY(${cardTilt.my * 1}px) translateZ(40px)`,
                        transition: "transform 0.15s ease-out",
                        transformStyle: "preserve-3d",
                      }}
                    >
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-[#4F9EFF]/10 flex items-center justify-center border border-[#4F9EFF]/30 group-hover:bg-[#4F9EFF] group-hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all duration-300 shrink-0">
                           <FolderOpen className="w-5 h-5 text-[#4F9EFF] group-hover:text-black transition-colors" />
                         </div>
                         <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider line-clamp-1 group-hover:text-[#4F9EFF] transition-colors duration-300" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                           {eventData?.title || eventSlug}
                         </h3>
                       </div>
                    </div>

                    {/* === Parallax Layer 4: Metadata (frontmost) === */}
                    <div
                      className="mt-auto p-5 pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-white/5 pt-4 z-10"
                      style={{
                        transform: `translateX(${cardTilt.mx * 0.5}px) translateY(${cardTilt.my * 0.5}px) translateZ(20px)`,
                        transition: "transform 0.15s ease-out",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-300 transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest">{eventData?.date || "Archive"}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {items.filter(i => i.type === "photo").length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#4F9EFF] bg-[#4F9EFF]/10 px-2.5 py-1 rounded-md border border-[#4F9EFF]/20 group-hover:border-[#4F9EFF]/40 transition-colors">
                            <ImageIcon className="w-3 h-3" />
                            {items.filter(i => i.type === "photo").length}
                          </span>
                        )}
                        {items.filter(i => i.type === "video").length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#FF8C00] bg-[#FF8C00]/10 px-2.5 py-1 rounded-md border border-[#FF8C00]/20 group-hover:border-[#FF8C00]/40 transition-colors">
                            <Film className="w-3 h-3" />
                            {items.filter(i => i.type === "video").length}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {Object.keys(groupedByEvent).length === 0 && (
                <div className="col-span-full py-32 text-center text-gray-500 font-mono text-sm uppercase tracking-widest">
                  No folders match filter_
                </div>
              )}
            </motion.div>
          ) : (
            /* ================= INSIDE FOLDER VIEW ================= */
            <motion.div
              key="inside-folder"
              layoutId={`folder-${effectiveFolder}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative min-h-[50vh] p-2 sm:p-4 rounded-3xl bg-[#050505]/90 backdrop-blur-xl border border-[#4F9EFF]/20 shadow-[0_0_50px_rgba(0,242,255,0.05)] origin-center"
            >
              {/* Folder Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10 relative">
                <div className="flex flex-col gap-4">
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setActiveFolder(null)}
                    data-clickable
                    className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors w-max cursor-pointer"
                  >
                    <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Gallery
                  </motion.button>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-black text-white uppercase tracking-wider relative drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {events.find(e => e.slug === effectiveFolder)?.title || effectiveFolder}
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex bg-white/5 backdrop-blur-md rounded-full p-1.5 gap-2 text-xs font-mono uppercase text-gray-300 self-start md:self-auto border border-white/10 shadow-lg"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40">
                    <Calendar className="w-3.5 h-3.5 text-[#4F9EFF]" />
                    {events.find(e => e.slug === effectiveFolder)?.date || "Archived"}
                  </div>
                  {events.find(e => e.slug === effectiveFolder)?.location && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40">
                      <MapPin className="w-3.5 h-3.5 text-[#4F9EFF]" />
                      {events.find(e => e.slug === effectiveFolder)?.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40">
                    <FolderOpen className="w-3.5 h-3.5 text-[#4F9EFF]" />
                    <span className="font-bold">{activeFolderItems.length} Files</span>
                  </div>
                </motion.div>
              </div>

              {/* === ADDON: Masonry Grid with Glitch Effect on Hover === */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6" style={{ perspective: "1200px" }}>
                {activeFolderItems.map((item, index) => {
                  const isLoaded = loadedImages.has(item.src);
                  const depthShift = (index % 3) * 4;

                  return (
                    <motion.div
                      key={`${item.event}-${index}`}
                      layoutId={`media-${item.src}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.4
                      }}
                      className="relative group cursor-pointer w-full rounded-xl md:rounded-2xl overflow-hidden bg-[#0A0A0A] break-inside-avoid border border-white/5 hover:border-[#4F9EFF]/30 glitch-on-hover"
                      data-clickable
                      style={{
                        boxShadow: `
                          0 2px 4px rgba(0, 0, 0, 0.3),
                          0 8px 16px rgba(0, 0, 0, 0.2),
                          0 ${8 + depthShift}px ${24 + depthShift * 2}px rgba(0, 0, 0, 0.15),
                          0 0 0 1px rgba(255, 255, 255, 0.02)
                        `,
                        transform: `translateZ(${depthShift}px)`,
                        transformStyle: "preserve-3d",
                        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                      }}
                      onClick={() => openLightbox(index)}
                    >
                      {/* Loading State */}
                      {!isLoaded && item.type === "photo" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#050505] min-h-[200px]">
                          <motion.div
                            className="w-6 h-6 border-2 border-[#4F9EFF] border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                      )}

                      {/* Media Content */}
                      {item.type === "video" ? (
                        <video
                          src={item.src}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => {
                            const video = e.currentTarget as HTMLVideoElement;
                            video.play().catch(()=>null);
                          }}
                          onMouseLeave={(e) => {
                            const video = e.currentTarget as HTMLVideoElement;
                            video.pause();
                            video.currentTime = 0;
                          }}
                        />
                      ) : (
                        <Image
                          src={item.src}
                          alt={`${item.eventTitle} photo ${index + 1}`}
                          width={800}
                          height={1200}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                          onLoad={() => handleImageLoad(item.src)}
                        />
                      )}

                      {/* Hover Overlay with View Icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                        <motion.div
                          className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md transform scale-50 group-hover:scale-100 transition-transform duration-300"
                        >
                          {item.type === "video" ? <Film className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </motion.div>
                      </div>

                      {/* Glow Floor */}
                      <div
                        className="absolute -bottom-1 left-4 right-4 h-3 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: "radial-gradient(ellipse, rgba(0, 242, 255, 0.3), transparent)",
                          filter: "blur(6px)",
                          transform: "scaleX(0.7)",
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal with 3D Scale-from-Origin */}
      <AnimatePresence>
        {selectedIndex !== null && effectiveFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center overscroll-none"
          >
            {/* Click outside to close helper */}
            <div className="absolute inset-0 z-0" onClick={() => setSelectedIndex(null)} />

            {/* Top Toolbar */}
            <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
              <div />

              <div className="flex gap-3 pointer-events-auto">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Close lightbox"
                  data-clickable
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full p-3 transition-colors backdrop-blur-md cursor-pointer"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </motion.button>
              </div>
            </div>

            {/* Navigation Arrows (Desktop) */}
            {activeFolderItems.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-40 pointer-events-none hidden md:flex">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  aria-label="Previous image"
                  data-clickable
                  className="pointer-events-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-md cursor-pointer"
                >
                  <ChevronLeft className="h-8 w-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  aria-label="Next image"
                  data-clickable
                  className="pointer-events-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-md cursor-pointer"
                >
                  <ChevronRight className="h-8 w-8" />
                </motion.button>
              </div>
            )}

            {/* Media Content Wrapper */}
            <div className="w-full h-full flex items-center justify-center relative z-20 pointer-events-none overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selectedIndex}
                  custom={direction}
                  layoutId={`media-${activeFolderItems[selectedIndex]?.src}`}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? 1000 : -1000, opacity: 0, scale: 0.9, rotateY: d > 0 ? 10 : -10 }),
                    center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
                    exit: (d: number) => ({ x: d < 0 ? 1000 : -1000, opacity: 0, scale: 0.9, rotateY: d < 0 ? 10 : -10, transition: { duration: 0.2 } })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      nextImage();
                    } else if (swipe > swipeConfidenceThreshold) {
                      prevImage();
                    }
                  }}
                  className="absolute w-full h-full p-4 md:p-16 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
                  onClick={(e) => e.stopPropagation()}
                  style={{ transformPerspective: 1000 }}
                >
                  {activeFolderItems[selectedIndex]?.type === "video" ? (
                    <video
                      src={activeFolderItems[selectedIndex]?.src}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                     <Image
                      src={activeFolderItems[selectedIndex]?.src}
                      alt={`${activeFolderItems[selectedIndex]?.eventTitle} full view ${selectedIndex + 1}`}
                      fill
                      className="object-contain drop-shadow-2xl select-none"
                      draggable={false}
                      sizes="100vw"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-6 md:bottom-10 inset-x-0 flex justify-center z-50 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full flex items-center gap-4 shadow-2xl">
                <span className="text-white font-mono text-sm tracking-widest">
                  {selectedIndex + 1} <span className="text-white/30 mx-1">/</span> {activeFolderItems.length}
                </span>
                <div className="w-px h-4 bg-white/20" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); handleDownload(e, activeFolderItems[selectedIndex].src, `${activeFolderItems[selectedIndex].event}-${selectedIndex}`); }}
                  className="pointer-events-auto text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Download image"
                  data-clickable
                >
                  <Download className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
