import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getCourses, getAnnouncements, getPublications } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oğuzhan Kapukaya | Araştırma Görevlisi – İTÜ EEF",
  description:
    "İstanbul Teknik Üniversitesi Elektrik ve Elektronik Mühendisliği araştırma görevlisi Oğuzhan Kapukaya'nın akademik web sitesi.",
};

export default function HomePage() {
  const profile = getProfile();
  const courses = getCourses();
  const announcements = getAnnouncements();
  const publications = getPublications();

  const recentAnnouncements = announcements.slice(0, 4);
  const recentPublications = publications.slice(0, 3);
  const activeCourses = courses.filter((c) => c.active).slice(0, 4);

  return (
    <>
      {/* ---- HERO ---- */}
      <section
        className="hero-gradient hero-mesh"
        style={{ padding: "80px 0 100px", position: "relative", overflow: "hidden" }}
        aria-label="Hero bölümü"
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(96, 165, 250, 0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(45, 106, 159, 0.12)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "48px",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Text */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(96, 165, 250, 0.15)",
                  border: "1px solid rgba(96, 165, 250, 0.3)",
                  borderRadius: "9999px",
                  padding: "6px 16px",
                  marginBottom: "24px",
                }}
              >
                <span style={{ color: "#60a5fa", fontSize: "0.8rem", fontWeight: 600 }}>
                  🎓 Araştırma Görevlisi
                </span>
              </div>

              <h1
                style={{
                  color: "white",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: "16px",
                }}
              >
                {profile.name}
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "1.05rem",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                {profile.department}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                  marginBottom: "28px",
                }}
              >
                {profile.university}
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  maxWidth: "560px",
                  marginBottom: "36px",
                }}
              >
                {profile.shortBio}
              </p>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link href="/hakkimda" className="btn btn-primary">
                  Hakkımda →
                </Link>
                <Link href="/dersler" className="btn btn-secondary">
                  Derslerim
                </Link>
                <a
                  href="/cv/oguzhan-kapukaya-cv.pdf"
                  download
                  className="btn"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  ⬇ CV İndir
                </a>
              </div>
            </div>

            {/* Avatar placeholder */}
            <div className="hero-avatar" style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d6a9f 0%, #60a5fa 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4.5rem",
                  border: "4px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                👨‍🔬
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .hero-grid {
            grid-template-columns: 1fr auto;
          }
          @media (max-width: 640px) {
            .hero-grid {
              grid-template-columns: 1fr;
            }
            .hero-avatar { display: none; }
          }
        `}</style>
      </section>

      {/* ---- STATS ---- */}
      <section
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5282 100%)", padding: "32px 0" }}
        aria-label="İstatistikler"
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
            className="stats-grid"
          >
            {[
              { value: profile.stats.publications, label: "Yayın", icon: "📄" },
              { value: profile.stats.courses, label: "Ders", icon: "📚" },
              { value: `${profile.stats.students}+`, label: "Öğrenci", icon: "👨‍🎓" },
              { value: `${profile.stats.yearsExperience}+`, label: "Yıl Deneyim", icon: "🏆" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{stat.icon}</div>
                <div style={{ color: "white", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", marginTop: "6px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ---- ANNOUNCEMENTS ---- */}
      <section className="section" aria-labelledby="ann-heading">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 id="ann-heading" style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                Son Duyurular
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                En güncel ders ve akademik duyurular
              </p>
            </div>
            <Link href="/duyurular" className="btn btn-outline btn-sm">
              Tümünü Gör →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  borderLeft: ann.important ? "4px solid #ef4444" : "4px solid #e2e8f0",
                }}
              >
                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                  {ann.important ? (
                    <span style={{ fontSize: "1.2rem" }}>🔴</span>
                  ) : (
                    <span style={{ fontSize: "1.2rem" }}>📢</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                      {ann.important && (
                        <span className="badge badge-red" style={{ marginRight: "8px" }}>
                          Önemli
                        </span>
                      )}
                      {ann.title}
                    </h3>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", flexShrink: 0 }}>
                      {new Date(ann.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      margin: 0,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {ann.content}
                  </p>
                  {ann.relatedCourse && (
                    <Link
                      href={`/dersler/${ann.relatedCourse}`}
                      className="badge badge-blue"
                      style={{ marginTop: "10px", textDecoration: "none", cursor: "pointer" }}
                    >
                      📚 Ders Detayı
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- COURSES ---- */}
      <section
        className="section-sm"
        aria-labelledby="courses-heading"
        style={{ background: "var(--border-light, #f8fafc)" }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 id="courses-heading" style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                Verilen Dersler
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Bu dönem aktif dersler
              </p>
            </div>
            <Link href="/dersler" className="btn btn-outline btn-sm">
              Tüm Dersler →
            </Link>
          </div>

          <div className="grid-auto-sm">
            {activeCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/dersler/${course.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{ padding: "24px", height: "100%", cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <span className="badge badge-navy" style={{ fontSize: "0.7rem" }}>
                      {course.code}
                    </span>
                    <span className="badge badge-blue" style={{ fontSize: "0.7rem" }}>
                      {course.credits} kredi
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)" }}>
                    {course.name}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      marginBottom: "14px",
                    }}
                  >
                    {course.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      📅 {course.semester}
                    </span>
                    <span style={{ color: "var(--blue)", fontSize: "0.8rem", fontWeight: 600 }}>
                      Detaylar →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- RECENT PUBLICATIONS ---- */}
      <section className="section" aria-labelledby="pub-heading">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 id="pub-heading" style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                Son Yayınlar
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Hakemli dergi ve konferans bildirileri
              </p>
            </div>
            <Link href="/yayinlar" className="btn btn-outline btn-sm">
              Tüm Yayınlar →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recentPublications.map((pub, idx) => (
              <div key={pub.id} className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #1e3a5f, #2d6a9f)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span
                        className={`badge ${pub.type === "journal" ? "badge-navy" : pub.type === "conference" ? "badge-teal" : "badge-blue"}`}
                      >
                        {pub.type === "journal"
                          ? "Dergi"
                          : pub.type === "conference"
                          ? "Konferans"
                          : pub.type === "thesis"
                          ? "Tez"
                          : pub.type}
                      </span>
                      <span className="badge badge-blue">{pub.year}</span>
                    </div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "6px", lineHeight: 1.4 }}>
                      {pub.title}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "6px" }}>
                      {pub.authors.join(", ")}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>
                      {pub.venue}
                    </p>
                    {pub.doi && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "var(--blue)",
                          fontSize: "0.8rem",
                          marginTop: "8px",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        🔗 DOI: {pub.doi}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
          padding: "64px 0",
        }}
        aria-label="İletişim çağrısı"
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", fontSize: "1.8rem", marginBottom: "16px" }}>
            İletişime Geçin
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto 32px" }}>
            Araştırma işbirliği, ders soruları veya ofis saati için ulaşabilirsiniz.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/iletisim" className="btn btn-primary">
              ✉️ İletişim Formu
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="btn"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {profile.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
