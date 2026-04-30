import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Contact — GEEKROOM",
  description: "Get in touch with GEEKROOM.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 overflow-hidden flex items-center justify-center">
      {/* Syne 800 — same font as nav GEEK ROOM wordmark */}





      {/* Card — no glow, no shadow */}
      <div className="relative z-10 w-full max-w-4xl mx-auto rounded-3xl border border-white/5 bg-[#1A1A26]/70 p-8 sm:p-12 backdrop-blur-2xl hover:border-[#FF8C00]/40 hover:shadow-[0_0_30px_rgba(255,140,0,0.15)] transition-all duration-500">

        {/*
          Heading — exactly mirrors nav wordmark:
            fontFamily : Syne, weight 800
            "CONTACT"  : #ededed  (nav "GEEK" colour)
            "SYSTEM"   : #4F9EFF  (nav "ROOM" colour)
            letterSpacing : -0.02em
        */}
        <h1
          style={{
            fontFamily: "var(--font-syne), system-ui, sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
            lineHeight: 1.15,
            marginBottom: "0.65rem",
          }}
        >
          <span style={{ color: "#ededed" }}>CONTACT </span>
          <span style={{ color: "#4F9EFF" }}>SYSTEM</span>
        </h1>

        {/* Body copy — muted dark */}
        <p className="text-[#5A6070] text-base leading-relaxed mb-10 max-w-2xl">
          Initialize a communication link. Whether you have questions or want to
          collaborate, securely transmit your message to our systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* ── Left: Contact Info ── */}
          <div className="space-y-6">

            {/* Comm-Link — no hover glow */}
            <div className="bg-[#161620]/80 rounded-xl p-6 border border-white/5 hover:border-[#FF8C00]/40 hover:shadow-[0_0_30px_rgba(255,140,0,0.15)] transition-all duration-500 group">
              <h3 className="text-[#4F9EFF] font-mono text-xs tracking-[0.2em] mb-3 uppercase">
                Comm-Link
              </h3>
              <a
                href="mailto:geekroom.jimsemtc@gmail.com"
                className="text-sm font-mono text-[#EDEDED]/85 hover:text-[#4F9EFF] transition-colors break-all"
              >
                geekroom.jimsemtc@gmail.com
              </a>
            </div>

            {/* Network Nodes — no hover glow */}
            <div className="bg-[#161620]/80 rounded-xl p-6 border border-white/5 hover:border-[#FF8C00]/40 hover:shadow-[0_0_30px_rgba(255,140,0,0.15)] transition-all duration-500 group">
              <h3 className="text-[#4F9EFF] font-mono text-xs tracking-[0.2em] mb-3 uppercase">
                Network Nodes
              </h3>
              <div className="flex flex-wrap gap-3 text-[#5A6070] text-sm font-mono">
                <a
                  href="https://www.linkedin.com/in/geek-room-jims-emtc-0078b43b5?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  className="hover:text-[#4F9EFF] transition-colors"
                >
                  LinkedIn
                </a>
                <span className="text-[#5A6070]/25 select-none">|</span>
                <a
                  href="https://www.instagram.com/geekroom.jemtec/?hl=en"
                  className="hover:text-[#4F9EFF] transition-colors"
                >
                  Instagram
                </a>
                <span className="text-[#5A6070]/25 select-none">|</span>
                <a
                  href="https://github.com/sahil7700/geek-room-site"
                  className="hover:text-[#4F9EFF] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="YOUR.NAME"
              className="w-full bg-[#161620]/70 border border-white/5 hover:border-[#FF8C00]/40 rounded-xl px-5 py-4 text-[#EDEDED]/90 placeholder-[#5A6070] focus:outline-none focus:border-[#FF8C00]/55 focus:ring-1 focus:ring-[#FF8C00]/15 transition-all duration-500 text-sm font-mono"
            />
            <input
              type="email"
              placeholder="YOUR.EMAIL@DOMAIN.COM"
              className="w-full bg-[#161620]/70 border border-white/5 hover:border-[#FF8C00]/40 rounded-xl px-5 py-4 text-[#EDEDED]/90 placeholder-[#5A6070] focus:outline-none focus:border-[#FF8C00]/55 focus:ring-1 focus:ring-[#FF8C00]/15 transition-all duration-500 text-sm font-mono"
            />
            <textarea
              placeholder="ENTER MESSAGE PROTOCOL..."
              rows={4}
              className="w-full bg-[#161620]/70 border border-white/5 hover:border-[#FF8C00]/40 rounded-xl px-5 py-4 text-[#EDEDED]/90 placeholder-[#5A6070] focus:outline-none focus:border-[#FF8C00]/55 focus:ring-1 focus:ring-[#FF8C00]/15 transition-all duration-500 text-sm font-mono resize-none"
            />

            {/* Button — teal fill, no shadow */}
            <button
              type="submit"
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-[#0C0E18] bg-[#4F9EFF] rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] tracking-wider text-sm"
            >
              <div className="absolute inset-0 bg-[#EDEDED]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                TRANSMIT SECURELY
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
