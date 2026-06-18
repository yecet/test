"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/profil", label: "Profil", icon: "👤" },
  { href: "/admin/dersler", label: "Dersler", icon: "📚" },
  { href: "/admin/materyaller", label: "Materyaller", icon: "📁" },
  { href: "/admin/duyurular", label: "Duyurular", icon: "📢" },
  { href: "/admin/yayinlar", label: "Yayınlar", icon: "📄" },
  { href: "/admin/arastirma", label: "Araştırma", icon: "🔬" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // Find active item
  const activeItem = NAV_ITEMS.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );
  const pageTitle = activeItem?.label || "Admin";
  const pageIcon = activeItem?.icon || "⚡";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      {/* ──── SIDEBAR ──── */}
      <aside
        style={{
          width: sidebarOpen ? "240px" : "64px",
          background: "rgba(15, 23, 42, 0.95)",
          borderRight: "1px solid rgba(148, 163, 184, 0.08)",
          transition: "width 0.25s ease",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: sidebarOpen ? "20px 16px" : "20px 14px",
            borderBottom: "1px solid rgba(148,163,184,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
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
              border: "none",
              color: "white",
            }}
          >
            ⚡
          </button>
          {sidebarOpen && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ color: "#f1f5f9", fontSize: "0.9rem", fontWeight: 700 }}>
                Yönetim Paneli
              </div>
              <div style={{ color: "#64748b", fontSize: "0.68rem" }}>İçerik Yönetimi</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          <div style={{ marginBottom: "6px", padding: "0 8px" }}>
            {sidebarOpen && (
              <span
                style={{
                  color: "#475569",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Menü
              </span>
            )}
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: sidebarOpen ? "9px 12px" : "9px 0",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderRadius: "8px",
                  border: "none",
                  background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                  color: isActive ? "#93c5fd" : "#94a3b8",
                  fontSize: "0.84rem",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  marginBottom: "2px",
                }}
              >
                <span style={{ fontSize: "1.05rem", flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ overflow: "hidden", whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(148,163,184,0.08)" }}>
          <button
            onClick={() => window.open("/", "_blank")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: sidebarOpen ? "9px 12px" : "9px 0",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontSize: "0.84rem",
              cursor: "pointer",
              marginBottom: "2px",
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>🌐</span>
            {sidebarOpen && "Siteyi Görüntüle"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: sidebarOpen ? "9px 12px" : "9px 0",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#ef4444",
              fontSize: "0.84rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>🚪</span>
            {sidebarOpen && "Çıkış Yap"}
          </button>
        </div>
      </aside>

      {/* ──── MAIN CONTENT ──── */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Top Header */}
        <header
          style={{
            padding: "14px 28px",
            borderBottom: "1px solid rgba(148,163,184,0.08)",
            background: "rgba(15,23,42,0.5)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h1 style={{ color: "#f1f5f9", fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
            {pageIcon} {pageTitle}
          </h1>
        </header>

        {/* Page Content */}
        <div style={{ padding: "24px 28px", flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
