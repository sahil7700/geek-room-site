"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

const FRAME_COUNT = 232;
// Generate paths from ezgif-frame-001.jpg to ezgif-frame-232.jpg
const getFramePath = (index: number) => {
  const paddedIndex = index.toString().padStart(3, "0");
  return `/ezgif-6bd10c8b75cb7195-jpg/ezgif-frame-${paddedIndex}.jpg`;
};

export function LogoSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, FRAME_COUNT]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          setIsLoaded(true);
        }
      };
      loadedImages[i] = img;
    }
    setImages(loadedImages);
  }, []);

  // Make canvas responsive
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Get current frame index
      const currentIndex = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.round(frameIndex.get()))
      );

      const img = images[currentIndex];
      if (!img || !img.complete) return;

      // Ensure canvas matches screen logic, using object-contain approach
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;

      // scale logic (object-contain)
      const scale = Math.min(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    };

    // Listen to frame changes
    const unsubscribe = frameIndex.on("change", render);
    
    // Also render on resize
    window.addEventListener("resize", render);

    // Initial render if loaded
    if (isLoaded) {
      setTimeout(render, 50); // slight delay to ensure dimmensions
    }

    return () => {
      unsubscribe();
      window.removeEventListener("resize", render);
    };
  }, [frameIndex, images, isLoaded]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-[#050505]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-[env(safe-area-inset-top,0px)] h-screen w-full overflow-hidden flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050505] text-[#00F2FF]">
            <div className="text-xl tracking-[0.2em] mb-4 uppercase font-mono">Initializing Sequence</div>
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00F2FF] to-[#FF8C00] transition-all duration-300"
                style={{ width: `${loadingProgress * 100}%` }}
              />
            </div>
            <div className="mt-4 text-xs font-mono text-gray-500">
              FRAME {Math.round(loadingProgress * FRAME_COUNT)} / {FRAME_COUNT}
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Text Beats Overlay */}
        {isLoaded && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center container mx-auto px-4 z-10">
            {/* Beat A (0-20%) */}
            <Beat 
              progress={smoothProgress} 
              range={[0, 0.1, 0.2, 0.25]} 
              title="ORIGIN BY CODE" 
              subtitle="Forging digital infrastructure." 
            />
            {/* Beat B (25-45%) */}
            <Beat 
              progress={smoothProgress} 
              range={[0.25, 0.35, 0.45, 0.5]} 
              title="ARCHITECTURAL PRECISION" 
              subtitle="Brackets aligned, logic secured." 
            />
            {/* Beat C (50-70%) */}
            <Beat 
              progress={smoothProgress} 
              range={[0.5, 0.6, 0.7, 0.75]} 
              title="ENERGIZED CORE" 
              subtitle="Igniting the hardware-software bridge." 
            />
            {/* Beat D (75-100%) */}
            <BeatD progress={smoothProgress} range={[0.75, 0.85, 1, 1]} />
          </div>
        )}
      </div>
    </div>
  );
}

function Beat({ progress, range, title, subtitle }: { progress: any, range: number[], title: string, subtitle: string }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [50, 0, 0, -50]);

  return (
    <motion.div 
      style={{ opacity, y }} 
      className="absolute text-center flex flex-col items-center justify-center drop-shadow-2xl"
    >
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-4 uppercase drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
        {title}
      </h2>
      <p className="text-lg md:text-2xl text-gray-400 font-medium tracking-wide">
        {subtitle}
      </p>
    </motion.div>
  );
}

function BeatD({ progress, range }: { progress: any, range: number[] }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 1]);
  const y = useTransform(progress, range, [50, 0, 0, 0]);

  return (
    <motion.div 
      style={{ opacity, y }} 
      className="absolute text-center flex flex-col items-center justify-center drop-shadow-2xl pointer-events-auto"
    >
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] to-[#FF8C00] mb-8 uppercase drop-shadow-[0_0_20px_rgba(255,140,0,0.6)]">
        DEPLOYING THE FUTURE
      </h2>
      <button className="px-8 py-4 bg-transparent border border-[#00F2FF] text-[#00F2FF] font-mono tracking-widest text-sm hover:bg-[#00F2FF] hover:text-[#050505] transition-colors duration-300 pointer-events-auto">
        INITIALIZE DEPLOYMENT
      </button>
    </motion.div>
  );
}
