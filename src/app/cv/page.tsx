import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";
import { publications } from "@/data/publications";
import { researchAreas } from "@/data/research";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Oğuzhan Kapukaya'nın akademik CV'si. Eğitim, yayınlar, dersler ve araştırma deneyimi.",
};

export default function CvPage() {
  const journalPubs = publications.filter((p) => p.type === "journal");
  const confPubs = publications.filter((p) => p.type === "conference");

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="cv-heading">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
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
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>📄 Curriculum Vitae</span>
              </div>
              <h1 id="cv-heading" style={{ fontSize: "2.2rem", marginBottom: "8px" }}>
                {profile.name}
              </h1>
              <p>{profile.title} · {profile.department}</p>
              <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>✉ {profile.email} · 🏛 {profile.university}</p>
            </div>
            <a
              href="/cv/oguzhan-kapukaya-cv.pdf"
              download
              className="btn btn-primary"
              aria-label="CV'yi PDF olarak indir"
            >
              ⬇ PDF İndir
            </a>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "880px" }}>
          {/* Education */}
          <section aria-labelledby="cv-edu" style={{ marginBottom: "48px" }}>
            <h2 id="cv-edu" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
              🎓 Eğitim
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {profile.education.map((edu, i) => (
                <div key={i} className="card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>{edu.degree}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 4px" }}>{edu.field}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: 0 }}>🏛 {edu.university}</p>
                  </div>
                  <span className="badge badge-blue">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Research Areas */}
          <section aria-labelledby="cv-research" style={{ marginBottom: "48px" }}>
            <h2 id="cv-research" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--border)" }}>
              🔬 Araştırma Alanları
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {researchAreas.map((area) => (
                <span key={area.id} style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(30,58,95,0.08)", border: "1px solid rgba(30,58,95,0.15)", color: "var(--navy)", fontSize: "0.875rem", fontWeight: 600 }}>
                  {area.icon} {area.title}
                </span>
              ))}
            </div>
          </section>

          {/* Teaching */}
          <section aria-labelledby="cv-teaching" style={{ marginBottom: "48px" }}>
            <h2 id="cv-teaching" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--border)" }}>
              📚 Verilen Dersler
            </h2>
            <div className="card" style={{ padding: "24px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.78rem" }}>Ders Kodu</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.78rem" }}>Ders Adı</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.78rem" }}>Dönem</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: "EEF 201", name: "Devre Analizi", semester: "Güz 2024–2025" },
                    { code: "EEF 301", name: "Elektronik Devreler", semester: "Güz 2024–2025" },
                    { code: "EEF 211", name: "Sayısal Tasarım", semester: "Güz 2024–2025" },
                    { code: "EEF 302", name: "Sinyaller ve Sistemler", semester: "Bahar 2024–2025" },
                    { code: "EEF 401", name: "Mikrodenetleyiciler", semester: "Bahar 2024–2025" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "var(--navy)" }}>{row.code}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.name}</td>
                      <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{row.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Journal Publications */}
          <section aria-labelledby="cv-journals" style={{ marginBottom: "48px" }}>
            <h2 id="cv-journals" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--border)" }}>
              📰 Dergi Makaleleri ({journalPubs.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {journalPubs.map((pub, i) => (
                <div key={pub.id} className="card" style={{ padding: "20px 24px", borderLeft: "3px solid var(--navy)" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "6px", lineHeight: 1.4 }}>
                    [{i + 1}] {pub.title}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: "0 0 4px" }}>
                    {pub.authors.join(", ")}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", margin: 0 }}>
                    {pub.venue}, {pub.year}
                    {pub.doi && ` · DOI: ${pub.doi}`}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Conference Publications */}
          <section aria-labelledby="cv-conf" style={{ marginBottom: "48px" }}>
            <h2 id="cv-conf" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--border)" }}>
              🎤 Konferans Bildirileri ({confPubs.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {confPubs.map((pub, i) => (
                <div key={pub.id} className="card" style={{ padding: "20px 24px", borderLeft: "3px solid var(--blue)" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "6px", lineHeight: 1.4 }}>
                    [{i + 1}] {pub.title}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: "0 0 4px" }}>
                    {pub.authors.join(", ")}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", margin: 0 }}>
                    {pub.venue}, {pub.year}
                    {pub.doi && ` · DOI: ${pub.doi}`}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section aria-labelledby="cv-skills" style={{ marginBottom: "48px" }}>
            <h2 id="cv-skills" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--border)" }}>
              🛠 Teknik Beceriler
            </h2>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {profile.skills.map((skill, i) => (
                  <span key={i} className="badge badge-navy" style={{ padding: "6px 14px" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Download CTA */}
          <div style={{ textAlign: "center", padding: "40px", background: "linear-gradient(135deg, rgba(30,58,95,0.05) 0%, rgba(45,106,159,0.05) 100%)", borderRadius: "16px", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
              Tam CV'yi PDF formatında indirebilirsiniz.
            </p>
            <a href="/cv/oguzhan-kapukaya-cv.pdf" download className="btn btn-primary">
              ⬇ CV'yi PDF Olarak İndir
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
