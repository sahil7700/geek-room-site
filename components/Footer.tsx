import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer({ hideJoin }: { hideJoin?: boolean }) {
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer
      className="relative w-full"
      style={{
        backgroundColor: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <Image
            src="/logo.jpg"
            alt="Geek Room"
            width={28}
            height={28}
            className="rounded-[5px] object-cover"
            sizes="28px"
          />
          <span
            style={{
              fontFamily: "var(--font-syne), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "1.0625rem",
              color: "#ededed",
              letterSpacing: "-0.02em",
            }}
          >
            GEEK
          </span>
          <span
            style={{
              fontFamily: "var(--font-syne), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "1.0625rem",
              color: "#4F9EFF",
              letterSpacing: "-0.02em",
            }}
          >
            ROOM
          </span>
        </Link>

        {/* Nav links */}
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {navLinks
            .filter((link) => !(hideJoin && link.href === "/join"))
            .map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[0.8125rem] font-normal text-white/40 transition-colors hover:text-white/75"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {label}
                </Link>
              </li>
            ))}
        </ul>

        {/* Copyright */}
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          © Geek Room {currentYear}
        </span>
      </div>
    </footer>
  );
}
