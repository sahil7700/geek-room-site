import { LogoSequence } from "@/components/LogoSequence";
import { LandingContent } from "@/components/LandingContent";

export default function Home() {
  return (
    <main className="relative bg-[#050505] min-h-screen text-[#ededed]">
      {/* 400vh Scrollytelling hero section */}
      <LogoSequence />
      
      {/* Additional informative content below the hero */}
      <LandingContent />
    </main>
  );
}
