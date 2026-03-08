"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Origin" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Terminal" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)] pointer-events-none">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 pointer-events-auto">
        <Link
          href="/"
          className="min-h-[44px] min-w-[44px] flex items-center -ml-2 pl-2 text-xl font-bold tracking-tighter text-[#ededed] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] hover:text-[#00F2FF] hover:drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] transition-all duration-300"
        >
          <span className="text-[#00F2FF] mr-1">{"<"}</span>
          GEEKROOM
          <span className="text-[#00F2FF] ml-1">{"/>"}</span>
        </Link>

        {/* Desktop - glassmorphism nav */}
        <ul className="hidden md:flex md:items-center">
          <li>
            <ul className="flex items-center gap-1 rounded-full border border-white/5 bg-[#050505]/60 backdrop-blur-xl px-4 py-2 sm:gap-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`relative rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                        isActive
                          ? "bg-[#00F2FF]/10 text-[#00F2FF] shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                          : "text-gray-400 hover:text-[#ededed] hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex md:hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#050505]/60 backdrop-blur-xl [-webkit-tap-highlight-color:transparent] text-[#00F2FF]"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <div className="relative w-5 h-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-all duration-300 ${
                menuOpen ? "top-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-full bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-full bg-current transition-all duration-300 ${
                menuOpen ? "top-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile nav - glassmorphism dropdown */}
      <div
        id="mobile-nav"
        className={`md:hidden pointer-events-auto mx-4 overflow-hidden rounded-2xl border border-[#00F2FF]/20 bg-[#050505]/90 backdrop-blur-2xl transition-all duration-300 ${
          menuOpen ? "max-h-[80vh] mt-2 mb-4 opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col px-2 py-4 gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-all [-webkit-tap-highlight-color:transparent] ${
                    isActive
                      ? "bg-[#00F2FF]/10 text-[#00F2FF] border-l-2 border-[#00F2FF]"
                      : "text-gray-400 hover:text-[#ededed] hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
