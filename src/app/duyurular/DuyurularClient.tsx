"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { announcements } from "@/data/announcements";
import { courses } from "@/data/courses";

export default function DuyurularPage() {
  const [filterCourse, setFilterCourse] = useState<string>("tumu");
  const [filterImportant, setFilterImportant] = useState<boolean>(false);

  const filtered = useMemo(() => {
    return announcements
      .filter((a) => {
        const matchCourse =
          filterCourse === "tumu" ||
          (filterCourse === "genel" ? a.relatedCourse === null : a.relatedCourse === filterCourse);
        const matchImportant = !filterImportant || a.important;
        return matchCourse && matchImportant;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filterCourse, filterImportant]);

  const courseMap = Object.fromEntries(courses.map((c) => [c.slug, c.name]));

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="ann-heading">
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
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>📢 Duyurular</span>
          </div>
          <h1 id="ann-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>
            Duyurular
          </h1>
          <p>Ders ve akademik duyurular · Toplam {announcements.length} duyuru</p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          {/* Filters */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "28px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }} role="search" aria-label="Duyuru filtreleme">
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor="course-filter" style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
                Ders
              </label>
              <select
                id="course-filter"
                className="select"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="tumu">📚 Tüm Dersler</option>
                <option value="genel">📌 Genel Duyurular</option>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.code} – {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "20px" }}>
              <input
                type="checkbox"
                id="important-filter"
                checked={filterImportant}
                onChange={(e) => setFilterImportant(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--navy)", cursor: "pointer" }}
              />
              <label htmlFor="important-filter" style={{ fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "var(--text-secondary)" }}>
                🔴 Yalnız Önemli
              </label>
            </div>

            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", paddingTop: "20px" }}>
              {filtered.length} duyuru
            </span>
          </div>

          {/* Announcements */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "12px" }}>📭</p>
              <p>Bu kritere ait duyuru bulunamadı.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((ann) => (
                <article
                  key={ann.id}
                  className="card"
                  style={{
                    padding: "24px 28px",
                    borderLeft: ann.important ? "4px solid #ef4444" : "4px solid var(--border)",
                  }}
                  aria-label={ann.title}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      {ann.important && (
                        <span className="badge badge-red">🔴 Önemli</span>
                      )}
                      {ann.relatedCourse ? (
                        <Link href={`/dersler/${ann.relatedCourse}`} className="badge badge-blue" style={{ textDecoration: "none" }}>
                          📚 {courseMap[ann.relatedCourse] ?? ann.relatedCourse}
                        </Link>
                      ) : (
                        <span className="badge badge-navy">📌 Genel</span>
                      )}
                    </div>
                    <time dateTime={ann.date} style={{ color: "var(--text-muted)", fontSize: "0.8rem", flexShrink: 0 }}>
                      📅{" "}
                      {new Date(ann.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "10px" }}>
                    {ann.title}
                  </h2>

                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
                    {ann.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
