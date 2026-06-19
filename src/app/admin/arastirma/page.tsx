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
import type { ResearchData, ResearchArea, ResearchProject } from "@/lib/types";

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

  const [activeTab, setActiveTab] = useState<"areas" | "projects">("areas");
  const [view, setView] = useState<"list" | "form">("list");
  
  // Area states
  const [editingArea, setEditingArea] = useState<ResearchArea | null>(null);
  const [deleteAreaId, setDeleteAreaId] = useState<string | null>(null);

  // Project states
  const [editingProject, setEditingProject] = useState<ResearchProject | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  if (loading || !data) {
    return <LoadingScreen text="Araştırma alanları yükleniyor..." />;
  }

  const areas = data.areas || [];
  const projects = data.projects || [];

  // ---- Area Handlers ----
  const handleAddNewArea = () => {
    setEditingArea({
      id: "",
      title: "",
      description: "",
      icon: "🔬",
      topics: [],
      relatedPublications: [],
    });
    setView("form");
  };

  const handleEditArea = (item: ResearchArea) => {
    setEditingArea({ ...item });
    setView("form");
  };

  const handleDeleteAreaConfirm = () => {
    if (!deleteAreaId) return;
    const newAreas = areas.filter((a) => a.id !== deleteAreaId);
    // Also remove or clean projects linked to this area
    const newProjects = projects.filter((p) => p.areaId !== deleteAreaId);
    save({ ...data, areas: newAreas, projects: newProjects });
    setDeleteAreaId(null);
  };

  const handleAreaSave = () => {
    if (!editingArea) return;
    if (!editingArea.title || !editingArea.description) {
      toast("error", "Başlık ve açıklama zorunludur.");
      return;
    }

    let finalItem = { ...editingArea };
    if (!finalItem.id) {
      finalItem.id = slugify(finalItem.title);
    }

    let newAreas: ResearchArea[];
    const isExisting = areas.some((a) => a.id === finalItem.id);

    if (isExisting && (!editingArea.id || editingArea.id === finalItem.id)) {
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
    setEditingArea(null);
  };

  // ---- Project Handlers ----
  const handleAddNewProject = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      status: "active",
      startYear: new Date().getFullYear(),
      endYear: undefined,
      funding: "",
      collaborators: [],
      areaId: areas[0]?.id || "",
    });
    setView("form");
  };

  const handleEditProject = (item: ResearchProject) => {
    setEditingProject({ ...item });
    setView("form");
  };

  const handleDeleteProjectConfirm = () => {
    if (!deleteProjectId) return;
    const newProjects = projects.filter((p) => p.id !== deleteProjectId);
    save({ ...data, projects: newProjects });
    setDeleteProjectId(null);
  };

  const handleProjectSave = () => {
    if (!editingProject) return;
    if (!editingProject.title || !editingProject.description || !editingProject.startYear || !editingProject.areaId) {
      toast("error", "Başlık, açıklama, başlangıç yılı ve ilgili alan zorunludur.");
      return;
    }

    let newProjects: ResearchProject[];
    const isExisting = projects.some((p) => p.id === editingProject.id);

    if (isExisting) {
      newProjects = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    } else {
      newProjects = [editingProject, ...projects];
    }

    save({ ...data, projects: newProjects });
    setView("list");
    setEditingProject(null);
  };

  const handleAreaFieldChange = (field: keyof ResearchArea, value: any) => {
    if (!editingArea) return;
    setEditingArea({ ...editingArea, [field]: value });
  };

  const handleProjectFieldChange = (field: keyof ResearchProject, value: any) => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, [field]: value });
  };

  const areaOptions = areas.map((a) => ({ value: a.id, label: `${a.icon} ${a.title}` }));

  // ---- Views ----
  if (view === "form") {
    if (activeTab === "areas" && editingArea) {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>
              {editingArea.id ? "Araştırma Alanını Düzenle" : "Yeni Araştırma Alanı"}
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
              <PrimaryButton onClick={handleAreaSave} loading={saving}>💾 Kaydet</PrimaryButton>
            </div>
          </div>

          <AdminCard>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0 16px" }}>
              <TextField
                label="Alan Başlığı"
                value={editingArea.title}
                onChange={(v) => handleAreaFieldChange("title", v)}
                required
              />
              <TextField
                label="İkon (Emoji)"
                value={editingArea.icon}
                onChange={(v) => handleAreaFieldChange("icon", v)}
              />
            </div>

            <TextArea
              label="Açıklama"
              value={editingArea.description}
              onChange={(v) => handleAreaFieldChange("description", v)}
              rows={4}
              required
            />

            <TextArea
              label="Alt Konular (Virgülle ayırın)"
              value={editingArea.topics.join(", ")}
              onChange={(v) => handleAreaFieldChange("topics", v.split(",").map(s => s.trim()).filter(Boolean))}
              rows={2}
            />
          </AdminCard>
        </div>
      );
    }

    if (activeTab === "projects" && editingProject) {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>
              {projects.some(p => p.id === editingProject.id) ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <SecondaryButton onClick={() => setView("list")}>İptal</SecondaryButton>
              <PrimaryButton onClick={handleProjectSave} loading={saving}>💾 Kaydet</PrimaryButton>
            </div>
          </div>

          <AdminCard>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0 16px" }}>
              <TextField
                label="Proje Başlığı"
                value={editingProject.title}
                onChange={(v) => handleProjectFieldChange("title", v)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <SelectField
                label="İlgili Araştırma Alanı"
                value={editingProject.areaId}
                onChange={(v) => handleProjectFieldChange("areaId", v)}
                options={areaOptions}
                required
              />
              <SelectField
                label="Proje Durumu"
                value={editingProject.status}
                onChange={(v) => handleProjectFieldChange("status", v)}
                options={[
                  { value: "active", label: "Aktif / Devam Ediyor" },
                  { value: "completed", label: "Tamamlandı" },
                  { value: "planned", label: "Planlandı / Gelecek" },
                ]}
                required
              />
              <NumberField
                label="Başlangıç Yılı"
                value={editingProject.startYear}
                onChange={(v) => handleProjectFieldChange("startYear", v)}
                required
              />
              <NumberField
                label="Bitiş Yılı (Opsiyonel)"
                value={editingProject.endYear || ""}
                onChange={(v) => handleProjectFieldChange("endYear", v ? Number(v) : undefined)}
              />
              <TextField
                label="Destekleyen Kurum / Fon (Örn: TÜBİTAK)"
                value={editingProject.funding || ""}
                onChange={(v) => handleProjectFieldChange("funding", v)}
              />
              <TextField
                label="Ortaklar / İşbirlikçiler (Virgülle ayırın)"
                value={(editingProject.collaborators || []).join(", ")}
                onChange={(v) => handleProjectFieldChange("collaborators", v.split(",").map(s => s.trim()).filter(Boolean))}
              />
            </div>

            <TextArea
              label="Proje Açıklaması"
              value={editingProject.description}
              onChange={(v) => handleProjectFieldChange("description", v)}
              rows={4}
              required
            />
          </AdminCard>
        </div>
      );
    }
  }

  // ---- List View ----
  return (
    <>
      {/* Sekme Seçiciler */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(148,163,184,0.1)", marginBottom: "24px", paddingBottom: "12px" }}>
        <button
          onClick={() => { setActiveTab("areas"); setView("list"); }}
          style={{
            padding: "8px 16px",
            background: activeTab === "areas" ? "rgba(59,130,246,0.15)" : "transparent",
            color: activeTab === "areas" ? "#93c5fd" : "#94a3b8",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: activeTab === "areas" ? 600 : 400,
            fontSize: "0.9rem",
          }}
        >
          🔬 Araştırma Alanları ({areas.length})
        </button>
        <button
          onClick={() => { setActiveTab("projects"); setView("list"); }}
          style={{
            padding: "8px 16px",
            background: activeTab === "projects" ? "rgba(59,130,246,0.15)" : "transparent",
            color: activeTab === "projects" ? "#93c5fd" : "#94a3b8",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: activeTab === "projects" ? 600 : 400,
            fontSize: "0.9rem",
          }}
        >
          📁 Projeler ({projects.length})
        </button>
      </div>

      {activeTab === "areas" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Araştırma Alanları</h2>
            <PrimaryButton onClick={handleAddNewArea}>➕ Yeni Alan Ekle</PrimaryButton>
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
                      <SecondaryButton onClick={() => handleEditArea(item)}>✏️ Düzenle</SecondaryButton>
                      <DangerButton onClick={() => setDeleteAreaId(item.id)}>🗑 Sil</DangerButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          <ConfirmDialog
            open={!!deleteAreaId}
            title="Araştırma Alanını Sil"
            message="Bu alanı silmek istediğinize emin misiniz? Bu alana bağlı tüm projeler de silinecektir. Bu işlem geri alınamaz."
            onConfirm={handleDeleteAreaConfirm}
            onCancel={() => setDeleteAreaId(null)}
          />
        </>
      )}

      {activeTab === "projects" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#f1f5f9", fontSize: "1.25rem", margin: 0 }}>Araştırma Projeleri</h2>
            <PrimaryButton onClick={handleAddNewProject} disabled={areas.length === 0}>
              ➕ Yeni Proje Ekle
            </PrimaryButton>
          </div>

          <AdminCard>
            {areas.length === 0 ? (
              <EmptyState icon="⚠️" text="Proje eklemeden önce en az bir Araştırma Alanı eklemelisiniz." />
            ) : projects.length === 0 ? (
              <EmptyState icon="📁" text="Henüz araştırma projesi eklenmemiş." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projects.map((item) => {
                  const linkedArea = areas.find(a => a.id === item.areaId);
                  const statusLabel = {
                    active: "Aktif",
                    completed: "Tamamlandı",
                    planned: "Planlandı"
                  }[item.status];
                  
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
                        <div style={{ color: "#e2e8f0", fontSize: "1.05rem", fontWeight: 600 }}>
                          {item.title}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <span>📅 {item.startYear}{item.endYear ? ` - ${item.endYear}` : " (Devam Ediyor)"}</span>
                          <span>📌 {statusLabel}</span>
                          {linkedArea && <span>🔬 {linkedArea.icon} {linkedArea.title}</span>}
                          {item.funding && <span>💰 {item.funding}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <SecondaryButton onClick={() => handleEditProject(item)}>✏️ Düzenle</SecondaryButton>
                        <DangerButton onClick={() => setDeleteProjectId(item.id)}>🗑 Sil</DangerButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminCard>

          <ConfirmDialog
            open={!!deleteProjectId}
            title="Projeyi Sil"
            message="Bu projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
            onConfirm={handleDeleteProjectConfirm}
            onCancel={() => setDeleteProjectId(null)}
          />
        </>
      )}
    </>
  );
}

