# 🔒 BACKUP CHECKPOINT & ROLLBACK GUIDE (v1.0.0-stable)

## 📌 Checkpoint Metadata

| Field | Detail |
| :--- | :--- |
| **Official Tag Name** | `v1.0.0-stable` |
| **Commit Hash** | `800a21e3407e392e365a39741a0e12967eb6aade` (`800a21e`) |
| **Commit Message** | `polish(portfolio): refine skill-matrix alignment, timeline layout, english translations, and humble contact heading` |
| **Tag Annotation** | `Release v1.0.0: Stable complete portfolio with Olist interactive map, RFM matrix, certificate simulator, and verified english copy` |
| **Remote Repository** | `https://github.com/afirstana/Portofolio.git` (Branch: `main`) |
| **GitHub Status** | ✅ **Permanently Tagged & Pushed to Remote** |
| **Date & Time** | `Sunday, August 16, 2026` |

---

## ⚡ How to Rollback to This Checkpoint (Apa yang Harus Dijalankan)

Jika Anda ingin mengembalikan (*rollback*) proyek ke titik ini kapan saja, buka terminal PowerShell di folder `project` dan jalankan salah satu instruksi berikut:

### Opsi 1: Rollback Penuh dan Bersih (Recommended)
Perintah ini akan mengembalikan seluruh kode, styling, dan data persis seperti saat tag `v1.0.0-stable` dibuat:
```powershell
# 1. Bersihkan perubahan lokal yang belum tersimpan (opsional tapi disarankan)
git fetch origin --tags
git reset --hard v1.0.0-stable

# 2. Pastikan dependensi sinkron
npm install

# 3. Jalankan server lokal untuk verifikasi
npm run dev
```

### Opsi 2: Menggunakan Commit Hash Langsung
```powershell
git checkout 800a21e
# Atau untuk membuat branch baru dari titik ini:
git checkout -b restore-v1 800a21e
```

---

## 📦 Detail Isi & Fitur pada Tag `v1.0.0-stable`

Titik stabil ini mencakup seluruh sistem, halaman, dan komponen interaktif berikut:

### 1. 🗺️ Olist E-Commerce Logistics & Customer Intelligence (`/projects/olist-e-commerce-logistics-analysis/`)
* **Interactive Brazil Geospatial Map (`components/OlistGeoShowcase.tsx`)**:
  * Peta vektor SVG poligon presisi untuk **27 Negara Bagian Brazil**.
  * **Dynamic Hover Telemetry HUD**: Memunculkan Revenue (BRL), Revenue Share %, Volume Order, Rata-rata Lead Time, Active Sellers, Cross-State %, dan Supply Chain Insight saat kursor diarahkan ke negara bagian mana saja.
  * **Disparitas Lead Time 2.0x**: Membandingkan Same-State (7.48 Hari / 153 km) vs Cross-State (14.68 Hari / 853 km) + Spektrum 6 Koridor Jarak Haversine (<50 km hingga >2000 km).
* **2D Behavioral RFM Customer Matrix (`components/OlistRfmShowcase.tsx`)**:
  * Mengolah data **93,358 pelanggan unik** (`customer_unique_id`).
  * 4 Kuadran Retensi Ringkas:
    1. 🔴 *Cannot Lose Them (27.5% GMV | 13.8k buyers)* — Churn Kritis & Voucher Reaktivasi.
    2. 🟡 *Promising & New Big Spenders (40.8% GMV | 21.3k buyers)* — Target Retensi Order ke-2.
    3. ⚪ *One-Time Low-Value Base (26.1% GMV | 55.5k buyers)* — Otomasi Email Biaya Nol.
    4. 🔵 *True Loyal Repeat Buyers (5.6% GMV | 2.8k buyers)* — Duta VIP & Referral Perks.
  * Dossier Rencana Aksi Bisnis Interaktif yang merespons sentuhan kursor.
* **Format Bersih & Dashboard-Driven**: Tanpa teks panjang berulang, berfokus murni pada kartu ringkasan eksekutif dan dashboard visual.

---

### 2. 📜 Certificate Generator Desktop App (`/projects/certificate-generator-desktop-app/`)
* **Interactive Canvas & Batch Simulator (`components/CertificateInteractiveShowcase.tsx`)**:
  * **Live 300-DPI Vector Canvas Preview**: 3 tema instan (*Obsidian Tech*, *Classic Gold*, *Academic Emerald*).
  * **Dynamic Text Auto-Centering Engine**: Pengatur ukuran font (*18px–32px*) yang otomatis menghitung posisi tengah nama peserta.
  * **Excel Roster Simulator**: Menampilkan daftar peserta contoh untuk menguji pengikatan skema kolom spreadsheet secara dinamis.
  * **High-Speed Batch Compilation Simulator**: Menghasilkan 500 PDF dalam **24.8 detik (~20.2 certs/sec)** dengan *progress bar real-time* (memotong waktu kerja manual dari ~4 jam menjadi 25 detik / 99.8% Time Reduction).

---

### 3. 🤖 Machine Learning & Data Automation Systems
* **ML Product Mapping System (`/projects/ml-product-mapping-system/`)**:
  * Ensemble 5-Model (PyTorch Bi-Encoder, Cross-Encoder Transformer, XGBoost, Random Forest, Online Active Learner) dengan presisi 95.4%.
* **Revenue Reconciliation Automation (`/projects/revenue-reconciliation-automation/`)**:
  * Pipeline rekonsiliasi faktur pajak asli vs faktur sistem DBO dengan klasifikasi 4-tier variansi dan ekspor audit Excel via Openpyxl.
* **Amazon Product Intelligence (`/projects/amazon-product-intelligence/`)**:
  * Static-first NLP, TF-IDF rating classifier, dan eksplorasi data 1.4k+ katalog tanpa server database.

---

### 4. 🌐 UI/UX, Navigasi, & Standar Bahasa
* **Konsistensi Bahasa**: 100% menggunakan Bahasa Inggris profesional di seluruh halaman portofolio, studi kasus, metadata, dan bio teks (`content/about.md`).
* **03 / Skills & Tools Matrix**: Tata letak grid vertikal yang lurus dan presisi menggunakan wrapper `.skill-items`, menghubungkan bukti nyata keahlian SQL, Python, Power BI, dan NLP.
* **06 / Career Timeline**: Penataan kolom responsif dengan ikon expand/collapse (`+` / `×`) yang rapi dan tidak terpotong.
* **07 / Contact**: Heading yang ramah dan *humble*: *"Let's build clearer systems together."*

---

## 🛠️ Perintah Pengujian & Verifikasi Lokal

Untuk memverifikasi keutuhan sistem kapan saja:

| Tujuan | Perintah |
| :--- | :--- |
| **Menjalankan Server Dev** | `npm run dev` (Buka `http://localhost:3000`) |
| **Uji Unit Test** | `npm test` atau `npx vitest run` (8/8 Tests Passed) |
| **Pengecekan Tipe TypeScript** | `npm run typecheck` (0 Errors) |
| **Build Ekspor Statis Penuh** | `npm run build` (13/13 Pages Generated) |

---
*Dokumen ini disimpan secara permanen di direktori `Notes Backup/` sebagai catatan resmi.*
