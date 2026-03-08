import Link from "next/link";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "System Nodes" },
  { href: "/blog", label: "Logs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/join", label: "Initialize" },
  { href: "/contact", label: "Comm-Link" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[#FF8C00]/20 bg-[#050505]/90 py-8 backdrop-blur-xl z-10 w-full overflow-hidden">
      {/* Circuit board subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#FF8C00] to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-[#FF8C00] shadow-[0_0_15px_#FF8C00]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tighter text-[#ededed] transition-all hover:text-[#00F2FF] hover:drop-shadow-[0_0_10px_rgba(0,242,255,0.6)]"
        >
          <span className="text-[#00F2FF]">{"<"}</span>
          GEEKROOM
          <span className="text-[#00F2FF]">{"/>"}</span>
        </Link>
        
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm tracking-wide text-gray-500 transition-all hover:text-[#00F2FF] hover:drop-shadow-[0_0_5px_rgba(0,242,255,0.4)]"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        
        <span className="text-xs font-mono text-gray-600 transition-colors hover:text-[#FF8C00]">
          © {new Date().getFullYear()} CORE LOGIC
        </span>
      </div>
    </footer>
  );
}
