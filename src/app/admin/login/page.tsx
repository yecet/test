"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: "24px",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          right: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: "16px",
          padding: "40px 36px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "1.5rem",
              boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
            }}
          >
            🔐
          </div>
          <h1
            style={{
              color: "#f1f5f9",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            Admin Panel
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            İçerik yönetim sistemine giriş yapın
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#fca5a5",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="admin-username"
              style={{
                display: "block",
                color: "#cbd5e1",
                fontSize: "0.82rem",
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              Kullanıcı Adı
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="admin"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                background: "rgba(15, 23, 42, 0.6)",
                color: "#f1f5f9",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                color: "#cbd5e1",
                fontSize: "0.82rem",
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              Şifre
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                background: "rgba(15, 23, 42, 0.6)",
                color: "#f1f5f9",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              border: "none",
              background: loading
                ? "rgba(59,130,246,0.4)"
                : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 15px rgba(59,130,246,0.3)",
            }}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "0.75rem",
            marginTop: "24px",
          }}
        >
          İçerik yönetimi • GitHub API entegrasyonu
        </p>
      </div>
    </div>
  );
}
