"use client";

import { useState } from "react";
import {
  AdminCard,
  TextField,
  TextArea,
  PrimaryButton,
  DangerButton,
  SecondaryButton,
  LoadingScreen,
  ConfirmDialog,
  useAdminData,
  useToast,
  EmptyState,
} from "@/components/admin/AdminUI";
import type { ResearchData, ResearchArea } from "@/lib/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ResearchAdmin() {
  const { data, loading, saving, save } = useAdminData<ResearchData>("research");
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<ResearchArea | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading || !data) {
    return <LoadingScreen text="Araştırma alanları yükleniyor..." />;
  }

  const areas = data.areas;

  // ---- Handlers ----
  const handleAddNew = () => {
    setEditingItem({
      id: "",
      title: "",
      description: "",
      icon: "🔬",
      topics: [],
      relatedPublications: [],
    });
    setView("form");
  };

  const handleEdit = (item: ResearchArea) => {
    setEditingItem({ ...item });
    setView("form");
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const newAreas = areas.filter((a) => a.id !== deleteId);
    save({ ...data, areas: newAreas });
    setDeleteId(null);
  };

  const handleFormSave = () => {
    if (!editingItem) return;
    if (!editingItem.title || !editingItem.description) {
      toast("error", "Başlık ve açıklama zorunludur.");
      return;
    }

    let finalItem = { ...editingItem };
    if (!finalItem.id) {
      finalItem.id = slugify(finalItem.title);
    }

    let newAreas: ResearchArea[];
    const isExisting = areas.some((a) => a.id === finalItem.id);

    if (isExisting && (!editingItem.id || editingItem.id === finalItem.id)) {
      newAreas = areas.map((a) => (a.id === finalItem.id ? finalItem : a));
    } else {
      if (areas.some((a) => a.id === finalItem.id)) {
        toast("error", "Bu isme sahip bir araştırma alanı zaten var.");
        return;
      }
      newAreas = [...areas, finalItem];
    }

    save({ ...data, areas: newAreas });
    setView("list");
    setEditingItem(null);
  };

  const handleFieldChange = (field: keyof ResearchArea, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  // ---- Views ----
  if (view === "form" && editingItem) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>
            {editingItem.id ? "Araştırma Alanını Düzenle" : "Yeni Araştırma Alanı"}
          </h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
            <PrimaryButton onClick={handleFormSave} loading={saving}>💾 Kaydet</PrimaryButton>
          </div>
        </div>

        <AdminCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0 16px" }}>
            <TextField
              label="Alan Başlığı"
              value={editingItem.title}
              onChange={(v) => handleFieldChange("title", v)}
              required
            />
            <TextField
              label="İkon (Emoji)"
              value={editingItem.icon}
              onChange={(v) => handleFieldChange("icon", v)}
            />
          </div>

          <TextArea
            label="Açıklama"
            value={editingItem.description}
            onChange={(v) => handleFieldChange("description", v)}
            rows={4}
            required
          />

          <TextArea
            label="Alt Konular (Virgülle ayırın)"
            value={editingItem.topics.join(", ")}
            onChange={(v) => handleFieldChange("topics", v.split(",").map(s => s.trim()).filter(Boolean))}
            rows={2}
          />
        </AdminCard>
      </div>
    );
  }

  // ---- List View ----
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Araştırma Alanları</h2>
        <PrimaryButton onClick={handleAddNew}>➕ Yeni Alan Ekle</PrimaryButton>
      </div>

      <AdminCard>
        {areas.length === 0 ? (
          <EmptyState icon="🔬" text="Henüz araştırma alanı eklenmemiş." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {areas.map((item) => (
              <div
                key={item.id}
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
                  <div style={{ color: "#e2e8f0", fontSize: "1.1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{item.icon}</span> {item.title}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px", maxWidth: "600px", lineHeight: 1.5 }}>
                    {item.description}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <SecondaryButton onClick={() => handleEdit(item)}>✏️ Düzenle</SecondaryButton>
                  <DangerButton onClick={() => setDeleteId(item.id)}>🗑 Sil</DangerButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!deleteId}
        title="Araştırma Alanını Sil"
        message="Bu alanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
