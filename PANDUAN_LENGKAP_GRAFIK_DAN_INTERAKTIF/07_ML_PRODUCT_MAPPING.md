# Panduan Komprehensif: ML Product Mapping System & Hybrid Ensemble Architecture

Dokumen ini membedah secara mendalam arsitektur model *machine learning* bertingkat (*hierarchical ensemble*), mekanisme *active learning human-in-the-loop*, ambang batas triase keyakinan (*confidence triage*), serta dampak otomatisasi pada proyek **ML Product Mapping System** di DBC Group (Djabesmen Group: Rucika, Djabesmen, RB Shera, Superex).

---

## 01. Ringkasan Eksekutif & Konteks Industri

### A. Masalah Bisnis (*The Problem*)
Sebagai konglomerasi manufaktur bahan bangunan terbesar di Indonesia, DBC Group menerima ribuan dokumen Surat Pesanan (*Purchase Order* / PO) dan faktur setiap hari dari ratusan distributor independen di seluruh nusantara.
1. **Penulisan Singkatan Tidak Terstandar**: Setiap distributor memiliki format penamaan produk yang kacau dan beragam, misalnya:
   - *"RCK PPA AW 1/2 INCH X 4M PUTIH"* vs *"PIPA PVC RUCIKA STD AW 0.5 INCH"* vs *"RUCIKA AW 1/2"*
2. **Risiko Fatal Kesalahan Spesifikasi Teknis**:
   - Tertukarnya pipa kelas **AW** (pipa bertekanan tinggi untuk air bersih) dengan kelas **D** (pipa tipis bertekanan rendah untuk pembuangan) dapat menyebabkan pecahnya pipa pada proyek konstruksi pelanggan dan klaim ganti rugi besar.
3. **Waktu Rekonsiliasi Lambat**: Rekonsiliasi manual berbasis spreadsheet Excel memakan waktu hingga **3 hari kerja penuh setiap akhir bulan**, melibatkan puluhan staf administrasi.

### B. Solusi Teknis & Desain Sistem
- Merancang **sistem *ensemble* 6-komponen hierarkis** yang menggabungkan *deep learning dense retrieval* (Bi-Encoder 384 dimensi), transformer re-ranking (Cross-Encoder), pohon keputusan terbobot (*gradient boosted* XGBoost & Random Forest), karakter N-Gram TF-IDF, dan pembelajar inkremental waktu-nyata (*Online Active Learner*).
- Menetapkan protokol **Triase Keyakinan 3-Tingkat (*3-Tier Confidence Triage*)** untuk menjamin keselamatan operasional pabrik.
- Mengintegrasikan hasil pemetaan langsung ke Master Data SKU SAP ERP perusahaan.

---

## 02. Panduan Membaca Alur Diagram & Arsitektur Sistem

### Diagram Alur: Pipeline Triase Pemetaan SKU Otomatis

```
+-----------------------------------------------------------------------------------+
| PIPELINE REKONSILIASI PEMETAAN PRODUK HIERARKIS                                   |
|                                                                                   |
| [1. TEKS PO DISTRIBUTOR RAW]                                                      |
|   "RCK PPA AW 1/2 IN PUTIH"                                                       |
|        │                                                                          |
|        ▼                                                                          |
| [2. PREPROCESSING REGEX & NORMALISASI DIMENSI]                                    |
|   1/2" -> 0.5 INCH, RCK -> RUCIKA, PPA -> PIPA, PUTIH -> WHT                      |
|        │                                                                          |
|        ▼                                                                          |
| [3. FAST DENSE RETRIEVAL: PYTORCH BI-ENCODER (~3ms)]                              |
|   Menghasilkan 384-d vektor embedding, mengekstrak Top-30 Kandidat Master SKU     |
|        │                                                                          |
|        ▼                                                                          |
| [4. DEEP SEMANTIC RE-RANKING: CROSS-ENCODER TRANSFORMER (~18ms)]                  |
|   Evaluasi cross-attention tingkat kata (memvalidasi AW vs D, drat kuningan)      |
|        │                                                                          |
|        ▼                                                                          |
| [5. META-CLASSIFIER: XGBOOST + RANDOM FOREST + TF-IDF + ACTIVE LEARNER]           |
|   Kombinasi skor probabilitas terbobot menghasilkan Final Confidence Score (0-100)|
|        │                                                                          |
|        ├───────────────┬──────────────────────────────┬───────────────────────────┤
|        ▼               ▼                              ▼                           |
| [TIER 1: SCORE >= 85%] [TIER 2: SCORE 60% - 84%]      [TIER 3: SCORE < 60%]       |
| AUTO-APPROVED (>80%)   HUMAN REVIEW QUEUE (<20%)      ANOMALY / MASTER DATA FLAG  |
| Langsung masuk SAP     Operator klik 1 dari Top 3     Item produk baru/belum      |
| Akurasi: 95,4%         Update SGD Learner <1ms        terdaftar di katalog resmi  |
+-----------------------------------------------------------------------------------+
```

#### Cara Membaca Alur:
1. **Tahap Pra-Pemrosesan (*Regex Normalization*)**: Mengubah seluruh variasi penulisan ukuran inci, pecahan, dan singkatan umum (*vulgar fractions* $1/2 \rightarrow 0{,}5$) menjadi representasi kanonikal.
2. **Penyaringan Cepat (*Bi-Encoder Retrieval*)**: Memangkas puluhan ribu katalog Master SKU menjadi hanya 30 kandidat terdekat dalam waktu **~3 milidetik**.
3. **Penilaian Teliti (*Cross-Encoder & Meta-Classifier*)**: Memeriksa token krusial yang menentukan kecocokan fisik barang.
4. **Gerbang Keputusan (*Confidence Gate*)**: Memisahkan transaksi yang aman disetujui otomatis vs transaksi yang memerlukan validasi mata manusia.

---

## 03. Formulasi Matematis & Algoritma Ensemble

### 1. Persamaan Skor Ansambel Terbobot (*Weighted Meta-Score*)

Skor kecocokan akhir antara teks input distributor $x$ dan kandidat Master SKU $y$ dihitung melalui kombinasi linier terkalibrasi:

$$S(x, y) = 0{,}20 M_1(x, y) + 0{,}25 M_2(x, y) + 0{,}20 M_3(x, y) + 0{,}15 M_4(x, y) + 0{,}10 M_5(x, y) + 0{,}10 \text{TF-IDF}(x, y)$$

Di mana:
- **$M_1$ (Bi-Encoder Similarity)**: *Cosine similarity* dari representasi vektor berdimensi 384 yang dihasilkan model PyTorch *MiniLM*:
  $$M_1(x, y) = \frac{\mathbf{u}_x \cdot \mathbf{v}_y}{\|\mathbf{u}_x\|_2 \|\mathbf{v}_y\|_2}$$
- **$M_2$ (Cross-Encoder Probability)**: Output softmax dari transformer yang menerima pasangan kalimat konkatenasi $[x; y]$:
  $$M_2(x, y) = \text{Softmax}(\mathbf{W}_2 \cdot \text{Transformer}([x; y]))$$
- **$M_3$ (XGBoost Classifier)**: Probabilitas prediksi dari pohon *Gradient Boosting* yang dilatih pada 8 fitur statistik teks (panjang token, kesamaan Levenshtein, rasio angka, kecocokan kelas tekanan, dll.).
- **$M_4$ (Random Forest Meta-Classifier)**: Ansambel *bagging* 100 pohon keputusan untuk meregularisasi variansi pada produk-produk langka (*long-tail SKUs*).
- **$M_5$ (Online Active Learner)**: Model linier inkremental menggunakan `SGDClassifier` dengan *log loss*:
  $$L(\mathbf{w}) = \log(1 + e^{-y_i \mathbf{w}^T \mathbf{x}_i}) + \alpha \|\mathbf{w}\|_2^2$$
- **$\text{TF-IDF}$ (Character N-Gram)**: Kesamaan kosinus sub-kata (3-gram hingga 5-gram karakter) untuk menangkal salah ketik (*typo*) parah distributor.

---

### 2. Mekanisme Pembelajaran Aktif (*Online Active Learning*)

Ketika sebuah pesanan jatuh ke **Tier 2** (skor 60% – 84%), sistem menampilkan 3 kandidat teratas kepada operator logistik:

```
[CONTOH TAMPILAN OPERATOR REVIEW QUEUE]
Teks Distributor: "SOK PIPA KHUSUS DRAT KUNINGAN"
Status          : Review Queue (Skor: 74,5%)

Kandidat Tersedia:
[1] [PILIH] RUCIKA-FIT-FAUCET-SCK-050 (Faucet Socket AW Brass Insert 1/2") -> Skor 74,5%
[2] [     ] RUCIKA-FIT-VALVE-SCK-050  (Valve Socket AW Plain 1/2")          -> Skor 68,2%
[3] [     ] RUCIKA-FIT-UNION-SCK-050  (Union Socket TS 1/2")                -> Skor 61,0%
```

Ketika operator mengklik kandidat [1]:
1. Sistem mengirim vektor fitur pasangan tersebut ke *Online Active Learner*.
2. Algoritma melakukan *one-step stochastic gradient descent* secara instan:
   $$\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} - \eta \left(\nabla_{\mathbf{w}} L(\mathbf{w}^{(t)}; \mathbf{x}_{\text{new}}, y_{\text{selected}})\right)$$
3. Waktu eksekusi pembaruan bobot berlangsung dalam **$< 1\text{ ms}$**.
4. Jika distributor yang sama mengirimkan deskripsi yang mirip di masa mendatang, skor produk tersebut otomatis terangkat ke atas 85% (**Tier 1 Auto-Approved**).

---

## 04. Matriks Transformasi Katalog Multi-Brand

Tabel berikut menunjukkan contoh nyata transformasi data produksi lintas 4 merek manufaktur DBC Group:

| Merek | Deskripsi Raw Distributor (Input) | Standarisasi Master SKU (Output ERP) | Skor Keyakinan | Status Triase |
| :--- | :--- | :--- | :---: | :---: |
| **Rucika** | `RCK PPA AW 1/2 INCH X 4M PUTIH` | `RUCIKA-PVC-AW-050-4M-WHT (Pipa PVC Standard AW 1/2" 4M)` | **98,2%** | `Auto-Approved` |
| **Rucika** | `KNEE DRAT DLM RCK 3/4X1/2 AW` | `RUCIKA-FIT-AW-FTE-075X050 (Faucet Elbow AW 3/4" x 1/2")` | **94,6%** | `Auto-Approved` |
| **Djabesmen** | `ATAP FIBER DJABES GEL 14 2100` | `DJABES-GLB14-2100X1020-GREY (Atap Semen Gelombang 14 2.10M)` | **96,1%** | `Auto-Approved` |
| **RB Shera** | `PAPAN FIBER SHERA PLANK COKLAT 3M` | `SHERA-PLK-TEAK-08X200X3000 (Shera Plank Dint Teak Brown 3M)` | **91,8%** | `Auto-Approved` |
| **Superex** | `TLNG AIR SUPEREX 4M SET ACC` | `SPRX-GUTTER-U140-4M-SET (Talang Air PVC U-140 Set 4M)` | **89,3%** | `Auto-Approved` |
| **Rucika** | `SOK PIPA KHUSUS DRAT KUNINGAN` | `RUCIKA-FIT-FAUCET-SCK-050 (Faucet Socket AW Brass Insert 1/2")` | **74,5%** | `Review Queue (Top 1)` |
| **Unknown** | `PIPA BESI HITAM SCH 40 2 IN` | *— Produk non-katalog DBC Group terdeteksi —* | **38,2%** | `Anomaly Flag` |

---

## 05. Evaluasi Kinerja & Dampak Bisnis Nyata

### Perbandingan Efisiensi Operasional:

| Metrik Operasional Perusahaan | Sebelum Otomasi ML | Sesudah Implementasi ML | Dampak / ROI Bisnis |
| :--- | :---: | :---: | :--- |
| **Waktu Siklus Rekonsiliasi PO Bulanan** | 3 Hari Kerja Penuh (72 Jam) | **< 5 Menit** | **Pemangkasan durasi sebesar 99,1%** |
| **Volume PO Terotomasi (*Zero-Touch*)** | 0% (100% manual manusia) | **> 80,0% PO Lines** | **Hemat 4,2 jam kerja staf setiap hari** |
| **Tingkat Presisi Otomasi (*Audited Precision*)** | N/A (human error ~4%) | **95,4% Presisi Audit** | **Nol insiden salah kirim pipa AW vs D** |
| **Waktu Tunggu Retraining Model** | Retraining Batch Mingguan | **< 1 ms Inkremental** | **Sistem terus pintar tanpa downtime** |

### Pelajaran Teknis & Tata Kelola AI:
1. **Keunggulan Ansambel Multimodel**: Model deep learning seperti transformer sangat unggul dalam memahami semantik kata, namun rentan pada salah ketik kode teknis; menggabungkannya dengan n-gram karakter dan model berbasis pohon memberikan kekokohan (*robustness*) yang tidak dapat dicapai oleh model tunggal.
2. **Pemisahan Jalur Triase Membangun Kepercayaan Organisasi**: Pengguna bisnis (tim gudang dan finansial) tidak akan mempercayai sistem *black-box* yang memaksakan tebakan 100%. Dengan menyediakan *Review Queue* transparan pada rentang keyakinan 60%–84%, kepercayaan operasional melonjak dan akurasi terjamin 100%.
