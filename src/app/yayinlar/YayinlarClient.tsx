"use client";

import { useState, useMemo } from "react";
import { publications, type PublicationType } from "@/data/publications";

const TYPE_LABELS: Record<PublicationType, string> = {
  journal: "Dergi Makalesi",
  conference: "Konferans Bildirisi",
  "book-chapter": "Kitap Bölümü",
  thesis: "Tez",
  preprint: "Preprint",
};

const TYPE_BADGES: Record<PublicationType, string> = {
  journal: "badge-navy",
  conference: "badge-teal",
  "book-chapter": "badge-purple",
  thesis: "badge-amber",
  preprint: "badge-blue",
};

export default function YayinlarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("tumu");
  const [selectedYear, setSelectedYear] = useState<string>("tumu");

  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);
  const types = Array.from(new Set(publications.map((p) => p.type)));

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.authors.join(" ").toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q));
      const matchType = selectedType === "tumu" || p.type === selectedType;
      const matchYear = selectedYear === "tumu" || p.year === parseInt(selectedYear);
      return matchSearch && matchType && matchYear;
    }).sort((a, b) => b.year - a.year);
  }, [searchQuery, selectedType, selectedYear]);

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="pub-heading">
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>📰 Yayınlar</span>
          </div>
          <h1 id="pub-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>Yayınlar</h1>
          <p>Toplam {publications.length} yayın · {publications.filter(p => p.type === "journal").length} dergi, {publications.filter(p => p.type === "conference").length} konferans</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Filters */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "28px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "flex-end" }} role="search" aria-label="Yayın arama ve filtreleme">
            <div style={{ flex: "1 1 240px" }}>
              <label htmlFor="pub-search" style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>Arama</label>
              <input
                id="pub-search"
                type="search"
                placeholder="🔍 Başlık, yazar, anahtar kelime..."
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label htmlFor="type-filter" style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>Tür</label>
              <select id="type-filter" className="select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ width: "100%" }}>
                <option value="tumu">Tüm Türler</option>
                {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label htmlFor="year-filter" style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>Yıl</label>
              <select id="year-filter" className="select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: "100%" }}>
                <option value="tumu">Tüm Yıllar</option>
                {years.map((y) => <option key={y} value={y.toString()}>{y}</option>)}
              </select>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", paddingBottom: "2px" }}>{filtered.length} yayın</span>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</p>
              <p>Yayın bulunamadı. Farklı arama kriterleri deneyin.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((pub, idx) => (
                <article key={pub.id} className="card" style={{ padding: "24px 28px" }} aria-label={pub.title}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {/* Number */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, var(--navy), var(--blue))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.82rem", flexShrink: 0 }}>
                      {idx + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Badges */}
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                        <span className={`badge ${TYPE_BADGES[pub.type]}`}>{TYPE_LABELS[pub.type]}</span>
                        <span className="badge badge-blue">{pub.year}</span>
                      </div>

                      {/* Title */}
                      <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px", lineHeight: 1.4 }}>
                        {pub.url ? (
                          <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", textDecoration: "none" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--blue)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                          >
                            {pub.title} ↗
                          </a>
                        ) : pub.title}
                      </h2>

                      {/* Authors */}
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "6px" }}>
                        {pub.authors.map((author, i) => (
                          <span key={i}>
                            {author === "O. Kapukaya" ? (
                              <strong style={{ color: "var(--navy)" }}>{author}</strong>
                            ) : author}
                            {i < pub.authors.length - 1 && ", "}
                          </span>
                        ))}
                      </p>

                      {/* Venue */}
                      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontStyle: "italic", marginBottom: "10px" }}>
                        📖 {pub.venue}
                      </p>

                      {/* Keywords */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                        {pub.keywords.map((kw, i) => (
                          <span key={i} style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", background: "var(--border-light, #f8fafc)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}
                            onClick={() => setSearchQuery(kw)}
                            title={`"${kw}" için filtrele`}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* DOI */}
                      {pub.doi && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)", fontSize: "0.8rem", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          🔗 DOI: {pub.doi}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Legend */}
          <div style={{ marginTop: "40px", padding: "20px 24px", borderRadius: "12px", background: "rgba(30,58,95,0.04)", border: "1px solid rgba(30,58,95,0.08)", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Açıklama:</span>
            {Object.entries(TYPE_LABELS).filter(([type]) => types.includes(type as PublicationType)).map(([type, label]) => (
              <span key={type} className={`badge ${TYPE_BADGES[type as PublicationType]}`}>{label}</span>
            ))}
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: "auto" }}>
              <strong>Kalın</strong> yazarlar benim
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
