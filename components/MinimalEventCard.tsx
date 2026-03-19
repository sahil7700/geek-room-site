"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EventDetails } from "@/app/events/data";
import { Calendar, MapPin, Users } from "lucide-react";
import "./MinimalEventCard.css";

const formatEventDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return { day, month, year };
};

export default function MinimalEventCard({
  event,
  index,
  isLarge
}: {
  event: EventDetails;
  index: number;
  isLarge: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const effectLayerRef = useRef<HTMLDivElement>(null);
  
  const [scrambledTitle, setScrambledTitle] = useState(event.title);
  const [attendeeCount, setAttendeeCount] = useState(180);
  const [isHovered, setIsHovered] = useState(false);

  const isUpcoming = event.type === "upcoming";
  const { day, month, year } = formatEventDate(event.date);
  
  const scrambleRef = useRef<number | null>(null);

  // Use useEffect to ensure scrambling cleans up on unmount
  useEffect(() => {
    return () => {
      if (scrambleRef.current) cancelAnimationFrame(scrambleRef.current);
    };
  }, []);
  
  const scrambleText = () => {
    const originalText = event.title;
    const glitchChars = '█▓▒░@#$%&*';
    const duration = 800;
    const startTime = Date.now();
    const chars = originalText.split('');
    
    if (scrambleRef.current) cancelAnimationFrame(scrambleRef.current);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      let result = '';
      chars.forEach((char, i) => {
        const charProgress = Math.max(0, progress - (i * 0.05));
        
        if (charProgress < 0.7) {
          result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          result += char;
        }
      });
      
      setScrambledTitle(result);
      
      if (progress < 1) {
        scrambleRef.current = requestAnimationFrame(animate);
      } else {
        setScrambledTitle(originalText);
      }
    };
    
    scrambleRef.current = requestAnimationFrame(animate);
  };
  
  const animateCounter = (start: number, end: number, duration: number) => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setAttendeeCount(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !innerRef.current || !effectLayerRef.current) return;
    
    const bounds = cardRef.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Max 15 degrees tilt
    const rotateY = (mouseX / (bounds.width / 2)) * 15;
    const rotateX = -(mouseY / (bounds.height / 2)) * 15;
    
    innerRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    innerRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    
    // For unique effects that track mouse
    const rawX = e.clientX - bounds.left;
    const rawY = e.clientY - bounds.top;
    effectLayerRef.current.style.setProperty('--mouse-x', `${rawX}px`);
    effectLayerRef.current.style.setProperty('--mouse-y', `${rawY}px`);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    scrambleText();
    
    if (!cardRef.current || !effectLayerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    effectLayerRef.current.style.setProperty('--mouse-x', `${rawX}px`);
    effectLayerRef.current.style.setProperty('--mouse-y', `${rawY}px`);
    
    // Unique effect activations
    if (event.slug === 'geek-veek-2') {
      effectLayerRef.current.classList.remove('ripple-active');
      void effectLayerRef.current.offsetWidth;
      effectLayerRef.current.classList.add('ripple-active');
    } else if (event.slug === 'aptiverse') {
      animateCounter(180, 200, 1000);
    } else if (event.slug === 'hackforce') {
      effectLayerRef.current.classList.remove('scanline-active');
      void effectLayerRef.current.offsetWidth;
      effectLayerRef.current.classList.add('scanline-active');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (innerRef.current) {
      innerRef.current.style.setProperty('--rotate-x', '0deg');
      innerRef.current.style.setProperty('--rotate-y', '0deg');
    }
    
    if (effectLayerRef.current) {
      effectLayerRef.current.classList.remove('ripple-active');
      effectLayerRef.current.classList.remove('scanline-active');
    }
    
    if (event.slug === 'aptiverse') {
      setAttendeeCount(180);
    }
    
    if (scrambleRef.current) {
      cancelAnimationFrame(scrambleRef.current);
      setScrambledTitle(event.title);
    }
  };

  return (
    <motion.div
      layoutId={`card-${event.slug}`}
      initial="hidden"
      animate="visible"
      custom={index}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.05, ease: "easeOut" } }
      }}
      className={`event-card-minimal ${isLarge ? "md:col-span-2 md:row-span-1" : "col-span-1 row-span-1"}`}
      data-event={event.slug}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-inner" ref={innerRef}>
        <Link href={`/events/${event.slug}`} className="absolute inset-0 z-30 flex flex-col items-end" />
        
        {/* Background Image / Gradient Layer */}
        <div className="absolute inset-0 z-0 bg-[#050505]">
          {event.image ? (
            <>
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover opacity-20 transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#050505] opacity-80" />
          )}
        </div>

        {/* Content Structure */}
        <div className="relative p-6 md:p-8 z-10 h-full flex flex-col pointer-events-none">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-auto">
            <span className="event-date text-xs text-white/50 tracking-wider font-semibold uppercase font-['Inter']">
              {month} {day}, {year}
            </span>
            {isUpcoming && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold text-black bg-white">
                Active
              </span>
            )}
            <span className="ml-auto px-2 py-0.5 rounded-full border border-white/10 text-[10px] uppercase tracking-wider text-white/60 bg-white/5 backdrop-blur-sm">
              {event.category ? event.category.replace('-', ' ') : 'Event'}
            </span>
          </div>

          {/* Body */}
          <div className="mt-12 flex flex-col justify-end">
            <h3 
              className={`font-bold text-white mb-2 tracking-tight transition-colors duration-300 font-['Inter'] ${isLarge ? 'text-3xl' : 'text-2xl'}`}
              style={{
                color: (isHovered && event.slug === 'hackforce') ? 'rgba(0, 255, 0, 0.9)' : '',
                textShadow: (isHovered && event.slug === 'hackforce') ? '0 0 10px rgba(0, 255, 0, 0.3)' : (isHovered && event.slug === 'hackquanta') ? '0 0 20px rgba(139, 92, 246, 0.4)' : ''
              }}
            >
              {scrambledTitle}
            </h3>
            
            <p className="text-sm text-white/50 line-clamp-2 leading-relaxed h-[40px] font-['Inter']">
              {event.description}
            </p>

            {/* Footer Metrics */}
            <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/10 text-xs text-white/40 font-medium">
              {(event.location || event.time) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{event.location || 'Online'}</span>
                </div>
              )}
              
              <div 
                className="flex items-center gap-1.5 ml-auto transition-colors"
                style={{
                  color: (isHovered && event.slug === 'blockgen') ? '#FFD700' : '',
                  textShadow: (isHovered && event.slug === 'blockgen') ? '0 0 10px rgba(255, 215, 0, 0.3)' : ''
                }}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{attendeeCount}+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Effects */}
        <div className="hover-effect-layer" ref={effectLayerRef}></div>
      </div>
    </motion.div>
  );
}
