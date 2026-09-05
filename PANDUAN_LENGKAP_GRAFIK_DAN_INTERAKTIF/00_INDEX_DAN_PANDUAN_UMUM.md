# 📚 PANDUAN INDEKS & STANDAR VISUALISASI PORTOFOLIO DATA ANALYTICS & AI

> **Direktori Master**: `C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\PANDUAN_LENGKAP_GRAFIK_DAN_INTERAKTIF\`  
> **Tujuan Dokumen**: Indeks induk dan panduan komprehensif untuk memahami seluruh filosofi desain, palet warna, tipologi grafik, dan mekanisme interaktif di seluruh 12 studi kasus portofolio Abimael.Data.  
> **Sasaran Pembaca**: Data Analyst, Analytics Engineer, Data Scientist, Product Manager, dan Eksekutif Bisnis.  

---

## 01. PETA NAVIGASI 12 STUDI KASUS & FITUR GLOBAL

Portofolio ini dirancang dengan pendekatan **spec-driven & zero AI-slop**, menggabungkan analisis data berbasis bisnis nyata dengan visualisasi tingkat lanjut (dari dashboard 2D interaktif hingga kanvas 3D berbasis matematika Euler native).

```diagram
Lane: Taksonomi 12 Proyek Portofolio Abimael.Data
[01. FINTECH & ANTI-FRAUD] ➔ (#1 2D SQL Suite) ➔ (#11 3D Network Graph) ➔ (#12 3D Anomaly Manifold)
[02. EKONOMETRIKA & ENERGI] ➔ (#2 Brent Market Dynamics) ➔ (#10 3D Volatility Manifold)
[03. EPIDEMIOLOGI KESEHATAN] ➔ (#3 Global Cancer Surveillance & Survival Elasticity)
[04. E-COMMERCE & LOGISTIK] ➔ (#4 Olist Logistics & SLA) ➔ (#5 Olist Payment & RFM) ➔ (#6 Amazon NLP)
[05. REKAYASA SISTEM & ML] ➔ (#7 ML Product Mapping) ➔ (#8 Revenue Reconciliation) ➔ (#9 Certificate App)
[06. GLOBAL UX & KINEMATIKA] ➔ (Kupu-kupu Fisika Interaktif, Command Palette Ctrl+K, Telemetri)
```

### 📋 Daftar Berkas Panduan Lengkap Per Proyek

| No | Berkas Panduan | Nama Proyek & Topik Utama | Format Visualisasi Unggulan |
|---|---|---|---|
| **01** | [`01_BANKING_TRANSACTION_ANTI_FRAUD.md`](./01_BANKING_TRANSACTION_ANTI_FRAUD.md) | **Banking Anti-Fraud 2D Enterprise SQL Suite** | 6 Dashboard Power BI, Live SQL Engine, Risk Simulator |
| **02** | [`02_BRENT_OIL_MARKET_DYNAMICS.md`](./02_BRENT_OIL_MARKET_DYNAMICS.md) | **Brent Oil Market Dynamics & Geopolitical Econometrics** | Ekonometrika 35.5 Tahun, 7 Rezim Krisis, VaR 99% & ES |
| **03** | [`03_GLOBAL_CANCER_EPIDEMIOLOGY.md`](./03_GLOBAL_CANCER_EPIDEMIOLOGY.md) | **Global Cancer Epidemiology & Survival Surveillance** | Scatter/Bubble 281k baris, 15 Survival Matrix, GDP Elasticity |
| **04** | [`04_OLIST_LOGISTICS_ANALYSIS.md`](./04_OLIST_LOGISTICS_ANALYSIS.md) | **Olist E-Commerce Logistics & Delivery SLA** | Peta Latensi 27 Negara Bagian Brazil, Freight vs Delivery |
| **05** | [`05_OLIST_PAYMENT_BEHAVIOR.md`](./05_OLIST_PAYMENT_BEHAVIOR.md) | **Olist Payment Behavior & Installment Depth** | Payment Mix Donut, Cicilan vs AOV, Matriks RFM 4 Pilar |
| **06** | [`06_AMAZON_PRODUCT_INTELLIGENCE.md`](./06_AMAZON_PRODUCT_INTELLIGENCE.md) | **Amazon Product Review Intelligence & NLP Simulator** | Live NLP Sentiment Simulator, ML Benchmark ROC-AUC 0.8369 |
| **07** | [`07_ML_PRODUCT_MAPPING.md`](./07_ML_PRODUCT_MAPPING.md) | **Automated ML Product Taxonomy Mapping System** | Cosine Similarity Matrix, Kurva Precision-Recall Tradeoff |
| **08** | [`08_REVENUE_RECONCILIATION.md`](./08_REVENUE_RECONCILIATION.md) | **Multi-Tier Revenue Reconciliation & Variance Engine** | Diagram Waterfall 4 Tingkat, Audit Variance Inspector |
| **09** | [`09_CERTIFICATE_GENERATOR_APP.md`](./09_CERTIFICATE_GENERATOR_APP.md) | **Automated Certificate Engine & Layout Grid** | Grid Kalibrasi Tipografi, Batch Rendering, Hash Integrity |
| **10** | [`10_BRENT_OIL_3D_VOLATILITY_MANIFOLD.md`](./10_BRENT_OIL_3D_VOLATILITY_MANIFOLD.md) | **Brent Oil 3D Volatility & Leptokurtic Crisis Manifold** | Kanvas 3D 36 Epoch × 19 Bin Return, 7 Tiang Laser Krisis |
| **11** | [`11_BANKING_FRAUD_3D_NETWORK_GRAPH.md`](./11_BANKING_FRAUD_3D_NETWORK_GRAPH.md) | **Banking 3D Force-Directed Financial Crime Graph** | Graf 3D Coulomb-Hooke, Aliran Dana Laser, 3 Sindikat |
| **12** | [`12_BANKING_FRAUD_3D_ANOMALY_MANIFOLD.md`](./12_BANKING_FRAUD_3D_ANOMALY_MANIFOLD.md) | **Banking 3D Latent Feature Manifold & Hyperplane** | Ruang Fitur $R^3$, 3D Decision Hyperplane $\mathcal{H}(\tau)$, Confusion Matrix |
| **13** | [`13_FITUR_GLOBAL_DAN_KINEMATIKA.md`](./13_FITUR_GLOBAL_DAN_KINEMATIKA.md) | **Fitur Global, Fisika Kupu-kupu & Command Palette** | Simulasi Kinematika Kupu-kupu, Repulsi Kursor, Ctrl+K |

---

## 02. STANDAR WARNA & SEMANTIK VISUAL (COLOR DESIGN SYSTEM)

Seluruh grafik di portofolio ini menggunakan sistem token warna obsidian berlatar belakang gelap (`#050506`, `#0b0b0e`) dengan kontras tinggi berstandar WCAG AAA:

| Nama Token / Warna | Kode Hex | Arti Semantis dalam Grafik | Contoh Penggunaan Nyata |
|---|---|---|---|
| **Neon Cyan** | `#00f0ff` / `#38bdf8` | **Kondisi Normal / Wajar / Baseline** | Akun perbankan sah, transaksi yang disetujui (*Approved*), rezim pasar minyak stabil, atau rute pengiriman tepat waktu. |
| **Neon Crimson** | `#f43f5e` / `#ef4444` | **Anomali Kritis / Penipuan / Bahaya** | Akun pembobol (*Fraudster*), transaksi terblokir (*Blocked*), keterlambatan SLA logistik parah, atau lonjakan mortalitas kanker. |
| **Amber Gold** | `#f59e0b` / `#fbbf24` | **Peringatan / Transisi / Jam Rawan** | Area lantai jam malam (*Twilight Zone* 01:00–04:00 UTC), peringatan keterlambatan kurir sedang, atau volatilitas pasar minyak meningkat. |
| **Emerald Green** | `#10b981` / `#059669` | **Terminal Tunai / Sukses / Akurasi Tinggi** | Mesin ATM pencairan tunai, tingkat *Recall* tinggi, segmen pelanggan *Champions* (RFM), atau keberhasilan rekonsiliasi finansial 100%. |
| **Electric Purple** | `#a855f7` / `#8b5cf6` | **Entitas Perangkat / Bot Farm / Metadata** | Gadget bersama (*Shared Device Fingerprint*), model machine learning, token clustering, atau klaster negara berpenghasilan menengah. |
| **Subtle Slate** | `#64748b` / `#475569` | **Garis Grid / Anotasi / Titik Latar Belakang** | Grid lantai 3D, sumbu koordinat referensi, titik-titik transaksi pasif saat 1-hop isolation aktif (reduksi opasitas hingga 10%). |

---

## 03. PRINSIP INTERAKSI: BAGAIMANA MENGGUNAKAN GRAFIK

Seluruh visualisasi di portofolio ini **bukan sekadar gambar statis**, melainkan sistem komputasi lokal (*Local-First Analytics*) yang berjalan langsung di browser pengguna:

1. **Eksplorasi Orbit 3D**:
   - **Klik Kiri + Tahan + Geser**: Memutar sudut pandang kamera 360° secara kontinu.
   - **Tombol Zoom (+ / -)**: Menyesuaikan jarak kamera (*camera distance*) dengan pembacaan persentase magnifikasi real-time.
   - **Preset Kamera Instan**: Tombol cepat untuk mengubah perspektif (Isometrik, Profil Samping/Waktu, atau Peta Kerapatan Atas-Bawah).
2. **Dynamic Threshold Tuning**:
   - Slider ambang batas (seperti $\tau$ pada anti-fraud manifold) yang menghitung ulang seluruh matriks konfusi (Precision, Recall, F1) pada ribuan data seketika tanpa jeda loading server.
3. **Sub-Pixel Raycasting Inspector**:
   - Klik pada partikel titik, node graf, atau sel heatmap untuk memunculkan **Dossier Forensik Modal** yang menampilkan detail baris transaksi, histori pelanggan, atau metadata diagnostik.
4. **Isolasi Subgraph 1-Hop / 2-Hop**:
   - Klik pada akun mencurigakan untuk meredupkan 90% elemen lain yang tidak terkait, membebaskan investigator dari *cognitive overload*.

---
*Silakan buka berkas nomor `01` s.d. `13` untuk membaca rincian mendalam setiap proyek secara spesifik.*
