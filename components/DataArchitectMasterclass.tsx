"use client";

import React, { useState, useMemo } from "react";

// ============================================================================
// DATA ARCHITECT MASTERCLASS — TYPES & DATA STRUCTURES
// ============================================================================

type MasterclassTab =
  | "concept"    // 1. Konsep Dasar & Analogi Visual
  | "simulator"  // 2. Simulator Jaringan & Aliran Kueri
  | "blueprint"  // 3. Simulasi Keputusan Arsitek (Trade-offs)
  | "crisis"     // 4. Simulasi Tanggap Darurat & Krisis
  | "interview"  // 5. Bank Soal & Persiapan Wawancara (10 FAQ)
  | "contracts";  // 6. Contract Builder & TCO Cloud

interface DomainCard {
  id: string;
  name: string;
  squad: string;
  lead: string;
  port: string;
  semVer: string;
  slaRefresh: string;
  slaAvailability: string;
  storage: string;
  color: string;
  icon: string;
  context: string;
  sampleColumns: { name: string; type: string; isPII: boolean; desc: string }[];
}

const DOMAINS: DomainCard[] = [
  {
    id: "leasing",
    name: "Active Lease Portfolio",
    squad: "Core Leasing Squad",
    lead: "Budi Santoso (Domain Lead)",
    port: "leasing_dp.active_portfolio",
    semVer: "2.1.0",
    slaRefresh: "T+60m (Per Jam)",
    slaAvailability: "99.85%",
    storage: "PostgreSQL ANSI SQL / Iceberg",
    color: "#3b82f6",
    icon: "📄",
    context: "Siklus hidup kontrak pembiayaan alat berat, tenor, plafon pokok utang, dan suku bunga.",
    sampleColumns: [
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "ID unik kontrak kredit pembiayaan" },
      { name: "customer_id", type: "VARCHAR(32)", isPII: false, desc: "ID relasi nasabah debitur" },
      { name: "principal_amount", type: "NUMERIC(15,2)", isPII: false, desc: "Plafon pokok pembiayaan alat berat" },
      { name: "tenor_months", type: "INTEGER", isPII: false, desc: "Jangka waktu cicilan pembiayaan" },
      { name: "status", type: "VARCHAR(16)", isPII: false, desc: "Status kontrak (ACTIVE, GRACE, OVERDUE)" },
    ],
  },
  {
    id: "equipment",
    name: "Fleet Telematics IoT",
    squad: "Asset Equipment Squad",
    lead: "Hendro Wijaya (IoT Squad Lead)",
    port: "equipment_dp.telematics_summary",
    semVer: "1.4.0",
    slaRefresh: "T+15m (Near Real-time)",
    slaAvailability: "99.90%",
    storage: "TimescaleDB / S3 Parquet",
    color: "#f59e0b",
    icon: "🚜",
    context: "Sensor telematika excavator tambang/kebun, jam kerja mesin, GPS geofencing, dan kesehatan agunan fisik.",
    sampleColumns: [
      { name: "equipment_id", type: "VARCHAR(32)", isPII: false, desc: "Nomor seri unit mesin (misal: CAT 320D)" },
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "Relasi ke kontrak leasing aktif" },
      { name: "engine_hours_today", type: "FLOAT", isPII: false, desc: "Total jam kerja mesin hari ini" },
      { name: "gps_latitude", type: "DOUBLE", isPII: false, desc: "Koordinat lokasi tambang/kebun" },
      { name: "is_geofence_violation", type: "BOOLEAN", isPII: false, desc: "Peringatan mesin keluar konsesi kontrak" },
    ],
  },
  {
    id: "risk",
    name: "Credit Underwriting & Risk",
    squad: "Credit Risk Analytics Squad",
    lead: "Citra Dewi (Head of Risk)",
    port: "risk_dp.underwriting_scores",
    semVer: "3.0.0",
    slaRefresh: "T+24h (Batch Harian)",
    slaAvailability: "99.95%",
    storage: "Trino / PostgreSQL",
    color: "#a855f7",
    icon: "⚖️",
    context: "Model machine learning probabilitas gagal bayar (PD), credit score debitur, dan rasio kemampuan bayar DSCR.",
    sampleColumns: [
      { name: "customer_id", type: "VARCHAR(32)", isPII: false, desc: "ID unik nasabah debitur" },
      { name: "credit_score", type: "INTEGER", isPII: false, desc: "Skor kredit internal (skala 300 - 850)" },
      { name: "pd_12m", type: "FLOAT", isPII: false, desc: "Probabilitas gagal bayar dalam 12 bulan" },
      { name: "risk_tier", type: "VARCHAR(8)", isPII: false, desc: "Tingkat risiko (TIER_A, TIER_B, HIGH)" },
    ],
  },
  {
    id: "billing",
    name: "Billing & Collection Aging",
    squad: "Finance & Billing Squad",
    lead: "Doni Prasetyo (Finance Lead)",
    port: "billing_dp.invoice_aging_summary",
    semVer: "2.0.0",
    slaRefresh: "T+30m",
    slaAvailability: "99.80%",
    storage: "PostgreSQL / CDC",
    color: "#10b981",
    icon: "💳",
    context: "Status virtual account perbankan, rekonsiliasi cicilan, dan analisis aging tunggakan DPD.",
    sampleColumns: [
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "ID kontrak leasing" },
      { name: "dpd_days", type: "INTEGER", isPII: false, desc: "Days Past Due (hari keterlambatan cicilan)" },
      { name: "overdue_penalty_idr", type: "NUMERIC(12,2)", isPII: false, desc: "Denda keterlambatan berjalan" },
      { name: "last_payment_date", type: "DATE", isPII: false, desc: "Tanggal pembayaran cicilan terakhir" },
    ],
  },
  {
    id: "risk360",
    name: "Risk 360 Aggregator Data Product",
    squad: "Risk 360 Consumer Squad",
    lead: "Chief Risk & Credit Committee",
    port: "risk360_dp.portfolio_health",
    semVer: "1.2.0",
    slaRefresh: "Near Real-Time (On-Demand)",
    slaAvailability: "99.99%",
    storage: "Trino RAM Federation / Iceberg",
    color: "#ec4899",
    icon: "💎",
    context: "Produk data komposit tingkat tinggi: menggabungkan data kredit, lokasi fisik mesin IoT, dan status billing untuk direksi.",
    sampleColumns: [
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "ID kontrak pembiayaan" },
      { name: "borrower_nik", type: "VARCHAR(16)", isPII: true, desc: "NIK penjamin (UU PDP Protected)" },
      { name: "fleet_status", type: "VARCHAR(16)", isPII: false, desc: "Status kerja alat berat (OPTIMAL/IDLE)" },
      { name: "composite_risk_rating", type: "VARCHAR(8)", isPII: false, desc: "Peringkat risiko gabungan portofolio" },
    ],
  },
];

interface InterviewCard {
  id: string;
  category: string;
  tag: string;
  question: string;
  intent: string;
  quickTakeaway: string;
  fullAnswer: string;
}

const INTERVIEW_QUESTIONS: InterviewCard[] = [
  {
    id: "q1",
    category: "Framework & Strategi",
    tag: "Monolith vs Mesh",
    question: "Kapan sebuah enterprise WAJIB beralih dari Central Data Warehouse ke Data Mesh?",
    intent: "Menguji apakah kandidat memahami batasan skala arsitektur monolitik vs kapan kompleksitas Data Mesh terjustifikasi.",
    quickTakeaway: "Beralih saat bottleneck organisasi (Conway's Law) terjadi: >4 domain bisnis, tim data pusat jadi antrean 3+ minggu.",
    fullAnswer:
      "Enterprise wajib beralih saat problem utama bukan lagi teknis storage, melainkan bottleneck kognitif organisasi (Conway's Law). Ketika ada lebih dari 4-5 domain bisnis otonom dan tim data pusat membutuhkan waktu 3-6 minggu untuk melayani 1 perubahan kolom atau dashboard baru, desentralisasi domain ownership adalah satu-satunya solusi yang dapat diskalakan secara linear.",
  },
  {
    id: "q2",
    category: "Tata Kelola & Hukum",
    tag: "SemVer & Kontrak",
    question: "Bagaimana cara menangani perubahan skema data (Breaking Change) dari Domain A yang dibutuhkan Domain B?",
    intent: "Menguji pemahaman arsitektur terdistribusi dan disiplin semantic versioning di dunia nyata.",
    quickTakeaway: "Terapkan SemVer pada port output. Jika breaking change (MAJOR), wajib sediakan dual-port (v1 dan v2) selama masa transisi.",
    fullAnswer:
      "Terapkan Semantic Versioning (MAJOR.MINOR.PATCH) pada port output data. Penambahan kolom baru (MINOR) bisa langsung dirilis karena bersifat backward-compatible. Jika terjadi breaking change (MAJOR, seperti hapus kolom), domain wajib menyediakan dual-port (v1 dan v2) bersamaan selama masa transisi 90 hari. Pemakaian port v1 dimonitor lewat query log; setelah trafiknya nol, port v1 dipensiunkan aman.",
  },
  {
    id: "q3",
    category: "Engineering & Pipeline",
    tag: "Kueri Federasi",
    question: "Bagaimana Data Mesh menggabungkan data lintas domain tanpa membikin Monolith baru di layer kuerinya?",
    intent: "Menguji pemahaman antara kueri federasi in-memory (Trino) vs consumer-aligned data product terdistribusi.",
    quickTakeaway: "Gunakan Trino untuk eksplorasi ad-hoc di RAM, dan bangun Higher-Order Data Product untuk agregasi rutin.",
    fullAnswer:
      "Gunakan strategi dual-layer: (1) Untuk eksplorasi ad-hoc analis, gunakan mesin federasi in-memory seperti Trino yang mendorong predikat filter (pushdown) ke masing-masing port tanpa mengopi data ke penyimpanan terpusat. (2) Untuk analitik rutin dan krusial (seperti Risk 360), buat 'Consumer-Aligned Data Product' resmi yang mematerialisasi data join terjadwal dengan pemilik yang jelas (Tim Risk).",
  },
  {
    id: "q4",
    category: "Tata Kelola & Hukum",
    tag: "UU PDP & OJK",
    question: "Bagaimana menegakkan UU PDP No. 27/2022 dan regulasi OJK di 5 tim domain yang bekerja mandiri?",
    intent: "Memastikan kandidat paham implementasi teknis hukum privasi data perbankan/fintech di Indonesia.",
    quickTakeaway: "Shift-Left regex scanner di CI/CD Git, Dynamic RLS Masking di port SQL, dan jejak audit OpenLineage.",
    fullAnswer:
      "Menggunakan Federated Computational Governance: (1) Scanner Regex di GitHub Actions otomatis mendeteksi pola 16 digit NIK polos pada sampel data Pull Request. (2) Dynamic Row-Level Security menyamarkan NIK ('3201****0004') secara default dan hanya membuka data asli bagi auditor berizin. (3) OpenLineage mencatat jejak audit kriptografis setiap kali port dibaca untuk memenuhi Pasal 39 UU PDP dan POJK 35.",
  },
  {
    id: "q5",
    category: "Framework & Strategi",
    tag: "Lakehouse vs Mesh",
    question: "Apa perbedaan mendasar antara Data Lakehouse dan Data Mesh?",
    intent: "Menilai kejelasan pemahaman antara arsitektur teknologi (Stack) vs model operasional organisasi.",
    quickTakeaway: "Lakehouse = Tumpukan teknologi penyimpanan/komputasi; Data Mesh = Paradigma sosio-teknikal kepemilikan data.",
    fullAnswer:
      "Data Lakehouse adalah tumpukan teknologi (object storage S3 + format tabel Iceberg/Delta Lake + compute Spark/Trino). Data Mesh adalah model operasi sosio-teknikal (Domain Ownership, Data as a Product, Federated Governance). Faktanya, Data Mesh dibangun MENGGUNAKAN teknologi Lakehouse sebagai media penyimpanannya di setiap domain!",
  },
  {
    id: "q6",
    category: "Organisasi & Budaya",
    tag: "Insentif Tim",
    question: "Bagaimana memotivasi tim pengembang domain agar mau merawat datanya sebagai produk dan bukan beban tambahan?",
    intent: "Menguji kemampuan kepemimpinan dan manajemen perubahan budaya engineering.",
    quickTakeaway: "Insentif anggaran internal (chargeback), SLA data masuk OKR manajer, dan template platform <30 menit.",
    fullAnswer:
      "Melalui tiga pilar: (1) Internal Chargeback: tim domain yang data product-nya sering dikonsumsi departemen lain mendapat alokasi anggaran infrastruktur lebih besar. (2) Masukkan uptime dan kepatuhan SLA data product ke dalam KPI triwulanan manajer domain. (3) Sediakan template repositori sekali klik dari tim platform agar membuat data product baru hanya butuh waktu <30 menit.",
  },
  {
    id: "q7",
    category: "Framework & Strategi",
    tag: "Anti-Silo",
    question: "Bagaimana mencegah 'Data Silo 2.0' di mana tim domain menyimpan datanya sendiri dan pelit berbagi?",
    intent: "Menilai mekanisme pengawasan terpusat agar desentralisasi tidak menjadi kekacauan tertutup.",
    quickTakeaway: "Katalog data pusat wajib, dewan tata kelola dwimingguan, dan standardisasi protokol terbuka (ANSI SQL/Iceberg).",
    fullAnswer:
      "Cegah dengan 3 kontrol terstandar: (1) Registrasi Katalog Wajib: dataset yang tidak terdaftar kontraknya dilarang dialirkan di jaringan perusahaan. (2) Dewan Tata Kelola Dwimingguan untuk menyelaraskan kebutuhan baru agar tidak ada pembuatan pipeline duplikat. (3) Kewajiban protokol terbuka (ANSI SQL dan Apache Iceberg) sehingga tidak ada domain yang memakai format proprietary tertutup.",
  },
  {
    id: "q8",
    category: "Engineering & Pipeline",
    tag: "CI/CD Gate",
    question: "Jelaskan alur teknis validasi Data Contract otomatis di pipeline CI/CD GitHub Actions.",
    intent: "Menguji pemahaman shift-left testing dan data contract engineering konkret.",
    quickTakeaway: "4 Gerbang: Validasi sintaks YAML -> Cek breaking change Git -> Tes Docker sementara -> Uji Great Expectations & Regex NIK.",
    fullAnswer:
      "Pipeline menjalankan 4 tahap berurutan: (1) Linter sintaks ODCS YAML terhadap JSON schema standar. (2) Pemeriksa kompatibilitas Git untuk mendeteksi kolom yang terhapus atau berubah tipe. (3) Menyalakan database PostgreSQL sementara di Docker berisi data tiruan. (4) Menjalankan suite pengujian Great Expectations dan scanner regex kebocoran NIK 16 digit. Jika ada 1 tes gagal, Pull Request otomatis diblokir.",
  },
  {
    id: "q9",
    category: "Engineering & Pipeline",
    tag: "Self-Serve Platform",
    question: "Bagaimana Self-Serve Data Platform mengurangi beban kognitif developer domain?",
    intent: "Memastikan kandidat paham konsep platform-as-a-product untuk memberdayakan software engineer.",
    quickTakeaway: "Menyediakan template repositori siap pakai, provisioning izin database otomatis, dan dasbor Grafana bawaan.",
    fullAnswer:
      "Tim platform memperlakukan developer domain sebagai pelanggan utama. Platform mengabstraksi kerumitan distributed system dengan menyediakan template Cookiecutter siap pakai, otomatisasi hak akses database berdasarkan file kontrak, serta pemantauan SLA otomatis di Grafana tanpa perlu developer domain menulis kodingan monitoring dari nol.",
  },
  {
    id: "q10",
    category: "Organisasi & Budaya",
    tag: "ROI & Metrik",
    question: "Bagaimana cara membuktikan Return on Investment (ROI) Data Mesh kepada jajaran direksi (C-Level)?",
    intent: "Menguji kemampuan komunikasi nilai bisnis arsitektur kepada eksekutif non-teknis.",
    quickTakeaway: "Tunjukkan lead time terpangkas dari minggu ke menit, penghematan TCO komputasi (\$66k/thn), dan skor DATSIS meningkat.",
    fullAnswer:
      "Ukur melalui 3 angka nyata: (1) Kecepatan Bisnis: memangkas waktu tunggu data analitik dari 3–6 minggu menjadi <15 menit sehingga direksi bisa mengambil keputusan kredit saat itu juga. (2) Penghematan Biaya: penurunan TCO infrastruktur cloud sebesar 35.9% (\$66,000/tahun) dari penghapusan pipeline ganda. (3) Kebugaran Arsitektur: kenaikan skor DATSIS dari 2.15 ke 4.67 / 5.00.",
  },
];

export function DataArchitectMasterclass() {
  const [activeTab, setActiveTab] = useState<MasterclassTab>("concept");

  // ============================================================================
  // TAB 1 STATES (CONWAY'S LAW & CONCEPT)
  // ============================================================================
  const [conwayDomainCount, setConwayDomainCount] = useState<number>(5);

  const conwayLines = useMemo(() => {
    return Math.round((conwayDomainCount * (conwayDomainCount - 1)) / 2 + conwayDomainCount * 3);
  }, [conwayDomainCount]);

  const meshLines = useMemo(() => {
    return conwayDomainCount * 2;
  }, [conwayDomainCount]);

  // ============================================================================
  // TAB 2 STATES (TOPOLOGY & LIVE QUERY RUNNER)
  // ============================================================================
  const [selectedDomainId, setSelectedDomainId] = useState<string>("leasing");
  const [simScenario, setSimScenario] = useState<"risk360" | "schema_drift" | "pdp_mask">("risk360");
  const [simMode, setSimMode] = useState<"mesh" | "monolith">("mesh");
  const [simIsRunning, setSimIsRunning] = useState<boolean>(false);
  const [pdpRole, setPdpRole] = useState<"analyst" | "auditor">("analyst");

  const runLiveSimulation = (mode: "mesh" | "monolith") => {
    setSimIsRunning(true);
    setSimMode(mode);
    setTimeout(() => {
      setSimIsRunning(false);
    }, 600);
  };

  const activeDomain = useMemo(
    () => DOMAINS.find((d) => d.id === selectedDomainId) ?? DOMAINS[0],
    [selectedDomainId]
  );

  // ============================================================================
  // TAB 3 STATES (BLUEPRINT TRADE-OFFS)
  // ============================================================================
  const [bpParadigm, setBpParadigm] = useState<"monolith" | "lakehouse" | "datamesh">("datamesh");
  const [bpGovernance, setBpGovernance] = useState<"manual" | "central_team" | "computational_ci">("computational_ci");
  const [bpQuery, setBpQuery] = useState<"direct_db" | "etl_batch" | "trino_federation">("trino_federation");
  const [bpPrivacy, setBpPrivacy] = useState<"unmasked" | "frontend_mask" | "dynamic_rls">("dynamic_rls");

  const bpMetrics = useMemo(() => {
    let leadTime = "< 15 Menit";
    let leadColor = "#10b981";
    let breakages = 0;
    let compliance = 100;
    let annualTco = 118000;
    let rank = "Principal Data Architect (Level Master)";

    if (bpParadigm === "monolith") {
      leadTime = "3–6 Minggu";
      leadColor = "#f43f5e";
      breakages += 10;
      annualTco += 50000;
    } else if (bpParadigm === "lakehouse") {
      leadTime = "1–2 Minggu";
      leadColor = "#f59e0b";
      breakages += 5;
      annualTco += 30000;
    }

    if (bpGovernance === "manual") {
      breakages += 4;
      compliance -= 35;
    } else if (bpGovernance === "central_team") {
      breakages += 2;
      compliance -= 15;
      annualTco += 16000;
    }

    if (bpQuery === "direct_db") {
      leadTime = "Timeout / Server Down";
      leadColor = "#f43f5e";
    } else if (bpQuery === "etl_batch") {
      leadTime = "T+24 Jam (Besok)";
      leadColor = "#f59e0b";
    }

    if (bpPrivacy === "unmasked") {
      compliance -= 60;
    } else if (bpPrivacy === "frontend_mask") {
      compliance -= 25;
    }

    const score = (compliance / 100) * 50 + (breakages === 0 ? 30 : Math.max(0, 30 - breakages * 2)) + (leadTime === "< 15 Menit" ? 20 : 5);
    if (score >= 85) rank = "Principal Data Architect (Level Master)";
    else if (score >= 60) rank = "Senior Data Architect (Solid Enterprise)";
    else rank = "Junior / Legacy Architect (Perlu Remediasi)";

    return { leadTime, leadColor, breakages, compliance, annualTco, score: Math.round(score), rank };
  }, [bpParadigm, bpGovernance, bpQuery, bpPrivacy]);

  // ============================================================================
  // TAB 4 STATES (CRISIS SCENARIOS)
  // ============================================================================
  const [activeCrisisId, setActiveCrisisId] = useState<string>("c1");
  const [crisisChoices, setCrisisChoices] = useState<Record<string, string>>({
    c1: "opt_b",
    c2: "opt_c",
    c3: "opt_a",
  });

  // ============================================================================
  // TAB 5 STATES (INTERVIEW DRILLS)
  // ============================================================================
  const [expandedQId, setExpandedQId] = useState<string>("q1");
  const [completedQs, setCompletedQs] = useState<Set<string>>(new Set(["q1"]));
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const toggleCompleteQ = (id: string) => {
    setCompletedQs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredQuestions = useMemo(() => {
    if (filterCategory === "ALL") return INTERVIEW_QUESTIONS;
    return INTERVIEW_QUESTIONS.filter((q) => q.category === filterCategory);
  }, [filterCategory]);

  // ============================================================================
  // TAB 6 STATES (CONTRACT BUILDER)
  // ============================================================================
  const [cbProduct, setCbProduct] = useState<string>("Active Lease Portfolio");
  const [cbOwner, setCbOwner] = useState<string>("Core Leasing Squad");
  const [cbFreshness, setCbFreshness] = useState<string>("60");
  const [cbMaskNik, setCbMaskNik] = useState<boolean>(true);
  const [cbVerified, setCbVerified] = useState<boolean>(false);

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "8px",
        backgroundColor: "var(--panel)",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
      }}
    >
      {/* ==================================================================== */}
      {/* UNIFIED SUITE HEADER                                                 */}
      {/* ==================================================================== */}
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#60a5fa",
                textTransform: "uppercase",
              }}
            >
              // INTERACTIVE ENTERPRISE DATA ARCHITECT SUITE
            </span>
            <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
              • PT NUSAFINANCE CASE STUDY
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--ink-heading)" }}>
            Data Mesh Architecture &amp; Data Architect Interactive Masterclass
          </h2>
        </div>

        {/* Dynamic Status Evaluation Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px",
            borderRadius: "6px",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <span style={{ fontSize: "18px" }}>🎖️</span>
          <div>
            <span style={{ display: "block", fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
              STATUS EVALUASI ARSITEK
            </span>
            <strong style={{ fontSize: "12px", color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>
              {bpMetrics.rank}
            </strong>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* UNIFIED 6-TAB NAVIGATION BAR                                         */}
      {/* ==================================================================== */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface-secondary)",
          overflowX: "auto",
        }}
      >
        {[
          { id: "concept", label: "🧭 1. Konsep Dasar & Analogi Visual", icon: "🧭" },
          { id: "simulator", label: "🌐 2. Simulator Aliran Data Mesh", icon: "🌐" },
          { id: "blueprint", label: "🏛️ 3. Simulasi Keputusan Arsitek", icon: "🏛️" },
          { id: "crisis", label: "🚨 4. Simulasi Respons Krisis", icon: "🚨" },
          { id: "interview", label: "🎓 5. Bank Soal Wawancara (10 FAQ)", icon: "🎓" },
          { id: "contracts", label: "📝 6. Contract Builder & TCO", icon: "📝" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MasterclassTab)}
            style={{
              padding: "13px 20px",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid #60a5fa" : "3px solid transparent",
              backgroundColor: activeTab === tab.id ? "var(--panel)" : "transparent",
              color: activeTab === tab.id ? "var(--ink-heading)" : "var(--muted)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: KONSEP DASAR & ANALOGI VISUAL (BELAJAR DARI NOL)              */}
      {/* ==================================================================== */}
      {activeTab === "concept" && (
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Real-World Analogy: Central Kitchen vs Food Court */}
          <div style={{ padding: "22px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
              // MEMAHAMI DARI DASAR: MENGAPA PERLU DATA MESH?
            </span>
            <h3 style={{ margin: "6px 0 16px 0", fontSize: "19px", color: "var(--ink-heading)" }}>
              Analogi Dunia Nyata: Dapur Restoran Terpusat vs Food Court Modern
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {/* Monolith Kitchen Card */}
              <div style={{ padding: "18px", borderRadius: "6px", backgroundColor: "rgba(244, 63, 94, 0.05)", border: "1px solid rgba(244, 63, 94, 0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "24px" }}>🏢</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#f43f5e" }}>Arsitektur Lama: Data Warehouse Terpusat (Monolith)</h4>
                    <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                      Analogi: 1 Dapur Terpusat dengan 3 Koki Melayani 100 Meja
                    </span>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", lineHeight: 1.6, color: "var(--ink)" }}>
                  <li><strong>Bottleneck Parah:</strong> 3 koki harus hafal ratusan resep dari seluruh restoran (Tim data pusat kewalahan).</li>
                  <li><strong>Silent Breakage:</strong> Pelayan mengubah nomor meja tanpa info, makanan salah antar (Perubahan kolom merusak dashboard).</li>
                  <li><strong>Waktu Tunggu Lama:</strong> Makanan keluar setelah 3 jam (Permintaan data analis butuh <strong>3 hingga 6 minggu</strong>).</li>
                </ul>
              </div>

              {/* Data Mesh Food Court Card */}
              <div style={{ padding: "18px", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "24px" }}>🌐</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#10b981" }}>Arsitektur Baru: Enterprise Data Mesh (Desentralisasi)</h4>
                    <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                      Analogi: Food Court Modern dengan Stand-Stand Spesialis Otonom
                    </span>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", lineHeight: 1.6, color: "var(--ink)" }}>
                  <li><strong>Otonomi Domain:</strong> Stand Sushi dan Stand Kopi masak sendiri (Tim Leasing &amp; IoT merawat data mandiri).</li>
                  <li><strong>Standar Kontrak Menu:</strong> Harga dan menu terdaftar resmi di kasir (Open Data Contract Standard / ODCS).</li>
                  <li><strong>Penyajian Kilat:</strong> Tamu langsung ambil makanan di stand (Kueri komite kredit selesai dalam <strong>&lt; 15 menit</strong>).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Foundational Pillars Visual Cards */}
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
              // 4 PILAR UTAMA DATA MESH (ZHAMAK DEHGHANI)
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "12px" }}>
              {[
                { icon: "🏛️", title: "1. Domain Ownership", desc: "Data dirawat oleh tim bisnis yang paling paham konteksnya, bukan dilempar ke tim data pusat." },
                { icon: "📦", title: "2. Data as a Product", desc: "Data diperlakukan sebagai produk resmi dengan kontrak skema (ODCS), SLA, dan jaminan kualitas." },
                { icon: "🚀", title: "3. Self-Serve Platform", desc: "Infrastruktur cloud sekali klik dari tim platform sehingga tim domain tidak terbebani urusan server." },
                { icon: "🛡️", title: "4. Federated Governance", desc: "Kepatuhan privasi (UU PDP & OJK) ditegakkan otomatis oleh mesin di pipeline CI/CD." },
              ].map((p, idx) => (
                <div key={idx} style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
                  <span style={{ fontSize: "22px", display: "block", marginBottom: "6px" }}>{p.icon}</span>
                  <strong style={{ fontSize: "14px", color: "var(--ink-heading)", display: "block", marginBottom: "4px" }}>{p.title}</strong>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conway's Law Mathematical Interactive Slider */}
          <div style={{ padding: "22px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
              // BUKTI MATEMATIS CONWAY'S LAW: MENGAPA MONOLITH PASTI HANCUR KETIKA SKALA MEMBESAR
            </span>
            <h4 style={{ margin: "6px 0 10px 0", fontSize: "17px", color: "var(--ink-heading)" }}>
              Kalkulator Beban Koordinasi: Monolith O(N²) vs Data Mesh O(N)
            </h4>
            <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.6 }}>
              Formula beban koordinasi monolitik: <code>C = N × (N - 1) / 2</code>. Geser slider di bawah ini untuk melihat bagaimana jalur komunikasi meledak seiring pertambahan domain bisnis!
            </p>

            {/* Slider Control */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", backgroundColor: "var(--panel)", borderRadius: "6px", border: "1px solid var(--line)", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", fontFamily: "var(--font-mono), monospace", color: "var(--ink)" }}>Jumlah Tim Domain:</span>
              <input
                type="range"
                min="2"
                max="12"
                value={conwayDomainCount}
                onChange={(e) => setConwayDomainCount(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#60a5fa" }}
              />
              <strong style={{ fontSize: "16px", color: "#60a5fa", fontFamily: "var(--font-mono), monospace", minWidth: "40px" }}>
                {conwayDomainCount} Tim
              </strong>
            </div>

            {/* Metric Comparison Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "14px", backgroundColor: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#f87171", display: "block" }}>
                  BEBAN KOORDINASI MONOLITH PUSAT
                </span>
                <strong style={{ fontSize: "24px", color: "#f43f5e", fontFamily: "var(--font-mono), monospace", display: "block", margin: "4px 0" }}>
                  {conwayLines} Jalur Rapat &amp; Tiket
                </strong>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Pertumbuhan Eksponensial O(N²) — Menimbulkan bottleneck rapat tanpa henti</span>
              </div>

              <div style={{ padding: "14px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#34d399", display: "block" }}>
                  BEBAN KOORDINASI DATA MESH OTONOM
                </span>
                <strong style={{ fontSize: "24px", color: "#10b981", fontFamily: "var(--font-mono), monospace", display: "block", margin: "4px 0" }}>
                  {meshLines} Batas Kontrak ODCS
                </strong>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>Pertumbuhan Linear O(N) — Terisolasi aman via kontrak data &amp; CI/CD</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: SIMULATOR JARINGAN DATA MESH & ALIRAN KUERI                   */}
      {/* ==================================================================== */}
      {activeTab === "simulator" && (
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Skenario Selector Bar */}
          <div style={{ padding: "18px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
                // PILIH SKENARIO SIMULASI ALIRAN KUERI:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {[
                  { id: "risk360", label: "⚡ Skenario A: Kueri Risk 360", desc: "Federasi Trino RAM vs Monolith DB Join" },
                  { id: "schema_drift", label: "🛡️ Skenario B: Deteksi Schema Drift", desc: "Shift-Left CI PR Gate vs Silent Crash" },
                  { id: "pdp_mask", label: "🔒 Skenario C: Masking UU PDP", desc: "Staf Cabang vs Auditor OJK" },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSimScenario(sc.id as typeof simScenario)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "4px",
                      border: simScenario === sc.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: simScenario === sc.id ? "rgba(96, 165, 250, 0.15)" : "var(--panel)",
                      color: simScenario === sc.id ? "#60a5fa" : "var(--ink)",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>{sc.label}</div>
                    <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: 400 }}>{sc.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Run Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "260px" }}>
              <button
                onClick={() => runLiveSimulation("mesh")}
                disabled={simIsRunning}
                style={{
                  padding: "10px 18px",
                  borderRadius: "4px",
                  border: "1px solid #10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: simIsRunning ? "wait" : "pointer",
                }}
              >
                {simIsRunning && simMode === "mesh" ? "⏳ Menjalankan Data Mesh..." : "▶ Jalankan di Arsitektur Data Mesh"}
              </button>
              <button
                onClick={() => runLiveSimulation("monolith")}
                disabled={simIsRunning}
                style={{
                  padding: "8px 18px",
                  borderRadius: "4px",
                  border: "1px solid #f43f5e",
                  backgroundColor: "rgba(244, 63, 94, 0.12)",
                  color: "#f87171",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: simIsRunning ? "wait" : "pointer",
                }}
              >
                {simIsRunning && simMode === "monolith" ? "⏳ Menjalankan Monolith..." : "⚠️ Simulasikan di Arsitektur Monolith"}
              </button>
            </div>
          </div>

          {/* Interactive Topology Cards Grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
                // TOPOLOGI 5 DOMAIN PT NUSAFINANCE &amp; HUB TRINO (KLIK KARTU UNTUK INSPEKSI)
              </span>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                Domain Terpilih: <strong>{activeDomain.name}</strong>
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              {DOMAINS.map((dom) => {
                const isSelected = selectedDomainId === dom.id;
                return (
                  <div
                    key={dom.id}
                    onClick={() => setSelectedDomainId(dom.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "6px",
                      border: isSelected ? `2px solid ${dom.color}` : "1px solid var(--line)",
                      backgroundColor: isSelected ? "var(--surface)" : "var(--panel)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{dom.icon}</span>
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", padding: "2px 6px", borderRadius: "3px", backgroundColor: "rgba(255, 255, 255, 0.06)", color: dom.color }}>
                        v{dom.semVer}
                      </span>
                    </div>
                    <strong style={{ fontSize: "13px", color: "var(--ink-heading)", display: "block", marginBottom: "2px" }}>
                      {dom.name}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "8px" }}>
                      {dom.squad}
                    </span>
                    <div style={{ fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "6px" }}>
                      Port: <code style={{ color: dom.color }}>{dom.port}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Telemetry Results of Selected Scenario */}
          <div style={{ padding: "20px", backgroundColor: "var(--surface)", border: simMode === "mesh" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(244, 63, 94, 0.4)", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ padding: "4px 10px", borderRadius: "4px", fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, backgroundColor: simMode === "mesh" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)", color: simMode === "mesh" ? "#10b981" : "#f43f5e" }}>
                {simMode === "mesh" ? "● STATUS: DATA MESH SUB-DETIK" : "⚠️ STATUS: MONOLITH TIMEOUT BOTTLENECK"}
              </span>

              {simScenario === "pdp_mask" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setPdpRole("analyst")}
                    style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontFamily: "var(--font-mono), monospace", border: pdpRole === "analyst" ? "1px solid #60a5fa" : "1px solid var(--line)", backgroundColor: pdpRole === "analyst" ? "rgba(96, 165, 250, 0.2)" : "var(--panel)", color: pdpRole === "analyst" ? "#60a5fa" : "var(--muted)", cursor: "pointer" }}
                  >
                    Role: Staf Cabang
                  </button>
                  <button
                    onClick={() => setPdpRole("auditor")}
                    style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontFamily: "var(--font-mono), monospace", border: pdpRole === "auditor" ? "1px solid #10b981" : "1px solid var(--line)", backgroundColor: pdpRole === "auditor" ? "rgba(16, 185, 129, 0.2)" : "var(--panel)", color: pdpRole === "auditor" ? "#10b981" : "var(--muted)", cursor: "pointer" }}
                  >
                    Role: Auditor OJK
                  </button>
                </div>
              )}
            </div>

            {/* Metrics Counters */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>WAKTU EKSEKUSI KUERI</span>
                <strong style={{ fontSize: "20px", color: simMode === "mesh" ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {simMode === "mesh" ? "420 ms" : "45 Menit 12s"}
                </strong>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>BEBAN CPU DB OPERASIONAL</span>
                <strong style={{ fontSize: "20px", color: simMode === "mesh" ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {simMode === "mesh" ? "< 12% (Aman)" : "100.0% (Crash!)"}
                </strong>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>KESEGARAN DATA</span>
                <strong style={{ fontSize: "20px", color: simMode === "mesh" ? "#10b981" : "#f59e0b", fontFamily: "var(--font-mono), monospace" }}>
                  {simMode === "mesh" ? "T+15 Menit (Live)" : "T+24 Jam (Stale)"}
                </strong>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>KERUSAKAN SKEMA</span>
                <strong style={{ fontSize: "20px", color: simMode === "mesh" ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {simMode === "mesh" ? "0 Error (SemVer)" : "14 Crash Rapat"}
                </strong>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div style={{ padding: "14px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)", fontSize: "12.5px", lineHeight: 1.6 }}>
              {simMode === "mesh" ? (
                <div>
                  <strong style={{ color: "#10b981" }}>Analisis Solusi Data Mesh (Optimal): </strong>
                  {simScenario === "risk360" && "Mesin Trino membaca metadata ODCS, mendorong filter pushdown langsung ke output port masing-masing domain, lalu memproses agregasi di memori RAM dalam 420 milidetik tanpa membebani database operasional IoT di Kalimantan."}
                  {simScenario === "schema_drift" && "Saat developer Core Leasing mengubah nama kolom, ODCS Shift-Left CI Gate otomatis menolak Pull Request, mewajibkan SemVer v2.0, dan menjaga port v1 tetap aktif sehingga 14 dashboard eksekutif tidak ada yang rusak."}
                  {simScenario === "pdp_mask" && (pdpRole === "analyst" ? "Role Staf Cabang aktif: Dynamic Row-Level Security otomatis menyamarkan NIK menjadi 3201****0002. Nol kebocoran data pribadi (Zero-Leak) sesuai Pasal 16 & 20 UU PDP No. 27/2022." : "Token Auditor OJK aktif: NIK asli 3201042908880002 terbuka dengan jejak kriptografis OpenLineage dicatat ke audit log (Pasal 39 UU PDP).")}
                </div>
              ) : (
                <div>
                  <strong style={{ color: "#f43f5e" }}>Analisis Masalah Monolith (Anti-Pattern): </strong>
                  {simScenario === "risk360" && "Kueri SQL join raksasa dieksekusi menabrak database IoT tambang operasional. CPU melonjak 100%, 8,400 excavator gagal mengirim koordinat GPS, dan kueri komite kredit timeout setelah 45 menit."}
                  {simScenario === "schema_drift" && "Database operasional di-patch tanpa kontrak. Script ETL malam hari gagal, dan pagi harinya 14 dashboard eksekutif crash saat rapat pembiayaan Rp 25 Miliar sedang berlangsung."}
                  {simScenario === "pdp_mask" && "Data NIK dan nomor HP dikirim mentah di jaringan tanpa masking database. Staf cabang dapat menyalin data nasabah tanpa audit trail, mengekspos perusahaan pada ancaman denda Rp 18 Miliar."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: SIMULASI KEPUTUSAN ARSITEK (TRADE-OFF BLUEPRINT)             */}
      {/* ==================================================================== */}
      {activeTab === "blueprint" && (
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
            Sebagai Lead Data Architect, tentukan 4 keputusan fundamental di bawah ini dan perhatikan bagaimana
            <strong> Lead Time</strong>, <strong>Kerusakan Skema</strong>, <strong>Kepatuhan UU PDP</strong>, dan <strong>TCO Biaya Cloud</strong> bereaksi secara langsung!
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
            {/* 1. Paradigma */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                1. PARADIGMA KEPEMILIKAN DATA
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "monolith", label: "Central Data Warehouse (EDW Monolith)", note: "Semua ETL dihandle 1 tim pusat" },
                  { id: "lakehouse", label: "Centralized Lakehouse (Delta Lake/S3)", note: "Penyimpanan obyek tapi tetap 1 tim" },
                  { id: "datamesh", label: "Enterprise Data Mesh Otonom (Optimal)", note: "5 domain merawat data product mandiri" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBpParadigm(opt.id as typeof bpParadigm)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: bpParadigm === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: bpParadigm === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: bpParadigm === opt.id ? "#60a5fa" : "var(--ink)",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    <strong>{opt.label}</strong>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{opt.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Governance */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                2. PENEGAKAN KONTRAK DATA (GOVERNANCE)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "manual", label: "Dokumentasi Manual Excel / Confluence", note: "Tanpa verifikasi mesin; rawan basi" },
                  { id: "central_team", label: "Review Manual Tim QA Data", note: "Rapat mingguan; antrean kerja menumpuk" },
                  { id: "computational_ci", label: "Automated ODCS CI/CD Gate (Optimal)", note: "Validasi otomatis saat Pull Request Git" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBpGovernance(opt.id as typeof bpGovernance)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: bpGovernance === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: bpGovernance === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: bpGovernance === opt.id ? "#60a5fa" : "var(--ink)",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    <strong>{opt.label}</strong>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{opt.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Query Strategy */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                3. STRATEGI KUERI RISK 360
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "direct_db", label: "Join Langsung ke Database Operasional", note: "Sangat berbahaya; bikin server tambang down" },
                  { id: "etl_batch", label: "ETL Duplikasi Harian (Batch)", note: "Data basi T+24 Jam; lambat untuk komite" },
                  { id: "trino_federation", label: "Trino In-Memory Query Federation (Optimal)", note: "Join di RAM sub-detik tanpa duplikasi data" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBpQuery(opt.id as typeof bpQuery)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: bpQuery === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: bpQuery === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: bpQuery === opt.id ? "#60a5fa" : "var(--ink)",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    <strong>{opt.label}</strong>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{opt.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Privacy */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                4. PERLINDUNGAN PRIVASI NIK (UU PDP)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "unmasked", label: "Data Polos Tanpa Masking (Bahaya)", note: "Pelanggaran UU PDP; ancaman denda pidana" },
                  { id: "frontend_mask", label: "Masking di Frontend / Power BI Saja", note: "Rentan disadap via browser / inspect SQL" },
                  { id: "dynamic_rls", label: "Dynamic RLS Masking di Port SQL (Optimal)", note: "Disamarkan di database; hanya terbuka auditor" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBpPrivacy(opt.id as typeof bpPrivacy)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: bpPrivacy === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: bpPrivacy === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: bpPrivacy === opt.id ? "#60a5fa" : "var(--ink)",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    <strong>{opt.label}</strong>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>{opt.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Telemetry Result Panel */}
          <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "var(--surface)", border: "1px solid var(--line)" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#10b981", fontWeight: 700, textTransform: "uppercase" }}>
              // DAMPAK ARSITEKTURAL KEPUTUSAN ANDA (REAL-TIME IMPACT)
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "12px" }}>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>LEAD TIME DATA</span>
                <strong style={{ fontSize: "18px", color: bpMetrics.leadColor, fontFamily: "var(--font-mono), monospace" }}>{bpMetrics.leadTime}</strong>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>KERUSAKAN SKEMA / BLN</span>
                <strong style={{ fontSize: "18px", color: bpMetrics.breakages === 0 ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>{bpMetrics.breakages} Insiden</strong>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>KEPATUHAN UU PDP &amp; OJK</span>
                <strong style={{ fontSize: "18px", color: bpMetrics.compliance >= 90 ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>{bpMetrics.compliance}% Aman</strong>
              </div>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>BIAYA TCO CLOUD / TAHUN</span>
                <strong style={{ fontSize: "18px", color: "var(--ink-heading)", fontFamily: "var(--font-mono), monospace" }}>${bpMetrics.annualTco.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: SIMULASI TANGGAP DARURAT & KRISIS ARSITEK                    */}
      {/* ==================================================================== */}
      {activeTab === "crisis" && (
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
            Pilih salah satu dari 3 insiden krisis nyata di PT NusaFinance di bawah ini, tentukan keputusan arsitektur terbaik, dan lihat feedback dampaknya pada sistem!
          </p>

          {/* Crisis Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              { id: "c1", title: "Insiden 01: Silent Schema Drift di Core Leasing" },
              { id: "c2", title: "Insiden 02: Pelanggaran Privasi UU PDP & OJK" },
              { id: "c3", title: "Insiden 03: Server IoT Tambang Kalimantan Down 100%" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCrisisId(c.id)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "4px",
                  border: activeCrisisId === c.id ? "2px solid #ef4444" : "1px solid var(--line)",
                  backgroundColor: activeCrisisId === c.id ? "rgba(239, 68, 68, 0.12)" : "var(--surface)",
                  color: activeCrisisId === c.id ? "#ef4444" : "var(--ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Crisis Detail Box */}
          <div style={{ padding: "20px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px" }}>
            {activeCrisisId === "c1" && (
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", padding: "3px 8px", borderRadius: "3px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", fontWeight: 700 }}>
                  TINGKAT BAHAYA: CRITICAL • SCHEMA EVOLUTION
                </span>
                <h4 style={{ margin: "10px 0 6px 0", fontSize: "17px", color: "var(--ink-heading)" }}>
                  Pukul 09:15 WIB: Silent Schema Drift di Core Leasing Sebelum Rapat Komite Kredit Rp 25 Miliar
                </h4>
                <p style={{ margin: "0 0 12px 0", fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.6 }}>
                  Tim Core Leasing mengubah nama kolom <code>tenor_months</code> menjadi <code>tenor_duration</code> di PostgreSQL produksi tanpa info. 14 dashboard eksekutif langsung crash saat rapat komite sedang berlangsung.
                </p>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                  {[
                    { id: "opt_a", label: "Opsi A: Tim Data Pusat Lembur Memperbaiki ETL Manual", optimal: false, feedback: "Keputusan Reaktif (Anti-Pattern): Memperbaiki di hilir tidak menyelesaikan akar masalah; insiden akan berulang minggu depan." },
                    { id: "opt_b", label: "Opsi B: Terapkan Open Data Contract (ODCS) & CI/CD Shift-Left Guardrail", optimal: true, feedback: "Solusi Arsitek Teladan: Perubahan dicegah otomatis di Pull Request Git. Downstream aman terlindungi oleh Semantic Versioning dan dual-port v1/v2." },
                    { id: "opt_c", label: "Opsi C: Kunci Database Operasional agar Developer Dilarang Ubah Skema", optimal: false, feedback: "Birokrasi Toxic: Memperlambat kecepatan rilis fitur produk bisnis. Inovasi bisnis terhambat oleh izin birokrasi." },
                  ].map((opt) => {
                    const isPicked = crisisChoices["c1"] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setCrisisChoices((p) => ({ ...p, c1: opt.id }))}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "6px",
                          border: isPicked ? (opt.optimal ? "2px solid #10b981" : "2px solid #ef4444") : "1px solid var(--line)",
                          backgroundColor: isPicked ? (opt.optimal ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)") : "var(--panel)",
                          cursor: "pointer",
                        }}
                      >
                        <strong style={{ fontSize: "13px", color: isPicked ? (opt.optimal ? "#10b981" : "#f87171") : "var(--ink-heading)" }}>
                          {opt.label} {isPicked && "✓ (Terpilih)"}
                        </strong>
                        {isPicked && (
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--line)", fontSize: "12px", color: opt.optimal ? "#34d399" : "#f87171" }}>
                            {opt.feedback}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeCrisisId === "c2" && (
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", padding: "3px 8px", borderRadius: "3px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", fontWeight: 700 }}>
                  TINGKAT BAHAYA: CRITICAL • PRIVACY COMPLIANCE
                </span>
                <h4 style={{ margin: "10px 0 6px 0", fontSize: "17px", color: "var(--ink-heading)" }}>
                  Pukul 14:00 WIB: NIK Terbuka Polos di 120 Cabang, Terancam Denda UU PDP Rp 18 Miliar
                </h4>
                <p style={{ margin: "0 0 12px 0", fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.6 }}>
                  Tim audit internal menemukan data NIK (KTP), nomor HP, dan NPWP debitur tampil telanjang tanpa masking kepada seluruh staf cabang. Perusahaan terancam sanksi OJK dan denda administratif hingga 2% pendapatan tahunan.
                </p>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                  {[
                    { id: "opt_a", label: "Opsi A: Masking di Tampilan Frontend / Power BI Saja", optimal: false, feedback: "Bahaya Keamanan Palsu (Security via Obscurity): Data mentah masih mengalir di kabel HTTP dan mudah disadap lewat browser Inspect Element." },
                    { id: "opt_b", label: "Opsi B: Enkripsi Kolom NIK Permanen di Tabel Master Database", optimal: false, feedback: "Overkill & Merusak Operasional: Aplikasi cabang gagal melakukan pencarian cepat debitur karena indeks NIK rusak oleh enkripsi acak." },
                    { id: "opt_c", label: "Opsi C: Dynamic Row-Level Security (RLS) Masking di Output Port SQL", optimal: true, feedback: "Arsitektur Kepatuhan Sempurna: NIK otomatis disamarkan '3201****0002' di database untuk role umum, dan hanya terbuka bagi token auditor berizin (Pasal 16 & 20)." },
                  ].map((opt) => {
                    const isPicked = crisisChoices["c2"] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setCrisisChoices((p) => ({ ...p, c2: opt.id }))}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "6px",
                          border: isPicked ? (opt.optimal ? "2px solid #10b981" : "2px solid #ef4444") : "1px solid var(--line)",
                          backgroundColor: isPicked ? (opt.optimal ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)") : "var(--panel)",
                          cursor: "pointer",
                        }}
                      >
                        <strong style={{ fontSize: "13px", color: isPicked ? (opt.optimal ? "#10b981" : "#f87171") : "var(--ink-heading)" }}>
                          {opt.label} {isPicked && "✓ (Terpilih)"}
                        </strong>
                        {isPicked && (
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--line)", fontSize: "12px", color: opt.optimal ? "#34d399" : "#f87171" }}>
                            {opt.feedback}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeCrisisId === "c3" && (
              <div>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", padding: "3px 8px", borderRadius: "3px", backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", fontWeight: 700 }}>
                  TINGKAT BAHAYA: HIGH • PERFORMANCE BOTTLENECK
                </span>
                <h4 style={{ margin: "10px 0 6px 0", fontSize: "17px", color: "var(--ink-heading)" }}>
                  Pukul 11:30 WIB: Kueri Join Analitik Bikin Server Database IoT Tambang Down 100%
                </h4>
                <p style={{ margin: "0 0 12px 0", fontSize: "12.5px", color: "var(--ink)", lineHeight: 1.6 }}>
                  Analis risiko menjalankan cross-database join raksasa langsung ke server IoT di Kalimantan. CPU database melonjak 100%, menyebabkan 8,400 excavator tambang gagal mengirim sinyal GPS keselamatan kerja.
                </p>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                  {[
                    { id: "opt_a", label: "Opsi A: Pasang Trino In-Memory Federation + Consumer-Aligned Port", optimal: true, feedback: "Solusi Arsitektur Modern: Database operasional terisolasi aman karena kueri hanya membaca port ringkasan terindeks; kueri selesai dalam 420 milidetik di RAM." },
                    { id: "opt_b", label: "Opsi B: Gandakan Spesifikasi Server Database IoT (Scale-Up Server)", optimal: false, feedback: "Pemborosan Biaya: Menghabiskan jutaan rupiah tanpa menyelesaikan problem pencampuran beban OLTP operasional dan OLAP analitik." },
                    { id: "opt_c", label: "Opsi C: Matikan Akses Data IoT dan Kembali ke Laporan Excel Manual", optimal: false, feedback: "Kemunduran Strategis: Merusak keunggulan kompetitif perusahaan dan membuat direksi buta kondisi agunan tambang." },
                  ].map((opt) => {
                    const isPicked = crisisChoices["c3"] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setCrisisChoices((p) => ({ ...p, c3: opt.id }))}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "6px",
                          border: isPicked ? (opt.optimal ? "2px solid #10b981" : "2px solid #ef4444") : "1px solid var(--line)",
                          backgroundColor: isPicked ? (opt.optimal ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)") : "var(--panel)",
                          cursor: "pointer",
                        }}
                      >
                        <strong style={{ fontSize: "13px", color: isPicked ? (opt.optimal ? "#10b981" : "#f87171") : "var(--ink-heading)" }}>
                          {opt.label} {isPicked && "✓ (Terpilih)"}
                        </strong>
                        {isPicked && (
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--line)", fontSize: "12px", color: opt.optimal ? "#34d399" : "#f87171" }}>
                            {opt.feedback}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: BANK SOAL & PERSIAPAN WAWANCARA (10 FAQ INTERACTIVE)          */}
      {/* ==================================================================== */}
      {activeTab === "interview" && (
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header & Progress */}
          <div style={{ padding: "18px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
                // PERSIAPAN WAWANCARA SENIOR / PRINCIPAL DATA ARCHITECT
              </span>
              <h4 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "var(--ink-heading)" }}>
                Bank Soal Wawancara Arsitektur Data (10 Soal Berstandar Industri)
              </h4>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>PROGRES DRILL</span>
                <strong style={{ fontSize: "15px", color: "#10b981", fontFamily: "var(--font-mono), monospace", display: "block" }}>
                  {completedQs.size} / {INTERVIEW_QUESTIONS.length} Soal Dikuasai
                </strong>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["ALL", "Framework & Strategi", "Engineering & Pipeline", "Tata Kelola & Hukum", "Organisasi & Budaya"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: filterCategory === cat ? "1px solid #60a5fa" : "1px solid var(--line)",
                  backgroundColor: filterCategory === cat ? "rgba(96, 165, 250, 0.15)" : "var(--surface)",
                  color: filterCategory === cat ? "#60a5fa" : "var(--muted)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQId === q.id;
              const isDone = completedQs.has(q.id);
              return (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: isExpanded ? "1px solid #60a5fa" : "1px solid var(--line)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    onClick={() => setExpandedQId(isExpanded ? "" : q.id)}
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: isExpanded ? "rgba(96, 165, 250, 0.04)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                      <span style={{ fontSize: "12px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                        #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <strong style={{ fontSize: "14px", color: isExpanded ? "#60a5fa" : "var(--ink-heading)" }}>
                        {q.question}
                      </strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", padding: "2px 8px", borderRadius: "3px", backgroundColor: "var(--panel)", color: "var(--muted)" }}>
                        {q.tag}
                      </span>
                      <span style={{ fontSize: "14px", color: "var(--muted)" }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid var(--line)", marginTop: "4px", paddingTop: "16px" }}>
                      {/* Interviewer Intent */}
                      <div style={{ padding: "10px 14px", backgroundColor: "rgba(96, 165, 250, 0.08)", borderLeft: "3px solid #60a5fa", borderRadius: "0 4px 4px 0", marginBottom: "12px", fontSize: "12px", color: "var(--ink)" }}>
                        <strong style={{ color: "#60a5fa" }}>🎯 Maksud Penguji (Interviewer Intent): </strong>
                        {q.intent}
                      </div>

                      {/* Quick Takeaway */}
                      <div style={{ padding: "10px 14px", backgroundColor: "rgba(16, 185, 129, 0.08)", borderLeft: "3px solid #10b981", borderRadius: "0 4px 4px 0", marginBottom: "14px", fontSize: "12px", color: "var(--ink)" }}>
                        <strong style={{ color: "#10b981" }}>⚡ Quick Takeaway (30 Detik): </strong>
                        {q.quickTakeaway}
                      </div>

                      {/* Full Answer */}
                      <div style={{ fontSize: "12.5px", lineHeight: 1.6, color: "var(--ink)", marginBottom: "16px" }}>
                        <strong style={{ display: "block", marginBottom: "4px", color: "var(--ink-heading)" }}>
                          📖 Jawaban Arsitektural Lengkap:
                        </strong>
                        <p style={{ margin: 0 }}>{q.fullAnswer}</p>
                      </div>

                      {/* Mark Completed Button */}
                      <button
                        onClick={() => toggleCompleteQ(q.id)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "4px",
                          border: isDone ? "1px solid #10b981" : "1px solid var(--line)",
                          backgroundColor: isDone ? "rgba(16, 185, 129, 0.15)" : "var(--panel)",
                          color: isDone ? "#10b981" : "var(--ink)",
                          fontSize: "11px",
                          fontFamily: "var(--font-mono), monospace",
                          cursor: "pointer",
                        }}
                      >
                        {isDone ? "✓ Soal Sudah Dikuasai" : "○ Tandai Sudah Dikuasai"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: CONTRACT BUILDER (ODCS YAML) & TCO FINANCIALS                 */}
      {/* ==================================================================== */}
      {activeTab === "contracts" && (
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* ODCS Interactive Builder */}
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
              // RAKIT OPEN DATA CONTRACT STANDARD (ODCS) SECARA LANGSUNG
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "12px" }}>
              {/* Form Input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                    NAMA DATA PRODUCT
                  </label>
                  <input
                    type="text"
                    value={cbProduct}
                    onChange={(e) => setCbProduct(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--ink)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                    OWNER SQUAD
                  </label>
                  <input
                    type="text"
                    value={cbOwner}
                    onChange={(e) => setCbOwner(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--ink)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                    SLA KESEGARAN DATA
                  </label>
                  <select
                    value={cbFreshness}
                    onChange={(e) => setCbFreshness(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--ink)", fontSize: "13px" }}
                  >
                    <option value="15">T+15 Menit (Near Real-time Sensor IoT)</option>
                    <option value="60">T+60 Menit (Hourly Leasing)</option>
                    <option value="1440">T+24 Jam (Batch Harian)</option>
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink)", cursor: "pointer", marginTop: "4px" }}>
                  <input
                    type="checkbox"
                    checked={cbMaskNik}
                    onChange={(e) => setCbMaskNik(e.target.checked)}
                    style={{ accentColor: "#10b981" }}
                  />
                  <span>Terapkan Dynamic RLS Masking NIK (UU PDP No. 27/2022)</span>
                </label>

                <button
                  onClick={() => setCbVerified(true)}
                  style={{
                    marginTop: "8px",
                    padding: "10px 18px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#60a5fa",
                    color: "#0f172a",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ▶ Validasi Kontrak di GitHub Actions CI
                </button>

                {cbVerified && (
                  <div style={{ padding: "12px", backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "4px", fontSize: "11px", color: "var(--ink)" }}>
                    <strong style={{ color: "#10b981", display: "block", marginBottom: "4px" }}>✓ CI GATE: PASS (KONTRAK VALID)</strong>
                    Sintaks ODCS v2.1.0 terverifikasi valid, skema backward compatible, dan aturan UU PDP terpenuhi.
                  </div>
                )}
              </div>

              {/* YAML Code Output */}
              <div style={{ backgroundColor: "#080c14", border: "1px solid var(--line)", borderRadius: "6px", padding: "16px", overflowX: "auto" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", display: "block", marginBottom: "8px" }}>
                  datacontract.yaml (ODCS v2.1.0)
                </span>
                <pre style={{ margin: 0, fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#e2e8f0", lineHeight: 1.45 }}>
{`version: 2.1.0
kind: DataContract
metadata:
  domain: "${cbOwner}"
  dataProduct: "${cbProduct}"
  classification: Internal Restricted

dataset:
  name: ${cbOwner.toLowerCase().replace(/\\s+/g, "_")}.output_port
  refreshInterval: T+${cbFreshness}m
  sla:
    freshnessMinutes: ${cbFreshness}
    availabilityPct: 99.85

schema:
  - name: contract_id
    type: string
    primaryKey: true
  - name: principal_idr
    type: numeric
  - name: nik_citizen
    type: string
    classification: ${cbMaskNik ? "pii_masked_uu_pdp" : "confidential_raw"}

governance:
  complianceFrameworks:
    - INDONESIA_UU_PDP_NO_27_2022
    - OJK_POJK_35_2018`}
                </pre>
              </div>
            </div>
          </div>

          {/* TCO Financial Bar Chart */}
          <div style={{ padding: "22px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
              // PERBANDINGAN TCO BIAYA INFRASTRUKTUR CLOUD TAHUNAN
            </span>
            <h4 style={{ margin: "6px 0 16px 0", fontSize: "18px", color: "var(--ink-heading)" }}>
              Efisiensi Finansial: Monolith DWH vs Enterprise Data Mesh
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Biaya Monolith Lama (ETL Duplikasi &amp; Server Terpusat)</span>
                  <strong style={{ color: "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>$184,000 / thn</strong>
                </div>
                <div style={{ width: "100%", height: "14px", backgroundColor: "var(--panel)", borderRadius: "7px", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#f43f5e" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Biaya Enterprise Data Mesh (Trino In-Memory &amp; Port Iceberg)</span>
                  <strong style={{ color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>$118,000 / thn</strong>
                </div>
                <div style={{ width: "100%", height: "14px", backgroundColor: "var(--panel)", borderRadius: "7px", overflow: "hidden" }}>
                  <div style={{ width: "64.1%", height: "100%", backgroundColor: "#10b981" }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", padding: "14px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "6px", textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>PENGHEMATAN TAHUNAN NYATA (ANNUAL SAVINGS)</span>
              <strong style={{ fontSize: "24px", color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>
                $66,000 / Tahun (-35.9%)
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
