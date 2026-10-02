"use client";

import React, { useState } from "react";

// ============================================================================
// MINIMALIST DATA ARCHITECT LEARNING LAB
// ============================================================================

export function DataArchitectMasterclass() {
  const [activeTab, setActiveTab] = useState<"concept" | "simulator" | "interview">("concept");

  // Simulator Interactive States
  const [activeScenario, setActiveScenario] = useState<"schema" | "federation" | "privacy">("schema");
  const [simMode, setSimMode] = useState<"monolith" | "mesh">("mesh");
  const [privacyRole, setPrivacyRole] = useState<"staff" | "auditor">("staff");

  // Interview Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apa bedanya Data Warehouse, Data Lake, dan Data Mesh?",
      takeaway: "Warehouse & Lake adalah teknologi penyimpanan terpusat. Data Mesh adalah cara mengorganisir kepemilikan data secara terdesentralisasi.",
      detail:
        "Data Warehouse dan Data Lake berfokus pada teknologi: mengumpulkan semua data perusahaan ke satu gudang terpusat yang dikelola oleh satu tim data. Sedangkan Data Mesh adalah paradigma organisasi: data tetap berada dan dirawat oleh masing-masing divisi bisnis (Domain), dan dibagikan sebagai produk resmi siap pakai.",
    },
    {
      q: "Kapan perusahaan benar-benar butuh beralih ke Data Mesh?",
      takeaway: "Saat tim data pusat menjadi bottleneck utama dan ada lebih dari 4-5 divisi bisnis yang bergerak cepat.",
      detail:
        "Jika perusahaan hanya memiliki 1-2 produk atau tim datanya masih sanggup melayani permintaan dalam hitungan hari, Data Warehouse terpusat sudah cukup. Data Mesh baru dibutuhkan saat perusahaan membesar, divisi bertambah banyak, dan setiap perubahan tabel membutuhkan waktu berminggu-minggu karena tim data pusat kewalahan.",
    },
    {
      q: "Apa itu Data Contract dan mengapa sangat krusial?",
      takeaway: "Data Contract adalah perjanjian tertulis yang mengikat antara pembuat data (produsen) dan pengguna data (konsumen).",
      detail:
        "Sering kali tim software engineer mengubah nama kolom di database operasional tanpa memberi tahu tim data, sehingga dashboard eksekutif langsung rusak. Data Contract (biasanya file YAML) menetapkan nama kolom, tipe data, SLA kesegaran data, dan aturan privasi. Jika ada perubahan yang melanggar kontrak, sistem CI/CD akan otomatis menolak perubahan tersebut.",
    },
    {
      q: "Bagaimana cara menangani perubahan skema (Breaking Change)?",
      takeaway: "Terapkan Semantic Versioning dan sediakan dual-port (v1 dan v2) selama masa transisi.",
      detail:
        "Jangan langsung mengubah atau menghapus kolom di produksi. Jika ada perubahan besar, produsen data merilis versi baru (v2) sambil tetap mempertahankan versi lama (v1) selama 30–90 hari. Pengguna data diberi waktu untuk beralih secara bertahap tanpa ada sistem yang mendadak rusak.",
    },
    {
      q: "Bagaimana menggabungkan data lintas divisi tanpa bikin Monolith baru?",
      takeaway: "Gunakan mesin kueri federasi in-memory (seperti Trino) yang membaca langsung ke sumber data masing-masing domain.",
      detail:
        "Alih-alih mengopi semua data ke satu database raksasa baru, mesin kueri federasi mendorong filter pencarian langsung ke database masing-masing tim (pushdown query) dan hanya menggabungkan hasilnya di memori RAM dalam hitungan milidetik.",
    },
    {
      q: "Bagaimana menegakkan privasi data (seperti UU PDP No. 27/2022)?",
      takeaway: "Gunakan Dynamic Row-Level Security (RLS) di layer database agar data sensitif disamarkan otomatis.",
      detail:
        "Data sensitif seperti NIK atau nomor HP tidak boleh dikirim polos ke pengguna biasa. Dengan Dynamic RLS, database otomatis menampilkan '3201****0002' untuk staf umum, dan hanya membuka data asli bagi auditor yang memiliki token izin resmi disertai pencatatan jejak audit (audit log).",
    },
  ];

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "6px",
        backgroundColor: "var(--panel)",
        overflow: "hidden",
        marginBottom: "40px",
      }}
    >
      {/* Header Minimalis */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: "11px",
            color: "var(--accent, #60a5fa)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "4px",
          }}
        >
          // PANDUAN BELAJAR INTERAKTIF
        </span>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--ink-heading)" }}>
          Belajar Arsitektur Data: Dari Monolith ke Data Mesh
        </h2>
        <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--muted)", lineHeight: 1.5 }}>
          Panduan ringkas dan simulator interaktif untuk memahami konsep dasar arsitektur data modern, cara kerja Data Mesh, dan persiapan interview teknis.
        </p>
      </div>

      {/* Navigasi 3 Tab Sederhana */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface-secondary)",
        }}
      >
        {[
          { id: "concept", label: "💡 1. Konsep Dasar" },
          { id: "simulator", label: "🎮 2. Simulator Interaktif" },
          { id: "interview", label: "🎓 3. Tanya-Jawab Interview (FAQ)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              flex: 1,
              padding: "13px 16px",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent, #60a5fa)" : "2px solid transparent",
              backgroundColor: activeTab === tab.id ? "var(--panel)" : "transparent",
              color: activeTab === tab.id ? "var(--ink-heading)" : "var(--muted)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================================================================== */}
      {/* TAB 1: KONSEP DASAR (RINGKAS & TO THE POINT)                        */}
      {/* ================================================================== */}
      {activeTab === "concept" && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Perbandingan Monolith vs Data Mesh */}
          <div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--ink-heading)" }}>
              Perbandingan: Monolith vs Data Mesh
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {/* Monolith Card */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "6px",
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px" }}>🏢</span>
                  <strong style={{ fontSize: "13px", color: "#f43f5e" }}>Monolith Terpusat (Lama)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.6 }}>
                  Semua tim (Leasing, IoT, Finance, Risk) mengirim data mentah ke <strong>1 Tim Data Pusat</strong>.
                </p>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "18px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>
                  <li>Tim data pusat jadi antrean macet (bottleneck).</li>
                  <li>Permintaan laporan baru butuh waktu berminggu-minggu.</li>
                  <li>Perubahan kolom database sering bikin dashboard rusak diam-diam.</li>
                </ul>
              </div>

              {/* Data Mesh Card */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "6px",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  backgroundColor: "rgba(16, 185, 129, 0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px" }}>🌐</span>
                  <strong style={{ fontSize: "13px", color: "#10b981" }}>Data Mesh Otonom (Modern)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.6 }}>
                  Setiap tim divisi bisnis <strong>merawat datanya sendiri</strong> dan menyajikannya sebagai produk siap pakai.
                </p>
                <ul style={{ margin: "8px 0 0 0", paddingLeft: "18px", fontSize: "12px", color: "var(--ink)", lineHeight: 1.6 }}>
                  <li>Data dirawat oleh tim yang paling paham konteks bisnisnya.</li>
                  <li>Ada perjanjian kontrak data (Data Contract) agar sistem aman.</li>
                  <li>Tim lain bisa langsung mengakses data tanpa antre di tim pusat.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Pilar Utama Data Mesh */}
          <div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--ink-heading)" }}>
              4 Pilar Utama Data Mesh
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {[
                {
                  icon: "🏛️",
                  title: "1. Domain Ownership",
                  desc: "Yang membuat data adalah yang bertanggung jawab merawatnya, bukan dilempar ke tim IT lain.",
                },
                {
                  icon: "📦",
                  title: "2. Data as a Product",
                  desc: "Data diperlakukan sebagai produk resmi: ada dokumentasi, jaminan kualitas, dan format yang rapi.",
                },
                {
                  icon: "🚀",
                  title: "3. Self-Serve Platform",
                  desc: "Infrastruktur disediakan otomatis sehingga tim bisnis tidak perlu pusing mengurus server.",
                },
                {
                  icon: "🛡️",
                  title: "4. Federated Governance",
                  desc: "Aturan keamanan dan privasi (seperti UU PDP) dicek otomatis oleh sistem, bukan lewat rapat birokrasi.",
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ fontSize: "18px", display: "block", marginBottom: "4px" }}>{p.icon}</span>
                  <strong style={{ fontSize: "13px", color: "var(--ink-heading)", display: "block", marginBottom: "4px" }}>
                    {p.title}
                  </strong>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: SIMULATOR INTERAKTIF (BERSIH & INTUITIF)                    */}
      {/* ================================================================== */}
      {activeTab === "simulator" && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Pilih Skenario */}
          <div>
            <span
              className="mono"
              style={{ fontSize: "11px", color: "var(--accent, #60a5fa)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}
            >
              // PILIH SKENARIO UNTUK MENCOBA:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                { id: "schema", label: "1. Perubahan Kolom Database" },
                { id: "federation", label: "2. Gabungkan Data Lintas Divisi" },
                { id: "privacy", label: "3. Perlindungan Privasi NIK" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id as typeof activeScenario)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: activeScenario === sc.id ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                    backgroundColor: activeScenario === sc.id ? "rgba(96, 165, 250, 0.15)" : "var(--surface)",
                    color: activeScenario === sc.id ? "var(--accent, #60a5fa)" : "var(--ink)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skenario 1: Schema Change */}
          {activeScenario === "schema" && (
            <div style={{ padding: "18px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <div style={{ marginBottom: "14px" }}>
                <strong style={{ fontSize: "14px", color: "var(--ink-heading)", display: "block", marginBottom: "4px" }}>
                  Kasus: Tim Leasing Ingin Mengubah Kolom 'tenor_months' Menjadi 'tenor_duration'
                </strong>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                  Bagaimana sistem merespons perubahan kolom ini? Pilih cara di bawah untuk membandingkan:
                </p>
              </div>

              {/* Mode Toggle Buttons */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  onClick={() => setSimMode("monolith")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: simMode === "monolith" ? "1px solid #f43f5e" : "1px solid var(--line)",
                    backgroundColor: simMode === "monolith" ? "rgba(244, 63, 94, 0.15)" : "var(--panel)",
                    color: simMode === "monolith" ? "#f43f5e" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  ⚠️ Cara Monolith (Tanpa Kontrak)
                </button>
                <button
                  onClick={() => setSimMode("mesh")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: simMode === "mesh" ? "1px solid #10b981" : "1px solid var(--line)",
                    backgroundColor: simMode === "mesh" ? "rgba(16, 185, 129, 0.15)" : "var(--panel)",
                    color: simMode === "mesh" ? "#10b981" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  ✓ Cara Data Mesh (Pakai Data Contract)
                </button>
              </div>

              {/* Outcome Box */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "4px",
                  backgroundColor: simMode === "mesh" ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)",
                  border: simMode === "mesh" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(244, 63, 94, 0.3)",
                }}
              >
                {simMode === "monolith" ? (
                  <div>
                    <strong style={{ color: "#f43f5e", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                      Hasil: 14 Dashboard Rusak Seketika! ❌
                    </strong>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.5 }}>
                      Karena tidak ada kontrak resmi, developer langsung mengubah nama kolom di database operasional.
                      Script ETL malam hari gagal berjalan, dan pagi harinya laporan komite kredit crash karena kolom yang dicari sudah tidak ada.
                    </p>
                  </div>
                ) : (
                  <div>
                    <strong style={{ color: "#10b981", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                      Hasil: Perubahan Dicegat Otomatis di CI/CD Git! ✓
                    </strong>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.5 }}>
                      Saat developer mengajukan Pull Request, sistem Data Contract otomatis mendeteksi bahwa perubahan kolom ini akan merusak sistem hilir (breaking change).
                      Sistem mewajibkan rilis versi baru (v2) sambil tetap menyediakan versi lama (v1) selama masa transisi. Nol dashboard yang rusak.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skenario 2: Cross-Domain Join */}
          {activeScenario === "federation" && (
            <div style={{ padding: "18px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <div style={{ marginBottom: "14px" }}>
                <strong style={{ fontSize: "14px", color: "var(--ink-heading)", display: "block", marginBottom: "4px" }}>
                  Kasus: Tim Risk Butuh Menggabungkan Data Leasing, IoT Mesin, dan Pembayaran
                </strong>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                  Bagaimana data dari 3 tim berbeda disatukan?
                </p>
              </div>

              {/* Mode Toggle Buttons */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  onClick={() => setSimMode("monolith")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: simMode === "monolith" ? "1px solid #f43f5e" : "1px solid var(--line)",
                    backgroundColor: simMode === "monolith" ? "rgba(244, 63, 94, 0.15)" : "var(--panel)",
                    color: simMode === "monolith" ? "#f43f5e" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  ⚠️ Cara Monolith (Tiket ke Tim Pusat)
                </button>
                <button
                  onClick={() => setSimMode("mesh")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: simMode === "mesh" ? "1px solid #10b981" : "1px solid var(--line)",
                    backgroundColor: simMode === "mesh" ? "rgba(16, 185, 129, 0.15)" : "var(--panel)",
                    color: simMode === "mesh" ? "#10b981" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  ✓ Cara Data Mesh (Self-Serve Query)
                </button>
              </div>

              {/* Outcome Box */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "4px",
                  backgroundColor: simMode === "mesh" ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)",
                  border: simMode === "mesh" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(244, 63, 94, 0.3)",
                }}
              >
                {simMode === "monolith" ? (
                  <div>
                    <strong style={{ color: "#f43f5e", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                      Hasil: Antre Tiket 3–4 Minggu di Tim Data Pusat ❌
                    </strong>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.5 }}>
                      Tim Risk harus membuat tiket permintaan kerja. Tim data pusat yang tidak paham seluk-beluk sensor mesin harus belajar tabel dari nol,
                      membuat pipeline baru, dan laporan baru selesai sebulan kemudian. Keputusan bisnis terlambat.
                    </p>
                  </div>
                ) : (
                  <div>
                    <strong style={{ color: "#10b981", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                      Hasil: Selesai Mandiri dalam Hitungan Menit! ✓
                    </strong>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.5 }}>
                      Karena masing-masing tim (Leasing, IoT, Finance) sudah menyediakan port data resmi yang terstandar,
                      tim Risk bisa langsung membaca port data tersebut secara mandiri (self-serve) menggunakan kueri SQL federasi tanpa perlu menunggu siapa pun.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skenario 3: Privacy */}
          {activeScenario === "privacy" && (
            <div style={{ padding: "18px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <div style={{ marginBottom: "14px" }}>
                <strong style={{ fontSize: "14px", color: "var(--ink-heading)", display: "block", marginBottom: "4px" }}>
                  Kasus: Melindungi Data Pribadi Debitur (NIK KTP) Sesuai UU PDP No. 27/2022
                </strong>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                  Bagaimana sistem membedakan hak akses data sensitif?
                </p>
              </div>

              {/* Role Toggle Buttons */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  onClick={() => setPrivacyRole("staff")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: privacyRole === "staff" ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                    backgroundColor: privacyRole === "staff" ? "rgba(96, 165, 250, 0.15)" : "var(--panel)",
                    color: privacyRole === "staff" ? "var(--accent, #60a5fa)" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  👤 Role: Staf Analis Umum
                </button>
                <button
                  onClick={() => setPrivacyRole("auditor")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    border: privacyRole === "auditor" ? "1px solid #10b981" : "1px solid var(--line)",
                    backgroundColor: privacyRole === "auditor" ? "rgba(16, 185, 129, 0.15)" : "var(--panel)",
                    color: privacyRole === "auditor" ? "#10b981" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  🛡️ Role: Auditor Kepatuhan Resmi
                </button>
              </div>

              {/* Outcome Box */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(96, 165, 250, 0.06)",
                  border: "1px solid var(--line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--muted)" }}>TAMPILAN NIK DI HASIL KUERI:</span>
                  <code style={{ fontSize: "14px", color: privacyRole === "staff" ? "#f59e0b" : "#10b981", fontWeight: 700 }}>
                    {privacyRole === "staff" ? "3201****0002" : "3201042908880002"}
                  </code>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                  {privacyRole === "staff"
                    ? "Dynamic Row-Level Security otomatis menyamarkan angka tengah NIK di layer database. Data mentah tidak pernah bocor ke komputer analis, memenuhi kepatuhan UU PDP."
                    : "Token auditor resmi memverifikasi hak akses. NIK asli ditampilkan dan sistem otomatis mencatat catatan audit kriptografis (siapa yang membaca, jam berapa, dan alasannya)."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 3: TANYA-JAWAB INTERVIEW (FAQ RINGKAS & JELAS)                  */}
      {/* ================================================================== */}
      {activeTab === "interview" && (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "var(--ink-heading)" }}>
              6 Pertanyaan Kunci Wawancara Data Architect
            </h3>
            <p style={{ margin: 0, fontSize: "12.5px", color: "var(--muted)" }}>
              Pertanyaan yang paling sering muncul saat interview arsitektur data, disertai poin inti jawaban cepat.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: isOpen ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    style={{
                      padding: "14px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: isOpen ? "rgba(96, 165, 250, 0.04)" : "transparent",
                    }}
                  >
                    <strong style={{ fontSize: "13.5px", color: isOpen ? "var(--accent, #60a5fa)" : "var(--ink-heading)" }}>
                      #{idx + 1}. {faq.q}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                      {isOpen ? "▲ Tutup" : "▼ Buka"}
                    </span>
                  </div>

                  {isOpen && (
                    <div style={{ padding: "0 18px 16px 18px", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(16, 185, 129, 0.08)",
                          borderLeft: "3px solid #10b981",
                          marginBottom: "10px",
                          fontSize: "12px",
                        }}
                      >
                        <strong style={{ color: "#10b981" }}>Inti Jawaban: </strong>
                        <span style={{ color: "var(--ink)" }}>{faq.takeaway}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.6 }}>
                        {faq.detail}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
