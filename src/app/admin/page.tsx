import { getCourses, getMaterials, getAnnouncements, getPublications } from "@/lib/content";
import { AdminCard, StatCard } from "@/components/admin/AdminUI";
import Link from "next/link";

export default function AdminDashboard() {
  const courses = getCourses();
  const materials = getMaterials();
  const announcements = getAnnouncements();
  const publications = getPublications();

  const recentMaterials = [...materials].sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  ).slice(0, 5);

  const recentAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", marginBottom: "24px" }}>
        Hoş Geldiniz, Yönetim Paneli Özeti
      </h2>

      {/* İstatistik Kartları */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          icon="📚"
          label="Toplam Ders"
          value={courses.length}
          color="#3b82f6"
        />
        <StatCard
          icon="📁"
          label="Toplam Materyal"
          value={materials.length}
          color="#10b981"
        />
        <StatCard
          icon="📄"
          label="Toplam Yayın"
          value={publications.length}
          color="#8b5cf6"
        />
        <StatCard
          icon="📢"
          label="Toplam Duyuru"
          value={announcements.length}
          color="#f59e0b"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Son Eklenen Materyaller */}
        <AdminCard title="Son Eklenen Materyaller">
          {recentMaterials.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentMaterials.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    background: "rgba(15,23,42,0.4)",
                    borderRadius: "8px",
                    border: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500 }}>
                      {m.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "4px" }}>
                      Ders: {m.courseSlug} • Tür: {m.type}
                    </div>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                    {m.uploadedAt}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#64748b", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
              Henüz materyal eklenmemiş.
            </div>
          )}
          <div style={{ marginTop: "16px", textAlign: "right" }}>
            <Link
              href="/admin/materyaller"
              style={{ color: "#3b82f6", fontSize: "0.85rem", textDecoration: "none" }}
            >
              Tüm Materyalleri Yönet →
            </Link>
          </div>
        </AdminCard>

        {/* Son Duyurular */}
        <AdminCard title="Son Duyurular">
          {recentAnnouncements.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentAnnouncements.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    background: "rgba(15,23,42,0.4)",
                    borderRadius: "8px",
                    border: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500 }}>
                      {a.important && "⚠️ "}
                      {a.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "4px" }}>
                      {a.relatedCourse ? `Ders: ${a.relatedCourse}` : "Genel Duyuru"}
                    </div>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                    {a.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#64748b", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
              Henüz duyuru eklenmemiş.
            </div>
          )}
          <div style={{ marginTop: "16px", textAlign: "right" }}>
            <Link
              href="/admin/duyurular"
              style={{ color: "#3b82f6", fontSize: "0.85rem", textDecoration: "none" }}
            >
              Tüm Duyuruları Yönet →
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
