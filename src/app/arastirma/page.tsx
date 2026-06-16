import type { Metadata } from "next";
import Link from "next/link";
import { researchAreas, researchProjects } from "@/data/research";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Araştırma Alanları",
  description:
    "Oğuzhan Kapukaya'nın araştırma alanları: güç elektroniği, gömülü sistemler, sinyal işleme, makine öğrenmesi ve yenilenebilir enerji.",
};

const statusLabels: Record<string, string> = {
  active: "Devam Ediyor",
  completed: "Tamamlandı",
  planned: "Planlandı",
};
const statusColors: Record<string, string> = {
  active: "badge-green",
  completed: "badge-blue",
  planned: "badge-amber",
};

export default function ArastirmaPage() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="research-heading">
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>🔬 Araştırma</span>
          </div>
          <h1 id="research-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>Araştırma Alanları</h1>
          <p>{researchAreas.length} araştırma alanı · {researchProjects.length} proje · {publications.length} yayın</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Research Areas */}
          <section aria-labelledby="areas-heading" style={{ marginBottom: "64px" }}>
            <h2 id="areas-heading" style={{ fontSize: "1.5rem", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              🔎 Araştırma Alanları
            </h2>
            <div className="grid-auto">
              {researchAreas.map((area) => {
                const areaPubs = publications.filter((p) => area.relatedPublications.includes(p.id));
                return (
                  <div key={area.id} className="card" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ height: "4px", background: "linear-gradient(90deg, var(--navy), var(--blue))" }} />
                    <div style={{ padding: "28px" }}>
                      <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{area.icon}</div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" }}>{area.title}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, marginBottom: "16px" }}>
                        {area.description}
                      </p>

                      {/* Topics */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                        {area.topics.map((topic, i) => (
                          <span key={i} style={{ fontSize: "0.75rem", padding: "3px 9px", borderRadius: "4px", background: "rgba(30,58,95,0.07)", border: "1px solid rgba(30,58,95,0.12)", color: "var(--navy)", fontWeight: 500 }}>
                            {topic}
                          </span>
                        ))}
                      </div>

                      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        📄 {areaPubs.length} ilgili yayın
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Projects */}
          <section aria-labelledby="projects-heading" style={{ marginBottom: "64px" }}>
            <h2 id="projects-heading" style={{ fontSize: "1.5rem", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              🚀 Araştırma Projeleri
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {researchProjects.map((proj) => {
                const area = researchAreas.find((a) => a.id === proj.areaId);
                return (
                  <div key={proj.id} className="card" style={{ padding: "24px 28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span className={`badge ${statusColors[proj.status]}`}>{statusLabels[proj.status]}</span>
                        {area && <span className="badge badge-navy">{area.icon} {area.title}</span>}
                        {proj.funding && <span className="badge badge-teal">💰 {proj.funding}</span>}
                      </div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", flexShrink: 0 }}>
                        {proj.startYear}{proj.endYear ? ` – ${proj.endYear}` : " – Devam ediyor"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "10px" }}>{proj.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, marginBottom: proj.collaborators ? "12px" : "0" }}>
                      {proj.description}
                    </p>
                    {proj.collaborators && (
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>İş Birlikleri: </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          {proj.collaborators.join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "40px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(30,58,95,0.06) 0%, rgba(45,106,159,0.06) 100%)", border: "1px solid rgba(30,58,95,0.1)" }}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>İş Birliği Önerisi</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.65, fontSize: "0.9rem" }}>
              Araştırma projelerimde iş birliği yapmak veya araştırma grubumuza dahil olmak için iletişime geçebilirsiniz.
            </p>
            <Link href="/iletisim" className="btn btn-primary">
              İletişime Geç →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
