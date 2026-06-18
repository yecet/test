"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ──── Types ──── */
type ContentType = "profile" | "courses" | "materials" | "announcements" | "publications" | "research";

interface TabItem {
  key: ContentType;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: "profile", label: "Profil", icon: "👤" },
  { key: "courses", label: "Dersler", icon: "📚" },
  { key: "materials", label: "Materyaller", icon: "📁" },
  { key: "announcements", label: "Duyurular", icon: "📢" },
  { key: "publications", label: "Yayınlar", icon: "📄" },
  { key: "research", label: "Araştırma", icon: "🔬" },
];

/* ──── Status badge ──── */
function StatusBadge({ type, text }: { type: "success" | "error" | "info"; text: string }) {
  const colors = {
    success: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "#4ade80" },
    error: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "#fca5a5" },
    info: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "#93c5fd" },
  };
  const c = colors[type];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "10px",
        padding: "12px 16px",
        color: c.text,
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"} {text}
    </div>
  );
}

/* ──── Main Component ──── */
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>("profile");
  const [content, setContent] = useState<string>("");
  const [sha, setSha] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [jsonValid, setJsonValid] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTarget, setUploadTarget] = useState("public/materials");
  const [uploading, setUploading] = useState(false);

  /* ── Load content ── */
  const loadContent = useCallback(async (type: ContentType) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/content/${type}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setContent(JSON.stringify(json.data, null, 2));
      setSha(json.sha);
      setJsonValid(true);
    } catch (err) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "İçerik yüklenemedi" });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadContent(activeTab);
  }, [activeTab, loadContent]);

  /* ── Save content ── */
  async function handleSave() {
    if (!jsonValid) {
      setStatus({ type: "error", text: "JSON formatı geçersiz. Lütfen düzeltin." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const parsed = JSON.parse(content);
      const res = await fetch(`/api/admin/content/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed, sha }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setStatus({ type: "success", text: json.message });
      // Reload to get new SHA
      await loadContent(activeTab);
    } catch (err) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Kaydetme hatası" });
    } finally {
      setSaving(false);
    }
  }

  /* ── JSON validation ── */
  function handleContentChange(value: string) {
    setContent(value);
    try {
      JSON.parse(value);
      setJsonValid(true);
    } catch {
      setJsonValid(false);
    }
  }

  /* ── File upload ── */
  async function handleUpload() {
    if (!uploadFile) return;
    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("targetPath", uploadTarget);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setStatus({
        type: "success",
        text: `${json.message} Dosya yolu: ${json.publicUrl}`,
      });
      setUploadFile(null);
    } catch (err) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Yükleme hatası" });
    } finally {
      setUploading(false);
    }
  }

  /* ── Logout ── */
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  /* ── Format JSON ── */
  function formatJSON() {
    try {
      const parsed = JSON.parse(content);
      setContent(JSON.stringify(parsed, null, 2));
      setJsonValid(true);
      setStatus({ type: "info", text: "JSON formatlandı" });
    } catch {
      setStatus({ type: "error", text: "JSON formatı geçersiz, formatlama yapılamadı" });
    }
  }

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      {/* ──── SIDEBAR ──── */}
      <aside
        style={{
          width: sidebarOpen ? "260px" : "64px",
          background: "rgba(15, 23, 42, 0.95)",
          borderRight: "1px solid rgba(148, 163, 184, 0.08)",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: sidebarOpen ? "24px 20px" : "24px 12px",
            borderBottom: "1px solid rgba(148,163,184,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              flexShrink: 0,
              cursor: "pointer",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ⚡
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 700 }}>Admin</div>
              <div style={{ color: "#64748b", fontSize: "0.7rem" }}>İçerik Yönetimi</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          <div style={{ marginBottom: "8px", padding: "0 12px" }}>
            {sidebarOpen && (
              <span style={{ color: "#475569", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                İçerik Türleri
              </span>
            )}
          </div>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: sidebarOpen ? "10px 14px" : "10px 0",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                borderRadius: "8px",
                border: "none",
                background: activeTab === tab.key ? "rgba(59,130,246,0.15)" : "transparent",
                color: activeTab === tab.key ? "#93c5fd" : "#94a3b8",
                fontSize: "0.85rem",
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: "2px",
              }}
            >
              <span style={{ fontSize: "1.05rem" }}>{tab.icon}</span>
              {sidebarOpen && tab.label}
            </button>
          ))}
        </nav>

        {/* Sidebar bottom */}
        <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(148,163,184,0.08)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: sidebarOpen ? "10px 14px" : "10px 0",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#ef4444",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>🚪</span>
            {sidebarOpen && "Çıkış Yap"}
          </button>
        </div>
      </aside>

      {/* ──── MAIN ──── */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <header
          style={{
            padding: "16px 32px",
            borderBottom: "1px solid rgba(148,163,184,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(15,23,42,0.5)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1 style={{ color: "#f1f5f9", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
              {currentTab.icon} {currentTab.label}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>
              content/{activeTab}.json • GitHub API ile yönetim
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.15)",
                background: "transparent",
                color: "#94a3b8",
                fontSize: "0.8rem",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              🌐 Siteyi Gör
            </a>
          </div>
        </header>

        <div style={{ padding: "24px 32px", maxWidth: "1200px" }}>
          {/* Status */}
          {status && (
            <div style={{ marginBottom: "20px" }}>
              <StatusBadge type={status.type} text={status.text} />
            </div>
          )}

          {/* ── JSON Editor ── */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "24px",
            }}
          >
            {/* Editor toolbar */}
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid rgba(148,163,184,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: jsonValid ? "#4ade80" : "#ef4444",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  {jsonValid ? "JSON geçerli" : "JSON geçersiz"}
                </span>
                {sha && (
                  <span style={{ color: "#475569", fontSize: "0.72rem" }}>
                    SHA: {sha.slice(0, 7)}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={formatJSON}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid rgba(148,163,184,0.15)",
                    background: "transparent",
                    color: "#94a3b8",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  🎨 Formatla
                </button>
                <button
                  onClick={() => loadContent(activeTab)}
                  disabled={loading}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid rgba(148,163,184,0.15)",
                    background: "transparent",
                    color: "#94a3b8",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  🔄 Yenile
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !jsonValid || loading}
                  style={{
                    padding: "6px 18px",
                    borderRadius: "6px",
                    border: "none",
                    background: saving || !jsonValid
                      ? "rgba(59,130,246,0.3)"
                      : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: saving || !jsonValid ? "not-allowed" : "pointer",
                    boxShadow: saving || !jsonValid ? "none" : "0 4px 12px rgba(59,130,246,0.3)",
                  }}
                >
                  {saving ? "Kaydediliyor..." : "💾 GitHub'a Kaydet"}
                </button>
              </div>
            </div>

            {/* Textarea */}
            {loading ? (
              <div
                style={{
                  padding: "80px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
                İçerik GitHub&apos;dan yükleniyor...
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                spellCheck={false}
                style={{
                  width: "100%",
                  minHeight: "480px",
                  padding: "20px",
                  border: "none",
                  background: "rgba(15, 23, 42, 0.4)",
                  color: "#e2e8f0",
                  fontSize: "0.82rem",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  borderLeft: jsonValid ? "3px solid rgba(34,197,94,0.3)" : "3px solid rgba(239,68,68,0.5)",
                }}
              />
            )}
          </div>

          {/* ── File Upload ── */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h2 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
              📎 Dosya Yükleme
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "20px" }}>
              PDF, PPTX, DOCX, PNG, JPEG dosyalarını GitHub reposuna yükleyin. (Maks. 25 MB)
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
              {/* Target path */}
              <div style={{ flex: "0 0 220px" }}>
                <label
                  htmlFor="upload-target"
                  style={{ display: "block", color: "#94a3b8", fontSize: "0.78rem", marginBottom: "6px" }}
                >
                  Hedef Klasör
                </label>
                <select
                  id="upload-target"
                  value={uploadTarget}
                  onChange={(e) => setUploadTarget(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(148,163,184,0.15)",
                    background: "rgba(15,23,42,0.6)",
                    color: "#e2e8f0",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                >
                  <option value="public/materials">📁 materials (Ders Materyalleri)</option>
                  <option value="public/cv">📁 cv (CV/Özgeçmiş)</option>
                </select>
              </div>

              {/* File input */}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label
                  htmlFor="upload-file"
                  style={{ display: "block", color: "#94a3b8", fontSize: "0.78rem", marginBottom: "6px" }}
                >
                  Dosya
                </label>
                <input
                  id="upload-file"
                  type="file"
                  accept=".pdf,.pptx,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  style={{
                    width: "100%",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(148,163,184,0.15)",
                    background: "rgba(15,23,42,0.6)",
                    color: "#e2e8f0",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: !uploadFile || uploading
                    ? "rgba(16,185,129,0.3)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: !uploadFile || uploading ? "not-allowed" : "pointer",
                  boxShadow: !uploadFile || uploading ? "none" : "0 4px 12px rgba(16,185,129,0.3)",
                  whiteSpace: "nowrap",
                }}
              >
                {uploading ? "Yükleniyor..." : "⬆ Yükle"}
              </button>
            </div>

            {uploadFile && (
              <div style={{ marginTop: "12px", color: "#94a3b8", fontSize: "0.78rem" }}>
                Seçilen: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
