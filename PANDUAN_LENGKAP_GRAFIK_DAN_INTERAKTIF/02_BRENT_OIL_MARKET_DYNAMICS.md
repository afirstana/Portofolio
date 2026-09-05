# 🛢️ PANDUAN LENGKAP PROYEK 02: BRENT CRUDE OIL MARKET DYNAMICS & GEOPOLITICAL ECONOMETRICS

> **Studi Kasus**: [Brent Oil Market Dynamics & Geopolitical Econometrics](#2)  
> **Route URL**: [`/projects/brent-oil-market-dynamics/`](http://localhost:3000/projects/brent-oil-market-dynamics/)  
> **Dataset**: 9.011 Hari Perdagangan Historis (Mei 1987 – September 2024, 35.5 Tahun)  
> **Kategori**: Quantitative Econometrics, Time-Series Forecasting, Geopolitical Risk & Power BI Suite  

---

## 01. TUJUAN BISNIS & LATAR BELAKANG EKONOMETRIKA

Harga minyak mentah Brent (*Brent Crude*) adalah darah bagi perekonomian global. Pergerakan harganya tidak mengikuti distribusi normal Gaussian sederhana, melainkan dipenuhi oleh **kejadian ekstrem (*black swan events*)**, **pengelompokan volatilitas (*volatility clustering*)**, dan **ekor gemuk (*fat tails*)** akibat perang, embargo geopolitik, dan krisis keuangan.

Proyek ini menghadirkan analisis kuantitatif mendalam selama 35.5 tahun untuk:
1. Mengukur risiko kerugian portofolio energi secara presisi (*Value at Risk & Expected Shortfall*).
2. Memetakan 7 era rezim struktural pasar minyak global.
3. Menyediakan **Interactive Econometric Explorer** dan 4 Dashboard Power BI untuk stress-testing manajemen risiko energi.

---

## 02. CARA MEMBACA GRAFIK UTAMA & METRIK RISIKO

### 1. Garis Waktu Harga Historis (35.5 Years Time-Series)
```
  Harga ($/Bbl)
   $150 ┼                                  ▲ 2008 GFC ($143.95 Rekor Tertinggi)
        │                                 ╱ ╲
   $100 ┼                                ╱   ╲            ▲ 2022 Perang Ukraina
        │                               ╱     ╲          ╱ ╲
    $50 ┼   ▲ 1990 Perang Teluk        ╱       ╲        ╱   ╲
        │  ╱ ╲                        ╱         ╲      ╱     ╲
     $0 ┼─┴───┴──────┴──────┴────────┴───────────┴────▼───────┴──► Waktu (1987–2024)
                                                 2020 COVID ($9.10 Titik Terendah)
```
- **Sumbu $X$**: Waktu kronologis (20 Mei 1987 s.d. 30 September 2024).
- **Sumbu $Y$**: Harga spot minyak mentah Brent dalam Dolar AS per barel (\$ USD/Barrel).
- **Rentang Ekstrem**:
  - **Harga Tertinggi Sepanjang Masa**: **\$143.95/barel** (Juli 2008, sebelum krisis *subprime mortgage*).
  - **Harga Terendah Sepanjang Masa**: **\$9.10/barel** (April 2020, saat *lockdown* global pandemi COVID-19 menghancurkan permintaan bahan bakar).

---

### 2. Grafik Log Returns & Volatility Clustering
- **Rumus Perhitungan**:
  $$r_t = \ln\left(\frac{P_t}{P_{t-1}}\right) \approx \frac{P_t - P_{t-1}}{P_{t-1}}$$
- **Sumbu $X$**: Waktu harian.
- **Sumbu $Y$**: Persentase imbal hasil harian (*daily return*, rentang $-35\%$ hingga $+35\%$).
- **Fenomena "Mandelbrot Volatility Clustering"**:
  Perhatikan bagaimana hari-hari yang bergejolak tinggi (lonjakan tajam ke atas dan ke bawah) **selalu berkumpul bersama dalam satu periode** (misal krisis 2008 dan 2020), sedangkan hari-hari tenang berkumpul dalam periode damai. Ini membuktikan bahwa volatilitas harga minyak bersifat memiliki ingatan (*autoregressive conditional heteroskedasticity / ARCH*).

---

### 3. Histogram Distribusi Ekor Gemuk (*Leptokurtic Fat-Tail*)
```
  Kerapatan Probabilitas
        ▲          Distribusi Empiris Minyak (Puncak Runcing, Ekor Gemuk: Kurtosis 45.43)
        │                    │
        │                   ╱│╲
        │                  ╱ │ ╲   - - - Distribusi Normal Gaussian (Kurtosis 3.0)
        │                 ╱  │  ╲
        │               ╱    │    ╲
        │   Ekor Gemuk ╱     │     ╲ Ekor Gemuk
    ────┴─────────────┴──────┼──────┴─────────────► Shock Return (%)
                    -7.12%   0%    +7.12%
                  (VaR 99%)
```
- **Sumbu $X$**: Persentase shock return harian.
- **Sumbu $Y$**: Kerapatan frekuensi kemunculan (*probability density*).
- **Interpretasi Kuantitatif**:
  - **Kurtosis = 45.43** (Distribusi normal biasa bernilai 3.0). Nilai 45.43 menunjukkan bahwa pasar minyak memiliki sifat **ultra-leptokurtik**. Kejadian luar biasa yang menurut teori statistik normal hanya terjadi sekali dalam 10.000 tahun, dalam realitas pasar minyak **terjadi beberapa kali dalam satu dekade**!
  - **Skewness = -0.19** (Condong negatif, artinya shock penurunan harga terjadi lebih cepat dan lebih curam daripada kenaikan harga).

---

## 03. FORMULASI MATEMATIKA MANAJEMEN RISIKO (VaR & ES)

Untuk mengukur batas risiko kerugian maksimal trader atau kilang minyak dalam satu hari perdagangan:

### 1. Value at Risk (VaR 99%)
$$\text{VaR}_{\alpha}(X) = -\inf \{ x \in \mathbb{R} \mid P(X \le x) \ge 1 - \alpha \}$$
- **Hasil Empiris (VaR 99%) = -7.12%**:
  Artinya, dalam 99% hari perdagangan normal, kerugian harian tidak akan melebihi 7.12%. Namun, terdapat 1% hari di mana kerugian melebihi batas ini.

### 2. Expected Shortfall / Conditional VaR (ES 99%)
$$\text{ES}_{\alpha}(X) = \mathbb{E}[ -X \mid -X \ge \text{VaR}_{\alpha}(X) ]$$
- **Hasil Empiris (ES 99%) = -10.42%**:
  Jika hari buruk 1% itu benar-benar terjadi (*tail loss event*), maka rata-rata kerugian yang diderita portofolio adalah **10.42% dalam satu hari tunggal**!

---

## 04. BEDAH 7 REZIM KRISIS HISTORIS & ANOTASINYA

Di dalam visualisasi, pengguna dapat mengklik 7 pin penanda krisis untuk melihat dekomposisi peristiwanya:

| No | Nama Krisis & Tahun | Durasi Rentang Waktu | Puncak Harga / Lembah | Pemicu Fundamental Pasar Minyak |
|---|---|---|---|---|
| **01** | **1990 Gulf War Shock** | Jul 1990 – Feb 1991 | Lonjakan \$15 ➔ \$41 | Invasi Irak ke Kuwait menghentikan 4.3 juta barel minyak/hari dari peredaran. |
| **02** | **1997 Asian Financial Crisis** | Jul 1997 – Des 1998 | Penurunan \$21 ➔ \$9.80 | Runtuhnya mata uang Baht Thailand dan krisis moneter Asia mematikan konsumsi industri manufaktur. |
| **03** | **2001 Dot-Com & 9/11 Shock** | Mar 2001 – Des 2001 | Penurunan \$30 ➔ \$17 | Runtuhnya saham teknologi AS disusul penutupan rute penerbangan global pasca serangan 9/11. |
| **04** | **2008 Global Financial Crisis** | Jan 2008 – Des 2008 | \$143.95 ➔ \$33.73 | Spekulasi likuiditas membawa harga ke puncak rekor, disusul kebangkrutan Lehman Brothers yang memicu pembekuan kredit dunia. |
| **05** | **2014 US Shale Oil Glut** | Jun 2014 – Jan 2016 | \$115 ➔ \$26 | Ledakan produksi *hydraulic fracturing* minyak serpih AS menciptakan surplus global raksasa; OPEC menolak memangkas kuota. |
| **06** | **2020 COVID-19 Demand Crash** | Jan 2020 – Apr 2020 | \$68 ➔ \$9.10 (Nadir) | *Lockdown* pandemi serentak di seluruh benua membuat tangki penyimpanan minyak dunia penuh sesak. |
| **07** | **2022 Russia-Ukraine Conflict** | Feb 2022 – Jun 2022 | \$85 ➔ \$133 | Sanksi embargo minyak Rusia dan ketakutan terputusnya pasokan pipa Druzhba ke Eropa. |

---

## 05. REKOMENDASI STRATEGIS & KEPUTUSAN BISNIS

Bagi Chief Risk Officer (CRO) perbankan komoditas atau manajer kilang:
1. **Jangan Gunakan Model Black-Scholes Gaussian Standar**: Karena kurtosis minyak mencapai 45.43, premi opsi *deep out-of-the-money (OTM)* yang dihitung dengan asumsi normal akan terlalu murah (*underpriced*), membuat perusahaan rentan bangkrut saat terjadi perang.
2. **Siapkan Cadangan Modal Berdasarkan ES 99% (-10.42%)**: Dalam pengujian ketahanan likuiditas (*stress test*), alokasi cadangan margin call harus mampu menyerap penurunan harian minimal 10.42%.
3. **Lindung Nilai Dinamis (*Dynamic Hedging*) Saat Terjadi Clustering**: Begitu volatilitas harian 30 hari melompat di atas 45%, perusahaan harus segera memperketat rasio lindung nilai (*hedge ratio*) dengan instrumen *collar strategy* (membeli put option dan menjual call option).
