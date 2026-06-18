"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

/* ═══════════════════════════════════════════
   Toast System
   ═══════════════════════════════════════════ */
interface Toast {
  id: number;
  type: "success" | "error" | "info";
  text: string;
}

const ToastContext = createContext<{
  toast: (type: Toast["type"], text: string) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast["type"], text: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => {
          const colors = {
            success: { bg: "#065f46", border: "#10b981", icon: "✅" },
            error: { bg: "#7f1d1d", border: "#ef4444", icon: "❌" },
            info: { bg: "#1e3a5f", border: "#3b82f6", icon: "ℹ️" },
          }[t.type];
          return (
            <div
              key={t.id}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "10px",
                padding: "14px 20px",
                color: "#f1f5f9",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                pointerEvents: "auto",
                animation: "slideIn 0.3s ease-out",
                maxWidth: "400px",
              }}
            >
              <span>{colors.icon}</span>
              <span>{t.text}</span>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </ToastContext.Provider>
  );
}

/* ═══════════════════════════════════════════
   Confirm Dialog
   ═══════════════════════════════════════════ */
export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e293b",
          border: "1px solid rgba(148,163,184,0.15)",
          borderRadius: "14px",
          padding: "28px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <h3 style={{ color: "#f1f5f9", fontSize: "1.1rem", marginBottom: "10px" }}>
          {title}
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "24px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              border: "1px solid rgba(148,163,184,0.2)",
              background: "transparent",
              color: "#94a3b8",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
            }}
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Form Fields
   ═══════════════════════════════════════════ */
const fieldBase: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(148,163,184,0.15)",
  background: "rgba(15,23,42,0.5)",
  color: "#e2e8f0",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#cbd5e1",
  fontSize: "0.8rem",
  fontWeight: 500,
  marginBottom: "6px",
};

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{ ...fieldBase, opacity: disabled ? 0.5 : 1 }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        style={{ ...fieldBase, resize: "vertical", lineHeight: 1.6 }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ ...fieldBase, cursor: "pointer" }}
      >
        <option value="">Seçiniz...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#cbd5e1",
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
        />
        {label}
      </label>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  required,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        style={fieldBase}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Shared Buttons
   ═══════════════════════════════════════════ */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        padding: "10px 24px",
        borderRadius: "8px",
        border: "none",
        background: isDisabled
          ? "rgba(59,130,246,0.3)"
          : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "white",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: isDisabled ? "not-allowed" : "pointer",
        boxShadow: isDisabled ? "none" : "0 4px 12px rgba(59,130,246,0.3)",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s",
      }}
    >
      {loading ? "İşleniyor..." : children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  small,
}: {
  children: React.ReactNode;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "5px 12px" : "8px 16px",
        borderRadius: "6px",
        border: "1px solid rgba(239,68,68,0.3)",
        background: "rgba(239,68,68,0.1)",
        color: "#fca5a5",
        fontSize: small ? "0.75rem" : "0.82rem",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  small,
}: {
  children: React.ReactNode;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "5px 12px" : "8px 16px",
        borderRadius: "6px",
        border: "1px solid rgba(148,163,184,0.2)",
        background: "transparent",
        color: "#94a3b8",
        fontSize: small ? "0.75rem" : "0.82rem",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════
   Loading Spinner
   ═══════════════════════════════════════════ */
export function LoadingScreen({ text }: { text?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        color: "#64748b",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(59,130,246,0.2)",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "16px",
        }}
      />
      <p style={{ fontSize: "0.9rem" }}>{text || "Yükleniyor..."}</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Card
   ═══════════════════════════════════════════ */
export function AdminCard({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(30,41,59,0.5)",
        border: "1px solid rgba(148,163,184,0.1)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {(title || actions) && (
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(148,163,184,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            {title && (
              <h2 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ color: "#64748b", fontSize: "0.75rem", margin: "4px 0 0" }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ display: "flex", gap: "8px" }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Stat Card (Dashboard)
   ═══════════════════════════════════════════ */
export function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "rgba(30,41,59,0.5)",
        border: "1px solid rgba(148,163,184,0.1)",
        borderRadius: "12px",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-12px",
          right: "-12px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `${color}15`,
          pointerEvents: "none",
        }}
      />
      <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{icon}</div>
      <div style={{ color: "#f1f5f9", fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: "6px" }}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Empty State
   ═══════════════════════════════════════════ */
export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 20px",
        color: "#64748b",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{icon}</div>
      <p style={{ fontSize: "0.9rem" }}>{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   useAdminData hook — load/save via API
   ═══════════════════════════════════════════ */
export function useAdminData<T>(type: string) {
  const [data, setData] = useState<T | null>(null);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${type}`);
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data as T);
      setSha(json.sha);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Veri yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [type, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (newData: T) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/content/${type}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: newData, sha }),
        });
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        toast("success", "Başarıyla kaydedildi. Vercel birkaç dakika içinde siteyi güncelleyecek.");
        setData(newData);
        // Reload to get new SHA
        await load();
      } catch (err) {
        toast("error", err instanceof Error ? err.message : "Kaydetme hatası");
      } finally {
        setSaving(false);
      }
    },
    [type, sha, toast, load]
  );

  return { data, sha, loading, saving, save, reload: load, setData };
}
