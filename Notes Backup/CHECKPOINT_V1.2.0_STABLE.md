# 🔒 BACKUP CHECKPOINT & ROLLBACK GUIDE (v1.2.0-stable)

## 📌 Checkpoint Metadata

| Field | Detail |
| :--- | :--- |
| **Official Tag Name** | `v1.2.0-stable` (Previous: `v1.1.0-stable`, `v1.0.0-stable`) |
| **Commit Hash** | `dc53b66` |
| **Commit Message** | `style(work): add responsive scroll container and custom scrollbar to project explorer list` |
| **Tag Annotation** | `Release v1.2.0: 6 Complete Projects with Scrollable Work Explorer, Olist Payment Analytics, Logistics Map, RFM Matrix, and Certificate Simulator` |
| **Remote Repository** | `https://github.com/afirstana/Portofolio.git` (Branch: `main`) |
| **GitHub Status** | ✅ **Permanently Tagged & Pushed to Remote** |
| **Date & Time** | `Sunday, August 16, 2026` |

---

## ⚡ How to Rollback to This Checkpoint (Apa yang Harus Dijalankan)

Jika Anda ingin mengembalikan (*rollback*) proyek ke titik ini kapan saja, buka terminal PowerShell di folder `project` dan jalankan:

```powershell
# 1. Bersihkan perubahan lokal & ambil tag terbaru
git fetch origin --tags
git reset --hard v1.2.0-stable

# 2. Pastikan dependensi sinkron
npm install

# 3. Jalankan server lokal
npm run dev
```

---

## 📦 6 Complete Projects & UI Enhancements in `v1.2.0-stable`:

1. **📱 Scrollable Work Explorer Container**:
   * Kontainer daftar proyek kini memiliki batas tinggi dinamis `max-height: clamp(540px, 68vh, 700px)` dengan *custom slim scrollbar* aksen oranye 4px, menjaga beranda tetap ringkas dan elegan.
2. **#01. ML Product Mapping System** (`/projects/ml-product-mapping-system/`)
   * Ensemble 5-Model (PyTorch Bi-Encoder, Cross-Encoder, XGBoost, Random Forest, Online Active Learner) dengan 95.4% presisi.
3. **#02. Revenue Reconciliation Automation** (`/projects/revenue-reconciliation-automation/`)
   * Engine rekonsiliasi faktur pajak asli vs faktur sistem DBO dengan klasifikasi 4-tier dan laporan audit Openpyxl.
4. **#03. Olist E-Commerce Logistics & Customer Intelligence** (`/projects/olist-e-commerce-logistics-analysis/`)
   * Peta Vektor Asli 27 Negara Bagian Brazil (SVG Polygons) + Dynamic Hover Telemetry HUD + 2.0x Lead Time Disparity.
   * Matriks 2D RFM Customer Retention (93.4k pembeli, 4 kuadran nilai + dossier strategi interaktif).
5. **#04. Olist Payment & Installment Behavior Analytics** (`/projects/olist-payment-behavior-analytics/`)
   * Distribusi 4 Channel Pembayaran (Credit Card 78.4% GMV, Boleto 17.9% GMV, Voucher 2.4%, Debit 1.4%).
   * Kurva Elastisitas Cicilan vs AOV (3.3x lonjakan nilai keranjang pada 7–10x cicilan, Pearson r = 0.37).
   * Diagnosa Anomali 10x Checkout UX Heuristics & Matriks Sensitivitas Kategori Barang Tahan Lama vs Konsumsi.
6. **#05. Certificate Generator Desktop App** (`/projects/certificate-generator-desktop-app/`)
   * Standalone zero-install Python desktop app (CustomTkinter + ReportLab + Pillow).
   * Live 300-DPI Vector Canvas Preview (Obsidian, Gold, Emerald), dynamic text auto-centering, & batch simulator (500 certs / 24.8s).
7. **#06. Amazon Product Intelligence** (`/projects/amazon-product-intelligence/`)
   * Static-first NLP, TF-IDF rating classifier, dan eksplorasi data 1.4k+ katalog.

---

## 🛠️ Perintah Pengujian & Verifikasi Lokal

| Tujuan | Perintah |
| :--- | :--- |
| **Menjalankan Server Dev** | `npm run dev` (Buka `http://localhost:3000`) |
| **Uji Unit Test** | `npm test` atau `npx vitest run` (8/8 Tests Passed) |
| **Pengecekan Tipe TypeScript** | `npm run typecheck` (0 Errors) |
| **Build Ekspor Statis Penuh** | `npm run build` (14/14 Pages Generated) |
