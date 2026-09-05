# Panduan Komprehensif: Amazon Product Intelligence & Live NLP Inference Engine

Dokumen ini membedah secara mendalam seluruh arsitektur data, visualisasi statistik, mesin inferensi pemrosesan bahasa alami (*Natural Language Processing*) yang berjalan 100% di browser, serta tolok ukur model *machine learning* pada proyek **Amazon Product Intelligence**.

---

## 01. Ringkasan Eksekutif & Arsitektur Sistem

### A. Masalah Bisnis (*The Problem*)
Dalam platform marketplace skala besar seperti Amazon, jutaan ulasan produk teks bebas (*unstructured customer reviews*) masuk setiap hari. Tim *product intelligence* dan *merchandising* menghadapi tantangan:
1. **Beban Ekstraksi Opini Manual**: Mengidentifikasi produk berkualitas buruk atau cacat produksi (*defective wiring, overheating, misleading specs*) dari ribuan teks ulasan memakan waktu lama jika dilakukan secara manual.
2. **Ketergantungan Server untuk Analitik NLP**: Kebanyakan dasbor analitik memerlukan arsitektur backend Python yang mahal (server GPU/CPU) hanya untuk menjalankan inferensi sentimen teks.
3. **Korelasi Harga & Kepuasan yang Kompleks**: Menguji apakah diskon besar mempengaruhi rating kepuasan konsumen secara empiris.

### B. Solusi Teknis & Keunikan Arsitektur
- **Browser-Only Static Inference Engine**: Mengonversi model klasifikasi terlatih (*scikit-learn* Logistic Regression & TF-IDF Vectorizer) menjadi payload JSON statis yang dieksekusi secara instan (<5 milidetik) di sisi klien (*client-side browser*) menggunakan JavaScript murni tanpa panggilan API server.
- **Explainability & Feature Contribution**: Mengurai setiap kata dalam kalimat ulasan menjadi kontribusi numerik positif atau negatif terhadap probabilitas sentimen.
- **Laboratorium Analitik Multivariat**: Menyediakan histogram dinamis, visualisasi *scatter plot* 2D dengan transformasi logaritmik $\log_{10}$, dan kalkulasi koefisien korelasi Pearson waktu-nyata.

---

## 02. Panduan Membaca Grafik & Visualisasi

### Grafik 1: Histogram Distribusi Metrik Produk (Rating, Diskon, dan Harga)

Dasbor menyajikan tiga panel histogram 10-bin interaktif:

```
[HISTOGRAM DISTRIBUSI RATING]            [HISTOGRAM DISTRIBUSI DISKON %]
Frekuensi                               Frekuensi
   ^                                       ^
400|               ■■■ (4.2)            300|         ■■■■■■ (50-60%)
300|            ■■■■■■ (4.1)            200|      ■■■■■■■■■ (40-50%)
200|         ■■■■■■■■■ (4.0)            100|   ■■■■■■■■■■■■ (20-40%)
100|      ■■■■■■■■■■■■ (3.8)             50| ■■■■■■■■■■■■■■ (0-20%)
 0 +------------------------> Rating      0 +------------------------> Diskon %
   2.5  3.0  3.5  4.0  4.5  5.0             0%   25%  50%  75% 100%
```

#### Cara Membaca & Interpretasi:
1. **Histogram Rating (*Customer Star Rating*)**:
   - Terdistribusi miring ke kiri (*negatively skewed*), dengan modus berada di kisaran **4,1 hingga 4,3 bintang**.
   - Menunjukkan fenomena *positivity bias* pada e-commerce di mana konsumen yang sangat puas lebih condong memberikan ulasan dibandingkan konsumen netral.
2. **Histogram Persentase Diskon (*Discount Percentage*)**:
   - Puncak frekuensi berada pada diskon **50% hingga 65%**. Ini menunjukkan strategi penetapan harga psikologis (*anchor pricing*) di mana harga retail resmi sengaja dipatok tinggi agar diskon terlihat agresif.
3. **Histogram Harga Terdiskon (*Discounted Price*)**:
   - Memiliki ekor kanan yang panjang (*positively skewed* / distribusi pareto). Mayoritas produk aksesori elektronik terkonsentrasi pada harga di bawah ₹1.500, dengan segmen premium di atas ₹5.000.

---

### Grafik 2: Interactive 2D Scatter Plot & Korelasi Pearson Real-Time

Komponen `ScatterPlot` memetakan pasangan variabel numerik dari produk yang difilter dan menghitung nilai korelasi Pearson $r$ secara dinamis:

```
Harga Diskon (Log10)
  ^
  |      ·  ·       ·
  |    ·  ·   ·   ·   ·   ·
  |  ·   · ·  · ·   ·   ·   ·     r = -0,042 (Tidak ada korelasi signifikan)
  |·  ·   ·  ·   ·  · ·   ·
  +------------------------------> Rating Kepuasan Pelanggan
 2.5     3.0     3.5     4.0     4.5     5.0
```

#### Cara Membaca dan Pasangan Variabel Analisis:
1. **Harga Diskon vs Rating**: Nilai $r \approx -0{,}04$ mengindikasikan bahwa harga mahal tidak menjamin rating tinggi. Konsumen menilai produk berdasarkan ekspektasi nilai (*value-for-money*), bukan kemewahan harga.
2. **Persentase Diskon vs Rating**: Nilai $r \approx 0{,}02$ membuktikan bahwa diskon besar (misal 70%) tidak meningkatkan kepuasan bintang; produk berkualitas buruk tetap akan mendapat ulasan negatif terlepas dari seberapa murah harganya.
3. **Rating Count (Volume Ulasan) vs Rating**: Menampilkan tren konvergensi variansi; produk dengan jumlah ulasan sedikit memiliki sebaran bintang sangat lebar (1,0 hingga 5,0), sementara produk dengan 10.000+ ulasan selalu mengumpul stabil di 4,1 – 4,3 bintang (*Law of Large Numbers*).
4. **Transformasi Sumbu $\log_{10}$**: Tombol skala logaritmik memadatkan variansi volume ulasan (dari 10 ulasan hingga 400.000 ulasan) ke dalam ruang koordinat linier yang mudah dibaca tanpa saling menumpuk di tepi bawah.

---

### Visualisasi 3: Peringkat Fitur N-Gram Ekstrem (*Sentiment Term Weight Ranking*)

Panel ini menampilkan kata-kata kunci pendorong polaritas sentimen positif dan negatif hasil ekstraksi bobot koefisien regresi logistik:

```
[TOP KATA PENUNJANG SENTIMEN POSITIF]       [TOP KATA PENUNJANG SENTIMEN NEGATIF]
term            koefisien                   term            koefisien
fast charging   +1.84 ■■■■■■■■■■■■■■■■      stopped         -2.12 ■■■■■■■■■■■■■■■■■■
good quality    +1.62 ■■■■■■■■■■■■■         poor quality    -1.95 ■■■■■■■■■■■■■■■■
durable cord    +1.35 ■■■■■■■■■■■           overheats       -1.74 ■■■■■■■■■■■■■■
value money     +1.28 ■■■■■■■■■■            defective       -1.61 ■■■■■■■■■■■■
clear audio     +1.14 ■■■■■■■■■             cheap plastic   -1.48 ■■■■■■■■■■■
```

---

## 03. Fungsi Interaktif & Kontrol Komponen

Dasbor `AmazonDashboard` menyediakan kontrol interaktif lengkap:

### 1. Mesin Inferensi NLP Interaktif (*Live NLP Simulator*)
- **Input Teks Bebas (*Interactive Text Area*)**: Pengguna dapat mengetik ulasan produk buatan sendiri dalam bahasa Inggris.
- **Tombol Sampel Cepat (*Preset Review Buttons*)**:
  - *⭐ High Quality & Fast Charging*: Mengisi teks ulasan positif kuat.
  - *⚠️ Stopped Working / Overheating*: Mengisi teks ulasan negatif keras.
  - *⚡ Budget & Clear Audio*: Mengisi ulasan bernada komparatif.
  - *❌ Slow Transfer / Defective*: Mengisi ulasan kecacatan fungsional.
- **Indikator Probabilitas Real-Time**: Bar progres gradien menampilkan skor probabilitas sentimen positif ($P \in [0{,}00\%, 100{,}0\%]$).
  - $P \ge 70\%$: Lencana Hijau (`POSITIVE / RECOMMENDED`).
  - $40\% \le P < 70\%$: Lencana Abu-abu/Kuning (`NEUTRAL / MIXED`).
  - $P < 40\%$: Lencana Merah (`NEGATIVE / AT-RISK`).
- **Papan Kontribusi Fitur (*Term Contribution Breakdown*)**: Menampilkan daftar token kata dalam teks yang cocok dengan kosakata model beserta besaran kontribusi numeriknya terhadap skor akhir.

### 2. Panel Filter Multi-Dimensi (*Faceted Filtering Console*)
- **Filter Kategori Induk**: Menyaring katalog produk berdasarkan *Computers & Accessories*, *Electronics*, *Home & Kitchen*, dll.
- **Filter Rentang Rating**: *All ratings*, *Below 4.0*, *4.0 to <4.2*, *4.2 and above*.
- **Filter Rentang Diskon**: *All discounts*, *0–25%*, *25–50%*, *50% and above*.
- **Filter Rentang Harga**: *Up to ₹500*, *₹500–₹1,500*, *₹1,500–₹3,000*, *Above ₹3,000*.
- **Kotak Pencarian Cepat (*Instant Query Search*)**: Pencarian substring nama produk dengan responsivitas sub-milidetik.

### 3. Tabel Data Produk dengan Multi-Sort
- Kolom tabel dapat diurutkan berdasarkan **Nama**, **Rating**, **Jumlah Ulasan**, atau **Persentase Diskon** secara *ascending* maupun *descending*.
- Paginasi adaptif (pilihan 12 atau 24 produk per halaman).

---

## 04. Formulasi Matematis & Algoritma NLP

### 1. Vektorisasi Teks TF-IDF di Sisi Klien

Teks ulasan dibersihkan dari *stop words* umum bahasa Inggris (50+ kata) dan dipecah menjadi unigram dan bigram karakter alfabet:

$$\text{Tokens}(d) = \{w_1, w_2, \dots, w_m\}, \quad \text{Bigrams} = \{w_1 w_2, w_2 w_3, \dots\}$$

Untuk setiap fitur $j$ yang ada di dalam kamus (*vocabulary*):

$$\text{TF}_{j, d} = \text{frekuensi kemunculan term } j \text{ dalam dokumen } d$$

$$\text{Raw Weight } w_j = \text{TF}_{j, d} \times \text{IDF}_j$$

Normalisasi Euclidean $L_2$ diterapkan untuk menstandarkan panjang teks:

$$\|w\|_2 = \sqrt{\sum_{j} w_j^2}$$

$$\tilde{w}_j = \frac{w_j}{\|w\|_2}$$

### 2. Fungsi Aktivasi Sigmoid Inferensi Sentimen

Model menghitung logit skor linier $z$ berdasarkan bobot koefisien terlatih ($\beta_j$) dan nilai intercept ($\beta_0$):

$$z = \beta_0 + \sum_{j \in \text{Matches}} \tilde{w}_j \cdot \beta_j$$

Probabilitas bahwa ulasan bersifat positif dimodelkan melalui fungsi logistik:

$$P(\text{Positive} \mid d) = \sigma(z) = \frac{1}{1 + e^{-z}} = \frac{1}{1 + \exp\left(-\left(\beta_0 + \sum_{j} \tilde{w}_j \beta_j\right)\right)}$$

### 3. Matriks Evaluasi Model ML (*Benchmark Performance*)

Pada dataset uji (*test set* 20% stratified split), performa model dievaluasi secara komprehensif:

| Algoritma Model | Akurasi | Presisi | Recall | F1-Score | ROC-AUC | Waktu Inferensi Klien |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Diekspor ke Klien)** | **86,2%** | **88,4%** | **82,1%** | **85,1%** | **0,8369** | **< 3 ms** |
| Random Forest (100 Trees) | 85,7% | 87,1% | 81,4% | 84,2% | 0,8291 | ~45 ms |
| Multinomial Naive Bayes | 82,4% | 84,0% | 78,5% | 81,2% | 0,7980 | < 2 ms |

#### Matriks Kebingungan (*Confusion Matrix* Uji):
- **True Positive (TP)**: 1.240 ulasan positif terdeteksi benar.
- **False Negative (FN)**: 270 ulasan positif salah diklasifikasikan sebagai negatif.
- **False Positive (FP)**: 162 ulasan negatif salah diklasifikasikan sebagai positif.
- **True Negative (TN)**: 828 ulasan negatif terdeteksi benar.

---

## 05. Kesimpulan & Keputusan Strategis Bisnis

1. **Deployment NLP Ringan Tanpa Biaya Infrastruktur Server**:
   - Dengan mengekspor bobot TF-IDF dan koefisien Regresi Logistik ke dalam payload JSON statis yang dieksekusi JavaScript murni, sistem mampu menganalisis ulasan pelanggan secara instan di browser tanpa memerlukan server GPU Python bulanan.
2. **Deteksi Dini Cacat Produk Manufaktur**:
   - Fitur analisis kontribusi kata mampu mengisolasi kata-kata negatif berbobot tinggi seperti *"overheats"*, *"stopped"*, dan *"defective"*. Sistem dapat dikembangkan menjadi sistem peringatan dini (*early-warning alarm*) untuk menarik produk bermasalah dari etalase sebelum rating toko anjlok.
3. **Diskon Bukan Pengganti Kualitas Produk**:
   - Analisis korelasi Pearson membuktikan tidak ada hubungan antara besaran diskon dan rating ulasan pelanggan ($r \approx 0{,}02$). Konsumen e-commerce modern memprioritaskan durabilitas dan keandalan fungsional; diskon 70% pada kabel yang putus dalam dua hari tetap menghasilkan ulasan bintang satu.
