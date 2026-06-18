"use client";

import { useState } from "react";
import {
  AdminCard,
  TextField,
  TextArea,
  PrimaryButton,
  LoadingScreen,
  useAdminData,
  useToast,
} from "@/components/admin/AdminUI";
import type { Profile } from "@/lib/types";

export default function ProfileAdmin() {
  const { data: profile, loading, saving, save, setData } = useAdminData<Profile>("profile");
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  if (loading || !profile) return <LoadingScreen text="Profil yükleniyor..." />;

  const handleChange = (field: keyof Profile, value: any) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSocialChange = (field: keyof Profile["social"], value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, social: { ...prev.social, [field]: value } };
    });
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(",").map((s) => s.trim()).filter(Boolean);
    handleChange("skills", skills);
  };

  const handleSave = () => {
    save(profile);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetPath", "public"); // uploads to public/
      formData.append("commitMessage", "Profil fotoğrafı güncellendi");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast("success", `Fotoğraf başarıyla yüklendi: ${json.publicUrl}`);
      // Note: we might want to save this URL to profile.json if it had a photoUrl field.
      // Currently Profile type in types.ts doesn't have a photoUrl. We just upload it.
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Profil Bilgileri</h2>
        <PrimaryButton onClick={handleSave} loading={saving}>
          💾 Değişiklikleri Kaydet
        </PrimaryButton>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Temel Bilgiler */}
        <AdminCard title="Temel Bilgiler">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <TextField
              label="Ad Soyad"
              value={profile.name}
              onChange={(v) => handleChange("name", v)}
              required
            />
            <TextField
              label="Ünvan"
              value={profile.title}
              onChange={(v) => handleChange("title", v)}
              required
            />
            <TextField
              label="Bölüm"
              value={profile.department}
              onChange={(v) => handleChange("department", v)}
            />
            <TextField
              label="Üniversite"
              value={profile.university}
              onChange={(v) => handleChange("university", v)}
            />
          </div>
          <TextArea
            label="Kısa Biyografi"
            value={profile.shortBio}
            onChange={(v) => handleChange("shortBio", v)}
            rows={2}
          />
          <TextArea
            label="Detaylı Biyografi"
            value={profile.bio}
            onChange={(v) => handleChange("bio", v)}
            rows={5}
          />
        </AdminCard>

        {/* İletişim Bilgileri */}
        <AdminCard title="İletişim & Ofis">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <TextField
              label="E-posta"
              value={profile.email}
              onChange={(v) => handleChange("email", v)}
              type="email"
            />
            <TextField
              label="Telefon"
              value={profile.phone}
              onChange={(v) => handleChange("phone", v)}
            />
            <TextField
              label="Ofis"
              value={profile.office}
              onChange={(v) => handleChange("office", v)}
            />
            <TextField
              label="Ofis Saatleri"
              value={profile.officeHours}
              onChange={(v) => handleChange("officeHours", v)}
            />
          </div>
        </AdminCard>

        {/* Araştırma ve Yetenekler */}
        <AdminCard title="Uzmanlık Alanları">
          <TextArea
            label="Yetenekler & Araştırma Alanları (Virgülle ayırın)"
            value={profile.skills.join(", ")}
            onChange={handleSkillsChange}
            rows={2}
          />
        </AdminCard>

        {/* Sosyal Medya & Linkler */}
        <AdminCard title="Sosyal Medya & Akademik Linkler">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <TextField
              label="Google Scholar"
              value={profile.social.googleScholar}
              onChange={(v) => handleSocialChange("googleScholar", v)}
            />
            <TextField
              label="ORCID"
              value={profile.social.orcid}
              onChange={(v) => handleSocialChange("orcid", v)}
            />
            <TextField
              label="LinkedIn"
              value={profile.social.linkedin}
              onChange={(v) => handleSocialChange("linkedin", v)}
            />
            <TextField
              label="GitHub"
              value={profile.social.github}
              onChange={(v) => handleSocialChange("github", v)}
            />
            <TextField
              label="ResearchGate"
              value={profile.social.researchGate}
              onChange={(v) => handleSocialChange("researchGate", v)}
            />
          </div>
        </AdminCard>

        {/* Profil Fotoğrafı */}
        <AdminCard title="Profil Fotoğrafı">
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.8rem", marginBottom: "8px" }}>
              Yeni Fotoğraf Yükle (PNG/JPG)
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handlePhotoUpload}
              disabled={uploading}
              style={{
                width: "100%",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.15)",
                background: "rgba(15,23,42,0.5)",
                color: "#e2e8f0",
                fontSize: "0.82rem",
              }}
            />
            {uploading && <div style={{ color: "#3b82f6", fontSize: "0.8rem", marginTop: "8px" }}>Yükleniyor...</div>}
          </div>
          <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>
            Not: Dosya <strong>public/</strong> klasörüne yüklenecektir. Ana sayfadaki fotoğrafınızı değiştirmek için, mevcut fotoğrafınızla (örn. profile.jpg) aynı isimde bir dosya yükleyebilirsiniz.
          </p>
        </AdminCard>
      </div>

      <div style={{ marginTop: "24px", textAlign: "right" }}>
        <PrimaryButton onClick={handleSave} loading={saving}>
          💾 Değişiklikleri Kaydet
        </PrimaryButton>
      </div>
    </div>
  );
}
