"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LogoAnimation from "./LogoAnimation";
import Robot3DBackground from "./Robot3DBackground";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  category: string;
  photo: string;
  gmail: string;
  linkedin: string;
};

interface TeamClientProps {
  members: TeamMember[];
  loggedInEmail: string | null;
}

const CATEGORY_ORDER = ["Core", "Heads", "Tech", "Design", "Publicity", "Management"];

export default function TeamClient({ members, loggedInEmail }: TeamClientProps) {
  // Group the dynamic members by category, preserving the desired order
  const teamDepartments = useMemo(() => {
    const grouped: Record<string, TeamMember[]> = {};
    for (const m of members) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    }
    return CATEGORY_ORDER
      .filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(cat => ({ title: cat.toUpperCase(), members: grouped[cat] }));
  }, [members]);
  const [heroQuoteIndex, setHeroQuoteIndex] = useState(0);
  const [isQuoteFading, setIsQuoteFading] = useState(false);
  const tourActiveRef = React.useRef(false);

  useEffect(() => {
    const cancelTour = () => { tourActiveRef.current = false; };
    window.addEventListener("wheel", cancelTour, { passive: true });
    window.addEventListener("touchstart", cancelTour, { passive: true });
    return () => {
      window.removeEventListener("wheel", cancelTour);
      window.removeEventListener("touchstart", cancelTour);
    };
  }, []);

  const handleAnimationComplete = useCallback(() => {
    document.body.style.overflow = "";
    tourActiveRef.current = true;
    
    const startTour = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const sections = document.querySelectorAll(".team-section");
      
      for (let i = 0; i < sections.length; i++) {
        if (!tourActiveRef.current) return;
        
        // Scroll to section
        sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
        
        // Wait for scroll to settle
        await new Promise(resolve => setTimeout(resolve, 800));
        if (!tourActiveRef.current) return;
        
        // Reveal the section header first
        const header = sections[i].querySelector(".section-header");
        if (header) header.classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 400));
        if (!tourActiveRef.current) return;
        
        // Get all cards in this section and pop them in one-by-one (wave)
        const cards = sections[i].querySelectorAll(".team-member");
        const CARD_STAGGER_MS = 120; // delay between each card popping
        
        for (let c = 0; c < cards.length; c++) {
          if (!tourActiveRef.current) return;
          cards[c].classList.add("wave-pop-in");
          await new Promise(resolve => setTimeout(resolve, CARD_STAGGER_MS));
        }
        
        // Wait for last card's animation to finish + a small pause
        await new Promise(resolve => setTimeout(resolve, 700));
      }
      
      if (!tourActiveRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 800));
      window.scrollTo({ top: 0, behavior: "smooth" });
      tourActiveRef.current = false;
    };
    
    startTour();
  }, []);

  const heroQuotes = [
    "\"Talk is cheap. Show me the code.\" - Linus Torvalds",
    "\"First, solve the problem. Then, write the code.\" - John Johnson",
    "\"Code is like humor. When you have to explain it, it’s bad.\" - Cory House",
    "\"It's not a bug. It's an undocumented feature!\" - Anonymous",
    "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" - Martin Fowler"
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Hero Quote Cycler
    const heroInterval = setInterval(() => {
      setIsQuoteFading(true);
      setTimeout(() => {
        setHeroQuoteIndex(prev => (prev + 1) % heroQuotes.length);
        setIsQuoteFading(false);
      }, 500); // Wait for fade out
    }, 4500);


    // Removed standalone navbar and mobile menu listeners

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
      revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) el.classList.add("active");
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // Scroll-based fallback: pop-in cards when they scroll into view (if tour was skipped)
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains("wave-pop-in")) {
          // Find all siblings in the same grid and stagger them
          const grid = entry.target.closest(".team-grid");
          if (grid) {
            const cards = grid.querySelectorAll(".team-member:not(.wave-pop-in)");
            cards.forEach((card, idx) => {
              setTimeout(() => {
                card.classList.add("wave-pop-in");
              }, idx * 120);
            });
          }
        }
      });
    }, { threshold: 0.1 });

    // Observe all team member cards
    document.querySelectorAll(".team-member").forEach(card => {
      cardObserver.observe(card);
    });

    // Smooth scroll for anchor links
    const smoothScroll = function (e: Event) {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener("click", smoothScroll));

    // Parallax effect for hero gradients
    const onParallaxMove = (e: MouseEvent) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      document.querySelectorAll(".hero-gradient-1, .hero-gradient-2, .hero-gradient-3").forEach((el, index) => {
        const factor = (index + 1) * 0.5;
        (el as HTMLElement).style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    };
    document.addEventListener("mousemove", onParallaxMove);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousemove", onParallaxMove);
      window.removeEventListener("scroll", revealOnScroll);
      cardObserver.disconnect();
      clearInterval(heroInterval);
    };
  }, []);

  return (
    <div className="kin-team-page">
      <style dangerouslySetInnerHTML={{
        __html: `
        .kin-team-page { --primary-bg: #050505; --secondary-bg: #111111; --card-bg: rgba(21,21,21,0.85); --accent-purple: #00F2FF; --accent-pink: #FF8C00; --accent-blue: #00F2FF; --accent-cyan: #00F2FF; --accent-orange: #FF8C00; --accent-green: #00F2FF; --text-primary: #ededed; --text-secondary: #a1a1aa; --text-muted: #71717a; --border-color: rgba(255, 255, 255, 0.1); --gradient-1: linear-gradient(135deg, #00F2FF 0%, #FF8C00 100%); --gradient-2: linear-gradient(135deg, #FF8C00 0%, #00F2FF 100%); --gradient-3: linear-gradient(135deg, #00F2FF 0%, #00F2FF 100%); --gradient-4: linear-gradient(135deg, #FF8C00 0%, #FF8C00 100%); font-family: var(--font-geist-sans), system-ui, sans-serif; background-color: transparent; color: var(--text-primary); line-height: 1.6; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        /* Removed Navbar CSS */
        .team-hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 10rem 4rem 6rem; text-align: center; overflow: hidden; }
        .hero-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; }
        .hero-gradient-1 { position: absolute; top: -30%; left: -20%; width: 70%; height: 70%; background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%); filter: blur(80px); animation: float 10s ease-in-out infinite; }
        .hero-gradient-2 { position: absolute; bottom: -30%; right: -20%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%); filter: blur(80px); animation: float 12s ease-in-out infinite reverse; }
        .hero-gradient-3 { position: absolute; top: 20%; right: 10%; width: 40%; height: 40%; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%); filter: blur(60px); animation: float 8s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -30px) scale(1.05); } 66% { transform: translate(-20px, 20px) scale(0.95); } }
        .hero-content { max-width: 900px; z-index: 1; }
        .hero-dynamic-quote { position: absolute; bottom: 6rem; left: 50%; width: 90%; transform: translateX(-50%); font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 1.15rem; color: #00F2FF; font-weight: 500; font-style: italic; opacity: 1; transition: opacity 0.5s ease, transform 0.5s ease; }
        .hero-dynamic-quote.fading { opacity: 0; transform: translateX(-50%) translateY(10px); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .kin-team-page section { position: relative; }
        @media (min-width: 992px) {
          .kin-team-page section {
            position: sticky;
            top: 0;
            min-height: 100vh;
            background-color: rgba(5, 5, 5, 0.78);
            z-index: 10;
            box-shadow: 0 -15px 40px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
        .team-section { padding: 6rem 4rem; }
        .section-header { text-align: center; margin-bottom: 5rem; }
        .section-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 50px; font-size: 0.85rem; color: var(--accent-purple); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1rem; }
        .section-description { font-size: 1.15rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.7; }
        .leadership-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; max-width: 1200px; margin: 0 auto 6rem; }
        .team-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .team-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-1); transform: scaleX(0); transition: transform 0.4s ease; }
        .team-card:hover { transform: translateY(-12px); border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4); } .team-card:hover::before { transform: scaleX(1); }
        .team-card-image { position: relative; width: 100%; height: 320px; overflow: hidden; }
        .team-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; filter: grayscale(20%); } .team-card:hover .team-card-image img { transform: scale(1.08); filter: grayscale(0%); }
        .team-card-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 50%; background: linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, transparent 100%); opacity: 0; transition: opacity 0.4s ease; } .team-card:hover .team-card-overlay { opacity: 1; }
        .team-card-socials { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%) translateY(20px); display: flex; gap: 0.75rem; opacity: 0; transition: all 0.4s ease 0.1s; } .team-card:hover .team-card-socials { opacity: 1; transform: translateX(-50%) translateY(0); }
        .social-link { width: 42px; height: 42px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: var(--text-primary); text-decoration: none; font-size: 1rem; transition: all 0.3s ease; } .social-link:hover { background: var(--accent-purple); border-color: var(--accent-purple); transform: translateY(-3px); }
        .team-card-content { padding: 2rem; text-align: center; }
        .team-card-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; }
        .team-card-role { font-size: 0.95rem; color: var(--accent-purple); margin-bottom: 1rem; font-weight: 500; }
        .team-card-bio { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }
        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; max-width: 1400px; margin: 0 auto; }
        .team-member { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .team-member::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gradient-1); transform: scaleX(0); transition: transform 0.4s ease; }
        .team-member:hover { transform: translateY(-10px); border-color: rgba(139, 92, 246, 0.3); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3); } .team-member:hover::before { transform: scaleX(1); }
        .team-member-image { position: relative; width: 100%; height: 260px; overflow: hidden; }
        .team-member-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; filter: grayscale(30%); } .team-member:hover .team-member-image img { transform: scale(1.05); filter: grayscale(0%); }
        .team-member-info { padding: 1.5rem; text-align: center; }
        .team-member-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 600; margin-bottom: 0.35rem; }
        .team-member-role { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; }
        .team-member-socials { display: flex; gap: 0.5rem; justify-content: center; } .team-member-socials .social-link { width: 36px; height: 36px; font-size: 0.9rem; }
        .department-filter { display: flex; justify-content: center; gap: 1rem; margin-bottom: 4rem; flex-wrap: wrap; }
        .filter-btn { padding: 0.75rem 1.5rem; border-radius: 50px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
        .filter-btn:hover { border-color: var(--accent-purple); color: var(--text-primary); } .filter-btn.active { background: var(--gradient-1); border-color: transparent; color: white; }

        /* Removed Footer CSS */
        .reveal { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); } .reveal.active { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; } .reveal-delay-2 { transition-delay: 0.2s; } .reveal-delay-3 { transition-delay: 0.3s; } .reveal-delay-4 { transition-delay: 0.4s; }

        /* ── Wave Pop-In Animation for Tour ── */
        .team-member {
          opacity: 0;
          transform: scale(0.3) translateY(60px);
        }
        .team-member.wave-pop-in {
          animation: wavePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes wavePopIn {
          0%   { opacity: 0; transform: scale(0.3) translateY(60px); }
          50%  { opacity: 1; transform: scale(1.08) translateY(-8px); }
          70%  { transform: scale(0.96) translateY(4px); }
          85%  { transform: scale(1.02) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        /* Removed Mobile Menu CSS */
        @media (max-width: 1200px) { .leadership-grid { grid-template-columns: repeat(2, 1fr); } .team-grid { grid-template-columns: repeat(3, 1fr); } .values-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 992px) { .navbar { padding: 1rem 2rem; } .nav-links { display: none; } .mobile-menu-btn { display: flex; } .team-hero, .team-section, .values-section, .join-section { padding-left: 2rem; padding-right: 2rem; } .team-grid { grid-template-columns: repeat(2, 1fr); } .leadership-grid { gap: 2rem; } }
        @media (max-width: 768px) { .leadership-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; } .team-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } .values-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } .department-filter { gap: 0.75rem; } .filter-btn { padding: 0.6rem 1.2rem; font-size: 0.85rem; } .footer-content { flex-direction: column; gap: 2rem; text-align: center; } .footer-left { flex-direction: column; } }
        @media (max-width: 576px) { .team-hero { padding: 8rem 1.5rem 4rem; } .team-section, .values-section, .join-section { padding: 4rem 1.5rem; } .team-grid { grid-template-columns: 1fr; max-width: 350px; margin: 0 auto; } .join-actions { flex-direction: column; align-items: center; } .join-actions .btn { width: 100%; max-width: 280px; justify-content: center; } .footer { padding: 3rem 1.5rem; } .footer-links { flex-wrap: wrap; justify-content: center; gap: 1rem; } }
      `}} />

      <Robot3DBackground />
      <LogoAnimation onComplete={handleAnimationComplete} />


      <section className="team-hero">
        <div className="hero-bg">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
          <div className="hero-gradient-3"></div>
        </div>
        <div className="hero-content">
          <div className={`hero-dynamic-quote ${isQuoteFading ? 'fading' : ''}`}>
            {heroQuotes[heroQuoteIndex]}
          </div>
        </div>
      </section>

      {members.length === 0 ? (
        <section className="team-section" style={{ paddingTop: '6rem' }}>
          <div className="section-header active">
            <h2 className="section-title" style={{ color: '#FF4444' }}>SYSTEM OFFLINE</h2>
            <p className="section-description" style={{ color: 'rgba(237,237,237,0.6)' }}>
              Failed to establish connection with the central database. Team nodes cannot be loaded at this time. Please verify database connectivity and credentials.
            </p>
          </div>
        </section>
      ) : (
        teamDepartments.map((dept, index) => (
          <section key={dept.title} className="team-section" style={{ paddingTop: index === 0 ? '6rem' : '2rem' }}>
            <div className="section-header reveal">
              <span className="section-badge">{dept.title}</span>
              <h2 className="section-title">{dept.title} TEAM</h2>
            </div>
  
            <div className="team-grid">
              {dept.members.map((member, idx) => (
                <div className="team-member" key={member.id}>
                  <div className="team-member-image">
                    <img src={member.photo} alt={member.name} />
                  </div>
                  <div className="team-member-info">
                    <h4 className="team-member-name">{member.name}</h4>
                    <p className="team-member-role">{member.role}</p>
                    <div className="team-member-socials">
                      {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">in</a>}
                      {member.gmail && member.gmail !== '—' && <a href={`mailto:${member.gmail}`} className="social-link">✉</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
