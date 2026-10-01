"use client";

import React, { useState, useMemo } from "react";

// ============================================================================
// DATA DOMAIN TOPOLOGY & DATSIS SCORES
// ============================================================================
interface DomainNode {
  id: string;
  name: string;
  domainName: string;
  shortName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  lead: string;
  boundedContext: string;
  outputPort: string;
  slaRefresh: string;
  slaAvailability: string;
  storage: string;
  datsis: {
    D: number; // Discoverable
    A: number; // Addressable
    T: number; // Trustworthy
    S: number; // Self-describing
    I: number; // Interoperable
    Sec: number; // Secure
  };
  sampleData: {
    title: string;
    metrics: { label: string; value: string }[];
  };
  analogy: string;
}

const DOMAIN_NODES: DomainNode[] = [
  {
    id: "leasing",
    name: "Active Lease Portfolio",
    domainName: "Core Leasing Domain",
    shortName: "Leasing",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
    borderColor: "#3b82f6",
    icon: "📄",
    lead: "Budi Santoso (Domain Lead)",
    boundedContext: "Siklus hidup kontrak pembiayaan, tenor, plafon pokok utang, dan suku bunga.",
    outputPort: "leasing_dp.active_portfolio",
    slaRefresh: "T+60 Menit (Per Jam)",
    slaAvailability: "99.85%",
    storage: "PostgreSQL ANSI SQL / Iceberg",
    datsis: { D: 4.8, A: 4.9, T: 4.7, S: 4.8, I: 4.6, Sec: 4.7 },
    sampleData: {
      title: "Data Port: Kontrak Pembiayaan Aktif",
      metrics: [
        { label: "Total Kontrak Aktif", value: "14,800 Unit" },
        { label: "Rata-rata Tenor", value: "36 Bulan" },
        { label: "Bunga Efektif", value: "10.75% / thn" },
        { label: "Format Port", value: "ANSI SQL View" },
      ],
    },
    analogy: "Seperti Bagian Akta Jual-Beli: Mencatat siapa yang menyewa alat, berapa cicilannya, dan kapan jatuh temponya.",
  },
  {
    id: "equipment",
    name: "Fleet Telematics IoT Summary",
    domainName: "Asset Equipment Domain",
    shortName: "Equipment IoT",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
    borderColor: "#f59e0b",
    icon: "🚜",
    lead: "Hendro Wijaya (IoT Squad Lead)",
    boundedContext: "Sensor mesin tambang/kebun, jam kerja engine harian, geofencing GPS, dan status fisik agunan.",
    outputPort: "equipment_dp.telematics_summary",
    slaRefresh: "T+15 Menit (Near Real-time)",
    slaAvailability: "99.90%",
    storage: "TimescaleDB / S3 Parquet",
    datsis: { D: 4.7, A: 4.8, T: 4.6, S: 4.6, I: 4.5, Sec: 4.5 },
    sampleData: {
      title: "Data Port: Telematika IoT Alat Berat",
      metrics: [
        { label: "Mesin Terhubung IoT", value: "8,400 Unit" },
        { label: "Jam Kerja Rata-rata", value: "8.2 jam/hari" },
        { label: "Status Sinyal GPS", value: "97.4% Online" },
        { label: "Kondisi Agunan", value: "88% Optimal" },
      ],
    },
    analogy: "Seperti Dokter & GPS Mesin: Memantau apakah excavator masih bekerja di tambang batubara atau rusak/dibawa kabur.",
  },
  {
    id: "risk",
    name: "Credit Underwriting & Risk Scores",
    domainName: "Credit Risk Domain",
    shortName: "Credit Risk",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.12)",
    borderColor: "#a855f7",
    icon: "⚖️",
    lead: "Citra Dewi (Head of Risk Analytics)",
    boundedContext: "Model machine learning probabilitas gagal bayar (PD), skor kredit debitur, dan rasio DSCR.",
    outputPort: "risk_dp.underwriting_scores",
    slaRefresh: "T+24 Jam (Batch Harian)",
    slaAvailability: "99.95%",
    storage: "Trino / PostgreSQL",
    datsis: { D: 4.9, A: 4.8, T: 4.9, S: 4.7, I: 4.7, Sec: 4.8 },
    sampleData: {
      title: "Data Port: Penilaian Risiko Kredit",
      metrics: [
        { label: "Rata-rata Skor Kredit", value: "710 / 850" },
        { label: "Expected PD Rate", value: "3.4%" },
        { label: "Peringkat Risiko", value: "Tier A / Low" },
        { label: "Rasio DSCR Rata-rata", value: "1.62x" },
      ],
    },
    analogy: "Seperti Penilai Kesehatan Finansial: Menghitung seberapa besar kemungkinan pengusaha tambang gagal melunasi utangnya.",
  },
  {
    id: "crm",
    name: "Borrower KYC Master (UU PDP)",
    domainName: "Customer CRM Domain",
    shortName: "CRM & KYC",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "#10b981",
    icon: "🛡️",
    lead: "Agus Pratama (KYC Squad)",
    boundedContext: "Identitas debitur dan penjamin, NIK warga, NPWP perusahaan, verifikasi Dukcapil, dan masking privasi.",
    outputPort: "crm_dp.borrower_directory",
    slaRefresh: "T+5 Menit (Streaming Sync)",
    slaAvailability: "99.92%",
    storage: "PostgreSQL Dynamic Masked View",
    datsis: { D: 4.9, A: 4.8, T: 4.8, S: 4.9, I: 4.7, Sec: 5.0 },
    sampleData: {
      title: "Data Port: Direktori Debitur Masked UU PDP",
      metrics: [
        { label: "Perlindungan NIK", value: "100% Masked" },
        { label: "Format Masking", value: "3201****0004" },
        { label: "Kepatuhan UU PDP", value: "Pasal 16 & 20" },
        { label: "Audit Logging", value: "Aktif (Pasal 39)" },
      ],
    },
    analogy: "Seperti Brankas Identitas: Menjaga rahasia KTP debitur agar tidak bocor dan melanggar hukum perlindungan data.",
  },
  {
    id: "finance",
    name: "Collections & Arrears Ledger",
    domainName: "Billing Treasury Domain",
    shortName: "Billing & Arrears",
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.12)",
    borderColor: "#06b6d4",
    icon: "💰",
    lead: "Maya Indah (Treasury Lead)",
    boundedContext: "Mutasi virtual account perbankan, rekonsiliasi pembayaran cicilan, dan kalkulasi Days Past Due (DPD).",
    outputPort: "finance_dp.payment_performance",
    slaRefresh: "T+1 Menit (Real-time Ledger)",
    slaAvailability: "99.98%",
    storage: "PostgreSQL ANSI SQL Ledger",
    datsis: { D: 4.8, A: 4.9, T: 4.9, S: 4.7, I: 4.6, Sec: 4.7 },
    sampleData: {
      title: "Data Port: Buku Kas & Pelunasan Cicilan",
      metrics: [
        { label: "Tingkat Ketepatan Bayar", value: "93.4%" },
        { label: "Rata-rata Arrears DPD", value: "4.8 Hari" },
        { label: "Rekonsiliasi Bank", value: "Auto-Match VA" },
        { label: "Bucket Terbanyak", value: "Current / On-time" },
      ],
    },
    analogy: "Seperti Kasir Real-time: Mencatat uang cicilan yang masuk dari bank dan mendeteksi detik itu juga jika ada yang menunggak.",
  },
];

// ============================================================================
// SIMULATED INTERVIEW DRILL CARDS
// ============================================================================
interface InterviewQuestion {
  id: string;
  category: "Framework & Strategi" | "Tata Kelola & Hukum" | "Engineering & Pipeline" | "Organisasi & Budaya";
  question: string;
  tag: string;
  interviewerIntent: string;
  quickTakeaway: string;
  fullAnswer: string;
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q1",
    category: "Framework & Strategi",
    tag: "Kriteria Adopsi",
    question: "Kapan perusahaan SEBAIKNYA TIDAK mengadopsi Data Mesh? Apa prasyarat minimalnya?",
    interviewerIntent: "Menguji apakah kandidat bersikap realistis & kritis, bukan sekadar latah mengikuti tren teknologi.",
    quickTakeaway: "Jangan adopsi jika domain < 3, tim engineering < 30 orang, atau belum punya budaya Git/CI dasar.",
    fullAnswer: "Data Mesh bukan obat untuk semua masalah. Perusahaan sebaiknya TIDAK mengadopsinya jika: (1) Hanya memiliki 1–2 domain bisnis sederhana dan tim engineering di bawah 30 orang. Pada skala ini, modular Data Warehouse (dbt + BigQuery/Snowflake) jauh lebih murah dan cepat. (2) Kedewasaan engineering tim masih rendah (belum menerapkan Git, CI/CD, atau automated test). Prasyarat adopsi: minimal ada 3–5 domain otonom, antrean tim data pusat >3 minggu, dan ada komitmen manajemen mendanai data engineer di tim bisnis.",
  },
  {
    id: "q2",
    category: "Tata Kelola & Hukum",
    tag: "SemVer & Kontrak",
    question: "Bagaimana cara menangani perubahan skema data (Breaking Change) dari Domain A yang dibutuhkan Domain B?",
    interviewerIntent: "Menguji pemahaman arsitektur terdistribusi dan disiplin semantic versioning di dunia nyata.",
    quickTakeaway: "Terapkan SemVer pada port output. Jika breaking change, wajib sediakan dual-port (v1 dan v2) selama 90 hari.",
    fullAnswer: "Terapkan Semantic Versioning (MAJOR.MINOR.PATCH) pada port output. Penambahan kolom baru (MINOR) bisa langsung dirilis karena backward-compatible. Jika terjadi perubahan fatal (MAJOR, misalnya hapus kolom), Domain A wajib menyediakan dua port bersamaan (v1 dan v2) selama masa transisi 90 hari. Telemetry memantau kueri port v1; setelah trafiknya nol, port v1 dipensiunkan dengan aman.",
  },
  {
    id: "q3",
    category: "Engineering & Pipeline",
    tag: "Kueri Federasi",
    question: "Bagaimana Data Mesh menggabungkan data lintas domain tanpa bikin Monolith baru di mesin kuerinya?",
    interviewerIntent: "Menguji pemahaman antara kueri federasi in-memory (Trino) vs consumer-aligned data product.",
    quickTakeaway: "Gunakan Trino untuk eksplorasi ad-hoc di RAM, dan bangun Higher-Order Data Product untuk agregasi rutin.",
    fullAnswer: "Bagi dua skenario: (1) Untuk eksplorasi ad-hoc analis, gunakan mesin federasi in-memory seperti Trino yang mendorong filter ke masing-masing port tanpa mengopi data ke penyimpanan terpusat. (2) Untuk analitik rutin dan krusial (seperti Risk 360), buat 'Consumer-Aligned Data Product' resmi yang mematerialisasi data join terjadwal dengan pemilik yang jelas (Tim Risk).",
  },
  {
    id: "q4",
    category: "Tata Kelola & Hukum",
    tag: "UU PDP & OJK",
    question: "Bagaimana menegakkan UU PDP No. 27/2022 dan regulasi OJK di 5 tim domain yang bekerja mandiri?",
    interviewerIntent: "Memastikan kandidat paham implementasi teknis hukum privasi data perbankan/fintech di Indonesia.",
    quickTakeaway: "Shift-Left regex scanner di CI/CD Git, Dynamic RLS Masking di port SQL, dan audit log OpenLineage.",
    fullAnswer: "Menggunakan Federated Computational Governance: (1) Scanner Regex di GitHub Actions otomatis mendeteksi pola 16 digit NIK polos pada sampel data Pull Request. (2) Dynamic Row-Level Security menyamarkan NIK ('3201****0004') secara default dan hanya membuka data asli bagi auditor berizin. (3) OpenLineage mencatat jejak audit kriptografis setiap kali port dibaca untuk memenuhi Pasal 39 UU PDP dan POJK 35.",
  },
  {
    id: "q5",
    category: "Framework & Strategi",
    tag: "Lakehouse vs Mesh",
    question: "Apa perbedaan mendasar antara Data Lakehouse dan Data Mesh?",
    interviewerIntent: "Menilai kejelasan pemahaman antara arsitektur teknologi (Stack) vs model operasional organisasi.",
    quickTakeaway: "Lakehouse = Teknologi penyimpanan & komputasi; Data Mesh = Model operasional kepemilikan data terdesentralisasi.",
    fullAnswer: "Data Lakehouse adalah tumpukan teknologi (object storage S3 + format tabel Iceberg/Delta Lake + compute Spark/Trino). Data Mesh adalah model operasi sosio-teknikal (Domain Ownership, Data as a Product, Federated Governance). Faktanya, Data Mesh bisa dan biasa dibangun MENGGUNAKAN teknologi Lakehouse sebagai media penyimpanannya!",
  },
  {
    id: "q6",
    category: "Organisasi & Budaya",
    tag: "Insentif Tim",
    question: "Bagaimana memotivasi tim pengembang domain agar mau merawat datanya sebagai produk dan bukan beban?",
    interviewerIntent: "Menguji kemampuan kepemimpinan dan manajemen perubahan budaya engineering.",
    quickTakeaway: "Insentif anggaran internal (chargeback), KPI ketersediaan data di OKR manajer, dan template platform <30 menit.",
    fullAnswer: "Melalui tiga strategi: (1) Internal Chargeback: tim domain yang data product-nya sering dipakai departemen lain mendapat alokasi anggaran internal. (2) Masukkan uptime dan kepatuhan SLA data product ke dalam KPI triwulanan manajer domain. (3) Sediakan template repositori sekali klik dari tim platform agar membuat data product baru hanya butuh waktu <30 menit.",
  },
  {
    id: "q7",
    category: "Framework & Strategi",
    tag: "Anti-Silo",
    question: "Bagaimana mencegah 'Data Silo 2.0' di mana tim domain menyimpan datanya sendiri dan pelit berbagi?",
    interviewerIntent: "Menilai mekanisme pengawasan terpusat agar desentralisasi tidak menjadi kekacauan.",
    quickTakeaway: "Katalog data pusat wajib, dewan tata kelola dwimingguan, dan larangan format proprietary tertutup.",
    fullAnswer: "Cegah dengan 3 kontrol: (1) Registrasi Katalog Wajib: dataset yang tidak terdaftar kontraknya dilarang dialirkan di jaringan perusahaan. (2) Dewan Tata Kelola Dwimingguan untuk menyelaraskan kebutuhan baru agar tidak ada pembuatan pipeline duplikat. (3) Kewajiban protokol terbuka (ANSI SQL dan Apache Iceberg) sehingga tidak ada domain yang memakai format tertutup.",
  },
  {
    id: "q8",
    category: "Engineering & Pipeline",
    tag: "CI/CD Gate",
    question: "Jelaskan alur teknis validasi Data Contract otomatis di pipeline CI/CD GitHub Actions.",
    interviewerIntent: "Menguji pemahaman shift-left testing dan data contract engineering konkret.",
    quickTakeaway: "4 Gerbang: Validasi sintaks YAML -> Cek breaking change Git -> Tes Docker database sementara -> Uji Great Expectations & Regex NIK.",
    fullAnswer: "Pipeline kami menjalankan 4 tahap: (1) Linter sintaks ODCS YAML terhadap JSON schema standar. (2) Pemeriksa kompatibilitas Git untuk mendeteksi kolom yang terhapus atau berubah tipe. (3) Menyalakan database PostgreSQL sementara di Docker berisi data tiruan. (4) Menjalankan suite pengujian Great Expectations dan scanner regex kebocoran NIK 16 digit. Jika ada 1 tes gagal, Pull Request otomatis diblokir.",
  },
  {
    id: "q9",
    category: "Engineering & Pipeline",
    tag: "Self-Serve Platform",
    question: "Bagaimana Self-Serve Data Platform mengurangi beban kognitif developer domain?",
    interviewerIntent: "Memastikan kandidat paham konsep platform-as-a-product untuk memberdayakan software engineer.",
    quickTakeaway: "Menyediakan template repositori siap pakai, provisioning izin database otomatis, dan dasbor Grafana bawaan.",
    fullAnswer: "Tim platform memperlakukan developer domain sebagai pelanggan utama. Platform mengabstraksi kerumitan distributed system dengan menyediakan template Cookiecutter siap pakai, otomatisasi hak akses database berdasarkan file kontrak, serta pemantauan SLA otomatis di Grafana tanpa perlu developer domain menulis kodingan monitoring dari nol.",
  },
  {
    id: "q10",
    category: "Organisasi & Budaya",
    tag: "ROI & Metrik",
    question: "Bagaimana cara membuktikan Return on Investment (ROI) Data Mesh kepada jajaran direksi (C-Level)?",
    interviewerIntent: "Menguji kemampuan komunikasi nilai bisnis arsitektur kepada eksekutif non-teknis.",
    quickTakeaway: "Tunjukkan lead time terpangkas dari minggu ke menit, penghematan TCO komputasi (\$66k/thn), dan skor DATSIS meningkat.",
    fullAnswer: "Ukur melalui 3 angka nyata: (1) Kecepatan Bisnis: memangkas waktu tunggu data analitik dari 3–6 minggu menjadi <15 menit sehingga direksi bisa mengambil keputusan kredit saat itu juga. (2) Penghematan Biaya: penurunan TCO infrastruktur cloud sebesar 35.9% (\$66,000/tahun) dari penghapusan pipeline ganda. (3) Kebugaran Arsitektur: kenaikan skor DATSIS dari 2.15 ke 4.67 / 5.00.",
  },
];

export function DataMeshVisualMasterclass() {
  // Navigation / View Tabs
  const [activeView, setActiveView] = useState<"visualGuide" | "topology" | "charts" | "governance" | "interview">("visualGuide");

  // Interactive Conway's Law Slider State
  const [domainCount, setDomainCount] = useState<number>(5);

  // Selected Domain Node for Topology Lab
  const [selectedDomainId, setSelectedDomainId] = useState<string>("leasing");
  const activeDomain = useMemo(
    () => DOMAIN_NODES.find((d) => d.id === selectedDomainId) ?? DOMAIN_NODES[0],
    [selectedDomainId]
  );

  // CI/CD Simulator State
  const [simulatedScenario, setSimulatedScenario] = useState<"pass" | "drift" | "leak">("pass");

  // Privacy Role Toggle for UU PDP Inspector
  const [isAuditorView, setIsAuditorView] = useState<boolean>(false);

  // Interview Questions Checklist & Expansion
  const [expandedQId, setExpandedQId] = useState<string>("q1");
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set(["q1"]));

  const toggleQuestionComplete = (id: string) => {
    setCompletedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Conway's Law Math: C = N*(N-1)/2
  const monolithCoordination = useMemo(() => {
    return Math.round((domainCount * (domainCount - 1)) / 2 + domainCount * 3);
  }, [domainCount]);

  const meshCoordination = useMemo(() => {
    return domainCount * 2; // Linear standardized contract boundary
  }, [domainCount]);

  // Radar Chart Calculations for DATSIS
  const radarPoints = useMemo(() => {
    const datsis = activeDomain.datsis;
    const dimensions = [
      { key: "D", val: datsis.D, angle: 0 },
      { key: "A", val: datsis.A, angle: 60 },
      { key: "T", val: datsis.T, angle: 120 },
      { key: "S", val: datsis.S, angle: 180 },
      { key: "I", val: datsis.I, angle: 240 },
      { key: "Sec", val: datsis.Sec, angle: 300 },
    ];
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 90;

    return dimensions.map((dim) => {
      const rad = ((dim.angle - 90) * Math.PI) / 180;
      const radius = (dim.val / 5.0) * maxRadius;
      const x = centerX + radius * Math.cos(rad);
      const y = centerY + radius * Math.sin(rad);
      return { x, y, labelX: centerX + (maxRadius + 16) * Math.cos(rad), labelY: centerY + (maxRadius + 16) * Math.sin(rad), ...dim };
    });
  }, [activeDomain]);

  const radarPolygonSvg = useMemo(() => {
    return radarPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  }, [radarPoints]);

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "inherit",
        color: "var(--ink)",
      }}
    >
      {/* ==================================================================== */}
      {/* HEADER & VIEW MODE NAVIGATION BAR                                    */}
      {/* ==================================================================== */}
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: "6px",
          backgroundColor: "var(--panel)",
          marginBottom: "32px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
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
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--accent, #60a5fa)",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "4px",
              }}
            >
              // NEXT.JS INTERACTIVE DATA ARCHITECT MASTERCLASS
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--ink-heading)",
              }}
            >
              Enterprise Data Mesh Visual Handbook
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
            }}
          >
            <span style={{ padding: "4px 8px", borderRadius: "3px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontWeight: 600 }}>
              ● 100% VISUAL MODE
            </span>
            <span style={{ padding: "4px 8px", borderRadius: "3px", backgroundColor: "rgba(96, 165, 250, 0.15)", color: "#60a5fa", fontWeight: 600 }}>
              PT NUSAFINANCE CASE
            </span>
          </div>
        </div>

        {/* Visual View Mode Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--line)",
            backgroundColor: "var(--surface-secondary)",
            overflowX: "auto",
          }}
        >
          {[
            { id: "visualGuide", label: "🧭 1. Panduan Bergambar & Analogi", icon: "🧭" },
            { id: "topology", label: "🚜 2. Peta 5 Domain & Radar DATSIS", icon: "🚜" },
            { id: "charts", label: "📊 3. Grafik Analitik & Conway's Curve", icon: "📊" },
            { id: "governance", label: "🛡️ 4. Simulator CI & UU PDP", icon: "🛡️" },
            { id: "interview", label: "🎓 5. Bank Soal Wawancara (10 Q&A)", icon: "🎓" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              style={{
                padding: "14px 20px",
                border: "none",
                borderBottom: activeView === tab.id ? "3px solid var(--accent, #60a5fa)" : "3px solid transparent",
                backgroundColor: activeView === tab.id ? "var(--panel)" : "transparent",
                color: activeView === tab.id ? "var(--ink-heading)" : "var(--muted)",
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
      </div>

      {/* ==================================================================== */}
      {/* VIEW 1: PANDUAN BERGAMBAR & ANALOGI KONKRET DUNIA NYATA              */}
      {/* ==================================================================== */}
      {activeView === "visualGuide" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "40px" }}>
          {/* Infografis Perbandingan Visual: Dapur Monolith vs Food Court Data Mesh */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
              // VISUAL INFOGRAPHIC: MEMAHAMI MENGAPA DATA MESH DIBUTUHKAN
            </div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
              Analogi Dunia Nyata: Dapur Restoran Terpusat vs Food Court Modern
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
                marginTop: "16px",
              }}
            >
              {/* Card Monolith */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(244, 63, 94, 0.05)",
                  border: "1px solid rgba(244, 63, 94, 0.25)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px" }}>🏢</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#f43f5e" }}>Tradisional: Data Warehouse Terpusat</h4>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>Analogi: 1 Dapur Terpusat &amp; 3 Chef Kewalahan</span>
                  </div>
                </div>

                {/* Visual SVG Diagram Monolith */}
                <svg viewBox="0 0 320 130" style={{ width: "100%", height: "130px", backgroundColor: "#0c1117", borderRadius: "4px", padding: "8px" }}>
                  {/* Sources */}
                  <rect x="10" y="15" width="70" height="25" rx="3" fill="#1f2937" stroke="#4b5563" />
                  <text x="45" y="32" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">Leasing ERP</text>

                  <rect x="10" y="52" width="70" height="25" rx="3" fill="#1f2937" stroke="#4b5563" />
                  <text x="45" y="69" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">IoT Mesin</text>

                  <rect x="10" y="90" width="70" height="25" rx="3" fill="#1f2937" stroke="#4b5563" />
                  <text x="45" y="107" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">Billing VA</text>

                  {/* Bottleneck Center */}
                  <line x1="80" y1="27" x2="135" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="80" y1="65" x2="135" y2="65" stroke="#ef4444" strokeWidth="1.5" />
                  <line x1="80" y1="102" x2="135" y2="65" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />

                  <rect x="135" y="35" width="80" height="60" rx="4" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="175" y="58" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TIM DATA</text>
                  <text x="175" y="72" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PUSAT ⚠️</text>
                  <text x="175" y="85" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">(BOTTLENECK)</text>

                  {/* Consumers */}
                  <line x1="215" y1="65" x2="250" y2="65" stroke="#6b7280" strokeWidth="1.5" />
                  <rect x="250" y="48" width="60" height="34" rx="3" fill="#1f2937" stroke="#4b5563" />
                  <text x="280" y="65" fill="#d1d5db" fontSize="9" textAnchor="middle" fontFamily="monospace">Risk 360</text>
                  <text x="280" y="76" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="monospace">Lama: 4 Mgg</text>
                </svg>

                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", lineHeight: 1.6, color: "var(--ink)" }}>
                  <li><strong>Kelelahan Tim Pusat:</strong> 3 data engineer harus memahami ratusan tabel asing dari 5 divisi berbeda.</li>
                  <li><strong>Silent Schema Breakage:</strong> Developer aplikasi mengubah nama kolom tanpa info, dashboard eksekutif langsung rusak.</li>
                  <li><strong>Waktu Tunggu Parah:</strong> Permintaan laporan memakan waktu <strong>3 hingga 6 minggu</strong>.</li>
                </ul>
              </div>

              {/* Card Data Mesh */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px" }}>🌐</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#10b981" }}>Modern: Enterprise Data Mesh</h4>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>Analogi: Food Court Mandiri Berstandar Bersama</span>
                  </div>
                </div>

                {/* Visual SVG Diagram Data Mesh */}
                <svg viewBox="0 0 320 130" style={{ width: "100%", height: "130px", backgroundColor: "#0c1117", borderRadius: "4px", padding: "8px" }}>
                  {/* Autonomous Nodes */}
                  <rect x="10" y="15" width="85" height="28" rx="3" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" />
                  <text x="52" y="32" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Leasing DP 📦</text>

                  <rect x="10" y="52" width="85" height="28" rx="3" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" />
                  <text x="52" y="69" fill="#fcd34d" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">IoT Fleet DP 📦</text>

                  <rect x="10" y="90" width="85" height="28" rx="3" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" />
                  <text x="52" y="107" fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Billing DP 📦</text>

                  {/* Direct Standardized Ports to Federation */}
                  <line x1="95" y1="29" x2="170" y2="65" stroke="#3b82f6" strokeWidth="1.5" />
                  <line x1="95" y1="66" x2="170" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="95" y1="104" x2="170" y2="65" stroke="#06b6d4" strokeWidth="1.5" />

                  {/* Federated In-Memory Hub */}
                  <rect x="170" y="42" width="65" height="46" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
                  <text x="202" y="62" fill="#6ee7b7" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TRINO</text>
                  <text x="202" y="75" fill="#6ee7b7" fontSize="8" textAnchor="middle" fontFamily="monospace">IN-MEMORY</text>

                  {/* Downstream */}
                  <line x1="235" y1="65" x2="260" y2="65" stroke="#10b981" strokeWidth="1.5" />
                  <rect x="260" y="48" width="55" height="34" rx="3" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                  <text x="287" y="64" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Risk 360</text>
                  <text x="287" y="76" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">&lt;15 Menit ⚡</text>
                </svg>

                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", lineHeight: 1.6, color: "var(--ink)" }}>
                  <li><strong>Kepemilikan Domain:</strong> Tim pembuat data merawat port analitiknya sendiri dengan bangga.</li>
                  <li><strong>Kontrak Data CI:</strong> Skema diuji otomatis pada Pull Request Git; tidak ada lagi error mendadak.</li>
                  <li><strong>Kueri Sub-Detik:</strong> Laporan Risk 360 selesai dalam <strong>kurang dari 15 menit</strong> via kueri Trino.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Pilar Data Mesh Visual Cards */}
          <div>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
              // 4 PILAR FUNDAMENTAL ZHAMAK DEHGHANI
            </div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
              Pilar Penopang Ekosistem Data Terdesentralisasi
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {[
                {
                  num: "01",
                  title: "Domain Ownership",
                  sub: "Kepemilikan Tim Bisnis",
                  color: "#3b82f6",
                  icon: "🏛️",
                  desc: "Data analitik dirawat oleh tim yang paling paham konteks bisnisnya (misal: Tim Leasing merawat data kontrak pembiayaan).",
                },
                {
                  num: "02",
                  title: "Data as a Product",
                  sub: "Data adalah Produk",
                  color: "#10b981",
                  icon: "📦",
                  desc: "Dataset bukan dump tabel mentah, melainkan produk dengan dokumentasi, SLA kesegaran, dan evaluasi kepuasan pengguna (DATSIS).",
                },
                {
                  num: "03",
                  title: "Self-Serve Platform",
                  sub: "Infrastruktur Mandiri",
                  color: "#f59e0b",
                  icon: "⚙️",
                  desc: "Tim platform menyediakan template otomatis (Docker, Helm, CI/CD) sehingga tim domain bisa merilis data port dalam <30 menit.",
                },
                {
                  num: "04",
                  title: "Computational Governance",
                  sub: "Tata Kelola via Kodingan",
                  color: "#a855f7",
                  icon: "🛡️",
                  desc: "Aturan hukum dan privasi (seperti masking NIK UU PDP) diuji otomatis oleh mesin di GitHub Actions, bukan rapat dokumen tebal.",
                },
              ].map((pilar) => (
                <div
                  key={pilar.num}
                  style={{
                    padding: "18px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    borderTop: `3px solid ${pilar.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "24px" }}>{pilar.icon}</span>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: pilar.color }}>
                      PILAR {pilar.num}
                    </span>
                  </div>
                  <h4 style={{ margin: "4px 0 0 0", fontSize: "16px", color: "var(--ink-heading)" }}>{pilar.title}</h4>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>{pilar.sub}</span>
                  <p style={{ margin: "6px 0 0 0", fontSize: "12px", lineHeight: 1.5, color: "var(--ink)" }}>{pilar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: PETA 5 DOMAIN TOPOLOGI & RADAR DATSIS                         */}
      {/* ==================================================================== */}
      {activeView === "topology" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "40px" }}>
          {/* Topologi Network Visual Selector */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
              // PETA INTERAKTIF 5 DOMAIN BISNIS PT NUSAFINANCE
            </div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
              Pilih Domain untuk Menginspeksi Arsitektur &amp; Radar Mutu DATSIS
            </h3>

            {/* Visual Node Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              {DOMAIN_NODES.map((d) => {
                const isSelected = selectedDomainId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomainId(d.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "6px",
                      backgroundColor: isSelected ? d.bgColor : "var(--panel)",
                      border: isSelected ? `2px solid ${d.borderColor}` : "1px solid var(--line)",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "22px" }}>{d.icon}</span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "3px",
                          backgroundColor: isSelected ? d.borderColor : "var(--surface)",
                          color: isSelected ? "#ffffff" : "var(--muted)",
                        }}
                      >
                        {d.shortName}
                      </span>
                    </div>
                    <strong style={{ fontSize: "13px", color: isSelected ? d.color : "var(--ink-heading)" }}>
                      {d.name}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>SLA: {d.slaRefresh}</span>
                  </button>
                );
              })}
            </div>

            {/* Deep Dive Panel: Domain Info + Radar DATSIS Chart */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
                padding: "20px",
                backgroundColor: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: "6px",
              }}
            >
              {/* Left Column: Domain Specs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "24px" }}>{activeDomain.icon}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "16px", color: activeDomain.color }}>{activeDomain.name}</h4>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                      {activeDomain.domainName} • Lead: {activeDomain.lead}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    backgroundColor: "var(--surface)",
                    borderLeft: `3px solid ${activeDomain.borderColor}`,
                    fontSize: "12px",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>💡 Analogi Mudah:</strong> {activeDomain.analogy}
                </div>

                <div style={{ fontSize: "12px", color: "var(--ink)", lineHeight: 1.5 }}>
                  <strong>Bounded Context:</strong> {activeDomain.boundedContext}
                </div>

                {/* Metrics Table */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
                  {activeDomain.sampleData.metrics.map((m) => (
                    <div key={m.label} style={{ padding: "8px 10px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                      <span style={{ display: "block", fontSize: "10px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>{m.label}</span>
                      <strong style={{ fontSize: "13px", color: "var(--ink-heading)", fontFamily: "var(--font-mono), monospace" }}>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual DATSIS Radar Chart (SVG) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: "1px solid var(--line)",
                  paddingLeft: "16px",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
                  // RADAR CHART DATSIS FITNESS ({activeDomain.shortName})
                </div>

                <svg viewBox="0 0 240 240" style={{ width: "220px", height: "220px", overflow: "visible" }}>
                  {/* Radar Circles */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
                    <circle
                      key={level}
                      cx="120"
                      cy="120"
                      r={level * 90}
                      fill="none"
                      stroke="#374151"
                      strokeWidth="1"
                      strokeDasharray={level < 1.0 ? "2 2" : "none"}
                    />
                  ))}

                  {/* Axis lines */}
                  {radarPoints.map((p) => (
                    <line key={p.key} x1="120" y1="120" x2={p.labelX} y2={p.labelY} stroke="#4b5563" strokeWidth="1" strokeDasharray="2 2" />
                  ))}

                  {/* Filled Polygon */}
                  <polygon
                    points={radarPolygonSvg}
                    fill={activeDomain.bgColor}
                    stroke={activeDomain.color}
                    strokeWidth="2"
                  />

                  {/* Points */}
                  {radarPoints.map((p) => (
                    <circle key={p.key} cx={p.x} cy={p.y} r="4" fill={activeDomain.color} stroke="#ffffff" strokeWidth="1.5" />
                  ))}

                  {/* Labels */}
                  {radarPoints.map((p) => (
                    <text
                      key={p.key}
                      x={p.labelX}
                      y={p.labelY + 4}
                      fill="#e5e7eb"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {p.key}: {p.val}
                    </text>
                  ))}
                </svg>

                <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace", marginTop: "12px" }}>
                  Skor Rata-rata: {((activeDomain.datsis.D + activeDomain.datsis.A + activeDomain.datsis.T + activeDomain.datsis.S + activeDomain.datsis.I + activeDomain.datsis.Sec) / 6).toFixed(2)} / 5.00
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* VIEW 3: GRAFIK ANALITIK, CONWAY'S LAW & RISIKO PORTOFOLIO           */}
      {/* ==================================================================== */}
      {activeView === "charts" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "40px" }}>
          {/* Interactive Conway's Law Overhead Curve */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
              // GRAFIK INTERAKTIF 1: BUKTI MATEMATIS CONWAY'S LAW
            </div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
              Mengapa Monolith Meledak Seiring Bertambahnya Jumlah Domain?
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
              Geser slider jumlah domain bisnis di bawah ini untuk melihat simulasi grafis perbandingan beban koordinasi:
              <strong> Monolitik Pusat (C = N × (N - 1) / 2)</strong> vs <strong> Data Mesh Terdesentralisasi (C = 2N)</strong>.
            </p>

            {/* Slider Control */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "14px 18px",
                backgroundColor: "var(--panel)",
                borderRadius: "4px",
                border: "1px solid var(--line)",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "12px", fontFamily: "var(--font-mono), monospace", color: "var(--ink-heading)", fontWeight: 600 }}>
                Jumlah Domain Bisnis ($N$):
              </span>
              <input
                type="range"
                min="2"
                max="20"
                value={domainCount}
                onChange={(e) => setDomainCount(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#60a5fa", cursor: "pointer" }}
              />
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "16px", fontWeight: 700, color: "#60a5fa", minWidth: "80px" }}>
                {domainCount} Domain
              </span>
            </div>

            {/* Coordination Metric Result Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div style={{ padding: "14px", backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#f87171", display: "block" }}>
                  KOORDINASI MONOLITH PUSAT
                </span>
                <strong style={{ fontSize: "24px", color: "#ef4444", fontFamily: "var(--font-mono), monospace" }}>
                  {monolithCoordination} Titik Antrean
                </strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "var(--muted)" }}>
                  Beban koordinasi meledak kuadratik; tim data pusat menjadi leher botol parah.
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "4px" }}>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#34d399", display: "block" }}>
                  KOORDINASI DATA MESH
                </span>
                <strong style={{ fontSize: "24px", color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>
                  {meshCoordination} Titik Kontrak
                </strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "var(--muted)" }}>
                  Koordinasi terikat secara linear pada port kontrak ODCS; stabil dan bebas hambatan.
                </p>
              </div>
            </div>

            {/* Interactive SVG Curve Visualization */}
            <div style={{ padding: "16px", backgroundColor: "#090d13", borderRadius: "6px", border: "1px solid #1f2937" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "#9ca3af", display: "block", marginBottom: "8px" }}>
                GRAFIK KURVA SKALABILITAS: MERAH (MONOLITH) VS HIJAU (DATA MESH)
              </span>
              <svg viewBox="0 0 400 140" style={{ width: "100%", height: "140px" }}>
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="#1f2937" strokeWidth="1" />
                <line x1="40" y1="60" x2="380" y2="60" stroke="#1f2937" strokeWidth="1" />
                <line x1="40" y1="100" x2="380" y2="100" stroke="#1f2937" strokeWidth="1" />

                {/* Axes */}
                <line x1="40" y1="10" x2="40" y2="120" stroke="#4b5563" strokeWidth="1.5" />
                <line x1="40" y1="120" x2="380" y2="120" stroke="#4b5563" strokeWidth="1.5" />

                {/* Monolith Quadratic Curve */}
                <path
                  d="M 40 120 Q 210 110, 380 20"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />

                {/* Data Mesh Linear Curve */}
                <line x1="40" y1="120" x2="380" y2="85" stroke="#10b981" strokeWidth="2.5" />

                {/* Active Slider Indicator */}
                {(() => {
                  const xPos = 40 + ((domainCount - 2) / 18) * 340;
                  return (
                    <g>
                      <line x1={xPos} y1="10" x2={xPos} y2="120" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx={xPos} cy={120 - (monolithCoordination / 250) * 100} r="4" fill="#ef4444" />
                      <circle cx={xPos} cy={120 - (meshCoordination / 250) * 100} r="4" fill="#10b981" />
                    </g>
                  );
                })()}

                {/* Legend */}
                <text x="50" y="32" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">Monolith: O(N²)</text>
                <text x="50" y="46" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">Data Mesh: O(N)</text>
              </svg>
            </div>
          </div>

          {/* Grafik 2: Komposisi Risiko Portofolio PT NusaFinance (Risk 360) */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
              // GRAFIK INTERAKTIF 2: DISTRIBUSI RISIKO PEMBIAYAAN KONTRAK
            </div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
              Komposisi Portofolio Alat Berat Berdasarkan Sektor Industri
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {[
                { sector: "Tambang Batubara (Kaltim/Sumsel)", units: 6200, pct: 41.9, amount: "Rp 15.2 Triliun", color: "#3b82f6" },
                { sector: "Perkebunan Kelapa Sawit (Riau/Sumut)", units: 5100, pct: 34.5, amount: "Rp 10.8 Triliun", color: "#10b981" },
                { sector: "Konstruksi & Jalan Tol (Jawa/Sulawesi)", units: 3500, pct: 23.6, amount: "Rp 6.4 Triliun", color: "#f59e0b" },
              ].map((s) => (
                <div key={s.sector} style={{ padding: "16px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-heading)" }}>{s.sector}</span>
                    <strong style={{ fontSize: "12px", fontFamily: "var(--font-mono), monospace", color: s.color }}>{s.pct}%</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "var(--surface)", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", backgroundColor: s.color }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                    <span>{s.units.toLocaleString()} Unit Alat</span>
                    <span style={{ color: "var(--ink)" }}>{s.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* VIEW 4: SIMULATOR CI/CD & INSPEKTOR UU PDP                           */}
      {/* ==================================================================== */}
      {activeView === "governance" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "40px" }}>
          {/* CI/CD Pipeline Simulator */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "8px" }}>
              // SIMULATOR GITOPS CI/CD: SHIFT-LEFT CONTRACT GATE
            </div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "var(--ink-heading)" }}>
              Uji Coba Otomatis: Bagaimana Kontrak Data Mencegah Bencana Produksi?
            </h3>

            {/* Scenario Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
              {[
                { id: "pass", label: "✅ Skenario 1: PR Bersih (Lulus 100%)", color: "#10b981" },
                { id: "drift", label: "❌ Skenario 2: Schema Drift (Kolom Berubah)", color: "#ef4444" },
                { id: "leak", label: "🚨 Skenario 3: Bocor NIK UU PDP (Pelanggaran Hukum)", color: "#f59e0b" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSimulatedScenario(sc.id as typeof simulatedScenario)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "4px",
                    border: simulatedScenario === sc.id ? `2px solid ${sc.color}` : "1px solid var(--line)",
                    backgroundColor: simulatedScenario === sc.id ? "var(--panel)" : "var(--surface)",
                    color: simulatedScenario === sc.id ? sc.color : "var(--ink)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Visual Terminal Window */}
            <div style={{ border: "1px solid #1f2937", borderRadius: "6px", backgroundColor: "#0a0e14", overflow: "hidden" }}>
              <div style={{ padding: "8px 16px", backgroundColor: "#111827", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#9ca3af" }}>
                <span>GitHub Actions CI Runner — computational_contract_validator.py</span>
                <span>STATUS: {simulatedScenario === "pass" ? "EXIT 0 (PASS)" : "EXIT 1 (BLOCKED)"}</span>
              </div>

              <div style={{ padding: "16px", fontFamily: "var(--font-mono), monospace", fontSize: "12px", lineHeight: 1.7, minHeight: "160px" }}>
                {simulatedScenario === "pass" && (
                  <div style={{ color: "#34d399" }}>
                    <div>[01] Membaca spesifikasi kontrak: leasing_contract_v2.yaml ... OK</div>
                    <div>[02] Verifikasi SemVer: v2.1.0 -&gt; v2.2.0 (Non-breaking additive) ... OK</div>
                    <div>[03] Uji coba 7 kolom fisik database vs kontrak ... 100% MATCH</div>
                    <div>[04] Great Expectations: expect_column_values_to_not_be_null ... PASSED</div>
                    <div>[05] Scanner UU PDP: Memeriksa 500 baris dari kebocoran 16 digit NIK ... 0 DETECTED</div>
                    <div style={{ fontWeight: "bold", marginTop: "8px" }}>&gt;&gt; BUILD PASSED: Pull Request disetujui untuk dimerge ke produksi! 🎉</div>
                  </div>
                )}

                {simulatedScenario === "drift" && (
                  <div style={{ color: "#f87171" }}>
                    <div>[01] Membaca spesifikasi kontrak: leasing_contract_v2.yaml ... OK</div>
                    <div style={{ color: "#fbbf24" }}>[02] Terdeteksi perubahan skema fisik di tabel domain_leasing.contracts!</div>
                    <div>[03] PERINGATAN: Kolom 'tenor_months' yang dibutuhkan kontrak TIBA-TIBA HILANG!</div>
                    <div>[04] Ditemukan kolom baru tanpa pengumuman: 'tenor_duration' (Integer)</div>
                    <div style={{ fontWeight: "bold", marginTop: "8px" }}>&gt;&gt; BUILD BLOCKED: 14 pipeline hilir (Risk 360) terancam rusak. PR ditolak otomatis! 🛑</div>
                  </div>
                )}

                {simulatedScenario === "leak" && (
                  <div style={{ color: "#fbbf24" }}>
                    <div>[01] Membaca spesifikasi kontrak: crm_contract_v2.yaml ... OK</div>
                    <div>[02] Menjalankan Scanner Privasi Regulasi UU PDP No. 27/2022 ...</div>
                    <div style={{ color: "#f87171", fontWeight: "bold" }}>[03] BAHAYA KRITIS: Ditemukan 16-digit NIK polos pada Baris 4: '3201041982040002'!</div>
                    <div style={{ color: "#f87171" }}>[04] Pelanggaran Pasal 16 &amp; 20 (Wajib Masking / Pseudonymization). Potensi Denda 2% Omzet!</div>
                    <div style={{ color: "#f87171", fontWeight: "bold", marginTop: "8px" }}>&gt;&gt; SECURITY LOCKDOWN: Deployment dibatalkan hingga Dynamic RLS View dipasang! 🔒</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive UU PDP Privacy Inspector */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase" }}>
                  // INSPEKTOR PRIVASI UU PDP NO. 27/2022 &amp; OJK
                </div>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "var(--ink-heading)" }}>
                  Dynamic Row-Level Security (RLS) Masking
                </h3>
              </div>

              <button
                onClick={() => setIsAuditorView(!isAuditorView)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "4px",
                  border: isAuditorView ? "1px solid #f43f5e" : "1px solid #10b981",
                  backgroundColor: isAuditorView ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: isAuditorView ? "#f43f5e" : "#10b981",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isAuditorView ? "🔒 Kembali ke Mode Konsumen Biasa" : "🔓 Mode Auditor Kepatuhan (Buka NIK)"}
              </button>
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)" }}>
              Perhatikan bagaimana kueri SQL otomatis menyamarkan angka NIK warga bagi pengguna analitik biasa, dan hanya membuka data asli bagi auditor yang memiliki hak akses resmi.
            </p>

            {/* Visual Table */}
            <div style={{ border: "1px solid var(--line)", borderRadius: "4px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "var(--font-mono), monospace" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--surface-secondary)", textAlign: "left", color: "var(--muted)" }}>
                    <th style={{ padding: "8px 12px" }}>NAMA PERUSAHAAN</th>
                    <th style={{ padding: "8px 12px" }}>SEKTOR</th>
                    <th style={{ padding: "8px 12px" }}>STATUS MASKING NIK (UU PDP)</th>
                    <th style={{ padding: "8px 12px" }}>TELEPON</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pt: "PT Nusantara Mining Logistik", sector: "Tambang Batubara", nikRaw: "3201041982040002", nikMask: "3201************0002", telRaw: "081198765432", telMask: "0811****5432" },
                    { pt: "PT Sawit Sejahtera Bersama", sector: "Kelapa Sawit", nikRaw: "1402088289090001", nikMask: "1402************0001", telRaw: "081234567890", telMask: "0812****7890" },
                    { pt: "CV Kutai Transport Prima", sector: "Hauling Tambang", nikRaw: "6401010477030005", nikMask: "6401************0005", telRaw: "082199887766", telMask: "0821****7766" },
                  ].map((row) => (
                    <tr key={row.pt} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 12px", color: "var(--ink-heading)", fontWeight: 600 }}>{row.pt}</td>
                      <td style={{ padding: "8px 12px", color: "var(--muted)" }}>{row.sector}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ color: isAuditorView ? "#f43f5e" : "#10b981", fontWeight: 700 }}>
                          {isAuditorView ? `${row.nikRaw} 🔓` : `${row.nikMask} 🔒`}
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px", color: "var(--muted)" }}>
                        {isAuditorView ? row.telRaw : row.telMask}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* VIEW 5: BANK SOAL WAWANCARA (10 Q&A DRILL CARDS)                    */}
      {/* ==================================================================== */}
      {activeView === "interview" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
          {/* Progress Banner */}
          <div
            style={{
              padding: "18px 24px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)", textTransform: "uppercase" }}>
                // PROGRESS PREPARASI WAWANCARA DATA ARCHITECT
              </span>
              <h3 style={{ margin: "4px 0 0 0", fontSize: "18px", color: "var(--ink-heading)" }}>
                Kuasai 10 Pertanyaan Wawancara Arsitek Data Tingkat Prinsipal
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "14px", fontWeight: 700, color: "#10b981" }}>
                {completedQuestions.size} / 10 Dipahami ({Math.round((completedQuestions.size / 10) * 100)}%)
              </span>
              <div style={{ width: "120px", height: "8px", backgroundColor: "var(--panel)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${(completedQuestions.size / 10) * 100}%`, height: "100%", backgroundColor: "#10b981", transition: "width 0.2s ease" }} />
              </div>
            </div>
          </div>

          {/* Question Drill Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {INTERVIEW_QUESTIONS.map((q, idx) => {
              const isExpanded = expandedQId === q.id;
              const isDone = completedQuestions.has(q.id);

              return (
                <div
                  key={q.id}
                  style={{
                    border: isExpanded ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                    borderRadius: "6px",
                    backgroundColor: "var(--surface)",
                    overflow: "hidden",
                    transition: "all 0.15s ease",
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "14px",
                      cursor: "pointer",
                      backgroundColor: isExpanded ? "rgba(96, 165, 250, 0.05)" : "transparent",
                    }}
                    onClick={() => setExpandedQId(isExpanded ? "" : q.id)}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleQuestionComplete(q.id);
                        }}
                        style={{
                          marginTop: "2px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: isDone ? "none" : "1px solid var(--line)",
                          backgroundColor: isDone ? "#10b981" : "transparent",
                          color: "#ffffff",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isDone ? "✓" : ""}
                      </button>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)" }}>
                            SOAL {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "2px", backgroundColor: "var(--panel)", color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}>
                            {q.category}
                          </span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: "15px", color: "var(--ink-heading)", lineHeight: 1.4 }}>
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "14px", color: "var(--muted)" }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid var(--line)" }}>
                      {/* Interviewer Intent */}
                      <div
                        style={{
                          margin: "14px 0",
                          padding: "10px 14px",
                          backgroundColor: "rgba(168, 85, 247, 0.08)",
                          borderLeft: "3px solid #a855f7",
                          fontSize: "12px",
                          color: "var(--ink)",
                          lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: "#c084fc", display: "block", marginBottom: "2px", fontFamily: "var(--font-mono), monospace", fontSize: "10px" }}>
                          APA YANG DIUJI OLEH PEWAWANCARA:
                        </strong>
                        {q.interviewerIntent}
                      </div>

                      {/* Quick Takeaway */}
                      <div
                        style={{
                          marginBottom: "14px",
                          padding: "10px 14px",
                          backgroundColor: "rgba(16, 185, 129, 0.08)",
                          borderLeft: "3px solid #10b981",
                          fontSize: "12px",
                          color: "var(--ink)",
                          lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: "#34d399", display: "block", marginBottom: "2px", fontFamily: "var(--font-mono), monospace", fontSize: "10px" }}>
                          RANGKUMAN CEPAT UNTUK DIINGAT:
                        </strong>
                        {q.quickTakeaway}
                      </div>

                      {/* Full Model Answer */}
                      <div>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--ink-heading)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                          // MODEL JAWABAN TINGKAT PRINSIPAL:
                        </span>
                        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--ink)" }}>
                          {q.fullAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
