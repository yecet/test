import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/data/courses";
import { materials } from "@/data/materials";

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "Ders Bulunamadı" };
  return {
    title: `${course.code} – ${course.name}`,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) notFound();

  const courseMatrials = materials.filter((m) => m.courseSlug === slug);

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby={`course-${slug}-heading`}>
        <div className="container">
          <nav style={{ marginBottom: "12px" }} aria-label="Breadcrumb">
            <Link href="/dersler" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textDecoration: "none" }}>
              Dersler
            </Link>
            <span style={{ color: "rgba(255,255,255,0.4)", margin: "0 8px" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem" }}>{course.name}</span>
          </nav>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span className="badge" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              {course.code}
            </span>
            <span className="badge" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}>
              {course.credits} Kredi
            </span>
            <span className="badge" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}>
              {course.level}
            </span>
          </div>
          <h1 id={`course-${slug}-heading`} style={{ fontSize: "2rem", marginBottom: "10px" }}>
            {course.name}
          </h1>
          <p style={{ fontSize: "0.9rem" }}>📅 {course.semester}</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "40px", alignItems: "start" }} className="course-detail-grid">
            {/* Main */}
            <div>
              {/* Description */}
              <section aria-labelledby="desc-heading" style={{ marginBottom: "40px" }}>
                <h2 id="desc-heading" style={{ fontSize: "1.2rem", marginBottom: "16px" }}>📖 Ders Açıklaması</h2>
                <div className="card" style={{ padding: "24px" }}>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
                    {course.description}
                  </p>
                </div>
              </section>

              {/* Objectives */}
              <section aria-labelledby="obj-heading" style={{ marginBottom: "40px" }}>
                <h2 id="obj-heading" style={{ fontSize: "1.2rem", marginBottom: "16px" }}>🎯 Dersin Amaçları</h2>
                <div className="card" style={{ padding: "24px" }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {course.objectives.map((obj, i) => (
                      <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        <span style={{ flexShrink: 0, width: "22px", height: "22px", background: "linear-gradient(135deg, var(--navy), var(--blue))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 700, marginTop: "1px" }}>
                          {i + 1}
                        </span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Weekly Plan */}
              <section aria-labelledby="plan-heading">
                <h2 id="plan-heading" style={{ fontSize: "1.2rem", marginBottom: "16px" }}>📅 Haftalık Ders Planı</h2>
                <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(135deg, var(--navy), var(--blue))", color: "white" }}>
                        <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 600, width: "80px" }}>Hafta</th>
                        <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 600 }}>Konu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.weeklyPlan.map((week) => (
                        <tr
                          key={week.week}
                          style={{
                            borderBottom: "1px solid var(--border)",
                            background: week.topic.includes("Ara Sınav") ? "rgba(239,68,68,0.04)" : "transparent",
                          }}
                        >
                          <td style={{ padding: "12px 20px", fontWeight: 700, color: week.topic.includes("Ara Sınav") ? "#dc2626" : "var(--navy)" }}>
                            {week.week}
                          </td>
                          <td style={{ padding: "12px 20px", color: week.topic.includes("Ara Sınav") ? "#dc2626" : "var(--text-secondary)" }}>
                            {week.topic.includes("Ara Sınav") && "📝 "}
                            {week.topic}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              {/* Quick links */}
              <div className="card" style={{ padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>📁 Ders Materyalleri</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "16px", lineHeight: 1.6 }}>
                  {courseMatrials.length} materyal mevcut (slayt, ödev, lab föyü ve daha fazlası)
                </p>
                <Link href={`/dersler/${slug}/materyaller`} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                  Materyallere Git →
                </Link>
              </div>

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="card" style={{ padding: "24px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px" }}>⚠️ Ön Koşullar</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {course.prerequisites.map((p, i) => (
                      <span key={i} style={{ padding: "8px 12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "6px", fontSize: "0.82rem", color: "#d97706", fontWeight: 500 }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Material summary */}
              {courseMatrials.length > 0 && (
                <div className="card" style={{ padding: "24px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px" }}>📊 Materyal Özeti</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(["slayt", "ders-notu", "odev", "lab", "sinav", "kaynak"] as const).map((type) => {
                      const count = courseMatrials.filter((m) => m.type === type).length;
                      if (count === 0) return null;
                      const labels: Record<string, string> = {
                        slayt: "Slayt",
                        "ders-notu": "Ders Notu",
                        odev: "Ödev",
                        lab: "Lab Föyü",
                        sinav: "Sınav",
                        kaynak: "Kaynak",
                      };
                      return (
                        <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{labels[type]}</span>
                          <span className={`badge type-${type}`} style={{ fontSize: "0.72rem", padding: "2px 8px" }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Back */}
              <Link href="/dersler" className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                ← Tüm Dersler
              </Link>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .course-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
