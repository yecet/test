"use client";

import { useState } from "react";
import {
  AdminCard,
  TextField,
  TextArea,
  SelectField,
  NumberField,
  PrimaryButton,
  DangerButton,
  SecondaryButton,
  LoadingScreen,
  ConfirmDialog,
  useAdminData,
  useToast,
  EmptyState,
} from "@/components/admin/AdminUI";
import type { Material, Course } from "@/lib/types";

const MATERIAL_TYPES = [
  { value: "ders-notu", label: "Ders Notu" },
  { value: "slayt", label: "Slayt" },
  { value: "odev", label: "Ödev" },
  { value: "lab", label: "Laboratuvar" },
  { value: "sinav", label: "Sınav" },
  { value: "kaynak", label: "Kaynak" },
];

export default function MaterialsAdmin() {
  const { data: materials, loading: mLoading, save, reload } = useAdminData<Material[]>("materials");
  const { data: courses, loading: cLoading } = useAdminData<Course[]>("courses");
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "form">("list");
  const [filterCourse, setFilterCourse] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newMat, setNewMat] = useState({
    courseSlug: "",
    title: "",
    description: "",
    week: "" as number | "",
    type: "slayt",
  });

  if (mLoading || cLoading || !materials || !courses) {
    return <LoadingScreen text="Materyaller yükleniyor..." />;
  }

  // ---- Handlers ----
  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const newData = materials.filter((m) => m.id !== deleteId);
    save(newData);
    setDeleteId(null);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      toast("error", "Lütfen bir dosya seçin.");
      return;
    }
    if (!newMat.courseSlug || !newMat.title || !newMat.type) {
      toast("error", "Ders, başlık ve tür zorunludur.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      // Construct target path e.g. public/materials/devre-analizi
      formData.append("targetPath", `public/materials/${newMat.courseSlug}`);
      formData.append("commitMessage", `Yeni materyal eklendi: ${newMat.title}`);
      
      // Send material metadata so the backend updates materials.json automatically
      formData.append("materialMeta", JSON.stringify(newMat));

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

      toast("success", "Materyal başarıyla yüklendi ve eklendi.");
      
      // Reset form
      setUploadFile(null);
      setNewMat({ ...newMat, title: "", description: "", week: "" });
      setView("list");
      
      // Reload data from backend to get the newly added material
      await reload();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
    }
  };

  const courseOptions = courses.map((c) => ({ value: c.slug, label: c.name }));
  const filteredMaterials = filterCourse ? materials.filter(m => m.courseSlug === filterCourse) : materials;

  // ---- Views ----
  if (view === "form") {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Yeni Materyal Ekle</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
            <PrimaryButton onClick={handleUploadSubmit} loading={uploading}>⬆ Yükle ve Kaydet</PrimaryButton>
          </div>
        </div>

        <AdminCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <SelectField
              label="Ders Seçin"
              value={newMat.courseSlug}
              onChange={(v) => setNewMat({ ...newMat, courseSlug: v })}
              options={courseOptions}
              required
            />
            <SelectField
              label="Materyal Türü"
              value={newMat.type}
              onChange={(v) => setNewMat({ ...newMat, type: v })}
              options={MATERIAL_TYPES}
              required
            />
            <TextField
              label="Başlık"
              value={newMat.title}
              onChange={(v) => setNewMat({ ...newMat, title: v })}
              required
            />
            <NumberField
              label="Hafta (Opsiyonel)"
              value={newMat.week}
              onChange={(v) => setNewMat({ ...newMat, week: v })}
              min={1}
              max={16}
            />
          </div>

          <TextArea
            label="Açıklama (Opsiyonel)"
            value={newMat.description}
            onChange={(v) => setNewMat({ ...newMat, description: v })}
            rows={2}
          />

          <div style={{ marginTop: "16px", padding: "20px", border: "1px dashed rgba(59,130,246,0.3)", borderRadius: "12px", background: "rgba(15,23,42,0.4)" }}>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500, marginBottom: "12px" }}>
              Dosya Seçin (PDF, PPTX, DOCX, ZIP - Max 25MB) *
            </label>
            <input
              type="file"
              accept=".pdf,.pptx,.docx,.zip,.png,.jpg,.jpeg"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.15)",
                background: "rgba(15,23,42,0.6)",
                color: "#e2e8f0",
                fontSize: "0.85rem",
              }}
            />
            {uploadFile && (
              <div style={{ marginTop: "10px", color: "#94a3b8", fontSize: "0.8rem" }}>
                Seçilen dosya: <strong>{uploadFile.name}</strong> ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
        </AdminCard>
      </div>
    );
  }

  // ---- List View ----
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: "0 0 12px 0" }}>Materyaller</h2>
          <div style={{ width: "250px" }}>
            <SelectField
              label=""
              value={filterCourse}
              onChange={setFilterCourse}
              options={courseOptions}
            />
          </div>
        </div>
        <PrimaryButton onClick={() => setView("form")}>➕ Yeni Materyal Yükle</PrimaryButton>
      </div>

      <AdminCard>
        {filteredMaterials.length === 0 ? (
          <EmptyState icon="📁" text="Bu derse ait materyal bulunamadı." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredMaterials.map((mat) => {
              const courseName = courses.find(c => c.slug === mat.courseSlug)?.name || mat.courseSlug;
              return (
                <div
                  key={mat.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "rgba(15,23,42,0.4)",
                    borderRadius: "8px",
                    border: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 600 }}>
                      {mat.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "6px" }}>
                      {courseName} • Tür: {mat.type} {mat.week && `• Hafta ${mat.week}`} • Boyut: {mat.fileSize}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid rgba(148,163,184,0.2)",
                        color: "#93c5fd",
                        fontSize: "0.82rem",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                    >
                      👁 Görüntüle
                    </a>
                    <DangerButton onClick={() => setDeleteId(mat.id)}>🗑 Sil</DangerButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!deleteId}
        title="Materyali Sil"
        message="Bu materyali silmek istediğinize emin misiniz? (Dosya GitHub deposundan silinmeyecek, sadece listeden kaldırılacaktır.)"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
