"use client";

import { useState } from "react";
import {
  AdminCard,
  TextField,
  TextArea,
  SelectField,
  CheckboxField,
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
import type { Course } from "@/lib/types";

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

export default function CoursesAdmin() {
  const { data: courses, loading, saving, save } = useAdminData<Course[]>("courses");
  const { toast } = useToast();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Confirm Delete Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading || !courses) return <LoadingScreen text="Dersler yükleniyor..." />;

  // ---- Handlers ----
  const handleAddNew = () => {
    setEditingCourse({
      slug: "",
      code: "",
      name: "",
      description: "",
      credits: 3,
      semester: "",
      level: "Lisans",
      prerequisites: [],
      objectives: [],
      weeklyPlan: [],
      active: true,
    });
    setView("form");
  };

  const handleEdit = (course: Course) => {
    setEditingCourse({ ...course });
    setView("form");
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const newData = courses.filter((c) => c.slug !== deleteId);
    save(newData);
    setDeleteId(null);
  };

  const handleFormSave = () => {
    if (!editingCourse) return;
    if (!editingCourse.name || !editingCourse.code) {
      toast("error", "Ders adı ve kodu zorunludur.");
      return;
    }

    // Auto-generate slug if new
    let finalCourse = { ...editingCourse };
    if (!finalCourse.slug) {
      finalCourse.slug = slugify(finalCourse.name);
    }

    let newData: Course[];
    const isExisting = courses.some((c) => c.slug === finalCourse.slug);

    if (isExisting && (!editingCourse.slug || editingCourse.slug === finalCourse.slug)) {
      // Update
      newData = courses.map((c) => (c.slug === finalCourse.slug ? finalCourse : c));
    } else {
      // Add new
      if (courses.some((c) => c.slug === finalCourse.slug)) {
        toast("error", "Bu isme sahip bir ders (slug) zaten var.");
        return;
      }
      newData = [...courses, finalCourse];
    }

    save(newData);
    setView("list");
    setEditingCourse(null);
  };

  const handleFieldChange = (field: keyof Course, value: any) => {
    if (!editingCourse) return;
    setEditingCourse({ ...editingCourse, [field]: value });
  };

  // ---- Views ----
  if (view === "form" && editingCourse) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>
            {editingCourse.slug ? "Dersi Düzenle" : "Yeni Ders Ekle"}
          </h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
            <PrimaryButton onClick={handleFormSave} loading={saving}>💾 Kaydet</PrimaryButton>
          </div>
        </div>

        <AdminCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <TextField
              label="Ders Adı"
              value={editingCourse.name}
              onChange={(v) => handleFieldChange("name", v)}
              required
            />
            <TextField
              label="Ders Kodu"
              value={editingCourse.code}
              onChange={(v) => handleFieldChange("code", v)}
              required
            />
            <SelectField
              label="Seviye"
              value={editingCourse.level}
              onChange={(v) => handleFieldChange("level", v)}
              options={[
                { value: "Lisans", label: "Lisans" },
                { value: "Yüksek Lisans", label: "Yüksek Lisans" },
              ]}
              required
            />
            <TextField
              label="Dönem (örn. Güz 2024)"
              value={editingCourse.semester}
              onChange={(v) => handleFieldChange("semester", v)}
              required
            />
            <NumberField
              label="Kredi"
              value={editingCourse.credits}
              onChange={(v) => handleFieldChange("credits", v)}
              required
            />
          </div>

          <TextArea
            label="Ders Açıklaması"
            value={editingCourse.description}
            onChange={(v) => handleFieldChange("description", v)}
            rows={3}
            required
          />

          <TextArea
            label="Ön Koşullar (Virgülle ayırın)"
            value={editingCourse.prerequisites.join(", ")}
            onChange={(v) => handleFieldChange("prerequisites", v.split(",").map(s => s.trim()).filter(Boolean))}
            rows={2}
          />

          <TextArea
            label="Öğrenme Hedefleri (Her satıra bir hedef)"
            value={editingCourse.objectives.join("\n")}
            onChange={(v) => handleFieldChange("objectives", v.split("\n").map(s => s.trim()).filter(Boolean))}
            rows={4}
          />

          <div style={{ marginTop: "16px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
            <CheckboxField
              label="Ders Aktif (Sitede Gösterilsin mi?)"
              checked={editingCourse.active}
              onChange={(v) => handleFieldChange("active", v)}
            />
          </div>
        </AdminCard>
      </div>
    );
  }

  // ---- List View ----
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Dersler</h2>
        <PrimaryButton onClick={handleAddNew}>➕ Yeni Ders Ekle</PrimaryButton>
      </div>

      <AdminCard>
        {courses.length === 0 ? (
          <EmptyState icon="📚" text="Henüz hiç ders eklenmemiş." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {courses.map((course) => (
              <div
                key={course.slug}
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
                  <div style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px" }}>
                    {course.code} – {course.name}
                    {!course.active && (
                      <span style={{ fontSize: "0.7rem", padding: "2px 8px", background: "#7f1d1d", color: "#fca5a5", borderRadius: "12px" }}>Pasif</span>
                    )}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "6px" }}>
                    {course.level} • {course.semester} • {course.credits} Kredi
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <SecondaryButton onClick={() => handleEdit(course)}>✏️ Düzenle</SecondaryButton>
                  <DangerButton onClick={() => setDeleteId(course.slug)}>🗑 Sil</DangerButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!deleteId}
        title="Dersi Sil"
        message="Bu dersi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
