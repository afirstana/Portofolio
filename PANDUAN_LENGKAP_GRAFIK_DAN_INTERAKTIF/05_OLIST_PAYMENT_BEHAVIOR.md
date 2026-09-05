# Panduan Komprehensif: Olist Payment & Installment Behavior Analytics

Dokumen ini membedah secara menyeluruh setiap grafik, terminal interaktif, anomali cicilan kredit, matriks sensitivitas pembiayaan kategori, dan formulasi matematika keuangan pada proyek **Olist Payment & Installment Behavior Analytics** (Analisis 103.886 Catatan Pembayaran, Total Nilai R$ 16,01 Juta).

---

## 01. Ringkasan Eksekutif & Konteks Finansial

### A. Masalah Bisnis (*The Problem*)
Ekosistem pembayaran digital di Brasil memiliki karakteristik unik di mana fasilitas cicilan tanpa bunga (*parcelamento sem juros*) menjadi instrumen utama daya beli konsumen. Tanpa pemahaman mendalam mengenai elastisitas cicilan terhadap nilai transaksi:
1. **Risiko Biaya *Merchant Discount Rate* (MDR)**: Biaya pemrosesan transaksi kartu kredit dengan tenor panjang (10x hingga 24x) memotong margin bersih hingga 3,5% - 5,0%.
2. **Ketergantungan Pembayaran Tunai Alternatif**: Penggunaan *Boleto Bancário* (voucher kasir tunai perbankan) memperpanjang siklus pelunasan hingga 3–5 hari kerja dengan tingkat pembatalan pesanan (*order drop-off*) mencapai 15%+.
3. **Anomali Spike Tenor 10x**: Adanya lonjakan frekuensi checkout tidak wajar pada cicilan 10 kali lipat dibandingkan tenor 7x, 8x, atau 9x.

### B. Solusi Analitik & Rekayasa Sistem
- Menganalisis 103.886 baris transaksi pembayaran dari pasar Olist menggunakan Python, Pandas, dan komponen visualisasi interaktif React.
- Mengidentifikasi korelasi statistik linier antara jumlah cicilan dan Nilai Rata-rata Pesanan (AOV) sebesar **$r = 0{,}37$**.
- Membangun 4 terminal interaktif khusus:
  1. *Interactive Payment Mix & Telemetry Terminal*
  2. *The 10x Installment Spike Diagnostic Terminal*
  3. *Category Financing Sensitivity Matrix*
  4. *Comprehensive Payment & Order Audit Console*

---

## 02. Panduan Membaca Grafik & Visualisasi

### Grafik 1: Distribusi Metode Pembayaran (*Payment Method Mix*)
Visualisasi *Donut Chart* dan telemetri menguraikan pangsa pangsa volume dan nilai dari 4 instrumen transaksi utama di Brasil:

```
+-----------------------------------------------------------------------------------+
| DISTRIBUSI PANGSA INSTRUMEN PEMBAYARAN (103.886 TRANSAKSI / R$ 16,01M)            |
|                                                                                   |
| [CREDIT CARD]  : 76.784 Transaksi (73,9%) | R$ 12.542.046 (78,3%) ■■■■■■■■■■■■■■■ |
| [BOLETO]       : 19.784 Transaksi (19,0%) | R$  2.869.362 (17,9%) ■■■■            |
| [VOUCHER]      :  5.775 Transaksi ( 5,4%) | R$    379.447 ( 2,4%) ■               |
| [DEBIT CARD]   :  1.529 Transaksi ( 1,5%) | R$    217.989 ( 1,4%)                 |
|                                                                                   |
| DOMINASI KREDIT: 3 dari 4 pesanan diselesaikan via Kartu Kredit                   |
+-----------------------------------------------------------------------------------+
```

#### Interpretasi Visual:
- **Kartu Kredit (*Credit Card*)**: Mendominasi secara absolut dengan **73,9% volume pesanan dan 78,3% total GMV**. Konsumen memilih kartu kredit karena tersedianya opsi cicilan fleksibel.
- **Boleto Bancário**: Instrumen pembayaran tunai populer bagi populasi *unbanked* di Brasil, menyumbang **19,0% volume** dan **17,9% GMV**. Memiliki risiko gagal bayar jika voucher kedaluwarsa sebelum disetor di gerai fisik.
- **Voucher & Kartu Debit**: Penggunaan marjinal (masing-masing 5,4% dan 1,5%), umumnya berupa kupon diskon atau saldo toko.

---

### Grafik 2: Kurva Hubungan Tenor Cicilan (*Installments*) vs Nilai Pesanan (AOV)

Grafik batang dan kurva tren menampilkan korelasi linier kuat antara jumlah cicilan yang diambil konsumen dengan nominal belanja mereka:

| Tenor Cicilan | Frekuensi Pesanan | % Pesanan | Nilai Rata-rata Pesanan (AOV) | Indeks Lonjakan AOV |
| :---: | :---: | :---: | :---: | :---: |
| **1x (Bayar Penuh)** | 52.546 | 50,6% | **R$ 102,40** | 1,00x (Baseline) |
| **2x** | 12.413 | 11,9% | **R$ 128,10** | 1,25x |
| **3x** | 10.461 | 10,1% | **R$ 143,50** | 1,40x |
| **4x** | 7.098 | 6,8% | **R$ 164,80** | 1,61x |
| **5x** | 5.239 | 5,0% | **R$ 183,20** | 1,79x |
| **6x** | 3.920 | 3,8% | **R$ 209,70** | 2,05x |
| **7x – 9x** | 4.811 | 4,6% | **R$ 245,10** | 2,39x |
| **10x (Spike Anomali)** | **5.328** | **5,1%** | **R$ 315,90** | **3,08x (+208% vs 1x)** |
| **11x – 24x** | 2.070 | 2,0% | **R$ 412,60** | 4,03x |

#### Temuan Utama:
- Konsumen yang membayar penuh (1x) rata-rata hanya membelanjakan **R\$ 102,40**.
- Konsumen yang menggunakan cicilan 10x membelanjakan rata-rata **R\$ 315,90** (lebih dari **3 kali lipat nilai belanja 1x**).
- Penawaran cicilan terbukti secara empiris meningkatkan daya beli (*purchasing power*) dan *basket size* konsumen.

---

### Grafik 3: Anomali Lonjakan Frekuensi Checkout 10x (*10x Spike Anomaly*)

Jika frekuensi cicilan diplot dari 1x hingga 24x, kurva frekuensi menunjukkan penurunan mulus (*exponential decay*) dari 1x hingga 9x. Namun, tepat pada tenor 10x, terjadi **lonjakan volume mendadak sebesar 5.328 pesanan** (melampaui volume tenor 6x, 7x, 8x, dan 9x).

```
Frekuensi Pesanan
  ^
52k | ■ (1x)
12k |   ■ (2x)
10k |     ■ (3x)
 7k |       ■ (4x)
 5k |         ■ (5x)
 4k |           ■ (6x)
 2k |             ·  ·  ·     ■ (10x SPIKE!) <--- Batas psikologis promosi
 1k |                             ·   · (11x-24x)
  0 +--------------------------------------------------> Tenor Cicilan
      1   2   3   4   5   6   7   8   9  10  12  18  24
```

#### Penyebab Anomali:
1. **Ambang Promosi Finansial Brasil**: Mayoritas perbankan dan penerbit kartu di Brasil membatasi program cicilan bebas bunga (*sem juros*) maksimum hingga 10 bulan. Tenor di atas 10x dikenakan bunga kartu kredit bulanan yang tinggi (~2,5% - 4,0%/bulan).
2. **Kenyamanan Kognitif Konsumen**: Tenor 10 bulan mempermudah kalkulasi mental konsumen (misalnya: barang R\$ 500 cukup diangsur R\$ 50 per bulan).

---

## 03. Fungsi Interaktif & Kontrol Komponen

Kasus studi ini dilengkapi empat modul interaktif berkinerja tinggi:

### 1. Modul Interaktif: `OlistPaymentInteractiveShowcase`
- **Donut Segment Hover**: Mengarahkan kursor ke segmen lingkaran (*Credit Card, Boleto, Voucher, Debit Card*) memperbarui kartu telemetri secara *real-time* (menampilkan Jumlah Transaksi, Total Nilai Transaksi, Rata-rata per Pesanan, dan Pangsa Pasar).
- **Toggle Unit Tampilan**: Beralih antara mode *Nilai Moneter (R\$)* dan *Jumlah Pesanan (Volume)*.

### 2. Modul Interaktif: `OlistInstallmentAnomalyShowcase`
- **Slider Tenor Interaktif**: Menggeser tenor dari 1 hingga 24 bulan:
  - Mengkalkulasi estimasi cicilan per bulan:
    $$\text{Angsuran Bulanan} = \frac{\text{AOV}}{k}$$
  - Memperlihatkan simulasi biaya MDR bagi *merchant* berdasarkan lama tenor penahanan modal.
- **Deep-Dive Anomaly Toggle**: Tombol eksplorasi yang membuka investigasi psikologis konsumen Brasil dan regulasi suku bunga Banco Central do Brasil (BACEN).

### 3. Modul Interaktif: `OlistCategoryFinancingShowcase`
- **Dropdown Filter Kategori Produk**: Membandingkan 10 kategori produk utama:
  - *High-Ticket / High-Installment*: Komputer (`informatica_acessorios`), Elektronik, Jam Tangan mewah (rata-rata 6,2 – 8,1 cicilan; AOV > R\$ 280).
  - *Low-Ticket / Immediate Settlement*: Buku, Makanan & Minuman, Kosmetik (rata-rata 1,4 – 2,2 cicilan; AOV < R\$ 85).
- **Matriks Elastisitas Pembiayaan**: Menampilkan korelasi antara harga kategori produk dan sensitivitas konsumen terhadap ketersediaan cicilan.

### 4. Modul Interaktif: `OlistPaymentDashboard`
- **Filter Rentang Tanggal Bulanan**: Memfilter tren pembayaran dari tahun 2016 hingga 2018.
- **Tabel Audit Transaksi Lengkap**: Tabel berkecepatan tinggi dengan paginasi dan pencarian instan berdasarkan `order_id` atau jenis kartu, memvalidasi integritas rekonsiliasi antara total item dan total pembayaran.

---

## 04. Formulasi Matematis & Finansial

### 1. Koefisien Korelasi Pearson Tenor vs Nilai Pesanan

$$r_{k, M} = \frac{\sum_{i=1}^n (k_i - \bar{k})(M_i - \bar{M})}{\sqrt{\sum_{i=1}^n (k_i - \bar{k})^2 \sum_{i=1}^n (M_i - \bar{M})^2}} = 0{,}371 \quad (p < 0{,}0001)$$

Di mana:
- $k_i$ adalah jumlah cicilan pada transaksi ke-$i$.
- $M_i$ adalah total nominal pembayaran (*payment value*) dalam Real Brasil (R\$).
- Nilai $r = 0{,}371$ mengindikasikan korelasi positif moderat yang signifikan secara statistik.

### 2. Model Regresi Linier Kenaikan AOV

$$\widehat{M}(k) = \beta_0 + \beta_1 k$$

$$\beta_1 = \frac{\sum (k_i - \bar{k})(M_i - \bar{M})}{\sum (k_i - \bar{k})^2} \approx 21{,}84 \text{ R\$/tenor}$$

$$\beta_0 \approx 87{,}15 \text{ R\$}$$

Setiap penambahan 1 bulan tenor cicilan diasosiasikan dengan peningkatan nilai belanja rata-rata sebesar **R\$ 21,84**.

### 3. Persamaan Net Merchant Proceeds (Dampak MDR & Subsidized Installments)

Pendapatan bersih yang diterima pedagang setelah dipotong biaya gerbang pembayaran (*payment gateway fee*) dan biaya penundaan dana:

$$\text{Net Revenue} = M \times \left(1 - \text{MDR}_{\text{base}} - \delta \cdot \max(0, k - 1)\right)$$

Di mana:
- $\text{MDR}_{\text{base}} = 2{,}2\%$ (biaya pemrosesan transaksi dasar kartu kredit).
- $\delta = 0{,}35\%$ per bulan tenor tambahan di atas pembayaran tunai ($k > 1$).
- Untuk tenor $k = 10$:
  $$\text{Potongan} = 2{,}2\% + 0{,}35\% \times 9 = 5{,}35\%$$

---

## 05. Kesimpulan & Keputusan Strategis Bisnis

1. **Optimalisasi Strategi Cicilan Berbasis Kategori (*Category-Targeted Financing*)**:
   - Untuk kategori bernilai tinggi seperti Komputer dan Elektronik, marketplace Olist disarankan **mensubsidi penuh biaya MDR hingga tenor 10x**, karena terbukti menghasilkan lonjakan AOV hingga 308%.
   - Sebaliknya, untuk kategori barang murah (*Groceries* / Aksesoris kecil di bawah R\$ 80), batasi cicilan maksimal hingga 3x guna menghindari pembengkakan biaya administrasi tanpa ada dampak kenaikan keranjang belanja.
2. **Mitigasi Kerugian Pembatalan Boleto Bancário**:
   - Boleto menyumbang 19% pesanan namun memiliki siklus konfirmasi lambat dan potensi pembatalan tinggi.
   - Merekomendasikan integrasi protokol transfer instan **PIX** (sistem pembayaran real-time Banco Central do Brasil yang diluncurkan pasca-periode dataset ini) untuk menggantikan Boleto, memangkas waktu rekonsiliasi dari 3 hari menjadi 3 detik dan menekan *drop-off* hingga 90%.
3. **Pemanfaatan Tenor 10x Sebagai Jangkar Psikologis Kampanye Penjualan**:
   - Gunakan promosi bertema *"10x Sem Juros"* pada festival belanja (Black Friday Brasil) sebagai *call-to-action* utama di halaman katalog produk.
