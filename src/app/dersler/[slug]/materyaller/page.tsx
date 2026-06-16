"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useMemo } from "react";
import { courses } from "@/data/courses";
import { materials, type MaterialType } from "@/data/materials";

const TYPE_LABELS: Record<MaterialType, string> = {
  slayt: "Slayt",
  "ders-notu": "Ders Notu",
  odev: "Ödev",
  lab: "Lab Föyü",
  sinav: "Sınav",
  kaynak: "Kaynak",
};

const TYPE_ICONS: Record<MaterialType, string> = {
  slayt: "🖥",
  "ders-notu": "📝",
  odev: "✏️",
  lab: "🔬",
  sinav: "📋",
  kaynak: "📚",
};

export default function MateryallerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const course = courses.find((c) => c.slug === slug);

  if (!course) notFound();

  const courseMatrials = materials.filter((m) => m.courseSlug === slug);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("tumu");
  const [selectedWeek, setSelectedWeek] = useState<string>("tumu");

  const availableTypes = Array.from(new Set(courseMatrials.map((m) => m.type)));
  const availableWeeks = Array.from(
    new Set(courseMatrials.filter((m) => m.week !== null).map((m) => m.week!))
  ).sort((a, b) => a - b);

  const filtered = useMemo(() => {
    return courseMatrials.filter((m) => {
      const matchSearch =
        searchQuery === "" ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === "tumu" || m.type === selectedType;
      const matchWeek =
        selectedWeek === "tumu" ||
        (selectedWeek === "genel" ? m.week === null : m.week === parseInt(selectedWeek));
      return matchSearch && matchType && matchWeek;
    });
  }, [courseMatrials, searchQuery, selectedType, selectedWeek]);

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby={`mat-${slug}-heading`}>
        <div className="container">
          <nav style={{ marginBottom: "12px" }} aria-label="Breadcrumb">
            <Link href="/dersler" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textDecoration: "none" }}>
              Dersler
            </Link>
            <span style={{ color: "rgba(255,255,255,0.4)", margin: "0 8px" }}>›</span>
            <Link href={`/dersler/${slug}`} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textDecoration: "none" }}>
              {course.name}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.4)", margin: "0 8px" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem" }}>Materyaller</span>
          </nav>
          <h1 id={`mat-${slug}-heading`} style={{ fontSize: "2rem", marginBottom: "8px" }}>
            {course.name} · Materyaller
          </h1>
          <p style={{ fontSize: "0.9rem" }}>
            {courseMatrials.length} materyal · PDF indirme için dosya adına tıklayın
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Filters */}
          <div
            className="card"
            style={{
              padding: "20px 24px",
              marginBottom: "28px",
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
            role="search"
            aria-label="Materyal arama ve filtreleme"
          >
            {/* Search */}
            <div style={{ flex: "1 1 240px" }}>
              <label htmlFor="mat-search" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
                Materyal ara
              </label>
              <input
                id="mat-search"
                type="search"
                placeholder="🔍 Materyal ara..."
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type filter */}
            <div style={{ flex: "1 1 160px" }}>
              <label htmlFor="type-filter" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
                Tür filtrele
              </label>
              <select
                id="type-filter"
                className="select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="tumu">📂 Tüm Türler</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_ICONS[type]} {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Week filter */}
            <div style={{ flex: "1 1 160px" }}>
              <label htmlFor="week-filter" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
                Hafta filtrele
              </label>
              <select
                id="week-filter"
                className="select"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="tumu">📅 Tüm Haftalar</option>
                {availableWeeks.map((w) => (
                  <option key={w} value={w.toString()}>
                    Hafta {w}
                  </option>
                ))}
                <option value="genel">📌 Genel</option>
              </select>
            </div>

            {/* Result count */}
            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", flexShrink: 0 }}>
              {filtered.length} sonuç
            </span>
          </div>

          {/* Material list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</p>
              <p style={{ fontSize: "1rem", marginBottom: "6px" }}>Materyal bulunamadı</p>
              <p style={{ fontSize: "0.85rem" }}>Arama kriterlerini değiştirerek tekrar deneyin.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map((mat) => (
                <div
                  key={mat.id}
                  className="card"
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                    className={`type-${mat.type}`}
                  >
                    {TYPE_ICONS[mat.type]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px", alignItems: "center" }}>
                      <span className={`badge type-${mat.type}`} style={{ border: "1px solid" }}>
                        {TYPE_LABELS[mat.type]}
                      </span>
                      {mat.week !== null && (
                        <span className="badge badge-navy" style={{ fontSize: "0.68rem" }}>
                          Hafta {mat.week}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "4px" }}>
                      {mat.title}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", margin: "0 0 4px", lineHeight: 1.5 }}>
                      {mat.description}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: 0 }}>
                      📦 {mat.fileSize} · 📅{" "}
                      {new Date(mat.uploadedAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Download */}
                  <a
                    href={mat.fileUrl}
                    download
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                    aria-label={`${mat.title} dosyasını indir`}
                  >
                    ⬇ İndir
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Back links */}
          <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href={`/dersler/${slug}`} className="btn btn-secondary btn-sm">
              ← Ders Detayı
            </Link>
            <Link href="/dersler" className="btn btn-outline btn-sm">
              ← Tüm Dersler
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
