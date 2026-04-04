"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { X, Menu, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
  { href: "/support", label: "Support" },
] as const;

export function Header({ hideJoin }: { hideJoin?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const email = user?.primaryEmailAddress?.emailAddress;
  const isAdminOrOwner =
    role === "admin" || role === "owner" || email === "sahilnwal975@gmail.com";

  const displayedLinks = navLinks.filter(
    (link) => !(hideJoin && link.href === "/join")
  );
  const allLinks = isAdminOrOwner
    ? [...displayedLinks, { href: "/admin", label: "Admin" }]
    : displayedLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Background explicitly securely syncing Member assigned role if missed during layout.
  useEffect(() => {
    if (isLoaded && isSignedIn && !role && email) {
      import('@/app/actions/syncRoleAction').then((m) => {
        m.syncUserRole().then((res) => {
          if (res.updated) {
            // Force reload to get the new Clerk JWT session payload!
            window.location.reload();
          }
        });
      }).catch(console.error);
    }
  }, [isLoaded, isSignedIn, role, email]);

  /* ── shared capsule style builder ─────────────────────────── */
  const capsuleBase: React.CSSProperties = {
    alignItems: "center",
    borderRadius: "9999px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <>
      {/* ── global style injection ─────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .nav-link-item {
          position: relative;
          padding: 8px 15px;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nav-link-item:hover {
          color: #ededed;
          background: rgba(255,255,255,0.06);
        }
        .nav-link-item.active {
          color: #ededed;
          background: rgba(255,255,255,0.08);
        }
        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 2px;
          border-radius: 9999px;
          background: #4F9EFF;
        }

        /* scrolled capsule glow pulse */
        @keyframes capsuleGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79,158,255,0.08), 0 8px 32px rgba(0,0,0,0.55); }
          50%       { box-shadow: 0 0 0 2px rgba(79,158,255,0.12), 0 8px 32px rgba(0,0,0,0.55); }
        }
        .scrolled-capsule {
          animation: capsuleGlow 3s ease-in-out infinite;
        }
      `}</style>

      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          /* header itself is transparent — capsules carry the bg */
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        {/* ── TOP STATE: three separate zones ─────────────────── */}
        <div
          className="px-4 md:px-7 py-4 w-full flex items-center justify-between mx-auto"
          style={{
            maxWidth: "1280px",
            pointerEvents: "auto",
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? "translateY(-8px)" : "translateY(0)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
            /* when scrolled hide but keep space so layout doesn't jump */
            visibility: scrolled ? "hidden" : "visible",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {/* LEFT — wordmark (no capsule) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 md:gap-2 no-underline"
          >
            <img
              src="/logo.jpg"
              alt="Geek Room"
              className="h-5 w-5 md:h-8 md:w-8 rounded-[4px] md:rounded-[6px] object-cover"
            />
            <span className="font-extrabold text-[1rem] md:text-[1.35rem] text-[#ededed] tracking-[-0.02em]" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
              GEEK
            </span>
            <span className="font-extrabold text-[1rem] md:text-[1.35rem] text-[#4F9EFF] tracking-[-0.02em]" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
              ROOM
            </span>
          </Link>

          {/* CENTER — nav links capsule */}
          <div
            className="hidden md:flex"
            style={{
              ...capsuleBase,
              gap: "2px",
              padding: "7px 8px",
              background: "rgba(20,20,24,0.72)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {allLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link-item${pathname === href ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* RIGHT — Sign In transparent capsule */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isLoaded && isSignedIn && (
              <div className="hidden md:flex" style={{
                ...capsuleBase,
                padding: "4px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 border border-white/10" } }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link label="Profile" href="/profile" labelIcon={<User className="w-4 h-4" />} />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            )}
            {isLoaded && !isSignedIn && (
              <Link
                href="/sign-in"
                className="hidden md:flex items-center justify-center font-medium transition-all duration-200 h-10 px-4 text-[0.85rem]"
                style={{
                  ...capsuleBase,
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(255,255,255,0.75)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,158,255,0.35)";
                  (e.currentTarget as HTMLElement).style.color = "#ededed";
                  (e.currentTarget as HTMLElement).style.background = "rgba(79,158,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }}
              >
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex md:hidden items-center justify-center transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.8)",
                background: "transparent",
                border: "none",
                padding: "8px",
              }}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── SCROLLED STATE: single centered capsule ──────────── */}
        <div
          className="py-3 md:px-7 md:py-4 flex justify-center w-full max-w-7xl mx-auto"
          style={{
            pointerEvents: "auto",
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? "translateY(0)" : "translateY(-12px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            visibility: scrolled ? "visible" : "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div
            className="scrolled-capsule hidden md:flex"
            style={{
              ...capsuleBase,
              gap: "2px",
              padding: "7px 10px",
              background: "rgba(14,14,18,0.88)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Wordmark inside capsule */}
            <Link
              href="/"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px" }}
            >
              <img
                src="/logo.jpg"
                alt="Geek Room"
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
              <span style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}>
                GEEK
              </span>
              <span style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#4F9EFF",
                letterSpacing: "-0.02em",
              }}>
                ROOM
              </span>
            </Link>

            {/* Divider */}
            <span style={{
              width: "1px",
              height: "20px",
              background: "rgba(255,255,255,0.1)",
              margin: "0 4px",
              alignSelf: "center",
              flexShrink: 0,
            }} />

            {/* Nav links */}
            {allLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link-item${pathname === href ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}

            {/* Divider */}
            <span style={{
              width: "1px",
              height: "20px",
              background: "rgba(255,255,255,0.1)",
              margin: "0 4px",
              alignSelf: "center",
              flexShrink: 0,
            }} />

            {/* Sign In / UserButton */}
            {isLoaded && isSignedIn && (
              <div style={{ padding: "3px 6px", display: "flex", alignItems: "center" }}>
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: "w-7 h-7 border border-white/10" } }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link label="Profile" href="/profile" labelIcon={<User className="w-4 h-4" />} />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            )}
            {isLoaded && !isSignedIn && (
              <Link
                href="/sign-in"
                className="flex items-center justify-center font-medium"
                style={{
                  ...capsuleBase,
                  height: "36px",
                  padding: "0 18px",
                  fontSize: "0.875rem",
                  fontFamily: "'Inter', sans-serif",
                  color: "rgba(255,255,255,0.65)",
                  background: "rgba(79,158,255,0.07)",
                  border: "1px solid rgba(79,158,255,0.2)",
                  textDecoration: "none",
                  margin: "0 2px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(79,158,255,0.12)";
                  (e.currentTarget as HTMLElement).style.color = "#ededed";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(79,158,255,0.07)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                }}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile scrolled navbar (visible on mobile only) */}
          <div className="flex md:hidden w-full items-center justify-between px-4">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setMenuOpen(false);
              }}
              className="flex items-center gap-1.5 no-underline"
            >
              <img
                src="/logo.jpg"
                alt="Geek Room"
                className="h-5 w-5 rounded-[4px] object-cover"
              />
              <span className="font-extrabold text-[1rem] text-[#ededed] tracking-[-0.02em]" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
                GEEK
              </span>
              <span className="font-extrabold text-[1rem] text-[#4F9EFF] tracking-[-0.02em]" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
                ROOM
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Hamburger */}
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center justify-center transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.8)", background: "transparent", border: "none" }}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile nav dropdown ───────────────────────────────── */}
        <div
          id="mobile-nav"
          aria-hidden={!menuOpen}
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? "100vh" : "0",
            opacity: menuOpen ? 1 : 0,
            marginTop: "60px",
            background: "rgba(14,14,18,0.97)",
            borderTop: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            pointerEvents: "auto",
          }}
        >
          <ul className="flex flex-col px-6 py-4 gap-1">
            {allLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-base font-medium transition-all duration-200"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: isActive ? "#ededed" : "rgba(255,255,255,0.45)",
                      backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                      borderLeft: isActive ? "2px solid #4F9EFF" : "2px solid transparent",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            
            {isLoaded && !isSignedIn && (
              <li className="mt-2 pt-2 px-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl text-[0.95rem] font-medium transition-all duration-200"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: "rgba(79,158,255,0.1)",
                    border: "1px solid rgba(79,158,255,0.2)",
                    color: "#ededed",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(79,158,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(79,158,255,0.1)";
                  }}
                >
                  Sign in
                </Link>
              </li>
            )}
            {isLoaded && isSignedIn && (
              <li
                className="mt-2 pt-3 pb-1 flex justify-center"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div style={{ transform: "scale(1.1)" }}>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border border-white/10" } }}>
                    <UserButton.MenuItems>
                      <UserButton.Link label="Profile" href="/profile" labelIcon={<User className="w-4 h-4" />} />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
}
