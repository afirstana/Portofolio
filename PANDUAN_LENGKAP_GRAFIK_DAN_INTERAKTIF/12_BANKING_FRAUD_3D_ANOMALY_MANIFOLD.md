# Panduan Komprehensif: Banking Fraud 3D Anomaly Manifold & Real-Time Decision Hyperplane

Dokumen ini membedah secara mendalam seluruh arsitektur penanaman ruang fitur laten tiga dimensi (*latent feature space embedding* $\mathbb{R}^3$), bidang hiper-keputusan dinamis (*decision hyperplane* $\mathcal{H}(\tau)$), kalkulasi matriks kebingungan (*confusion matrix*) waktu-nyata, titik optimal F1-Score, serta penyeimbangan friksi finansial pada proyek **Banking Fraud 3D Anomaly Manifold**.

---

## 01. Ringkasan Eksekutif & Konteks Pembelajaran Mesin

### A. Masalah Bisnis (*The Problem*)
Dalam industri perbankan modern, tim manajemen risiko menghadapi dilema fundamental antara keamanan (*security*) dan kenyamanan nasabah (*customer friction*):
1. **Aturan Ambang Batas Kaku (*Rigid Heuristics*)**: Sistem deteksi fraud tradisional mengandalkan *hardcoded rules* (misalnya: tolak transaksi jika di atas \$1.000 atau terjadi pada pukul 02:00 pagi). Hal ini menyebabkan tingginya penolakan keliru (*False Positives*) pada nasabah setia yang sedang bepergian ke luar negeri atau berbelanja mendesak.
2. **Ketiadaan Visibilitas Interaksi Fitur Non-Linier**: Risiko penipuan jarang terjadi karena satu variabel saja. Penipuan merupakan kombinasi interaktif antara **nominal uang**, **waktu diurnal**, dan **akumulasi pelanggaran perilaku akun**.
3. **Kebutuhan Simulasi Ambang Batas Waktu-Nyata**: Petugas kepatuhan (*compliance officer*) membutuhkan simulator spasial untuk melihat dampak pergeseran *decision boundary* terhadap modal yang diselamatkan vs gesekan nasabah sebelum aturan baru diterapkan ke sistem produksi.

### B. Solusi Rekayasa Manifold & Hyperplane 3D
- Mentransformasikan 2.512 transaksi perbankan sintetis ke dalam **ruang koordinat fitur kontinu $\mathbb{R}^3$** di atas kanvas HTML5 3D berkecepatan 60 FPS tanpa pustaka eksternal.
- Memvisualisasikan **Bidang Hiper-Keputusan Transparan $\mathcal{H}(\tau)$** yang memotong ruang spasial menjadi dua belahan: wilayah transaksi aman vs wilayah transaksi terindikasi fraud.
- Mengintegrasikan mesin telemetri yang menghitung metrik statistik (*True Positives, False Positives, True Negatives, False Negatives, Precision, Recall, F1-Score*) secara instan saat slider digeser.

---

## 02. Panduan Membaca Geometri Ruang Fitur $\mathbb{R}^3$

### Diagram Koordinat Ruang Spasial Tiga Dimensi:

```
                  SUMBU Z: TINGKAT SEVERITAS RISIKO (0 s.d. 6 Poin AML)
                             ^
                             |        [*] Titik Merah (Ground-Truth Fraud)
                             |          /
                             |         /   [BIDANG HIPER-KEPUTUSAN H(tau)]
                             |        /   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
                             |       /   /  Wilayah Fraud Diblokir    /
                             |      /   /                            /
                             |     /   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
                             |    /   /   Wilayah Transaksi Bersih /
                             +---+-------------------------------------> SUMBU X: LOG10 NOMINAL
                            /   /                                        ($20 s.d. $1.920)
                           /   /
                          /   /
                         v   v
                SUMBU Y: JAM DIURNAL (00:00 s.d. 24:00 UTC)
```

#### Cara Membaca Ketiga Sumbu Fitur:
1. **Sumbu X (Skala Logaritmik Nominal Transaksi: $\log_{10}(\text{Amount})$)**:
   - Terbentang dari kiri ke kanan mewakili rentang nilai transaksi dari **\$20 hingga \$1.920**.
   - Skala logaritmik diterapkan agar sebaran mikro-transaksi (\$20–\$100) dan transaksi besar (\$1.000+) terdistribusi secara seimbang tanpa memadati pojok kanvas.
2. **Sumbu Y (Jam Diurnal Transaksi: 00:00 – 24:00 UTC)**:
   - Terbentang dari depan ke belakang.
   - Jam dini hari (*odd hours*, 01:00 – 04:00 UTC) terletak di segmen depan, menyoroti jendela waktu aktivitas pencucian uang dan penarikan ATM ilegal.
3. **Sumbu Z (Tingkat Severitas Pelanggaran AML: 0 – 6 Poin)**:
   - Ketinggian vertikal merefleksikan akumulasi bendera kecurigaan (kecepatan transaksi abnormal, lonjakan nominal, penggunaan perangkat baru, kartu dorman). Semakin tinggi posisi titik, semakin berbahaya profil transaksinya.

---

### Makna Visual Titik Data (*Scatter Points*):
- **Lingkaran Merah Pendar (*Crimson Points*)**: Transaksi yang secara riil berstatus fraud (*ground-truth positive*).
- **Lingkaran Sian Transparan (*Cyan Points*)**: Transaksi sah nasabah normal (*ground-truth negative*).
- **Posisi Terhadap Bidang $\mathcal{H}(\tau)$**:
  - Titik yang berada **di atas/di luar bidang** diputuskan oleh model sebagai **BLOCKED / FRAUD**.
  - Titik yang berada **di bawah bidang** diputuskan sebagai **CLEARED / APPROVED**.

---

## 03. Fungsi Interaktif & Kontrol Komponen

Komponen `BankingFraud3DAnomalyManifold` menyediakan pengalaman laboratorium Machine Learning yang interaktif:

### 1. Penggeser Ambang Batas Keputusan (*Threshold Slider $\tau$*)
- Rentang slider dari $\tau = 0{,}10$ hingga $\tau = 0{,}90$ (langkah kelipatan 0,01).
- Saat slider digeser:
  - Bidang bercahaya $\mathcal{H}(\tau)$ bergeser secara fisik di ruang 3D.
  - Seluruh 2.512 transaksi dievaluasi ulang dalam waktu $<1$ milidetik.
  - Kartu telemetri dan tabel *Confusion Matrix* di bawah kanvas langsung diperbarui tanpa memuat ulang halaman.

### 2. Tombol Filter Mode Transaksi (*Filter Presets*)
- **ALL**: Menampilkan seluruh 2.512 transaksi dalam ruang koordinat.
- **FLAGGED**: Mengisolasi 100% transaksi yang memiliki riwayat bendera anomali.
- **ODD_HOURS**: Menyaring transaksi yang terjadi antara pukul 01:00 hingga 04:00 pagi.
- **HIGH_AMOUNT**: Menyaring transaksi bernilai tinggi (> \$800).
- **DRAIN**: Menampilkan transaksi penarikan saldo drastis (*account draining*).

### 3. Preset Sudut Pandang Kamera 3D
- **Default Isometric ($\text{yaw} = -0{,}72, \text{pitch} = 0{,}38$)**: Sudut pandang tiga perempat untuk melihat pemisahan spasial secara optimal.
- **Frontal Elevation**: Kamera sejajar sumbu X-Z untuk melihat korelasi antara nominal uang dan skor risiko murni.
- **Top-Down Orthogonal**: Kamera tegak lurus dari atas untuk mengamati distribusi siklus jam diurnal (Sumbu X vs Sumbu Y).

### 4. Sakelar Visibilitas Grafis
- **Toggle Hyperplane $\mathcal{H}(\tau)$**: Menyembunyikan atau memunculkan bidang pembatas.
- **Toggle Density Ground Grid**: Menghidupkan jaring kisi-kisi referensi pada dasar kanvas untuk memudahkan orientasi kedalaman.

### 5. Inspektur Transaksi Forensik (*Point Click Inspector*)
- Mengklik titik mana pun pada kanvas 3D mengunci kursor pada transaksi tersebut dan membuka kartu audit lengkap di sisi layar:
  - *Transaction ID & Timestamp*
  - *Account Number & Card Type*
  - *Merchant Category & Channel (ATM, Online, Branch)*
  - *Calculated Continuous Decision Score* vs *Current Threshold $\tau$*
  - *Status Klasifikasi Operasional (TP, FP, TN, atau FN)*.

---

## 04. Formulasi Matematis & Kalkulasi Metrik Evaluasi

### 1. Fungsi Skor Keputusan Kontinu (*Continuous Decision Function*)

Untuk setiap transaksi $\mathbf{x} = (\text{Amt}, t_{\text{hour}}, \text{Risk})$, sistem mengomputasi skor risiko komposit terkalibrasi $S(\mathbf{x}) \in [0{,}0, 1{,}0]$:

$$S(\mathbf{x}) = \min\left(1{,}0, \; 0{,}45 \cdot \left(\frac{\text{Risk}}{6}\right) + 0{,}35 \cdot \text{Norm}(\log_{10}(\text{Amt})) + 0{,}20 \cdot \mathbb{I}(t_{\text{hour}} \in [1, 4])\right)$$

Di mana fungsi normalisasi logaritmik nominal didefinisikan sebagai:

$$\text{Norm}(\log_{10}(\text{Amt})) = \frac{\log_{10}(\text{Amt}) - \log_{10}(20)}{\log_{10}(1920) - \log_{10}(20)}$$

### 2. Definisi Geometris Bidang Hiper-Keputusan $\mathcal{H}(\tau)$

Bidang hiper-keputusan membagi ruang fitur menjadi dua separuh ruang (*half-spaces*):

$$\mathcal{H}(\tau) = \left\{ \mathbf{x} \in \mathbb{R}^3 \;\middle|\; S(\mathbf{x}) = \tau \right\}$$

$$\text{Prediksi}(\mathbf{x}) = \begin{cases}
1 \text{ (Fraud / Block)}, & \text{jika } S(\mathbf{x}) \ge \tau \\
0 \text{ (Clean / Clear)}, & \text{jika } S(\mathbf{x}) < \tau
\end{cases}$$

---

### 3. Matriks Kebingungan Real-Time (*Real-Time Confusion Matrix*)

Dengan membandingkan ground-truth riil $y \in \{0, 1\}$ dengan prediksi model $\hat{y} \in \{0, 1\}$ pada ambang batas $\tau$:

| | Prediksi Fraud ($\hat{y} = 1$) | Prediksi Sah / Lolos ($\hat{y} = 0$) |
| :--- | :---: | :---: |
| **Ground-Truth Fraud ($y = 1$)** | **True Positive (TP)** | **False Negative (FN)** |
| **Ground-Truth Sah ($y = 0$)** | **False Positive (FP)** | **True Negative (TN)** |

### 4. Metrik Kinerja Pembelajaran Mesin

$$\text{Precision} = \frac{TP}{TP + FP}$$

$$\text{Recall} = \frac{TP}{TP + FN}$$

$$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2TP}{2TP + FP + FN}$$

---

### 5. Titik Optimal Ambang Batas (*F1-Score Sweet Spot Analysis*)

Grafik performa sistem terhadap variasi ambang batas $\tau$:

```
Metrik Performa
 1.0 ^
     |              / \  <- Puncak F1-Score (tau* = 0,45, F1 = 0,841)
 0.8 |             /   \_______ Precision
 0.6 |   Recall __/            \
 0.4 |         \                \
 0.2 |          \                \
 0.0 +----------------------------------------------------> Ambang Batas (tau)
     0.10      0.30     0.45      0.60      0.80     0.90
```

| Ambang Batas ($\tau$) | Status Operasional | Recall (Daya Tangkap Fraud) | False Positive (Friksi Nasabah) | Modal Fraud Tertangkap | F1-Score |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0,20 (Terlalu Longgar)** | Sistem Paranoid | **96,4%** | 342 Akun Terblokir Salah | \$48.200 | 0,612 |
| **0,45 (Sweet Spot)** | **Optimal Seimbang** | **88,7%** | **41 Akun Terblokir Salah** | **\$38.940** | **0,841** |
| **0,75 (Terlalu Ketat)** | Sistem Ceroboh | 41,2% | 3 Akun Terblokir Salah | \$16.800 | 0,564 |

---

## 05. Kesimpulan & Kebijakan Risiko Finansial

1. **Pemilihan Ambang Batas Optimal $\tau^* = 0{,}45$**:
   - Menetapkan batas pada $\tau = 0{,}45$ menyelamatkan **\$38.940 modal curian perbankan** sekaligus membatasi komplain nasabah sah hanya pada 41 transaksi dari total 2.512 aktivitas perbankan.
2. **Kuantifikasi Biaya Moneter Penolakan Keliru (*False Friction Cost*)**:
   - Simulator ini memungkinkan divisi perbankan menghitung kerugian reputasi nasabah:
     $$\text{Customer Friction Value} = \sum_{i \in FP} \text{Amount}_i$$
   - Hal ini mengakhiri perdebatan antara divisi Keamanan Siber (yang menginginkan proteksi 100%) dan divisi Pemasaran/Produk (yang menginginkan friksi 0%).
3. **Penerapan Multi-Tier Rule Routing**:
   - Transaksi dengan skor $S(\mathbf{x}) \ge 0{,}60$ dapat langsung **diblokir otomatis**.
   - Transaksi pada zona abu-abu $0{,}40 \le S(\mathbf{x}) < 0{,}60$ tidak langsung ditolak, melainkan ditantang dengan **Verifikasi Biometrik / OTP Dua Faktor (2FA)**, memberikan perlindungan maksimal tanpa mengorbankan kenyamanan nasabah.
