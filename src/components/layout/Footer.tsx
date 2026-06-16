"use client";

import Link from "next/link";
import { profile } from "@/data/profile";

const footerLinks = [
  {
    title: "Akademik",
    links: [
      { href: "/hakkimda", label: "Hakkımda" },
      { href: "/cv", label: "CV" },
      { href: "/yayinlar", label: "Yayınlar" },
      { href: "/arastirma", label: "Araştırma" },
    ],
  },
  {
    title: "Öğrenciler",
    links: [
      { href: "/dersler", label: "Dersler" },
      { href: "/duyurular", label: "Duyurular" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0f1f35 0%, #152c4a 100%)",
        color: "rgba(255,255,255,0.8)",
        paddingTop: "56px",
        paddingBottom: "32px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "white",
                  fontSize: "0.9rem",
                }}
              >
                ÖK
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                  {profile.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
                  {profile.title}
                </div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "20px" }}>
              {profile.department} · {profile.university}
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { href: profile.social.googleScholar, label: "Scholar" },
                { href: profile.social.orcid, label: "ORCID" },
                { href: profile.social.researchGate, label: "ResearchGate" },
                { href: profile.social.linkedin, label: "LinkedIn" },
                { href: profile.social.github, label: "GitHub" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.78rem",
                    padding: "4px 10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                    (e.currentTarget as HTMLElement).style.borderColor = "#60a5fa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3
                style={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  marginBottom: "16px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {group.title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#60a5fa")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "16px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              İletişim
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { icon: "✉️", text: profile.email },
                { icon: "🏢", text: profile.office },
                { icon: "🕐", text: profile.officeHours },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
            © {year} Oğuzhan Kapukaya · Tüm hakları saklıdır.
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
            İstanbul Teknik Üniversitesi
          </p>
        </div>
      </div>
    </footer>
  );
}
