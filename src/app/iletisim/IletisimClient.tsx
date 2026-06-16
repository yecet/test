"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mailto fallback – gerçek backend olmadığından mailto kullanılır
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Gönderen: ${formData.name} <${formData.email}>\n\n${formData.message}`)}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header" aria-labelledby="contact-heading">
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>✉️ İletişim</span>
          </div>
          <h1 id="contact-heading" style={{ fontSize: "2.2rem", marginBottom: "12px" }}>İletişim</h1>
          <p>Sorularınız, ders talepleriniz veya araştırma iş birlikleri için yazın</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }} className="contact-grid">
            {/* Form */}
            <div>
              {submitted ? (
                <div className="card" style={{ padding: "48px", textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
                  <h2 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>E-posta İstemciniz Açıldı</h2>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.65 }}>
                    Mesajınız e-posta istemcinize yüklendi. Göndermek için istemcinizden onaylayın.
                    <br />
                    Doğrudan{" "}
                    <a href={`mailto:${profile.email}`} style={{ color: "var(--blue)" }}>
                      {profile.email}
                    </a>{" "}
                    adresine de yazabilirsiniz.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                    ← Yeni Mesaj
                  </button>
                </div>
              ) : (
                <div className="card" style={{ padding: "36px" }}>
                  <h2 style={{ fontSize: "1.3rem", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                    ✉️ Mesaj Gönder
                  </h2>

                  <form onSubmit={handleSubmit} noValidate aria-label="İletişim formu">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <label htmlFor="contact-name" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                          Adınız *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          className="input"
                          placeholder="Adınız Soyadınız"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                          E-posta *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          className="input"
                          placeholder="ornek@email.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label htmlFor="contact-subject" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                        Konu *
                      </label>
                      <select
                        id="contact-subject"
                        className="select"
                        style={{ width: "100%" }}
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="">Konu seçin...</option>
                        <option value="Ders Sorusu">Ders Sorusu</option>
                        <option value="Ödev / Lab">Ödev / Lab</option>
                        <option value="Araştırma İş Birliği">Araştırma İş Birliği</option>
                        <option value="Danışmanlık Talebi">Danışmanlık Talebi</option>
                        <option value="Ofis Saati Randevusu">Ofis Saati Randevusu</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                      <label htmlFor="contact-message" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                        Mesajınız *
                      </label>
                      <textarea
                        id="contact-message"
                        className="input"
                        placeholder="Mesajınızı buraya yazın..."
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ resize: "vertical", minHeight: "140px" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                      disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
                    >
                      ✉️ Gönder
                    </button>
                  </form>

                  <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "16px", textAlign: "center" }}>
                    Form e-posta istemcinizi açar. Doğrudan{" "}
                    <a href={`mailto:${profile.email}`} style={{ color: "var(--blue)" }}>
                      {profile.email}
                    </a>{" "}
                    adresine de yazabilirsiniz.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              {/* Contact info */}
              <div className="card" style={{ padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "18px" }}>📬 İletişim Bilgileri</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { icon: "✉️", label: "E-posta", value: profile.email, href: `mailto:${profile.email}` },
                    { icon: "📞", label: "Telefon", value: profile.phone },
                    { icon: "🏢", label: "Ofis", value: profile.office },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        {item.icon} {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ color: "var(--blue)", fontSize: "0.875rem", textDecoration: "none" }}>
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="card" style={{ padding: "24px", marginBottom: "20px", background: "linear-gradient(135deg, rgba(30,58,95,0.05), rgba(45,106,159,0.05))", border: "1px solid rgba(30,58,95,0.1)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px" }}>🕐 Ofis Saatleri</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { day: "Salı", hours: "14:00 – 16:00" },
                    { day: "Perşembe", hours: "10:00 – 12:00" },
                  ].map((oh) => (
                    <div key={oh.day} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "white", borderRadius: "8px", border: "1px solid var(--border)" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{oh.day}</span>
                      <span style={{ color: "var(--blue)", fontWeight: 600, fontSize: "0.875rem" }}>{oh.hours}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "12px", lineHeight: 1.6 }}>
                  {profile.office}. Randevu için önceden e-posta gönderilmesi önerilir.
                </p>
              </div>

              {/* Academic profiles */}
              <div className="card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px" }}>🔗 Akademik Profiller</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { href: profile.social.googleScholar, label: "Google Scholar", icon: "📚" },
                    { href: profile.social.orcid, label: "ORCID", icon: "🆔" },
                    { href: profile.social.researchGate, label: "ResearchGate", icon: "🔬" },
                    { href: profile.social.linkedin, label: "LinkedIn", icon: "💼" },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)"; (e.currentTarget as HTMLElement).style.color = "var(--navy)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                    >
                      <span>{s.icon}</span><span>{s.label}</span><span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .contact-grid form > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
