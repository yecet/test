"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/dersler", label: "Dersler" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/yayinlar", label: "Yayınlar" },
  { href: "/arastirma", label: "Araştırma" },
  { href: "/cv", label: "CV" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #152c4a 0%, #1e3a5f 60%, #2d5282 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
          aria-label="Ana sayfaya git"
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1rem",
              color: "white",
              flexShrink: 0,
            }}
          >
            ÖK
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
              Oğuzhan Kapukaya
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", lineHeight: 1.2 }}>
              Araştırma Görevlisi · İTÜ EEF
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Ana navigasyon" style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden-mobile">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? "#60a5fa" : "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "rgba(96, 165, 250, 0.15)" : "transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    (e.target as HTMLElement).style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={menuOpen}
          className="show-mobile"
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px", transition: "transform 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px", opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px", transition: "transform 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav
          aria-label="Mobil navigasyon"
          style={{
            background: "#152c4a",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: isActive ? "#60a5fa" : "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? "rgba(96, 165, 250, 0.15)" : "transparent",
                  borderLeft: isActive ? "3px solid #60a5fa" : "3px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      <style>{`
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
