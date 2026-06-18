"use client";

import { useState } from "react";
import {
  AdminCard,
  TextField,
  TextArea,
  SelectField,
  CheckboxField,
  PrimaryButton,
  DangerButton,
  SecondaryButton,
  LoadingScreen,
  ConfirmDialog,
  useAdminData,
  useToast,
  EmptyState,
} from "@/components/admin/AdminUI";
import type { Announcement, Course } from "@/lib/types";

export default function AnnouncementsAdmin() {
  const { data: announcements, loading: aLoading, saving, save } = useAdminData<Announcement[]>("announcements");
  const { data: courses, loading: cLoading } = useAdminData<Course[]>("courses");
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (aLoading || cLoading || !announcements || !courses) {
    return <LoadingScreen text="Duyurular yükleniyor..." />;
  }

  // ---- Handlers ----
  const handleAddNew = () => {
    setEditingItem({
      id: `ann-${Date.now()}`,
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      relatedCourse: null,
      important: false,
    });
    setView("form");
  };

  const handleEdit = (item: Announcement) => {
    setEditingItem({ ...item });
    setView("form");
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const newData = announcements.filter((a) => a.id !== deleteId);
    save(newData);
    setDeleteId(null);
  };

  const handleFormSave = () => {
    if (!editingItem) return;
    if (!editingItem.title || !editingItem.content || !editingItem.date) {
      toast("error", "Başlık, içerik ve tarih zorunludur.");
      return;
    }

    let newData: Announcement[];
    const isExisting = announcements.some((a) => a.id === editingItem.id);

    if (isExisting) {
      newData = announcements.map((a) => (a.id === editingItem.id ? editingItem : a));
    } else {
      // Sort so newest is at the top conceptually, but here we just prepend
      newData = [editingItem, ...announcements];
    }

    save(newData);
    setView("list");
    setEditingItem(null);
  };

  const handleFieldChange = (field: keyof Announcement, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const courseOptions = [
    { value: "", label: "Genel Duyuru (Ders Seçilmedi)" },
    ...courses.map((c) => ({ value: c.slug, label: c.name })),
  ];

  // ---- Views ----
  if (view === "form" && editingItem) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>
            {announcements.some((a) => a.id === editingItem.id) ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}
          </h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
            <PrimaryButton onClick={handleFormSave} loading={saving}>💾 Kaydet</PrimaryButton>
          </div>
        </div>

        <AdminCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <TextField
              label="Duyuru Başlığı"
              value={editingItem.title}
              onChange={(v) => handleFieldChange("title", v)}
              required
            />
            <TextField
              label="Tarih"
              type="date"
              value={editingItem.date}
              onChange={(v) => handleFieldChange("date", v)}
              required
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <SelectField
                label="İlgili Ders (Opsiyonel)"
                value={editingItem.relatedCourse || ""}
                onChange={(v) => handleFieldChange("relatedCourse", v || null)}
                options={courseOptions}
              />
            </div>
          </div>

          <TextArea
            label="Duyuru İçeriği"
            value={editingItem.content}
            onChange={(v) => handleFieldChange("content", v)}
            rows={6}
            required
          />

          <div style={{ marginTop: "16px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
            <CheckboxField
              label="⚠️ Bu önemli bir duyuru mu? (Ana sayfada veya dikkat çekici gösterilir)"
              checked={editingItem.important}
              onChange={(v) => handleFieldChange("important", v)}
            />
          </div>
        </AdminCard>
      </div>
    );
  }

  // Sort announcements by date
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // ---- List View ----
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Duyurular</h2>
        <PrimaryButton onClick={handleAddNew}>➕ Yeni Duyuru Ekle</PrimaryButton>
      </div>

      <AdminCard>
        {sortedAnnouncements.length === 0 ? (
          <EmptyState icon="📢" text="Henüz hiç duyuru eklenmemiş." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sortedAnnouncements.map((item) => {
              const courseName = item.relatedCourse
                ? courses.find(c => c.slug === item.relatedCourse)?.name || item.relatedCourse
                : "Genel Duyuru";
                
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
                    borderLeft: item.important ? "4px solid #ef4444" : "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                      {item.important && <span title="Önemli Duyuru">⚠️</span>}
                      {item.title}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px", display: "flex", gap: "12px" }}>
                      <span>📅 {item.date}</span>
                      <span>📚 {courseName}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
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
        title="Duyuruyu Sil"
        message="Bu duyuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
