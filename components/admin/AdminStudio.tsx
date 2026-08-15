"use client";

import React, { useState, useEffect } from "react";
import { LogoBadge } from "@/components/LogoBadge";

type TabKey = "projects" | "hero" | "about" | "method" | "skills" | "timeline" | "contact";

export function AdminStudio() {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Content state
  const [data, setData] = useState<{
    hero?: any;
    about?: any;
    skills?: any;
    timeline?: any;
    contact?: any;
    method?: any;
    projects?: any[];
  }>({});

  // Active project selection
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        showToast("Gagal memuat konten dari server", "error");
      }
    } catch (e: any) {
      showToast("Gagal terhubung ke API: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const saveContent = async (type: string, payload: any) => {
    try {
      setSaving(true);
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || "Perubahan berhasil disimpan!");
        await fetchContent();
      } else {
        showToast("Gagal menyimpan: " + json.error, "error");
      }
    } catch (e: any) {
      showToast("Error saat menyimpan: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewProject = () => {
    const newSlug = `new-project-${Date.now().toString().slice(-4)}`;
    const newProject = {
      _filename: `${newSlug}.md`,
      title: "Judul Proyek Baru",
      slug: newSlug,
      one_liner: "Ringkasan 1 baris mengenai sistem atau hasil analisis.",
      problem: "Jelaskan permasalahan atau inefisiensi yang dihadapi.",
      approach: "Jelaskan metodologi teknis dan arsitektur yang Anda bangun.",
      impact: "Jelaskan hasil nyata, efisiensi waktu, atau dampak bisnis.",
      category: "Analytics",
      tools: ["Python", "SQL"],
      skills: ["Analytics", "Data quality"],
      order: (data.projects?.length || 0) + 1,
      system: [
        { label: "Sumber Data", value: "Raw records" },
        { label: "Proses", value: "Pipeline & Model" },
        { label: "Output", value: "Decision Dashboard" },
      ],
      lessons: ["Pelajaran penting yang didapat saat membangun sistem ini."],
      preview: {
        eyebrow: "Snapshot Proyek",
        metrics: [
          { label: "Skala", value: "10k+ baris" },
          { label: "Efisiensi", value: "+40%" },
          { label: "Hasil", value: "Akurat" },
        ],
        takeaway: "Sistem otomatis yang dapat diinspeksi secara transparan.",
      },
      evidence: [
        {
          slot: "01",
          kind: "dashboard",
          title: "Tampilan Utama",
          description: "Screenshot tampilan antarmuka sistem.",
          alt: "Tampilan dashboard",
          image: "",
        },
      ],
      body: "## Problem\n\nDetail permasalahan...\n\n## Approach\n\nDetail solusi teknis...\n\n## Impact\n\nDetail dampak...",
    };

    saveContent("project", newProject);
  };

  const handleDeleteProject = (filename: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      saveContent("delete_project", { _filename: filename });
      setSelectedProjectIndex(0);
    }
  };

  const activeProject = data.projects?.[selectedProjectIndex];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#050506", color: "#f5f5f4", fontFamily: "Arial, sans-serif" }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            backgroundColor: toast.type === "success" ? "#ff4d1c" : "#e63946",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header
        style={{
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(11,11,14,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LogoBadge size={28} />
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>
              ABIMAEL<span style={{ color: "#ff4d1c" }}>.STUDIO</span>
            </h1>
            <span style={{ fontSize: 10, color: "#a0a0a8", fontFamily: "monospace" }}>PORTFOLIO CONTENT MANAGER</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              color: "#a0a0a8",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "6px 14px",
              borderRadius: "4px",
              transition: "all 0.2s",
            }}
          >
            <span>Lihat Web Live</span> <span>↗</span>
          </a>
        </div>
      </header>

      {/* Main Studio Body */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 64px)" }}>
        {/* Left Navigation Sidebar */}
        <aside
          style={{
            borderRight: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "#0a0a0d",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ padding: "0 12px 10px", fontSize: 10, color: "#ff4d1c", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            NAVIGASI KONTEN
          </div>

          {[
            { key: "projects", label: "Studi Kasus Proyek", icon: "📁", badge: data.projects?.length || 0 },
            { key: "hero", label: "01. Header & Hero", icon: "✨" },
            { key: "about", label: "02. Tentang & Nilai", icon: "👤" },
            { key: "method", label: "03. How I Work", icon: "🎯" },
            { key: "skills", label: "04. Matriks Keahlian", icon: "⚡" },
            { key: "timeline", label: "05. Karier & Timeline", icon: "⏳" },
            { key: "contact", label: "06. Kontak & Sosial", icon: "📬" },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isActive ? "#ff4d1c" : "transparent",
                  color: isActive ? "#ffffff" : "#a0a0a8",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {tab.badge !== undefined && (
                  <span
                    style={{
                      fontSize: 11,
                      backgroundColor: isActive ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.1)",
                      padding: "2px 7px",
                      borderRadius: 99,
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Workspace */}
        <main style={{ padding: "32px 48px", overflowY: "auto", maxWidth: 1100 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#a0a0a8" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
              <p>Memuat konten portofolio...</p>
            </div>
          ) : (
            <>
              {/* ======================================================== */}
              {/* TAB 1: PROJECTS                                          */}
              {/* ======================================================== */}
              {activeTab === "projects" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                      <h2 style={{ fontSize: 22, margin: "0 0 4px", fontWeight: 800 }}>Studi Kasus Proyek</h2>
                      <p style={{ margin: 0, fontSize: 13, color: "#a0a0a8" }}>
                        Kelola proyek unggulan, metrik, arsitektur, dan narasi studi kasus Anda.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewProject}
                      style={{
                        backgroundColor: "#ff4d1c",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "6px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>+</span> <span>Tambah Proyek Baru</span>
                    </button>
                  </div>

                  {/* Project Selector List */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      paddingBottom: 14,
                      marginBottom: 24,
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {data.projects?.map((proj, idx) => {
                      const isSelected = idx === selectedProjectIndex;
                      return (
                        <button
                          key={proj.slug || idx}
                          type="button"
                          onClick={() => setSelectedProjectIndex(idx)}
                          style={{
                            padding: "12px 18px",
                            borderRadius: "8px",
                            backgroundColor: isSelected ? "#14141a" : "#0d0d10",
                            border: isSelected ? "1px solid #ff4d1c" : "1px solid rgba(255,255,255,0.08)",
                            color: isSelected ? "#ffffff" : "#a0a0a8",
                            cursor: "pointer",
                            textAlign: "left",
                            minWidth: 200,
                            flexShrink: 0,
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ fontSize: 10, color: "#ff4d1c", fontFamily: "monospace", marginBottom: 4 }}>
                            0{proj.order || idx + 1} / {proj.category}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {proj.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Project Editor */}
                  {activeProject && (
                    <ProjectForm
                      project={activeProject}
                      saving={saving}
                      onSave={(updated) => saveContent("project", updated)}
                      onDelete={() => handleDeleteProject(activeProject._filename)}
                    />
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: HERO SECTION                                      */}
              {/* ======================================================== */}
              {activeTab === "hero" && (
                <SimpleSectionForm
                  title="Header & Hero Section"
                  description="Atur nama besar di pembuka website, tagline, dan lokasi Anda."
                  data={data.hero || {}}
                  saving={saving}
                  fields={[
                    { name: "name", label: "Nama di Hero (Rekomendasi: 1 kata singkat)", type: "string" },
                    { name: "tagline", label: "Tagline Utama", type: "text" },
                    { name: "location", label: "Lokasi", type: "string" },
                    { name: "eyebrow", label: "Teks Kecil Atas (Eyebrow)", type: "string" },
                    { name: "cta_label", label: "Teks Tombol Scroll", type: "string" },
                  ]}
                  onSave={(updated) => saveContent("hero", updated)}
                />
              )}

              {/* ======================================================== */}
              {/* TAB 3: ABOUT SECTION                                     */}
              {/* ======================================================== */}
              {activeTab === "about" && (
                <SimpleSectionForm
                  title="About Section (Tentang Saya)"
                  description="Kelola bio profesional, prinsip kerja, dan ringkasan pendekatan Anda."
                  data={data.about || {}}
                  saving={saving}
                  fields={[
                    { name: "heading", label: "Judul Besar (Heading)", type: "string" },
                    { name: "bio_text", label: "Teks Bio / Ringkasan Diri", type: "text" },
                    { name: "values", label: "3 Nilai Utama (Pisahkan dengan koma atau baris baru)", type: "list_string" },
                  ]}
                  onSave={(updated) => saveContent("about", updated)}
                />
              )}

              {/* ======================================================== */}
              {/* TAB 4: HOW I WORK                                        */}
              {/* ======================================================== */}
              {activeTab === "method" && (
                <MethodSectionForm
                  data={data.method || {}}
                  saving={saving}
                  onSave={(updated) => saveContent("method", updated)}
                />
              )}

              {/* ======================================================== */}
              {/* TAB 5: SKILLS MATRIX                                     */}
              {/* ======================================================== */}
              {activeTab === "skills" && (
                <SkillsSectionForm
                  data={data.skills || {}}
                  projects={data.projects || []}
                  saving={saving}
                  onSave={(updated) => saveContent("skills", updated)}
                />
              )}

              {/* ======================================================== */}
              {/* TAB 6: TIMELINE                                          */}
              {/* ======================================================== */}
              {activeTab === "timeline" && (
                <TimelineSectionForm
                  data={data.timeline || {}}
                  saving={saving}
                  onSave={(updated) => saveContent("timeline", updated)}
                />
              )}

              {/* ======================================================== */}
              {/* TAB 7: CONTACT                                           */}
              {/* ======================================================== */}
              {activeTab === "contact" && (
                <ContactSectionForm
                  data={data.contact || {}}
                  saving={saving}
                  onSave={(updated) => saveContent("contact", updated)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Project Editor Subcomponent
// ----------------------------------------------------------------------
function ProjectForm({
  project,
  saving,
  onSave,
  onDelete,
}: {
  project: any;
  saving: boolean;
  onSave: (p: any) => void;
  onDelete: () => void;
}) {
  const [form, setForm] = useState<any>(project);

  useEffect(() => {
    setForm(project);
  }, [project]);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleMetricChange = (index: number, key: string, value: string) => {
    const metrics = [...(form.preview?.metrics || [])];
    metrics[index] = { ...metrics[index], [key]: value };
    handleChange("preview", { ...form.preview, metrics });
  };

  return (
    <div style={{ backgroundColor: "#0b0b0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: 28 }}>
      {/* Header Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <span style={{ fontSize: 11, color: "#ff4d1c", fontFamily: "monospace" }}>EDITING PROYEK:</span>
          <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700 }}>{form.title}</h3>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={onDelete}
            style={{
              backgroundColor: "transparent",
              color: "#e63946",
              border: "1px solid rgba(230,57,70,0.3)",
              padding: "8px 14px",
              borderRadius: "6px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Hapus Proyek
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(form)}
            style={{
              backgroundColor: "#ff4d1c",
              color: "#ffffff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan Proyek"}
          </button>
        </div>
      </div>

      {/* Grid Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Judul Proyek</label>
          <input
            type="text"
            value={form.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Slug URL</label>
          <input
            type="text"
            value={form.slug || ""}
            onChange={(e) => handleChange("slug", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Kategori</label>
          <select
            value={form.category || "Analytics"}
            onChange={(e) => handleChange("category", e.target.value)}
            style={inputStyle}
          >
            <option value="Applied Data Science">Applied Data Science</option>
            <option value="Machine learning">Machine learning</option>
            <option value="Analytics">Analytics</option>
            <option value="Automation">Automation</option>
            <option value="Data Engineering">Data Engineering</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Urutan Tampil (Order)</label>
          <input
            type="number"
            value={form.order || 1}
            onChange={(e) => handleChange("order", parseInt(e.target.value) || 1)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Ringkasan 1 Baris (One-Liner)</label>
        <input
          type="text"
          value={form.one_liner || ""}
          onChange={(e) => handleChange("one_liner", e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Case Study Narrative */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>1. Masalah yang Dihadapi (Problem)</label>
        <textarea
          rows={3}
          value={form.problem || ""}
          onChange={(e) => handleChange("problem", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>2. Pendekatan Solusi (Approach)</label>
        <textarea
          rows={3}
          value={form.approach || ""}
          onChange={(e) => handleChange("approach", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>3. Dampak & Hasil (Impact)</label>
        <textarea
          rows={3}
          value={form.impact || ""}
          onChange={(e) => handleChange("impact", e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Tools & Skills */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Tools (Pisahkan dengan koma)</label>
          <input
            type="text"
            value={(form.tools || []).join(", ")}
            onChange={(e) => handleChange("tools", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Skills (Pisahkan dengan koma)</label>
          <input
            type="text"
            value={(form.skills || []).join(", ")}
            onChange={(e) => handleChange("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Live Preview Metrics Section */}
      <div style={{ backgroundColor: "#131318", padding: 18, borderRadius: 8, marginBottom: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#ff4d1c", marginBottom: 12, fontFamily: "monospace" }}>
          SNAPSHOT METRIK (3 KARTU)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
          {[0, 1, 2].map((i) => {
            const metric = form.preview?.metrics?.[i] || { label: "", value: "" };
            return (
              <div key={i} style={{ backgroundColor: "#0a0a0d", padding: 10, borderRadius: 6 }}>
                <input
                  placeholder="Label Metrik"
                  value={metric.label}
                  onChange={(e) => handleMetricChange(i, "label", e.target.value)}
                  style={{ ...inputStyle, marginBottom: 6, fontSize: 11 }}
                />
                <input
                  placeholder="Nilai Metrik"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(i, "value", e.target.value)}
                  style={{ ...inputStyle, fontSize: 12, fontWeight: "bold" }}
                />
              </div>
            );
          })}
        </div>
        <input
          placeholder="Takeaway / Kesimpulan 1 kalimat"
          value={form.preview?.takeaway || ""}
          onChange={(e) => handleChange("preview", { ...form.preview, takeaway: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* Markdown Body */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Dokumentasi Lengkap (Isi Markdown)</label>
        <textarea
          rows={10}
          value={form.body || ""}
          onChange={(e) => handleChange("body", e.target.value)}
          style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Generic Simple Section Form
// ----------------------------------------------------------------------
function SimpleSectionForm({
  title,
  description,
  data,
  fields,
  saving,
  onSave,
}: {
  title: string;
  description: string;
  data: any;
  fields: Array<{ name: string; label: string; type: "string" | "text" | "list_string" }>;
  saving: boolean;
  onSave: (payload: any) => void;
}) {
  const [form, setForm] = useState<any>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleChange = (name: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ backgroundColor: "#0b0b0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 800 }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#a0a0a8" }}>{description}</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          style={{
            backgroundColor: "#ff4d1c",
            color: "#ffffff",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {fields.map((f) => (
          <div key={f.name}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>{f.label}</label>
            {f.type === "text" ? (
              <textarea
                rows={3}
                value={form[f.name] || ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                style={inputStyle}
              />
            ) : f.type === "list_string" ? (
              <textarea
                rows={3}
                placeholder="Item 1, Item 2, Item 3..."
                value={Array.isArray(form[f.name]) ? form[f.name].join("\n") : form[f.name] || ""}
                onChange={(e) =>
                  handleChange(
                    f.name,
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                style={inputStyle}
              />
            ) : (
              <input
                type="text"
                value={form[f.name] || ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Method Section Form
// ----------------------------------------------------------------------
function MethodSectionForm({ data, saving, onSave }: { data: any; saving: boolean; onSave: (p: any) => void }) {
  const [form, setForm] = useState<any>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleStepChange = (index: number, key: string, value: string) => {
    const steps = [...(form.steps || [])];
    steps[index] = { ...steps[index], [key]: value };
    setForm({ ...form, steps });
  };

  return (
    <div style={{ backgroundColor: "#0b0b0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 800 }}>03. How I Work (Metodologi)</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#a0a0a8" }}>Langkah-langkah pendekatan analitik dan eksekusi sistem Anda.</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          style={{
            backgroundColor: "#ff4d1c",
            color: "#ffffff",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Judul Besar (Heading)</label>
        <input
          type="text"
          value={form.heading || ""}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(form.steps || []).map((step: any, i: number) => (
          <div key={i} style={{ backgroundColor: "#131318", padding: 18, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "#ff4d1c", fontFamily: "monospace", marginBottom: 8 }}>
              TAHAP 0{i + 1}
            </div>
            <input
              placeholder="Judul Tahap (contoh: Frame the decision)"
              value={step.title || ""}
              onChange={(e) => handleStepChange(i, "title", e.target.value)}
              style={{ ...inputStyle, marginBottom: 8, fontWeight: 700 }}
            />
            <textarea
              rows={2}
              placeholder="Deskripsi langkah kerja..."
              value={step.description || ""}
              onChange={(e) => handleStepChange(i, "description", e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Skills Section Form
// ----------------------------------------------------------------------
function SkillsSectionForm({ data, projects, saving, onSave }: { data: any; projects: any[]; saving: boolean; onSave: (p: any) => void }) {
  const [form, setForm] = useState<any>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  return (
    <div style={{ backgroundColor: "#0b0b0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 800 }}>04. Skills & Tools Matrix</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#a0a0a8" }}>Kelola kelompok keahlian yang terhubung langsung ke bukti studi kasus.</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          style={{
            backgroundColor: "#ff4d1c",
            color: "#ffffff",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Judul Besar (Heading)</label>
        <input
          type="text"
          value={form.heading || ""}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(form.groups || []).map((group: any, gi: number) => (
          <div key={gi} style={{ backgroundColor: "#131318", padding: 18, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, color: "#ff4d1c", fontWeight: 700, marginBottom: 12 }}>
              KATEGORI SKILL: {group.name}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {(group.skills || []).map((skill: any, si: number) => (
                <div
                  key={si}
                  style={{
                    backgroundColor: "#050506",
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{skill.name}</span>
                  {skill.evidence?.length > 0 && (
                    <span style={{ fontSize: 10, color: "#a0a0a8", marginLeft: 6 }}>
                      ({skill.evidence.length} Proyek)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Timeline Section Form
// ----------------------------------------------------------------------
function TimelineSectionForm({ data, saving, onSave }: { data: any; saving: boolean; onSave: (p: any) => void }) {
  const [form, setForm] = useState<any>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleEntryChange = (index: number, key: string, value: any) => {
    const entries = [...(form.entries || [])];
    entries[index] = { ...entries[index], [key]: value };
    setForm({ ...form, entries });
  };

  return (
    <div style={{ backgroundColor: "#0b0b0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 800 }}>05. Career Timeline (Where I've Been)</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#a0a0a8" }}>Riwayat karier, peran, dan fokus tanggung jawab Anda.</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          style={{
            backgroundColor: "#ff4d1c",
            color: "#ffffff",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(form.entries || []).map((entry: any, i: number) => (
          <div key={i} style={{ backgroundColor: "#131318", padding: 18, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12, marginBottom: 10 }}>
              <input
                placeholder="Peran / Role (contoh: Data Analyst)"
                value={entry.role || ""}
                onChange={(e) => handleEntryChange(i, "role", e.target.value)}
                style={{ ...inputStyle, fontWeight: 700 }}
              />
              <input
                placeholder="Periode (contoh: Now, 2024)"
                value={entry.period || ""}
                onChange={(e) => handleEntryChange(i, "period", e.target.value)}
                style={inputStyle}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Deskripsi singkat..."
              value={entry.description || ""}
              onChange={(e) => handleEntryChange(i, "description", e.target.value)}
              style={{ ...inputStyle, marginBottom: 8 }}
            />
            <textarea
              rows={2}
              placeholder="Detail fokus pekerjaan..."
              value={entry.detail || ""}
              onChange={(e) => handleEntryChange(i, "detail", e.target.value)}
              style={{ ...inputStyle, marginBottom: 8 }}
            />
            <input
              placeholder="Tools (pisahkan dengan koma, misal: Python, Power BI, Excel)"
              value={(entry.tools || []).join(", ")}
              onChange={(e) => handleEntryChange(i, "tools", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Contact Section Form
// ----------------------------------------------------------------------
function ContactSectionForm({ data, saving, onSave }: { data: any; saving: boolean; onSave: (p: any) => void }) {
  const [form, setForm] = useState<any>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleSocialChange = (index: number, key: string, value: string) => {
    const social_links = [...(form.social_links || [])];
    social_links[index] = { ...social_links[index], [key]: value };
    setForm({ ...form, social_links });
  };

  return (
    <div style={{ backgroundColor: "#0b0b0e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h2 style={{ fontSize: 20, margin: "0 0 4px", fontWeight: 800 }}>06. Kontak & Sosial Media</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#a0a0a8" }}>Atur email, nomor WhatsApp, LinkedIn, GitHub, dan Instagram Anda.</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(form)}
          style={{
            backgroundColor: "#ff4d1c",
            color: "#ffffff",
            border: "none",
            padding: "8px 22px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Email Utama</label>
          <input
            type="text"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#d5d5d8", marginBottom: 6 }}>Teks Tombol CTA</label>
          <input
            type="text"
            value={form.cta_text || ""}
            onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ backgroundColor: "#131318", padding: 18, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 12, color: "#ff4d1c", fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>
          TAUTAN SOSIAL MEDIA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(form.social_links || []).map((s: any, i: number) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
              <input
                placeholder="Platform"
                value={s.label || ""}
                onChange={(e) => handleSocialChange(i, "label", e.target.value)}
                style={{ ...inputStyle, fontWeight: 700 }}
              />
              <input
                placeholder="URL Tautan"
                value={s.url || ""}
                onChange={(e) => handleSocialChange(i, "url", e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#050506",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "6px",
  padding: "9px 12px",
  color: "#f5f5f4",
  fontSize: "13px",
  boxSizing: "border-box",
  outline: "none",
};
