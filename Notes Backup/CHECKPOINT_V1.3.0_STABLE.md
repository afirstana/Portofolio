# 🔒 BACKUP CHECKPOINT & ROLLBACK GUIDE (v1.3.0-stable)

## 📌 Checkpoint Metadata

| Field | Detail |
| :--- | :--- |
| **Official Tag Name** | `v1.3.0-stable` (Previous: `v1.2.0-stable`, `v1.1.0-stable`, `v1.0.0-stable`) |
| **Commit Hash** | `577399c` |
| **Commit Message** | `feat(ux): add minimalist floating back-to-top button on bottom right with smooth scroll` |
| **Tag Annotation** | `Release v1.3.0: 6 Complete Projects with Floating Minimalist Back-to-Top Button, Scrollable Work Explorer, Olist Payment Analytics, Logistics Map, RFM Matrix, and Certificate Simulator` |
| **Remote Repository** | `https://github.com/afirstana/Portofolio.git` (Branch: `main`) |
| **GitHub Status** | ✅ **Permanently Tagged & Pushed to Remote** |
| **Date & Time** | `Sunday, August 16, 2026` |

---

## ⚡ How to Rollback to This Checkpoint (Apa yang Harus Dijalankan)

Jika Anda ingin mengembalikan (*rollback*) proyek ke titik ini kapan saja, buka terminal PowerShell di folder `project` dan jalankan:

```powershell
# 1. Bersihkan perubahan lokal & ambil tag terbaru
git fetch origin --tags
git reset --hard v1.3.0-stable

# 2. Pastikan dependensi sinkron
npm install

# 3. Jalankan server lokal
npm run dev
```

---

## 📦 Features & Systems in `v1.3.0-stable`:

1. **🔝 Minimalist Floating Back-to-Top Button**:
   * Tombol mengambang elegan di sudut kanan bawah (`position: fixed; bottom: 26px; right: 26px;`) dengan efek *glassmorphism* minimalis (`rgba(13,13,16,0.85)` + blur 12px), *smart auto-fade* saat scroll >320px, dan *smooth scroll to top*.
2. **📱 Scrollable Work Explorer Container**:
   * Kontainer daftar proyek dengan batas tinggi dinamis `max-height: clamp(540px, 68vh, 700px)` dan *custom slim scrollbar* aksen oranye 4px.
3. **#01. ML Product Mapping System** (`/projects/ml-product-mapping-system/`)
   * Ensemble 5-Model (PyTorch Bi-Encoder, Cross-Encoder, XGBoost, Random Forest, Online Active Learner) dengan 95.4% presisi.
4. **#02. Revenue Reconciliation Automation** (`/projects/revenue-reconciliation-automation/`)
   * Engine rekonsiliasi faktur pajak asli vs faktur sistem DBO dengan klasifikasi 4-tier dan laporan audit Openpyxl.
5. **#03. Olist E-Commerce Logistics & Customer Intelligence** (`/projects/olist-e-commerce-logistics-analysis/`)
   * Peta Vektor Asli 27 Negara Bagian Brazil (SVG Polygons) + Dynamic Hover Telemetry HUD + 2.0x Lead Time Disparity.
   * Matriks 2D RFM Customer Retention (93.4k pembeli, 4 kuadran nilai + dossier strategi interaktif).
6. **#04. Olist Payment & Installment Behavior Analytics** (`/projects/olist-payment-behavior-analytics/`)
   * Distribusi 4 Channel Pembayaran (Credit Card 78.4% GMV, Boleto 17.9% GMV, Voucher 2.4%, Debit 1.4%).
   * Kurva Elastisitas Cicilan vs AOV (3.3x lonjakan nilai keranjang pada 7–10x cicilan, Pearson r = 0.37).
   * Diagnosa Anomali 10x Checkout UX Heuristics & Matriks Sensitivitas Kategori Barang Tahan Lama vs Konsumsi.
7. **#05. Certificate Generator Desktop App** (`/projects/certificate-generator-desktop-app/`)
   * Standalone zero-install Python desktop app (CustomTkinter + ReportLab + Pillow).
   * Live 300-DPI Vector Canvas Preview (Obsidian, Gold, Emerald), dynamic text auto-centering, & batch simulator (500 certs / 24.8s).
8. **#06. Amazon Product Intelligence** (`/projects/amazon-product-intelligence/`)
   * Static-first NLP, TF-IDF rating classifier, dan eksplorasi data 1.4k+ katalog.

---

## 🛠️ Perintah Pengujian & Verifikasi Lokal

| Tujuan | Perintah |
| :--- | :--- |
| **Menjalankan Server Dev** | `npm run dev` (Buka `http://localhost:3000`) |
| **Uji Unit Test** | `npm test` atau `npx vitest run` (8/8 Tests Passed) |
| **Pengecekan Tipe TypeScript** | `npm run typecheck` (0 Errors) |
| **Build Ekspor Statis Penuh** | `npm run build` (14/14 Pages Generated) |
