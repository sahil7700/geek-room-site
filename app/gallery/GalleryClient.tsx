"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Film, X, ChevronLeft, ChevronRight, Search, Download, Calendar, MapPin, FolderOpen } from "lucide-react";
import Image from "next/image";
import { EventDetails } from "../events/data";

type MediaType = "all" | "photos" | "videos";

interface GalleryClientProps {
  events: EventDetails[];
}

function AnimatedCounter({ value, label, delay = 0 }: { value: number, label: string, delay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(value);
      return;
    }
    
    const duration = 1500;
    const incrementTime = Math.max(duration / end, 10);
    
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(counter);
      }, incrementTime);
      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 min-w-[100px] shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors hover:border-[#00F2FF]/30">
      <span className="block text-2xl font-bold text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
        {count.toString().padStart(2, '0')}
      </span>
      <span className={`text-[10px] uppercase tracking-widest font-mono ${label === 'Photos' ? 'text-[#00F2FF]' : label === 'Videos' ? 'text-[#FF8C00]' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function GalleryClient({ events }: GalleryClientProps) {
  const [filter, setFilter] = useState<MediaType>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

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

  const groupedByEvent: Record<string, typeof mediaItems> = {};
  filteredMedia.forEach(item => {
    if (!groupedByEvent[item.event]) {
      groupedByEvent[item.event] = [];
    }
    groupedByEvent[item.event].push(item);
  });

  useEffect(() => {
    if (activeFolder && !groupedByEvent[activeFolder]) {
      setActiveFolder(null); // Reset if current folder is filtered out
    }
  }, [filter, activeFolder, groupedByEvent]);

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => new Set([...prev, src]));
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  // For lightbox navigation we want only the currently active folder's items
  const activeFolderItems = activeFolder ? groupedByEvent[activeFolder] || [] : [];
  
  const nextImage = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % activeFolderItems.length;
    });
  };

  const prevImage = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + activeFolderItems.length) % activeFolderItems.length;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") setSelectedIndex(null);
      } else if (activeFolder) {
        // Allow escape to close folder logic if we aren't in lightbox
        if (e.key === "Escape") setActiveFolder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, activeFolder, activeFolderItems.length]);
  
  const handleDownload = (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getMasonryHeight = (idx: number) => {
    const pattern = [300, 450, 350, 400];
    return pattern[idx % pattern.length];
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#ededed] relative overflow-hidden">
      {/* Background Overlay Nodes */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.08)_0%,transparent_50%)] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_bottom_right,rgba(255,140,0,0.05)_0%,transparent_50%)] pointer-events-none z-0" />

      {/* Minimized Page Header */}
      <div className="relative pt-24 pb-8 px-4 text-center border-b border-white/5 z-10">
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent via-[#00F2FF]/50 to-[#00F2FF]" />
            <div className="relative">
              <Film className="h-8 w-8 text-[#00F2FF]" />
              <motion.div 
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
                className="absolute inset-0 bg-[#00F2FF] blur-[15px] -z-10 rounded-full" 
              />
            </div>
            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent via-[#FF8C00]/50 to-[#FF8C00]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              <span className="text-[#00F2FF] opacity-80 mr-2">{'<'}</span>
              MEDIA ARCHIVE
              <span className="text-[#FF8C00] opacity-80 ml-2">{'/>'}</span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-sm font-mono text-gray-400 max-w-xl mx-auto uppercase tracking-widest mb-8"
          >
            Explore photos & videos
          </motion.p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-2">
            {/* Animated Stats Counters */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-3 md:gap-4"
            >
              <AnimatedCounter value={mediaItems.length} label="Total" delay={400} />
              <AnimatedCounter value={mediaItems.filter(m => m.type === "photo").length} label="Photos" delay={600} />
              <AnimatedCounter value={mediaItems.filter(m => m.type === "video").length} label="Videos" delay={800} />
            </motion.div>

            {/* Cyber UI Filter Pills */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full items-center shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              {(["all", "photos", "videos"] as MediaType[]).map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`relative px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold overflow-hidden transition-all duration-300 ${
                    filter === type
                      ? "text-black bg-[#00F2FF] shadow-[0_0_20px_rgba(0,242,255,0.5)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {filter === type && (
                    <motion.div 
                      layoutId="filterTabIndicator"
                      className="absolute inset-0 bg-[#00F2FF] -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{type}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-12 min-h-[60vh]">
        <AnimatePresence mode="wait">
          {!activeFolder ? (
            /* ================= FOLDER GRID VIEW ================= */
            <motion.div
              key="folder-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8"
            >
              {Object.entries(groupedByEvent).map(([eventSlug, items], index) => {
                const eventData = events.find(e => e.slug === eventSlug);
                const thumbnail = items.find(i => i.type === "photo")?.src || items[0]?.src; // Prefer photo for thumbnail

                return (
                  <motion.div
                    key={`folder-${eventSlug}`}
                    layoutId={`folder-${eventSlug}`}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                    onClick={() => setActiveFolder(eventSlug)}
                    className="cursor-pointer flex flex-col relative w-full perspective-[1500px]"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.div 
                      variants={{ 
                        hover: { y: -20, scale: 1.05 },
                        tap: { scale: 0.95, y: 0 }
                      }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="relative w-full aspect-[4/3] flex flex-col items-start z-10"
                    >
                      {/* Folder Glow Profile */}
                      <motion.div 
                        variants={{ hover: { opacity: 1, scale: 1.1 } }}
                        initial={{ opacity: 0 }}
                        className="absolute inset-0 top-[10%] bg-[#00F2FF]/30 blur-2xl rounded-xl z-0 pointer-events-none"
                      />

                      {/* Folder Back Tab */}
                      <motion.div 
                        variants={{ hover: { backgroundColor: "rgba(0, 242, 255, 0.2)", borderColor: "rgba(0, 242, 255, 0.8)", y: -5, rotateX: 10 } }}
                        className="w-1/3 h-[12%] bg-[#0a0a0a] border-t border-l border-r border-[#00F2FF]/40 rounded-t-lg relative z-10 transition-colors duration-300 origin-bottom" 
                      />
                      
                      {/* Folder Back Body */}
                      <motion.div 
                        variants={{ hover: { borderColor: "rgba(0, 242, 255, 0.8)" } }}
                        className="w-full h-[88%] bg-[#050505] border border-[#00F2FF]/40 rounded-b-lg rounded-tr-lg relative z-10 flex items-end justify-center overflow-hidden transition-colors duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                      >
                        {/* Blurred Thumbnail inside folder */}
                        {thumbnail && (
                          <div className="absolute inset-0 z-0">
                            <Image src={thumbnail} alt="preview" fill sizes="25vw" className="object-cover blur-[10px] scale-110 opacity-40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
                          </div>
                        )}

                        {/* Middle Layer - Files */}
                        <motion.div 
                          className="absolute bottom-0 w-[85%] h-[92%] left-1/2 -translate-x-1/2 origin-bottom z-20"
                        >
                          {/* 3rd Item (Back) */}
                          {items[2] && (
                            <motion.div 
                              variants={{ hover: { rotate: -12, x: -30, y: -40, scale: 1.05 } }}
                              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                              className="absolute inset-0 bg-[#111] rounded-lg border border-white/10 shadow-xl overflow-hidden z-[21]"
                            >
                              <Image src={items[2].src} alt="" fill sizes="10vw" className="object-cover opacity-50" />
                            </motion.div>
                          )}
                          {/* 2nd Item (Middle) */}
                          {items[1] && (
                            <motion.div 
                              variants={{ hover: { rotate: 12, x: 30, y: -20, scale: 1.05 } }}
                              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }}
                              className="absolute inset-0 bg-[#222] rounded-lg border border-white/10 shadow-xl overflow-hidden z-[22]"
                            >
                               <Image src={items[1].src} alt="" fill sizes="10vw" className="object-cover opacity-70" />
                            </motion.div>
                          )}
                          {/* 1st Item (Front thumbnail) */}
                          <motion.div 
                            variants={{ hover: { scale: 1.15, y: -60, rotate: -2 } }}
                            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                            className="absolute inset-0 bg-[#050505] rounded-lg border border-[#00F2FF]/50 shadow-[0_15px_30px_rgba(0,0,0,0.6)] overflow-hidden z-[23]"
                          >
                            {thumbnail && (
                              <Image
                                src={thumbnail}
                                alt={eventSlug}
                                fill
                                sizes="(max-width: 640px) 100vw, 25vw"
                                className="object-cover"
                              />
                            )}
                            <motion.div 
                               variants={{ hover: { opacity: 1, scale: 1.1 } }}
                               initial={{ opacity: 0 }}
                               transition={{ duration: 0.3 }}
                               className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none"
                            >
                              <FolderOpen className="w-12 h-12 text-[#00F2FF] drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]" />
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      {/* Folder Front Lid (Top Layer) */}
                      <motion.div 
                        variants={{ hover: { rotateX: -60, borderColor: "rgba(0, 242, 255, 0.8)", y: 2 } }}
                        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        className="absolute bottom-0 w-full h-[88%] bg-gradient-to-t from-[#050505] to-[#111] border border-[#00F2FF]/40 rounded-b-lg rounded-tr-lg z-30 origin-bottom flex flex-col justify-end p-4 shadow-[0_-5px_25px_rgba(0,0,0,0.9)]"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Front Lid Decoration */}
                        <div className="absolute top-4 right-4 w-12 h-2 rounded-full bg-[#00F2FF]/20 border border-[#00F2FF]/30" style={{ transform: 'translateZ(1px)' }} />
                        <div className="absolute top-8 right-4 w-8 h-2 rounded-full bg-[#00F2FF]/20 border border-[#00F2FF]/30" style={{ transform: 'translateZ(1px)' }} />

                        {/* Folder Info */}
                        <div className="flex flex-col gap-1 items-start relative z-10" style={{ transform: 'translateZ(10px)' }}>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider line-clamp-1 transition-colors drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                            {eventData?.title || eventSlug}
                          </h3>
                          <div className="flex items-center justify-between mt-1 w-full">
                            <div className="flex items-center gap-1.5 opacity-80 backdrop-blur-md bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                              <Calendar className="w-3 h-3 text-[#FF8C00]" />
                              <span className="text-[10px] sm:text-xs font-mono text-gray-300">{eventData?.date || "Archive"}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#00F2FF] bg-[#00F2FF]/10 px-2 py-0.5 rounded border border-[#00F2FF]/30 backdrop-blur-md shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                              {items.length} Files
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
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
              layoutId={`folder-${activeFolder}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative min-h-[50vh] p-2 sm:p-4 rounded-3xl bg-[#050505]/90 backdrop-blur-xl border border-[#00F2FF]/20 shadow-[0_0_50px_rgba(0,242,255,0.05)] origin-center"
            >
              {/* Folder Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10 relative">
                <div className="flex flex-col gap-4">
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setActiveFolder(null)}
                    className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00F2FF] hover:text-white transition-colors w-max"
                  >
                    <div className="p-1 rounded bg-[#00F2FF]/10 border border-[#00F2FF]/30 group-hover:bg-[#00F2FF] group-hover:text-black transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Folders
                  </motion.button>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider relative" 
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {events.find(e => e.slug === activeFolder)?.title || activeFolder}
                  </motion.h2>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex border border-white/10 bg-[#050505]/50 backdrop-blur-md rounded-lg p-2 gap-4 text-xs font-mono uppercase text-gray-400 self-start md:self-auto"
                >
                  <div className="flex items-center gap-2 px-2">
                    <Calendar className="w-4 h-4 text-[#FF8C00]" />
                    {events.find(e => e.slug === activeFolder)?.date || "Archived"}
                  </div>
                  {events.find(e => e.slug === activeFolder)?.location && (
                    <div className="flex items-center gap-2 px-2 border-l border-white/10">
                      <MapPin className="w-4 h-4 text-[#FF8C00]" />
                      {events.find(e => e.slug === activeFolder)?.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-2 border-l border-white/10">
                    <FolderOpen className="w-4 h-4 text-[#00F2FF]" />
                    <span className="text-[#00F2FF] font-bold">{activeFolderItems.length} Files</span>
                  </div>
                </motion.div>
              </div>

              {/* Staggered Images Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
                {activeFolderItems.map((item, index) => {
                  const isLoaded = loadedImages.has(item.src);
                  const height = getMasonryHeight(index);

                  return (
                    <motion.div
                      key={`${item.event}-${index}`}
                      initial={{ opacity: 0, scale: 0.5, y: 150 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -50, transition: { duration: 0.2 } }}
                      transition={{ 
                        delay: 0.1 + (index * 0.04), // tighter stagger effect
                        type: "spring", stiffness: 120, damping: 14 
                      }}
                      className="relative group cursor-pointer w-full mb-6 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] break-inside-avoid shadow-xl transition-all duration-500 hover:border-[#00F2FF]/40 hover:shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:-translate-y-1"
                      style={{ minHeight: `${height}px` }}
                      onClick={() => openLightbox(index)}
                    >
                      {/* Loading State */}
                      {!isLoaded && item.type === "photo" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
                          <motion.div
                            className="w-8 h-8 border-2 border-[#00F2FF] border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                      )}

                      {/* Media Content */}
                      {item.type === "video" ? (
                        <div className="absolute inset-0 w-full h-full">
                          <video
                            src={item.src}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                        </div>
                      ) : (
                        <div className="absolute inset-0 w-full h-full">
                          <Image
                            src={item.src}
                            alt={`${item.eventTitle} media`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={`object-cover transition-transform duration-700 group-hover:scale-[1.03] ${isLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => handleImageLoad(item.src)}
                          />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-0 right-0 p-4 z-20 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                          {item.type === "video" ? (
                            <Film className="h-4 w-4 text-[#FF8C00]" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-[#00F2FF]" />
                          )}
                        </div>
                      </div>

                      {/* Hover Glass Overlay Details */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
                        <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <button 
                            className="w-12 h-12 rounded-full bg-[#00F2FF]/20 border border-[#00F2FF]/50 flex items-center justify-center text-[#00F2FF] hover:bg-[#00F2FF] hover:text-black transition-colors"
                          >
                            <Search className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => handleDownload(e, item.src, `${item.event}-${index}`)}
                            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                        <span className="absolute bottom-4 right-4 text-xs font-mono font-bold text-white/50 tracking-widest">
                          #{(index + 1).toString().padStart(2, "0")}
                        </span>
                      </div>

                      {/* Tech Decorative Corners on Hover */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00F2FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00F2FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && activeFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-4"
          >
            {/* Top Toolbar */}
            <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-50 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-2xl pointer-events-auto"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-1 line-clamp-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {activeFolderItems[selectedIndex]?.eventTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono text-[#00F2FF]">
                  <span className="opacity-80">[{activeFolderItems[selectedIndex]?.date || "Archived"}]</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span>{selectedIndex + 1} / {activeFolderItems.length}</span>
                </div>
              </motion.div>
              
              <div className="flex gap-3 pointer-events-auto">
                <motion.button
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  onClick={(e) => handleDownload(e, activeFolderItems[selectedIndex].src, `${activeFolderItems[selectedIndex].event}-${selectedIndex}`)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full p-3 md:p-4 transition-colors backdrop-blur-md"
                >
                  <Download className="h-5 w-5 md:h-6 md:w-6" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  onClick={() => setSelectedIndex(null)}
                  className="bg-[#00F2FF]/20 hover:bg-[#00F2FF]/30 border border-[#00F2FF]/50 text-[#00F2FF] rounded-full p-3 md:p-4 transition-colors backdrop-blur-md shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </motion.button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {activeFolderItems.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 z-40 pointer-events-none">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="pointer-events-auto bg-black/60 hover:bg-[#00F2FF] border border-[#00F2FF]/30 hover:border-[#00F2FF] text-white hover:text-black rounded-full p-4 transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  <ChevronLeft className="h-8 w-8" />
                </motion.button>
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="pointer-events-auto bg-black/60 hover:bg-[#00F2FF] border border-[#00F2FF]/30 hover:border-[#00F2FF] text-white hover:text-black rounded-full p-4 transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  <ChevronRight className="h-8 w-8" />
                </motion.button>
              </div>
            )}

            {/* Media Content Wrapper */}
            <div className="w-full max-w-[90vw] h-[80vh] flex items-center justify-center relative mt-16 md:mt-0" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex items-center justify-center pointer-events-none"
                >
                  {activeFolderItems[selectedIndex]?.type === "video" ? (
                    <video
                      src={activeFolderItems[selectedIndex]?.src}
                      className="max-w-full max-h-full object-contain rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,242,255,0.15)] pointer-events-auto"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="relative w-full h-full pointer-events-auto">
                       <Image
                        src={activeFolderItems[selectedIndex]?.src}
                        alt={`Gallery Fullscreen ${selectedIndex + 1}`}
                        fill
                        className="object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                        sizes="90vw"
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Keyboard Hint */}
            <div className="absolute bottom-6 font-mono text-[10px] text-white/30 tracking-widest">
              USE ARROW KEYS TO NAVIGATE (ESC TO CLOSE)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
