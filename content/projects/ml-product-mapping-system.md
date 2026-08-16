---
title: "ML Product Mapping System"
slug: "ml-product-mapping-system"
one_liner: "Sistem machine learning multi-model ensemble (PyTorch Bi-Encoder, Cross-Encoder, XGBoost, Random Forest, & Online Active Learner) yang otomatis memetakan deskripsi produk distributor DBC Group (Rucika, Djabesmen, RB Shera, Superex) ke Master SKU internal dengan presisi 95%+."
problem: "Ribuan Purchase Order dan invoice distributor masuk dengan format deskripsi tidak terstandar (singkatan ukuran 1/2\", 3/4\", varian kelas AW/D, jenis drat luar/dalam). Mapping manual di ribuan SKU memakan waktu berhari-hari dan rawan salah input pada kode barang kritis."
approach: "Membangun arsitektur hybrid multi-model ensemble 6 komponen dengan Bi-Encoder retrieval (~3ms), Cross-Encoder re-ranker, XGBoost, Random Forest, TF-IDF, serta Online Active Learning loop yang belajar real-time (<1ms) dari koreksi manusia."
impact: "95%+ Presisi pada mapping otomatis, >80% volume PO terpetakan instan tanpa intervensi manual, dan memangkas waktu pemrosesan batch dari 3 hari kerja menjadi <5 menit lintas 4 brand manufaktur (Rucika, Djabesmen, RB Shera, Superex)."
category: "Machine learning"
tools:
  - "Python"
  - "PyTorch Bi-Encoder"
  - "Cross-Encoder Transformer"
  - "XGBoost"
  - "Random Forest"
  - "Scikit-Learn (SGD Active Learner)"
  - "TF-IDF & Fuzzy Matching"
skills:
  - "Machine learning"
  - "NLP & Embeddings"
  - "Active learning"
  - "Data quality"
  - "System architecture"
order: 1
system:
  - label: "01. Fast Dense Retrieval"
    value: "PyTorch Bi-Encoder (384-d dense embeddings) menyaring Top 30 kandidat dalam ~3ms"
  - label: "02. Deep Semantic Re-Ranking"
    value: "Cross-Encoder Transformer mengevaluasi kata-per-kata untuk variasi halus (AW/D, drat)"
  - label: "03. Hybrid Meta-Classifier"
    value: "XGBoost + Random Forest menghitung probabilitas fitur statistik & leksikal 8-dimensi"
  - label: "04. Active Human-in-the-Loop"
    value: "Online Active Learner (SGD log_loss) belajar dalam <1ms dari umpan balik operator"
lessons:
  - "Multi-model ensemble jauh lebih tangguh menangani variasi penulisan teknis ekstrem dibanding model NLP tunggal."
  - "Pemisahan threshold confidence (Auto-Approve vs Human Review Queue) adalah kunci adopsi operasional yang aman di industri manufaktur."
  - "Online incremental learning memastikan model terus menjadi lebih pintar tanpa memerlukan retrain batch besar yang membebani infrastruktur."
preview:
  eyebrow: "5-Model Hybrid Ensemble"
  metrics:
    - label: "Auto-Precision"
      value: "95.4%"
    - label: "Auto Volume"
      value: ">80%"
    - label: "Batch Speed"
      value: "<5 Min"
  takeaway: "Ensemble 5 model + Active Learning memangkas rekonsiliasi SKU multi-brand DBC Group dari hari ke menit."
evidence:
  - slot: "01"
    kind: "diagram"
    title: "5-Model Hybrid Ensemble Architecture"
    description: "Arsitektur retrieval 2 tahap (Bi-Encoder Dense Search ➡️ Cross-Encoder Re-Ranker) digabung dengan XGBoost, Random Forest, dan Online Active Learner."
    alt: "Diagram arsitektur hybrid multi-model ensemble ML product mapping."
  - slot: "02"
    kind: "dashboard"
    title: "Confidence Calibration & Review Queue"
    description: "Antarmuka triage confidence: Skor >=85% langsung sinkron ke ERP Master SKU, 60-85% masuk antrean review operator dengan saran Top 3."
    alt: "Mockup antarmuka confidence calibration dan review queue."
  - slot: "03"
    kind: "screenshot"
    title: "Multi-Brand SKU Transformation Matrix"
    description: "Contoh hasil pemetaan real-world deskripsi distributor ke Master SKU standar Rucika, Djabesmen, RB Shera, dan Superex."
    alt: "Matriks transformasi deskripsi distributor ke Master SKU DBC Group."
---

## Problem: Fragmentasi Deskripsi Distributor Lintas Brand DBC Group

Di lingkungan distribusi bahan bangunan berskala nasional seperti **DBC Group (Djabesmen Group)**, ribuan transaksi *Purchase Order (PO)* dan invoice masuk setiap hari dari ratusan toko bangunan dan distributor rekanan untuk 4 lini produk utama:
1. **Rucika**: Pipa PVC (Standard AW/D, JIS), pipa PPR, HDPE, serta ratusan varian sambungan/fitting (Knee/Elbow, Tee, Socket, Valve, Drat Luar/Dalam).
2. **Djabesmen**: Lembaran atap gelombang fiber semen dan nok penutup dengan variasi ketebalan, panjang, dan profil gelombang.
3. **RB Shera**: Papan semen (*fiber cement board*), *wood plank*, dan lisplang bertekstur kayu dengan spesifikasi dimensi milimeter.
4. **Superex**: Pipa PVC dan sistem talang air hujan (*gutter & fittings*).

### Bottleneck Operasional:
- **Ketidakteraturan Teks Input**: Setiap distributor menuliskan nama barang dengan gaya bebas, singkatan non-standar, dan salah ketik. Contoh: *"PPA RCK AW 1/2 IN"* vs *"PIPA PVC RUCIKA STD KELAS AW 0.5 INCH 4 METER"*, atau *"SHERA PLANK TEAK BROWN 8X200X3000"* vs *"PAPAN RB SHERA COKLAT 3M"*.
- **Risiko Salah Mapping**: Kesalahan membedakan kelas pipa (misal: pipa kelas AW yang bertekanan tinggi tertukar dengan kelas D untuk air limbah) berakibat fatal pada pengiriman barang dan ketidaksesuaian inventori ERP.
- **Biaya Waktu Manual**: Tim operasional menghabiskan waktu berhari-hari di setiap akhir bulan hanya untuk mencocokkan baris data PO secara manual satu per satu di spreadsheet.

---

## Technical Solution: Arsitektur 5-Model + TF-IDF Hybrid Ensemble

Untuk mencapai presisi tinggi tanpa mengorbankan kecepatan, dibangun arsitektur pencocokan bertingkat (*hierarchical multi-model ensemble*) yang memadukan komputasi vektor padat (*dense embedding*), analisis perhatian kontekstual (*cross-attention*), model pohon keputusan (*gradient boosting & random forest*), dan pembelajaran aktif online (*online active learning*).

### 1. Komponen Ensemble & Formula Pembobotan:

Sistem menghitung skor kecocokan akhir (**Final Ensemble Confidence Score**) dengan formula pembobotan matematis:

$$\text{Final Score} = 0.20 \times M_1 + 0.25 \times M_2 + 0.20 \times M_3 + 0.15 \times M_4 + 0.10 \times M_5 + 0.10 \times \text{TF-IDF}$$

| Komponen | Model / Engine | Latensi | Peran Khusus dalam Pipeline |
| :--- | :--- | :--- | :--- |
| **Model 1 (20%)** | **PyTorch Bi-Encoder** | ~3ms | Menghasilkan vektor embedding 384-dimensi untuk *fast dense vector retrieval* Top 30 kandidat Master SKU dari database katalog. |
| **Model 2 (25%)** | **Cross-Encoder Re-Ranker** | ~18ms | Transformer dengan *cross-attention* kata-per-kata untuk mengevaluasi detail teknis sensitif (kelas AW vs D, drat luar vs dalam, inch vs mm). |
| **Model 3 (20%)** | **XGBoost Classifier** | ~2ms | *Gradient boosted decision trees* untuk kalkulasi probabilitas berdasarkan 8 fitur statistik dan leksikal (rasio overlap token, kesamaan panjang, pencocokan numerik). |
| **Model 4 (15%)** | **Random Forest Classifier** | ~2ms | *Bagged meta-ensemble* (100 decision trees) yang bertindak sebagai penyeimbang variansi dan meminimalkan bias prediksi pada data langka. |
| **Model 5 (10%)** | **Online Active Learner** | <1ms | Model inkremental *real-time* (`SGDClassifier` dengan *log_loss*) yang langsung menyerap koreksi operator dan memperbarui bobot dalam hitungan milidetik. |
| **TF-IDF (10%)** | **N-Gram Character Vectorizer** | <1ms | Mempertahankan pencocokan leksikal tingkat karakter untuk menangani *typo* ekstrem dan singkatan kode khusus supplier. |

---

## Operational Workflow: Human-in-the-Loop & Confidence Calibration

Sistem dirancang dengan prinsip **keterandalan tanpa kompromi**. Alih-alih memaksakan keputusan otomatis pada data yang meragukan, sistem menerapkan kalibrasi confidence 3 tingkat:

```
[Input PO / Invoice Distributor]
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Text Preprocessing & Dimension Normalization   │
│  (Regex inch-mm, brand aliases, schedule specs) │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│   5-Model + TF-IDF Hybrid Ensemble Scoring      │
│  (Bi-Encoder ➡️ Cross-Encoder ➡️ XGBoost ➡️ RF) │
└──────────────────────┬──────────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Score ≥ 85%: AUTO-APPROVE]   [Score 60-85%: REVIEW QUEUE]   [Score < 60%: ANOMALY FLAG]
 (>80% Total PO Volume)        (Saran Top 3 Kandidat)         (Indikasi Produk Baru)
       │                               │                               │
       │                               ▼                               │
       │                   [Operator Memilih Koreksi]                  │
       │                               │                               │
       │                               ▼                               │
       │                   ┌────────────────────────┐                  │
       │                   │ Online Active Learner  │                  │
       │                   │ Update Bobot (<1ms)    │                  │
       │                   └────────────────────────┘                  │
       ▼                               ▼                               ▼
 [ERP SAP Master SKU]         [ERP SAP Master SKU]            [Master Data Triage]
```

1. **Tier 1 — Auto-Approved ($\ge 85\%$ Confidence)**:
   - Mencakup **>80% dari total volume PO harian**.
   - Diproses langsung tanpa campur tangan manusia ke dalam sistem ERP SAP dengan tingkat presisi terverifikasi **95.4%**.
2. **Tier 2 — Human Review Queue ($60\% - 85\%$ Confidence)**:
   - Menampilkan antarmuka audit ringkas dengan **3 rekomendasi kandidat teratas** beserta probabilitasnya.
   - Ketika operator memilih kandidat yang benar, **Online Active Learner langsung memperbarui bobot secara instan (<1ms)** sehingga sistem tidak mengulangi ketidakpastian yang sama.
3. **Tier 3 — Anomaly / New Product Flag ($< 60\%$ Confidence)**:
   - Mengisolasi kode produk baru yang belum pernah terdaftar di Master Catalog untuk ditinjau tim Master Data Management.

---

## Visual Comparison: Transformasi Input Distributor ke Master SKU

Berikut contoh konkret pemetaan data nyata yang berhasil dieksekusi sistem lintas 4 brand DBC Group:

| Brand | Raw Distributor Description (Input) | Standardized Internal Master SKU (Output) | Ensemble Score | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Rucika** | `RCK PPA AW 1/2 INCH X 4M PUTIH` | `RUCIKA-PVC-AW-050-4M-WHT (Pipa PVC Standard AW 1/2" 4M)` | **98.2%** | `Auto-Approved` |
| **Rucika** | `KNEE DRAT DLM RCK 3/4X1/2 AW` | `RUCIKA-FIT-AW-FTE-075X050 (Faucet Elbow AW 3/4" x 1/2")` | **94.6%** | `Auto-Approved` |
| **Djabesmen** | `ATAP FIBER DJABES GEL 14 2100` | `DJABES-GLB14-2100X1020-GREY (Atap Semen Gelombang 14 2.10M)` | **96.1%** | `Auto-Approved` |
| **RB Shera** | `PAPAN FIBER SHERA PLANK COKLAT 3M` | `SHERA-PLK-TEAK-08X200X3000 (Shera Plank Dint Teak Brown 3M)` | **91.8%** | `Auto-Approved` |
| **Superex** | `TLNG AIR SUPEREX 4M SET ACC` | `SPRX-GUTTER-U140-4M-SET (Talang Air PVC U-140 Set 4M)` | **89.3%** | `Auto-Approved` |
| **Rucika** | `SOK PIPA KHUSUS DRAT KUNINGAN` | `RUCIKA-FIT-FAUCET-SCK-050 (Faucet Socket AW Brass Insert 1/2")` | **74.5%** | `Reviewed (Top 1)` |

---

## Quantitative Business Impact & Outcomes

Penerapan sistem ini di lingkungan operasional DBC Group memberikan dampak efisiensi nyata yang terukur:

```text
┌──────────────────────────────┬──────────────────────────────┬──────────────────────────────┐
│       AUTO-PRECISION         │       AUTOMATION RATE        │       BATCH TIME SAVED       │
│           95.4%              │            >80%              │          99.1%               │
│  Terverifikasi pada >50k SKU │   Tanpa sentuhan manual      │  Dari 3 hari ke <5 menit     │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

- **Pengurangan Waktu Pemrosesan 99%**: Waktu rekonsiliasi PO distributor berukuran puluhan ribu baris data turun drastis dari **3 hari kerja menjadi kurang dari 5 menit**.
- **Skalabilitas Multi-Brand**: Modul pencocokan berhasil direplikasi ke **4 brand manufaktur** (Rucika, Djabesmen, RB Shera, Superex) tanpa perlu membangun arsitektur ulang dari awal.
- **Eliminasi Human Error**: Mengurangi insiden salah kirim varian teknis (AW vs D) hingga mendekati nol, menjaga akurasi pemenuhan pesanan dan kepuasan pelanggan distributor.
- **Peningkatan Kapasitas Tim**: Tim administrasi inventori dapat dialihkan dari pekerjaan klerikal mapping manual ke analisis perkiraan permintaan (*demand forecasting*) dan optimalisasi rantai pasok.
