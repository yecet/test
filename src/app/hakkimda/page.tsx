import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Hakkımda",
  description:
    "Oğuzhan Kapukaya hakkında; biyografi, eğitim geçmişi, araştırma becerileri ve akademik deneyim.",
};

export default function HakkimdaPage() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="about-heading">
        <div className="container">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "9999px",
              padding: "4px 14px",
              marginBottom: "16px",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>👤 Hakkımda</span>
          </div>
          <h1 id="about-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>
            {profile.name}
          </h1>
          <p style={{ fontSize: "1rem", maxWidth: "560px" }}>
            {profile.title} · {profile.department} · {profile.university}
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "48px",
              alignItems: "start",
            }}
            className="about-grid"
          >
            {/* Main Content */}
            <div>
              {/* Bio */}
              <section aria-labelledby="bio-heading" style={{ marginBottom: "48px" }}>
                <h2 id="bio-heading" style={{ fontSize: "1.4rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>📖</span> Biyografi
                </h2>
                <div className="card" style={{ padding: "28px" }}>
                  <div className="prose">
                    {profile.bio.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </section>

              {/* Education */}
              <section aria-labelledby="edu-heading" style={{ marginBottom: "48px" }}>
                <h2 id="edu-heading" style={{ fontSize: "1.4rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>🎓</span> Eğitim
                </h2>
                <div className="card" style={{ padding: "28px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                    {profile.education.map((edu, i) => (
                      <div key={i} className="timeline-item" style={{ paddingBottom: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{edu.degree}</h3>
                          <span className="badge badge-blue">{edu.year}</span>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 4px" }}>
                          {edu.field}
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>
                          🏛 {edu.university}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section aria-labelledby="skills-heading">
                <h2 id="skills-heading" style={{ fontSize: "1.4rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>🛠</span> Teknik Beceriler
                </h2>
                <div className="card" style={{ padding: "28px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, rgba(30,58,95,0.08) 0%, rgba(45,106,159,0.08) 100%)",
                          border: "1px solid rgba(30,58,95,0.12)",
                          color: "var(--navy)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              {/* Contact Info */}
              <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  📬 İletişim Bilgileri
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { icon: "✉️", label: "E-posta", value: profile.email, href: `mailto:${profile.email}` },
                    { icon: "🏢", label: "Ofis", value: profile.office },
                    { icon: "📞", label: "Telefon", value: profile.phone },
                    { icon: "🕐", label: "Ofis Saati", value: profile.officeHours },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "3px" }}>
                        {item.icon} {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ color: "var(--blue)", fontSize: "0.875rem", textDecoration: "none" }}>
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>
                  🌐 Dil Yetkinliği
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {profile.languages.map((lang, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{lang.name}</span>
                      <span className="badge badge-blue">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social / Academic */}
              <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>
                  🔗 Akademik Profiller
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { href: profile.social.googleScholar, label: "Google Scholar", icon: "📚" },
                    { href: profile.social.orcid, label: "ORCID", icon: "🆔" },
                    { href: profile.social.researchGate, label: "ResearchGate", icon: "🔬" },
                    { href: profile.social.linkedin, label: "LinkedIn", icon: "💼" },
                    { href: profile.social.github, label: "GitHub", icon: "💻" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                      <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CV Download */}
              <a
                href="/cv/oguzhan-kapukaya-cv.pdf"
                download
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                ⬇ CV İndir (PDF)
              </a>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
