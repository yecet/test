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
import type { Publication, PublicationType } from "@/lib/types";

const PUB_TYPES: { value: PublicationType; label: string }[] = [
  { value: "journal", label: "Makale (Dergi)" },
  { value: "conference", label: "Bildiri (Konferans)" },
  { value: "book-chapter", label: "Kitap Bölümü" },
  { value: "thesis", label: "Tez" },
  { value: "preprint", label: "Ön Baskı" },
];

export default function PublicationsAdmin() {
  const { data: publications, loading, saving, save } = useAdminData<Publication[]>("publications");
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<Publication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading || !publications) {
    return <LoadingScreen text="Yayınlar yükleniyor..." />;
  }

  // ---- Handlers ----
  const handleAddNew = () => {
    setEditingItem({
      id: `pub-${Date.now()}`,
      title: "",
      authors: [],
      venue: "",
      year: new Date().getFullYear(),
      type: "journal",
      keywords: [],
      doi: "",
      url: "",
      abstract: "",
    });
    setView("form");
  };

  const handleEdit = (item: Publication) => {
    setEditingItem({ ...item });
    setView("form");
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const newData = publications.filter((p) => p.id !== deleteId);
    save(newData);
    setDeleteId(null);
  };

  const handleFormSave = () => {
    if (!editingItem) return;
    if (!editingItem.title || !editingItem.venue || !editingItem.year) {
      toast("error", "Başlık, dergi/konferans adı ve yıl zorunludur.");
      return;
    }

    let newData: Publication[];
    const isExisting = publications.some((p) => p.id === editingItem.id);

    if (isExisting) {
      newData = publications.map((p) => (p.id === editingItem.id ? editingItem : p));
    } else {
      // Prepend
      newData = [editingItem, ...publications];
    }

    // Sort by year descending
    newData.sort((a, b) => b.year - a.year);

    save(newData);
    setView("list");
    setEditingItem(null);
  };

  const handleFieldChange = (field: keyof Publication, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  // ---- Views ----
  if (view === "form" && editingItem) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>
            {publications.some((p) => p.id === editingItem.id) ? "Yayını Düzenle" : "Yeni Yayın Ekle"}
          </h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
            <PrimaryButton onClick={handleFormSave} loading={saving}>💾 Kaydet</PrimaryButton>
          </div>
        </div>

        <AdminCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0 16px" }}>
            <TextField
              label="Yayın Başlığı"
              value={editingItem.title}
              onChange={(v) => handleFieldChange("title", v)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <SelectField
              label="Yayın Türü"
              value={editingItem.type}
              onChange={(v) => handleFieldChange("type", v as PublicationType)}
              options={PUB_TYPES}
              required
            />
            <NumberField
              label="Yıl"
              value={editingItem.year}
              onChange={(v) => handleFieldChange("year", v)}
              required
            />
            <TextField
              label="Yayınlandığı Yer (Dergi/Konferans Adı)"
              value={editingItem.venue}
              onChange={(v) => handleFieldChange("venue", v)}
              required
            />
            <TextField
              label="Yazarlar (Virgülle ayırın)"
              value={editingItem.authors.join(", ")}
              onChange={(v) => handleFieldChange("authors", v.split(",").map(s => s.trim()).filter(Boolean))}
              required
            />
            <TextField
              label="DOI (Opsiyonel)"
              value={editingItem.doi || ""}
              onChange={(v) => handleFieldChange("doi", v)}
            />
            <TextField
              label="Link (Opsiyonel)"
              value={editingItem.url || ""}
              onChange={(v) => handleFieldChange("url", v)}
            />
          </div>

          <TextArea
            label="Anahtar Kelimeler (Virgülle ayırın)"
            value={editingItem.keywords.join(", ")}
            onChange={(v) => handleFieldChange("keywords", v.split(",").map(s => s.trim()).filter(Boolean))}
            rows={2}
          />

          <TextArea
            label="Özet / Abstract (Opsiyonel)"
            value={editingItem.abstract || ""}
            onChange={(v) => handleFieldChange("abstract", v)}
            rows={5}
          />
        </AdminCard>
      </div>
    );
  }

  // ---- List View ----
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Yayınlar</h2>
        <PrimaryButton onClick={handleAddNew}>➕ Yeni Yayın Ekle</PrimaryButton>
      </div>

      <AdminCard>
        {publications.length === 0 ? (
          <EmptyState icon="📄" text="Henüz hiç yayın eklenmemiş." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {publications.map((item) => {
              const typeLabel = PUB_TYPES.find((t) => t.value === item.type)?.label || item.type;
              return (
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
                    <div style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 600 }}>
                      {item.title}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <span>📅 {item.year}</span>
                      <span>🏷 {typeLabel}</span>
                      <span>📖 {item.venue}</span>
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "4px" }}>
                      Yazarlar: {item.authors.join(", ")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <SecondaryButton onClick={() => handleEdit(item)}>✏️ Düzenle</SecondaryButton>
                    <DangerButton onClick={() => setDeleteId(item.id)}>🗑 Sil</DangerButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!deleteId}
        title="Yayını Sil"
        message="Bu yayını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
