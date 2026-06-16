import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Dersler",
  description:
    "Oğuzhan Kapukaya tarafından verilen lisans dersleri. Devre Analizi, Elektronik Devreler, Sinyaller ve Sistemler, Sayısal Tasarım, Mikrodenetleyiciler.",
};

export default function DerslerPage() {
  const activeCourses = courses.filter((c) => c.active);

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="courses-heading">
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
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>📚 Dersler</span>
          </div>
          <h1 id="courses-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>
            Verilen Dersler
          </h1>
          <p>
            Bu dönem {activeCourses.length} aktif ders · Materyallere ders detay sayfasından ulaşabilirsiniz
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid-auto">
            {activeCourses.map((course) => (
              <div key={course.slug} className="card" style={{ padding: "0", overflow: "hidden" }}>
                {/* Card top bar */}
                <div
                  style={{
                    height: "6px",
                    background: "linear-gradient(90deg, var(--navy) 0%, var(--blue) 100%)",
                  }}
                />
                <div style={{ padding: "28px" }}>
                  {/* Badges */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <span className="badge badge-navy">{course.code}</span>
                    <span className="badge badge-blue">{course.credits} Kredi</span>
                    <span className="badge badge-teal">{course.level}</span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
                    {course.name}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      marginBottom: "16px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.description}
                  </p>

                  {/* Semester */}
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "20px" }}>
                    📅 {course.semester}
                  </p>

                  {/* Prerequisites */}
                  {course.prerequisites.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>
                        Ön Koşullar
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {course.prerequisites.map((p, i) => (
                          <span key={i} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", background: "var(--border-light, #f8fafc)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <Link
                      href={`/dersler/${course.slug}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      Ders Detayı
                    </Link>
                    <Link
                      href={`/dersler/${course.slug}/materyaller`}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      📁 Materyaller
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px 28px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(30,58,95,0.05) 0%, rgba(45,106,159,0.05) 100%)",
              border: "1px solid rgba(30,58,95,0.1)",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>💡</span>
            <div>
              <p style={{ fontWeight: 600, marginBottom: "6px" }}>Öğrencilere Not</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                Ders materyallerine (slayt, ödev, lab föyü vb.) her dersin "Materyaller" bölümünden ulaşabilirsiniz.
                Duyurular için duyurular sayfasını ve ofis saatlerini takip etmenizi öneririm.
                Sorularınız için{" "}
                <a href="mailto:kapukaya@itu.edu.tr" style={{ color: "var(--blue)", textDecoration: "none" }}>
                  kapukaya@itu.edu.tr
                </a>{" "}
                adresine e-posta gönderebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
