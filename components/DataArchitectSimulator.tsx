"use client";

import React, { useState, useMemo } from "react";

// ============================================================================
// SIMULATOR STATE TYPES & DOMAIN DATA
// ============================================================================
type ParadigmChoice = "monolith" | "lakehouse" | "datamesh";
type GovernanceChoice = "manual" | "central_team" | "computational_ci";
type QueryChoice = "direct_db" | "etl_batch" | "trino_federation";
type PrivacyChoice = "unmasked" | "frontend_mask" | "dynamic_rls";

interface MeshDomainNode {
  id: string;
  name: string;
  squad: string;
  lead: string;
  port: string;
  semVer: string;
  slaRefresh: string;
  slaAvailability: string;
  tech: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  desc: string;
  columns: { name: string; type: string; isPII: boolean; desc: string }[];
}

const MESH_DOMAINS: MeshDomainNode[] = [
  {
    id: "leasing",
    name: "Active Lease Portfolio",
    squad: "Core Leasing Squad",
    lead: "Budi Santoso (Domain Lead)",
    port: "leasing_dp.active_portfolio",
    semVer: "2.1.0",
    slaRefresh: "T+60m (Per Jam)",
    slaAvailability: "99.85%",
    tech: "PostgreSQL ANSI SQL / Iceberg",
    color: "#3b82f6",
    icon: "📄",
    x: 140,
    y: 285,
    desc: "Siklus hidup kontrak pembiayaan alat berat, tenor, plafon pokok utang, dan suku bunga.",
    columns: [
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "ID unik kontrak kredit" },
      { name: "customer_id", type: "VARCHAR(32)", isPII: false, desc: "ID relasi nasabah" },
      { name: "principal_amount", type: "NUMERIC(15,2)", isPII: false, desc: "Plafon pokok pembiayaan" },
      { name: "tenor_months", type: "INTEGER", isPII: false, desc: "Jangka waktu cicilan" },
      { name: "status", type: "VARCHAR(16)", isPII: false, desc: "Status kontrak (ACTIVE, OVERDUE)" },
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
    tech: "TimescaleDB / S3 Parquet",
    color: "#f59e0b",
    icon: "🚜",
    x: 120,
    y: 125,
    desc: "Sensor telematika excavator tambang/kebun, jam kerja mesin, GPS geofencing, dan kesehatan agunan fisik.",
    columns: [
      { name: "equipment_id", type: "VARCHAR(32)", isPII: false, desc: "Nomor seri unit mesin (CAT 320D)" },
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "Relasi kontrak pembiayaan" },
      { name: "engine_hours_today", type: "FLOAT", isPII: false, desc: "Total jam kerja mesin hari ini" },
      { name: "gps_latitude", type: "DOUBLE", isPII: false, desc: "Koordinat lokasi tambang" },
      { name: "is_geofence_violation", type: "BOOLEAN", isPII: false, desc: "Peringatan mesin keluar area kontrak" },
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
    tech: "Trino / PostgreSQL",
    color: "#a855f7",
    icon: "⚖️",
    x: 620,
    y: 285,
    desc: "Model machine learning probabilitas gagal bayar (PD), credit score debitur, dan rasio kemampuan bayar DSCR.",
    columns: [
      { name: "customer_id", type: "VARCHAR(32)", isPII: false, desc: "ID unik nasabah" },
      { name: "credit_score", type: "INTEGER", isPII: false, desc: "Skor kredit internal (300-850)" },
      { name: "pd_12m", type: "FLOAT", isPII: false, desc: "Probabilitas gagal bayar 12 bulan" },
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
    tech: "PostgreSQL / CDC",
    color: "#10b981",
    icon: "💳",
    x: 640,
    y: 125,
    desc: "Status virtual account perbankan, rekonsiliasi pembayaran cicilan, dan aging tunggakan DPD.",
    columns: [
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "ID kontrak" },
      { name: "dpd_days", type: "INTEGER", isPII: false, desc: "Days Past Due (hari keterlambatan)" },
      { name: "overdue_penalty_idr", type: "NUMERIC(12,2)", isPII: false, desc: "Denda keterlambatan" },
      { name: "last_payment_date", type: "DATE", isPII: false, desc: "Tanggal pembayaran terakhir" },
    ],
  },
  {
    id: "risk360",
    name: "Risk 360 Aggregator Data Product",
    squad: "Risk 360 Consumer-Aligned Squad",
    lead: "Chief Risk & Credit Committee",
    port: "risk360_dp.portfolio_health",
    semVer: "1.2.0",
    slaRefresh: "Near Real-Time (On-Demand)",
    slaAvailability: "99.99%",
    tech: "Trino RAM Federation / Iceberg",
    color: "#ec4899",
    icon: "💎",
    x: 380,
    y: 45,
    desc: "Produk data komposit tingkat tinggi: menggabungkan data kredit, lokasi fisik mesin IoT, dan status billing untuk direksi.",
    columns: [
      { name: "contract_id", type: "VARCHAR(32)", isPII: false, desc: "ID kontrak pembiayaan" },
      { name: "borrower_nik", type: "VARCHAR(16)", isPII: true, desc: "NIK penjamin (UU PDP Protected)" },
      { name: "fleet_status", type: "VARCHAR(16)", isPII: false, desc: "Status kerja alat berat (OPTIMAL/IDLE)" },
      { name: "composite_risk_rating", type: "VARCHAR(8)", isPII: false, desc: "Peringkat risiko gabungan" },
    ],
  },
];

interface CrisisScenario {
  id: string;
  title: string;
  category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  situation: string;
  businessImpact: string;
  options: {
    id: string;
    label: string;
    description: string;
    isOptimal: boolean;
    feedback: string;
    leadTimeDelta: string;
    riskScoreDelta: number;
    costImpact: string;
  }[];
}

const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: "schema_drift",
    title: "Insiden 01: Silent Schema Drift di Core Leasing",
    category: "Schema Evolution & Compatibility",
    severity: "CRITICAL",
    situation:
      "Pukul 09:15 WIB: Tim software engineer Core Leasing merilis patch baru dan mengganti nama kolom 'tenor_months' menjadi 'tenor_duration' di database PostgreSQL operasional tanpa pemberitahuan. 14 dashboard eksekutif dan kueri Risk 360 seketika crash saat komite kredit sedang rapat persetujuan pembiayaan Rp 25 Miliar.",
    businessImpact: "Komite kredit tertunda 4 jam, potensi gagal bayar debitur tidak terpantau, dan direksi menuntut pertanggungjawaban.",
    options: [
      {
        id: "opt_a",
        label: "Opsi A: Tim Data Pusat Lembur Memperbaiki ETL Manual",
        description: "Menugaskan 3 data engineer untuk menelusuri script ETL yang rusak, mengubah nama kolom secara terburu-buru, dan reload data malam hari.",
        isOptimal: false,
        feedback: "Keputusan Reaktif (Anti-Pattern): Memperbaiki di hilir tidak menyelesaikan akar masalah. Minggu depan hal yang sama akan terulang lagi ketika tim leasing mengubah kolom lain.",
        leadTimeDelta: "+24 Jam Downtime",
        riskScoreDelta: -25,
        costImpact: "Biaya lembur tim & resiko kesalahan data manual tinggi",
      },
      {
        id: "opt_b",
        label: "Opsi B: Terapkan Open Data Contract (ODCS) & CI/CD Shift-Left Guardrail (Optimal)",
        description: "Mewajibkan file leasing_contract_v2.yaml di Git. Setiap perubahan skema diuji otomatis di PR GitHub Actions. Jika ada breaking change, build ditolak otomatis dan wajib merilis dual-port (v1 & v2).",
        isOptimal: true,
        feedback: "Solusi Arsitek Teladan: Perubahan skema dicegah sebelum menyentuh produksi. Sistem hilir aman terlindungi oleh Semantic Versioning dan kontrak yang mengikat.",
        leadTimeDelta: "< 15 Menit Recovery (v1 Port Tetap Aman)",
        riskScoreDelta: +35,
        costImpact: "Hemat 100% biaya downtime; bebas insiden berulang",
      },
      {
        id: "opt_c",
        label: "Opsi C: Kunci Database Operasional agar Developer Tidak Bisa Ubah Skema",
        description: "Mengeluarkan kebijakan birokrasi ketat: software engineer dilarang mengubah DDL database tanpa tanda tangan persetujuan Head of Data.",
        isOptimal: false,
        feedback: "Birokrasi Toxic: Memperlambat kecepatan rilis fitur aplikasi operasional. Tim bisnis akan memprotes karena inovasi aplikasi terhambat birokrasi izin data.",
        leadTimeDelta: "+2 Minggu Birokrasi PR",
        riskScoreDelta: -10,
        costImpact: "Kecepatan produk bisnis turun drastis",
      },
    ],
  },
  {
    id: "uu_pdp_breach",
    title: "Insiden 02: Peringatan Pelanggaran Privasi UU PDP & OJK",
    category: "Regulatory Compliance & Security",
    severity: "CRITICAL",
    situation:
      "Pukul 14:00 WIB: Tim audit internal menemukan bahwa kueri analitik debitur menampilkan 16-digit NIK (KTP), nomor HP, dan NPWP penjamin perorangan secara telanjang kepada 120 staf cabang. Berdasarkan UU PDP No. 27/2022 Pasal 16 & 20, perusahaan terancam denda administratif hingga 2% pendapatan tahunan (sekitar Rp 18 Miliar).",
    businessImpact: "Ancaman denda regulator, potensi kebocoran data nasabah ke pihak ketiga, dan sanksi reputasi publik.",
    options: [
      {
        id: "opt_a",
        label: "Opsi A: Masking di Tampilan Frontend Dashboard Saja (CSS / Power BI Formula)",
        description: "Menyembunyikan NIK menggunakan masking formula di Power BI atau bintang-bintang di antarmuka web, sementara data mentah dari database tetap dikirim polos.",
        isOptimal: false,
        feedback: "Bahaya Keamanan Palsu (Security via Obscurity): Data mentah masih mengalir di jaringan kabel HTTP/JDBC dan bisa disadap lewat browser Inspect Element atau script SQL langsung.",
        leadTimeDelta: "Cepat (1 Hari), tapi Rawan",
        riskScoreDelta: -30,
        costImpact: "Denda UU PDP tetap mengintai jika terjadi kebocoran jaringan",
      },
      {
        id: "opt_b",
        label: "Opsi B: Enkripsi Kolom NIK Permanen di Tabel Master Database",
        description: "Mengenkripsi kolom NIK dengan kunci AES di database operasional sehingga semua pihak termasuk aplikasi core leasing melihat karakter acak.",
        isOptimal: false,
        feedback: "Overkill & Merusak Operasional: Aplikasi operasional cabang kesulitan mencari debitur karena tidak bisa melakukan pencarian cepat berdasarkan nomor KTP asli.",
        leadTimeDelta: "Lama (3 Minggu Migrasi)",
        riskScoreDelta: +5,
        costImpact: "Performa kueri operasional anjlok karena overhead enkripsi",
      },
      {
        id: "opt_c",
        label: "Opsi C: Dynamic Row-Level Security (RLS) Masking di Output Port crm_dp (Optimal)",
        description: "Terapkan view SQL dinamis di port crm_dp.borrower_directory: otomatis tampil masked '3201****0002' untuk role umum (role_data_consumer), dan hanya terbuka untuk token auditor kepatuhan berizin.",
        isOptimal: true,
        feedback: "Arsitektur Kepatuhan Sempurna: Memenuhi Pasal 16 & 20 secara komputasional tanpa mengganggu database operasional asli, dilengkapi logging jejak audit OpenLineage (Pasal 39).",
        leadTimeDelta: "< 2 Jam Implementasi Port",
        riskScoreDelta: +40,
        costImpact: "Nol risiko denda; performa tetap cepat dan patuh hukum",
      },
    ],
  },
  {
    id: "cross_domain_bottleneck",
    title: "Insiden 03: Kueri Risk 360 Lemot & Bikin Server Tambang Down",
    category: "Analytical Performance & Federation",
    severity: "HIGH",
    situation:
      "Pukul 11:30 WIB: Saat harga komoditas batubara anjlok, direksi meminta pembaruan analisis Risk 360 secara real-time. Tim analis menjalankan kueri SQL cross-database join raksasa langsung ke database IoT alat berat di Kalimantan. Akibatnya, CPU database IoT melonjak 100%, menyebabkan sensor telematika 8,400 excavator gagal mengirim sinyal GPS.",
    businessImpact: "Sistem pelacakan alat berat tambang lumpuh, data operasional tertahan, dan kueri analitik timeout.",
    options: [
      {
        id: "opt_a",
        label: "Opsi A: Pasang Trino In-Memory Federation + Consumer-Aligned Risk 360 Port (Optimal)",
        description: "Gunakan Trino untuk mendorong kueri teragregasi (pushdown) ke output port hourly yang sudah diringkas, lalu buat Data Product turunan 'Risk 360' resmi yang mematerialisasi data join terjadwal.",
        isOptimal: true,
        feedback: "Solusi Arsitektur Modern: Database operasional terisolasi aman karena kueri hanya membaca port ringkasan yang terindeks, kueri komite selesai dalam 420 milidetik di RAM.",
        leadTimeDelta: "Kueri dari 45 Menit -> 420 ms",
        riskScoreDelta: +35,
        costImpact: "Beban CPU database operasional turun ke <15%",
      },
      {
        id: "opt_b",
        label: "Opsi B: Gandakan Spesifikasi Server Database IoT (Scale-Up Server)",
        description: "Meningkatkan ukuran server cloud database IoT dari 16 vCPU menjadi 64 vCPU agar kuat menahan kueri join analitik bersamaan.",
        isOptimal: false,
        feedback: "Pemborosan Biaya (Symptom-Fixing): Menghabiskan anggaran cloud jutaan rupiah tanpa menyelesaikan problem pencampuran beban OLTP operasional dan OLAP analitik.",
        leadTimeDelta: "Kueri Tetap 30+ Menit",
        riskScoreDelta: -15,
        costImpact: "Biaya cloud bulanan melonjak 300%",
      },
      {
        id: "opt_c",
        label: "Opsi C: Larang Analis Membuka Data Telematika dan Kembali ke Laporan Manual",
        description: "Menonaktifkan akses data sensor IoT untuk analis risiko dan meminta cabang tambang mengirim laporan jam kerja alat lewat email mingguan.",
        isOptimal: false,
        feedback: "Kemunduran Strategis: Menghancurkan keunggulan kompetitif perusahaan. Direksi kembali buta terhadap kondisi fisik agunan alat berat di lapangan.",
        leadTimeDelta: "Lead Time Mundur ke 1 Minggu",
        riskScoreDelta: -40,
        costImpact: "Keputusan restrukturisasi kredit menjadi lambat dan berisiko",
      },
    ],
  },
];

export function DataArchitectSimulator() {
  const [activeTab, setActiveTab] = useState<"topology" | "blueprint" | "crisis" | "builder" | "scorecard">("topology");

  // ============================================================================
  // TAB 1: TOPOLOGY & LIVE QUERY PIPELINE SIMULATOR STATES
  // ============================================================================
  const [topologyScenario, setTopologyScenario] = useState<"query_risk360" | "schema_drift" | "privacy_pdp">("query_risk360");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [executedArchitecture, setExecutedArchitecture] = useState<"mesh" | "monolith">("mesh");
  const [selectedDomainId, setSelectedDomainId] = useState<string>("leasing");
  const [pdpUserRole, setPdpUserRole] = useState<"analyst" | "auditor">("analyst");

  const runSimulation = (mode: "mesh" | "monolith") => {
    setIsSimulating(true);
    setExecutedArchitecture(mode);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const activeDomainNode = useMemo(
    () => MESH_DOMAINS.find((d) => d.id === selectedDomainId) ?? MESH_DOMAINS[0],
    [selectedDomainId]
  );

  // ============================================================================
  // TAB 2: BLUEPRINT ARCHITECTURE CONFIGURATION STATES
  // ============================================================================
  const [paradigm, setParadigm] = useState<ParadigmChoice>("datamesh");
  const [governance, setGovernance] = useState<GovernanceChoice>("computational_ci");
  const [queryStrategy, setQueryStrategy] = useState<QueryChoice>("trino_federation");
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyChoice>("dynamic_rls");

  // ============================================================================
  // TAB 3: CRISIS INCIDENT SELECTED OPTION STATE
  // ============================================================================
  const [activeCrisisId, setActiveCrisisId] = useState<string>("schema_drift");
  const [crisisAnswers, setCrisisAnswers] = useState<Record<string, string>>({
    schema_drift: "opt_b",
    uu_pdp_breach: "opt_c",
    cross_domain_bottleneck: "opt_a",
  });

  // ============================================================================
  // TAB 4: CONTRACT BUILDER INTERACTIVE STATES
  // ============================================================================
  const [productName, setProductName] = useState<string>("Active Lease Portfolio");
  const [domainOwner, setDomainOwner] = useState<string>("Core Leasing Squad");
  const [slaFreshness, setSlaFreshness] = useState<string>("60");
  const [includeNikMask, setIncludeNikMask] = useState<boolean>(true);
  const [contractValidationRan, setContractValidationRan] = useState<boolean>(false);

  // Compute Architecture Metric Telemetry based on user choices
  const architectureMetrics = useMemo(() => {
    let leadTimeText = "< 15 Menit";
    let leadTimeColor = "#10b981";
    let breakageCount = 0;
    let complianceScore = 100;
    let annualCost = 118000;
    let datsisRating = 4.67;
    let architecturalRank = "Principal Data Architect (Optimal)";

    // Paradigm Impact
    if (paradigm === "monolith") {
      leadTimeText = "3–6 Minggu";
      leadTimeColor = "#f43f5e";
      breakageCount += 10;
      annualCost += 50000;
      datsisRating -= 1.8;
    } else if (paradigm === "lakehouse") {
      leadTimeText = "1–2 Minggu";
      leadTimeColor = "#f59e0b";
      breakageCount += 5;
      annualCost += 30000;
      datsisRating -= 0.8;
    }

    // Governance Impact
    if (governance === "manual") {
      breakageCount += 4;
      complianceScore -= 35;
      datsisRating -= 0.6;
    } else if (governance === "central_team") {
      breakageCount += 2;
      complianceScore -= 15;
      annualCost += 16000;
      datsisRating -= 0.3;
    }

    // Query Strategy Impact
    if (queryStrategy === "direct_db") {
      leadTimeText = "Timeout / Server Down";
      leadTimeColor = "#f43f5e";
      datsisRating -= 0.5;
    } else if (queryStrategy === "etl_batch") {
      leadTimeText = "T+24 Jam (Besok)";
      leadTimeColor = "#f59e0b";
    }

    // Privacy Policy Impact
    if (privacyPolicy === "unmasked") {
      complianceScore -= 60;
      datsisRating -= 0.9;
    } else if (privacyPolicy === "frontend_mask") {
      complianceScore -= 25;
      datsisRating -= 0.4;
    }

    // Rank evaluation
    const compositeScore = (datsisRating / 5.0) * 50 + (complianceScore / 100) * 30 + (breakageCount === 0 ? 20 : Math.max(0, 20 - breakageCount * 2));
    if (compositeScore >= 85) architecturalRank = "Principal Data Architect (Level Master)";
    else if (compositeScore >= 65) architecturalRank = "Senior Data Architect (Solid Enterprise)";
    else architecturalRank = "Junior / Legacy Architect (Perlu Remediasi)";

    return {
      leadTimeText,
      leadTimeColor,
      breakageCount,
      complianceScore,
      annualCost,
      datsisRating: Math.max(1.5, Math.min(5.0, datsisRating)).toFixed(2),
      compositeScore: Math.round(compositeScore),
      architecturalRank,
    };
  }, [paradigm, governance, queryStrategy, privacyPolicy]);

  const activeCrisis = useMemo(
    () => CRISIS_SCENARIOS.find((c) => c.id === activeCrisisId) ?? CRISIS_SCENARIOS[0],
    [activeCrisisId]
  );

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "6px",
        backgroundColor: "var(--panel)",
        boxShadow: "0 10px 32px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        marginBottom: "40px",
      }}
    >
      {/* Simulator Chrome Header */}
      <div
        style={{
          padding: "18px 24px",
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#60a5fa",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "3px",
            }}
          >
            // SIMULATOR ENTERPRISE DATA ARCHITECT &amp; DATA MESH
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--ink-heading)",
            }}
          >
            Interactive Data Architect Sandbox &amp; Pipeline Engine
          </h3>
        </div>

        {/* Live Architect Fitness Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "6px 14px",
            borderRadius: "4px",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <span style={{ fontSize: "16px" }}>🎖️</span>
          <div>
            <span style={{ display: "block", fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
              STATUS EVALUASI ARSITEK
            </span>
            <strong style={{ fontSize: "12px", color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>
              {architectureMetrics.architecturalRank}
            </strong>
          </div>
        </div>
      </div>

      {/* Simulator Mode Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface-secondary)",
          overflowX: "auto",
        }}
      >
        {[
          { id: "topology", label: "🌐 1. Simulasi Live Aliran Data Mesh", icon: "🌐" },
          { id: "blueprint", label: "🏛️ 2. Studio Keputusan Arsitektur", icon: "🏛️" },
          { id: "crisis", label: "🚨 3. Simulasi Krisis & Insiden Arsitek", icon: "🚨" },
          { id: "builder", label: "📝 4. Contract Builder & CI (ODCS)", icon: "📝" },
          { id: "scorecard", label: "📈 5. Scorecard Kebugaran & TCO", icon: "📈" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: "12px 20px",
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
      {/* TAB 1: TOPOLOGY & LIVE QUERY PIPELINE SIMULATOR                      */}
      {/* ==================================================================== */}
      {activeTab === "topology" && (
        <div style={{ padding: "24px" }}>
          {/* Skenario Selector Header */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "var(--surface)",
              borderRadius: "6px",
              border: "1px solid var(--line)",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase" }}>
                // PILIH SKENARIO SIMULASI ALIRAN DATA:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {[
                  { id: "query_risk360", label: "⚡ Skenario A: Kueri Komite Risk 360", desc: "Federasi Trino RAM vs Monolith DB Join" },
                  { id: "schema_drift", label: "🛡️ Skenario B: Uji Schema Drift & CI", desc: "Shift-left PR guardrail vs Silent Crash" },
                  { id: "privacy_pdp", label: "🔒 Skenario C: Masking UU PDP No. 27/2022", desc: "Role Staf Cabang vs Auditor OJK" },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setTopologyScenario(sc.id as typeof topologyScenario)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "4px",
                      border: topologyScenario === sc.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: topologyScenario === sc.id ? "rgba(96, 165, 250, 0.15)" : "var(--panel)",
                      color: topologyScenario === sc.id ? "#60a5fa" : "var(--ink)",
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

            {/* Run Trigger Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "240px" }}>
              <button
                onClick={() => runSimulation("mesh")}
                disabled={isSimulating}
                style={{
                  padding: "10px 18px",
                  borderRadius: "4px",
                  border: "1px solid #10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: isSimulating ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isSimulating && executedArchitecture === "mesh" ? "⏳ Menjalankan Data Mesh..." : "▶ Jalankan di Arsitektur Data Mesh"}
              </button>
              <button
                onClick={() => runSimulation("monolith")}
                disabled={isSimulating}
                style={{
                  padding: "8px 18px",
                  borderRadius: "4px",
                  border: "1px solid #f43f5e",
                  backgroundColor: "rgba(244, 63, 94, 0.12)",
                  color: "#f87171",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: isSimulating ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {isSimulating && executedArchitecture === "monolith" ? "⏳ Menjalankan Monolith..." : "⚠️ Simulasikan di Arsitektur Monolith"}
              </button>
            </div>
          </div>

          {/* Interactive SVG Topology Map */}
          <div
            style={{
              position: "relative",
              backgroundColor: "#070b12",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "14px",
                fontSize: "10px",
                fontFamily: "var(--font-mono), monospace",
                color: "#60a5fa",
                letterSpacing: "0.08em",
                fontWeight: 700,
                zIndex: 2,
              }}
            >
              // TOPOLOGI JARINGAN DATA MESH (INTERACTIVE SVG NODE MAP)
            </div>

            <svg
              viewBox="0 0 760 360"
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <defs>
                <linearGradient id="meshLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="monolithLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Background Grid Pattern */}
              <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1">
                <line x1="0" y1="90" x2="760" y2="90" />
                <line x1="0" y1="180" x2="760" y2="180" />
                <line x1="0" y1="270" x2="760" y2="270" />
                <line x1="190" y1="0" x2="190" y2="360" />
                <line x1="380" y1="0" x2="380" y2="360" />
                <line x1="570" y1="0" x2="570" y2="360" />
              </g>

              {/* Connection Pipelines */}
              {/* Leasing to Center Hub */}
              <line
                x1="140"
                y1="285"
                x2="380"
                y2="195"
                stroke={executedArchitecture === "mesh" ? "#3b82f6" : "#f43f5e"}
                strokeWidth={isSimulating ? "3" : "1.5"}
                strokeDasharray={isSimulating ? "6 4" : "none"}
                opacity={isSimulating ? "1" : "0.5"}
              />

              {/* Equipment IoT to Center Hub */}
              <line
                x1="120"
                y1="125"
                x2="380"
                y2="195"
                stroke={executedArchitecture === "mesh" ? "#f59e0b" : "#f43f5e"}
                strokeWidth={isSimulating ? "3" : "1.5"}
                strokeDasharray={isSimulating ? "6 4" : "none"}
                opacity={isSimulating ? "1" : "0.5"}
              />

              {/* Billing to Center Hub */}
              <line
                x1="640"
                y1="125"
                x2="380"
                y2="195"
                stroke={executedArchitecture === "mesh" ? "#10b981" : "#f43f5e"}
                strokeWidth={isSimulating ? "3" : "1.5"}
                strokeDasharray={isSimulating ? "6 4" : "none"}
                opacity={isSimulating ? "1" : "0.5"}
              />

              {/* Credit Risk to Center Hub */}
              <line
                x1="620"
                y1="285"
                x2="380"
                y2="195"
                stroke={executedArchitecture === "mesh" ? "#a855f7" : "#f43f5e"}
                strokeWidth={isSimulating ? "3" : "1.5"}
                strokeDasharray={isSimulating ? "6 4" : "none"}
                opacity={isSimulating ? "1" : "0.5"}
              />

              {/* Center Hub to Risk 360 Aggregator */}
              <line
                x1="380"
                y1="195"
                x2="380"
                y2="45"
                stroke={executedArchitecture === "mesh" ? "#ec4899" : "#f43f5e"}
                strokeWidth={isSimulating ? "4" : "2"}
                strokeDasharray={isSimulating ? "8 4" : "none"}
                opacity={isSimulating ? "1" : "0.7"}
              />

              {/* CENTER HUB (TRINO IN-MEMORY vs MONOLITH BOTTLENECK) */}
              {executedArchitecture === "mesh" ? (
                <g transform="translate(380, 195)">
                  <circle r="46" fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="2" />
                  <circle r="36" fill="#082f49" stroke="#06b6d4" strokeWidth="1" />
                  <text y="-8" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TRINO RAM</text>
                  <text y="7" fill="#e0f2fe" fontSize="8" textAnchor="middle" fontFamily="monospace">FEDERATION</text>
                  <text y="20" fill="#7dd3fc" fontSize="7" textAnchor="middle" fontFamily="monospace">&lt;500ms Pushdown</text>
                </g>
              ) : (
                <g transform="translate(380, 195)">
                  <circle r="48" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" strokeWidth="2.5" />
                  <circle r="38" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" />
                  <text y="-10" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CENTRAL DWH</text>
                  <text y="5" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">100% CPU ⚠️</text>
                  <text y="18" fill="#fecdd3" fontSize="7" textAnchor="middle" fontFamily="monospace">45 Min Bottleneck</text>
                </g>
              )}

              {/* DOMAIN NODES */}
              {MESH_DOMAINS.map((dom) => {
                const isSelected = selectedDomainId === dom.id;
                return (
                  <g
                    key={dom.id}
                    transform={`translate(${dom.x}, ${dom.y})`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedDomainId(dom.id)}
                  >
                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle r="38" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />
                    )}
                    <circle
                      r="30"
                      fill="#0f172a"
                      stroke={dom.color}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                    <text y="-4" fontSize="16" textAnchor="middle">{dom.icon}</text>
                    <text y="14" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {dom.id.toUpperCase()}
                    </text>
                    {/* Port Name Tag */}
                    <rect x="-65" y="36" width="130" height="16" rx="3" fill="#1e293b" stroke={dom.color} strokeWidth="0.8" />
                    <text x="0" y="48" fill="#cbd5e1" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                      {dom.port}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Real-time Telemetry & Simulation Result Panel */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--surface)",
              border: executedArchitecture === "mesh" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(244, 63, 94, 0.4)",
              borderRadius: "6px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "3px",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: executedArchitecture === "mesh" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                    color: executedArchitecture === "mesh" ? "#10b981" : "#f43f5e",
                  }}
                >
                  {executedArchitecture === "mesh" ? "● STATUS: DATA MESH AKTIF" : "⚠️ STATUS: MONOLITH BOTTLENECK"}
                </span>
                <strong style={{ fontSize: "14px", color: "var(--ink-heading)" }}>
                  {topologyScenario === "query_risk360" && "Hasil Eksekusi Kueri Risk 360 Eksekutif"}
                  {topologyScenario === "schema_drift" && "Hasil Deteksi Schema Drift & Versioning"}
                  {topologyScenario === "privacy_pdp" && "Hasil Verifikasi Masking UU PDP No. 27/2022"}
                </strong>
              </div>

              {topologyScenario === "privacy_pdp" && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => setPdpUserRole("analyst")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "3px",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono), monospace",
                      border: pdpUserRole === "analyst" ? "1px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: pdpUserRole === "analyst" ? "rgba(96, 165, 250, 0.2)" : "var(--panel)",
                      color: pdpUserRole === "analyst" ? "#60a5fa" : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    Role: Staf Cabang
                  </button>
                  <button
                    onClick={() => setPdpUserRole("auditor")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "3px",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono), monospace",
                      border: pdpUserRole === "auditor" ? "1px solid #10b981" : "1px solid var(--line)",
                      backgroundColor: pdpUserRole === "auditor" ? "rgba(16, 185, 129, 0.2)" : "var(--panel)",
                      color: pdpUserRole === "auditor" ? "#10b981" : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    Role: Auditor OJK
                  </button>
                </div>
              )}
            </div>

            {/* Metric Comparison Counters */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  WAKTU KUERI (LATENCY)
                </span>
                <strong style={{ fontSize: "18px", color: executedArchitecture === "mesh" ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {executedArchitecture === "mesh" ? "420 ms" : "45 Menit 12s"}
                </strong>
              </div>

              <div style={{ padding: "10px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  BEBAN CPU DB OPERASIONAL
                </span>
                <strong style={{ fontSize: "18px", color: executedArchitecture === "mesh" ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {executedArchitecture === "mesh" ? "< 12% (Aman)" : "100.0% (Crash!)"}
                </strong>
              </div>

              <div style={{ padding: "10px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  KESEGARAN DATA (SLA)
                </span>
                <strong style={{ fontSize: "18px", color: executedArchitecture === "mesh" ? "#10b981" : "#f59e0b", fontFamily: "var(--font-mono), monospace" }}>
                  {executedArchitecture === "mesh" ? "T+15 Menit (Live)" : "T+24 Jam (Stale)"}
                </strong>
              </div>

              <div style={{ padding: "10px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  INTEGRITAS SKEMA KONTRAK
                </span>
                <strong style={{ fontSize: "18px", color: executedArchitecture === "mesh" ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {executedArchitecture === "mesh" ? "0 Error (SemVer)" : "14 Crash Rapat"}
                </strong>
              </div>
            </div>

            {/* Narrative Explanation of the Simulation */}
            <div style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--ink)", padding: "12px", backgroundColor: "var(--panel)", borderRadius: "4px", border: "1px solid var(--line)" }}>
              {executedArchitecture === "mesh" ? (
                <div>
                  <strong style={{ color: "#10b981" }}>Analisis Arsitektural Data Mesh (Optimal):</strong>
                  {topologyScenario === "query_risk360" && (
                    <p style={{ margin: "4px 0 0 0" }}>
                      Mesin Trino membaca metadata dari kontrak ODCS, mendorong predikat kueri (filter pushdown) langsung ke port
                      <code> leasing_dp</code>, <code>equipment_dp</code>, dan <code>billing_dp</code>. Hanya agregat ringkas ditarik ke memori RAM,
                      menyelesaikan kalkulasi komite kredit dalam <strong>420 milidetik</strong> tanpa membebani CPU database operasional tambang di Kalimantan.
                    </p>
                  )}
                  {topologyScenario === "schema_drift" && (
                    <p style={{ margin: "4px 0 0 0" }}>
                      Saat tim Core Leasing mengajukan Pull Request perubahan kolom, <strong>ODCS CI/CD Shift-Left Gate</strong> langsung mendeteksi breaking change.
                      Merge ke branch produksi diblokir otomatis. Tim leasing merilis Semantic Versioning v2.0.0 sambil tetap mempertahankan port v1.0.0 selama 90 hari.
                      <strong> Nol dashboard eksekutif yang rusak.</strong>
                    </p>
                  )}
                  {topologyScenario === "privacy_pdp" && (
                    <p style={{ margin: "4px 0 0 0" }}>
                      {pdpUserRole === "analyst" ? (
                        <span>
                          Role Staf Cabang terdeteksi: <strong>Dynamic Row-Level Security</strong> otomatis menyamarkan NIK menjadi
                          <code> 3201****0002</code> dan NPWP menjadi <code>09.***.***.1-012.000</code>. Data mentah tidak pernah bocor ke jaringan,
                          memenuhi kepatuhan 100% UU PDP No. 27/2022 Pasal 16 &amp; 20 (Zero-Leak).
                        </span>
                      ) : (
                        <span>
                          Token Auditor Kepatuhan OJK terverifikasi: NIK asli <code>3201042908880002</code> terbuka, dan
                          <strong> OpenLineage</strong> secara otomatis mencatat jejak kriptografis (Cryptographic Audit Trail) untuk audit kepatuhan Pasal 39 UU PDP.
                        </span>
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <strong style={{ color: "#f43f5e" }}>Analisis Arsitektural Monolith (Anti-Pattern):</strong>
                  {topologyScenario === "query_risk360" && (
                    <p style={{ margin: "4px 0 0 0" }}>
                      Kueri analitik cross-join besar dijalankan langsung ke database operasional IoT tambang. CPU melonjak 100%,
                      mengakibatkan sistem GPS telematika 8,400 excavator gagal mengirimkan sinyal keselamatan kerja, kueri komite timeout setelah 45 menit,
                      dan tim analis harus menunggu antrean tiket data pusat selama 3 minggu.
                    </p>
                  )}
                  {topologyScenario === "schema_drift" && (
                    <p style={{ margin: "4px 0 0 0" }}>
                      Patch database operasional dirilis tanpa kontrak data formal. Nama kolom diubah secara diam-diam.
                      Job ETL tengah malam gagal total, dan pagi harinya 14 dashboard eksekutif crash tepat saat komite kredit sedang rapat persetujuan pembiayaan Rp 25 Miliar.
                    </p>
                  )}
                  {topologyScenario === "privacy_pdp" && (
                    <p style={{ margin: "4px 0 0 0" }}>
                      Data NIK dan nomor HP dikirim mentah tanpa enkripsi level database. Staf cabang dapat menyalin NIK pelanggan secara leluasa,
                      mengekspos perusahaan terhadap ancaman denda administratif OJK dan UU PDP hingga Rp 18 Miliar.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Domain Detail Inspector Card */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>{activeDomainNode.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", color: activeDomainNode.color }}>
                    {activeDomainNode.name} ({activeDomainNode.squad})
                  </h4>
                  <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                    Lead: {activeDomainNode.lead} • Port: <code>{activeDomainNode.port}</code>
                  </span>
                </div>
              </div>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "3px",
                  backgroundColor: "rgba(96, 165, 250, 0.12)",
                  color: "#60a5fa",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                SemVer {activeDomainNode.semVer}
              </span>
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "var(--ink)", lineHeight: 1.5 }}>
              <strong>Bounded Context:</strong> {activeDomainNode.desc}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "16px" }}>
              <div style={{ padding: "8px 12px", backgroundColor: "var(--panel)", borderRadius: "4px", fontSize: "11px" }}>
                <span style={{ color: "var(--muted)", display: "block" }}>SLA KESEGARAN DATA</span>
                <strong style={{ color: "var(--ink-heading)", fontFamily: "var(--font-mono), monospace" }}>{activeDomainNode.slaRefresh}</strong>
              </div>
              <div style={{ padding: "8px 12px", backgroundColor: "var(--panel)", borderRadius: "4px", fontSize: "11px" }}>
                <span style={{ color: "var(--muted)", display: "block" }}>AVAILABILITY PORT</span>
                <strong style={{ color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>{activeDomainNode.slaAvailability}</strong>
              </div>
              <div style={{ padding: "8px 12px", backgroundColor: "var(--panel)", borderRadius: "4px", fontSize: "11px" }}>
                <span style={{ color: "var(--muted)", display: "block" }}>TEKNOLOGI PENYIMPANAN</span>
                <strong style={{ color: "var(--ink-heading)", fontFamily: "var(--font-mono), monospace" }}>{activeDomainNode.tech}</strong>
              </div>
            </div>

            {/* Column Schema Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "var(--font-mono), monospace" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left", color: "var(--muted)" }}>
                    <th style={{ padding: "6px 8px" }}>NAMA KOLOM</th>
                    <th style={{ padding: "6px 8px" }}>TIPE DATA</th>
                    <th style={{ padding: "6px 8px" }}>STATUS PRIVASI</th>
                    <th style={{ padding: "6px 8px" }}>DESKRIPSI ARSITEKTURAL</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDomainNode.columns.map((col) => (
                    <tr key={col.name} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <td style={{ padding: "6px 8px", color: "var(--ink-heading)", fontWeight: 600 }}>{col.name}</td>
                      <td style={{ padding: "6px 8px", color: "#60a5fa" }}>{col.type}</td>
                      <td style={{ padding: "6px 8px" }}>
                        {col.isPII ? (
                          <span style={{ padding: "2px 6px", borderRadius: "2px", backgroundColor: "rgba(244, 63, 94, 0.2)", color: "#f87171" }}>
                            PII (UU PDP Masked)
                          </span>
                        ) : (
                          <span style={{ padding: "2px 6px", borderRadius: "2px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                            Standard Field
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "6px 8px", color: "var(--ink)" }}>{col.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: STUDIO DESAIN ARSITEKTUR & TRADE-OFF SIMULATOR                */}
      {/* ==================================================================== */}
      {activeTab === "blueprint" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
            Sebagai Lead Data Architect PT NusaFinance, ubah 4 keputusan fundamental di bawah ini dan perhatikan bagaimana
            <strong> Lead Time Analitik</strong>, <strong>Kepatuhan UU PDP</strong>, <strong>Kerusakan Skema</strong>, dan <strong>Biaya Cloud TCO</strong> bereaksi secara langsung!
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {/* Decision 1: Data Architecture Paradigm */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                1. PARADIGMA KEPEMILIKAN DATA
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "monolith", label: "Central Data Warehouse Monolith (EDW)", note: "Tim data pusat menangani semua ETL" },
                  { id: "lakehouse", label: "Centralized Lakehouse (S3 / Delta Lake)", note: "Penyimpanan obyek tapi tetap dikelola 1 tim" },
                  { id: "datamesh", label: "Enterprise Data Mesh Otonom (Optimal)", note: "5 domain bisnis merawat data product mandiri" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setParadigm(opt.id as ParadigmChoice)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: paradigm === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: paradigm === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: paradigm === opt.id ? "#60a5fa" : "var(--ink)",
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

            {/* Decision 2: Governance & Schema Enforcement */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                2. PENEGAKAN KONTRAK DATA (GOVERNANCE)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "manual", label: "Dokumentasi Manual Excel / Confluence", note: "Tanpa verifikasi mesin; rawan basi" },
                  { id: "central_team", label: "Review Manual Tim QA Data", note: "Rapat mingguan; menambah antrean kerja" },
                  { id: "computational_ci", label: "Automated ODCS CI/CD Gate (Optimal)", note: "Validasi otomatis saat Pull Request Git" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setGovernance(opt.id as GovernanceChoice)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: governance === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: governance === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: governance === opt.id ? "#60a5fa" : "var(--ink)",
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

            {/* Decision 3: Cross-Domain Query Architecture */}
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
                    onClick={() => setQueryStrategy(opt.id as QueryChoice)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: queryStrategy === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: queryStrategy === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: queryStrategy === opt.id ? "#60a5fa" : "var(--ink)",
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

            {/* Decision 4: Regulatory Privacy (UU PDP) */}
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#60a5fa", marginBottom: "8px" }}>
                4. PERLINDUNGAN PRIVASI NIK (UU PDP)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { id: "unmasked", label: "Data Polos Tanpa Masking (Bahaya)", note: "Pelanggaran hukum UU PDP; ancaman denda" },
                  { id: "frontend_mask", label: "Masking di Frontend / Power BI Saja", note: "Rentan dibobol inspect element / kueri SQL" },
                  { id: "dynamic_rls", label: "Dynamic RLS Masking di Port SQL (Optimal)", note: "Disamarkan di database; hanya terbuka bagi auditor" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPrivacyPolicy(opt.id as PrivacyChoice)}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      borderRadius: "4px",
                      border: privacyPolicy === opt.id ? "2px solid #60a5fa" : "1px solid var(--line)",
                      backgroundColor: privacyPolicy === opt.id ? "rgba(96, 165, 250, 0.12)" : "var(--panel)",
                      color: privacyPolicy === opt.id ? "#60a5fa" : "var(--ink)",
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

          {/* Real-time Telemetry Dashboard Result of the Architecture Decisions */}
          <div
            style={{
              padding: "20px",
              borderRadius: "6px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "#10b981", textTransform: "uppercase", marginBottom: "12px" }}>
              // HASIL TELEMETRI KEPUTUSAN ARSITEKTUR ANDA (REAL-TIME IMPACT)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  LEAD TIME DATA ANALITIK
                </span>
                <strong style={{ fontSize: "18px", color: architectureMetrics.leadTimeColor, fontFamily: "var(--font-mono), monospace" }}>
                  {architectureMetrics.leadTimeText}
                </strong>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  KERUSAKAN SKEMA / BULAN
                </span>
                <strong style={{ fontSize: "18px", color: architectureMetrics.breakageCount === 0 ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {architectureMetrics.breakageCount} Insiden
                </strong>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  KEPATUHAN UU PDP &amp; OJK
                </span>
                <strong style={{ fontSize: "18px", color: architectureMetrics.complianceScore >= 90 ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>
                  {architectureMetrics.complianceScore}% Aman
                </strong>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  BIAYA TCO CLOUD / TAHUN
                </span>
                <strong style={{ fontSize: "18px", color: "var(--ink-heading)", fontFamily: "var(--font-mono), monospace" }}>
                  ${architectureMetrics.annualCost.toLocaleString()}
                </strong>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", display: "block" }}>
                  SKOR KEBUGARAN DATSIS
                </span>
                <strong style={{ fontSize: "18px", color: Number(architectureMetrics.datsisRating) >= 4.5 ? "#10b981" : "#f59e0b", fontFamily: "var(--font-mono), monospace" }}>
                  {architectureMetrics.datsisRating} / 5.0
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: SIMULASI KRISIS & INSIDEN NYATA DATA ARCHITECT                 */}
      {/* ==================================================================== */}
      {activeTab === "crisis" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
            Uji insting kepemimpinan Anda saat menghadapi <strong>Krisis Arsitektur Nyata</strong> di PT NusaFinance.
            Pilih insiden di bawah ini, putuskan tindakan arsitektur terbaik, dan lihat evaluasi dampaknya pada sistem!
          </p>

          {/* Scenario Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {CRISIS_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveCrisisId(sc.id)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "4px",
                  border: activeCrisisId === sc.id ? "2px solid #ef4444" : "1px solid var(--line)",
                  backgroundColor: activeCrisisId === sc.id ? "rgba(239, 68, 68, 0.12)" : "var(--surface)",
                  color: activeCrisisId === sc.id ? "#ef4444" : "var(--ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* Active Crisis Card */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", padding: "3px 8px", borderRadius: "3px", backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", fontWeight: 700 }}>
                TINGKAT BAHAYA: {activeCrisis.severity}
              </span>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                Kategori: {activeCrisis.category}
              </span>
            </div>

            <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "var(--ink-heading)" }}>
              {activeCrisis.title}
            </h4>

            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--ink)", lineHeight: 1.6 }}>
              {activeCrisis.situation}
            </p>

            <div style={{ padding: "10px 14px", backgroundColor: "rgba(245, 158, 11, 0.08)", borderLeft: "3px solid #f59e0b", fontSize: "12px", color: "var(--ink)", marginBottom: "20px" }}>
              <strong>Dampak Bisnis Langsung:</strong> {activeCrisis.businessImpact}
            </div>

            {/* Decision Options */}
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", marginBottom: "10px" }}>
              // PILIH KEPUTUSAN ARSITEKTURAL ANDA:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {activeCrisis.options.map((opt) => {
                const isSelected = crisisAnswers[activeCrisis.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setCrisisAnswers((prev) => ({ ...prev, [activeCrisis.id]: opt.id }))}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "6px",
                      border: isSelected ? (opt.isOptimal ? "2px solid #10b981" : "2px solid #ef4444") : "1px solid var(--line)",
                      backgroundColor: isSelected ? (opt.isOptimal ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)") : "var(--panel)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "13px", color: isSelected ? (opt.isOptimal ? "#10b981" : "#f87171") : "var(--ink-heading)" }}>
                        {opt.label}
                      </strong>
                      <span style={{ fontSize: "12px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                        {isSelected ? "Terpilih ✓" : "Pilih Solusi"}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "var(--ink)", lineHeight: 1.5 }}>
                      {opt.description}
                    </p>

                    {isSelected && (
                      <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--line)", fontSize: "12px" }}>
                        <div style={{ color: opt.isOptimal ? "#34d399" : "#f87171", fontWeight: 600, marginBottom: "4px" }}>
                          {opt.feedback}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                          <span>Pemulihan: <strong>{opt.leadTimeDelta}</strong></span>
                          <span>Biaya: <strong>{opt.costImpact}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: INTERACTIVE CONTRACT BUILDER (ODCS YAML)                      */}
      {/* ==================================================================== */}
      {activeTab === "builder" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
            Rakit spesifikasi <strong>Open Data Contract Standard (ODCS)</strong> secara interaktif untuk domain data Anda.
            Perhatikan bagaimana file YAML tergenerate otomatis dan uji validasinya di pipeline CI/CD!
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* Input Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                  NAMA DATA PRODUCT
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--ink)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                  TIM PEMILIK DOMAIN (OWNER SQUAD)
                </label>
                <input
                  type="text"
                  value={domainOwner}
                  onChange={(e) => setDomainOwner(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--ink)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                  SLA KESEGARAN DATA (MENIT)
                </label>
                <select
                  value={slaFreshness}
                  onChange={(e) => setSlaFreshness(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", color: "var(--ink)", fontSize: "13px" }}
                >
                  <option value="15">T+15 Menit (Near Real-time Sensor IoT)</option>
                  <option value="60">T+60 Menit (Hourly Kontrak Leasing)</option>
                  <option value="1440">T+24 Jam (Batch Harian Underwriting)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink)", cursor: "pointer", marginTop: "8px" }}>
                  <input
                    type="checkbox"
                    checked={includeNikMask}
                    onChange={(e) => setIncludeNikMask(e.target.checked)}
                    style={{ accentColor: "#10b981" }}
                  />
                  <span>Terapkan Dynamic RLS Masking NIK (UU PDP No. 27/2022)</span>
                </label>
              </div>

              <button
                onClick={() => setContractValidationRan(true)}
                style={{
                  marginTop: "12px",
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
                ▶ Jalankan Validasi ODCS di GitHub Actions CI
              </button>

              {contractValidationRan && (
                <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "4px" }}>
                  <strong style={{ color: "#10b981", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    ✓ CI PIPELINE PASS: KONTRAK VALID!
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "var(--ink)", lineHeight: 1.5 }}>
                    <li>Sintaks ODCS v2.1.0 terverifikasi valid terhadap skema JSON.</li>
                    <li>{includeNikMask ? "UU PDP Regex Guardrail: PASS (NIK terlindungi)" : "Peringatan: Kolom NIK terbuka polos!"}</li>
                    <li>Backward Compatibility Check: PASS (Zero breaking changes).</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Generated YAML Preview */}
            <div style={{ backgroundColor: "#0b0f19", border: "1px solid var(--line)", borderRadius: "6px", padding: "16px", overflowX: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "6px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa" }}>
                  datacontract.yaml
                </span>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                  ODCS v2.1.0
                </span>
              </div>
              <pre style={{ margin: 0, fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#e2e8f0", lineHeight: 1.4 }}>
{`version: 2.1.0
kind: DataContract
metadata:
  domain: "${domainOwner}"
  dataProduct: "${productName}"
  classification: Internal Restricted

dataset:
  name: ${domainOwner.toLowerCase().replace(/\\s+/g, "_")}.output_port
  refreshInterval: T+${slaFreshness}m
  sla:
    freshnessMinutes: ${slaFreshness}
    availabilityPct: 99.85

schema:
  - name: contract_id
    type: string
    primaryKey: true
    tests: [unique, not_null]
  - name: principal_idr
    type: numeric
    tests: [{greater_than: 10000000}]
  - name: nik_citizen
    type: string
    classification: ${includeNikMask ? "pii_masked_uu_pdp" : "confidential_raw"}
    tests: [not_null]

governance:
  complianceFrameworks:
    - INDONESIA_UU_PDP_NO_27_2022
    - OJK_POJK_35_2018`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: SCORECARD KEBUGARAN ARSITEK & TCO EVALUATION                  */}
      {/* ==================================================================== */}
      {activeTab === "scorecard" && (
        <div style={{ padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {/* Left Card: Score Summary */}
            <div style={{ padding: "20px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
                // HASIL AUDIT KOMPETENSI ARSITEK
              </div>
              <h4 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
                Skor Kebugaran Sistem: {architectureMetrics.compositeScore} / 100
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                  <span>Kecepatan Bisnis (Lead Time):</span>
                  <strong style={{ color: architectureMetrics.leadTimeColor, fontFamily: "var(--font-mono), monospace" }}>{architectureMetrics.leadTimeText}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                  <span>Ketahanan Skema (Zero Drift):</span>
                  <strong style={{ color: architectureMetrics.breakageCount === 0 ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>{architectureMetrics.breakageCount} Error</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                  <span>Kepatuhan Regulasi Indonesia:</span>
                  <strong style={{ color: architectureMetrics.complianceScore >= 90 ? "#10b981" : "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>{architectureMetrics.complianceScore}% (UU PDP)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "6px" }}>
                  <span>TCO Penghematan Biaya:</span>
                  <strong style={{ color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>Hemat $66,000 / tahun</strong>
                </div>
              </div>

              <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "4px" }}>
                <strong style={{ color: "#10b981", display: "block", fontSize: "12px", marginBottom: "4px" }}>
                  Catatan Penguji Teknis (Evaluator Verdict):
                </strong>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--ink)", lineHeight: 1.5 }}>
                  Keputusan arsitektur Anda berhasil membebaskan PT NusaFinance dari belenggu bottleneck tim data monolitik,
                  menjaga integritas data komputasional via CI/CD, dan melindungi perusahaan dari ancaman denda pidana UU PDP No. 27/2022.
                </p>
              </div>
            </div>

            {/* Right Card: TCO Comparison Visual Bar Chart */}
            <div style={{ padding: "20px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
                // GRAFIK EFISIENSI FINANSIAL TCO (SEBELUM VS SESUDAH)
              </div>
              <h4 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "var(--ink-heading)" }}>
                Total Cost of Ownership Infrastruktur Analitik
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span>Biaya Monolith Lama (ETL Duplikasi &amp; Server Terpusat)</span>
                    <strong style={{ color: "#f43f5e", fontFamily: "var(--font-mono), monospace" }}>$184,000 / thn</strong>
                  </div>
                  <div style={{ width: "100%", height: "12px", backgroundColor: "var(--panel)", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "#f43f5e" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span>Biaya Enterprise Data Mesh (Trino In-Memory &amp; Port Bersama)</span>
                    <strong style={{ color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>$118,000 / thn</strong>
                  </div>
                  <div style={{ width: "100%", height: "12px", backgroundColor: "var(--panel)", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{ width: "64.1%", height: "100%", backgroundColor: "#10b981" }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "24px", padding: "14px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px", textAlign: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>PENGHEMATAN TAHUNAN (ANNUAL SAVINGS)</span>
                <strong style={{ fontSize: "24px", color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>
                  $66,000 / Tahun (-35.9%)
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
