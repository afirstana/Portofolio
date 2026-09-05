# 🧬 PANDUAN LENGKAP PROYEK 03: GLOBAL CANCER EPIDEMIOLOGY, CLINICAL SURVIVAL & SOCIO-ECONOMIC ELASTICITY

> **Studi Kasus**: [Global Cancer Epidemiology Surveillance](#3)  
> **Route URL**: [`/projects/global-cancer-epidemiology-surveillance/`](http://localhost:3000/projects/global-cancer-epidemiology-surveillance/)  
> **Dataset**: 281.400 Baris Data Terstandarisasi, 26 CSV WHO/GLOBOCAN, 185 Negara, 15 Klasifikasi Kanker  
> **Kategori**: Biostatistics, Healthcare Economics, Global Health Surveillance & Epidemiological Modeling  

---

## 01. TUJUAN KESEHATAN PUBLIK & FOKUS STUDI

Kanker bukan sekadar masalah biologis murni, melainkan cerminan dari **kesenjangan infrastruktur diagnostik dan ekonomi kesehatan global**.

Proyek ini membedah data epidemiologi global untuk:
1. Membuktikan **"Paradoks Epidemiologis Kanker"** (*The Cancer Screening & Longevity Paradox*).
2. Memetakan variasi tingkat kelangsungan hidup 5 tahun (*5-Year Survival Rate*) di 15 lokasi anatomis kanker.
3. Menghitung elastisitas korelasi antara Produk Domestik Bruto (PDB/GDP per kapita) terhadap rasio kematian pasien kanker (*Mortality-to-Incidence Ratio / MIR*).
4. Menyediakan **Interactive Cross-Country Data Playground** untuk simulasi kebijakan intervensi kesehatan publik.

---

## 02. CARA MEMBACA VISUALISASI UTAMA

### 1. Scatter/Bubble Plot: Insidensi vs Mortalitas (ASIR vs ASMR)
```
  Tingkat Kematian (ASMR per 100k)
   160 ┼                                  ● Negara Miskin (MIR Tinggi > 0.70)
       │                                  [Fasilitas Terlambat, Angka Kematian Tinggi]
   120 ┼
       │                  ● Negara Menengah
    80 ┼                                      ● Negara Maju (MIR Rendah < 0.35)
       │                                      [Skrining Masif, Deteksi Dini Sukses]
    40 ┼
     0 ┼──────┴───────────┴───────────┴───────────┴──► Tingkat Kasus Baru (ASIR per 100k)
       0     100         200         300         400
```
- **Sumbu $X$ (Horizontal)**: *Age-Standardized Incidence Rate (ASIR)* per 100.000 populasi (jumlah kasus baru yang terdeteksi per tahun setelah disesuaikan dengan struktur usia).
- **Sumbu $Y$ (Vertical)**: *Age-Standardized Mortality Rate (ASMR)* per 100.000 populasi (jumlah kematian akibat kanker per tahun).
- **Ukuran Lingkaran (*Bubble Size*)**: Jumlah populasi total negara.
- **Warna Lingkaran (Tingkatan Pendapatan Bank Dunia / World Bank Income Tier)**:
  - **Cyan**: *High Income Countries* (PDB tinggi).
  - **Purple**: *Upper-Middle Income*.
  - **Amber**: *Lower-Middle Income*.
  - **Crimson**: *Low Income* (PDB rendah).

---

### 2. Memahami Rasio Kematian-terhadap-Insidensi (*MIR*)
$$\text{MIR} = \frac{\text{ASMR}}{\text{ASIR}} \in [0.0, 1.0]$$

| Nilai MIR | Arti Klinis & Sistem Kesehatan | Karakteristik Negara |
|---|---|---|
| **Rendah ($0.20 - 0.35$)** | **Tingkat Kesembuhan Sangat Tinggi** | Negara maju (misal Jepang, Australia, Swiss). Kanker terdeteksi pada Stadium I–II saat masih bisa dioperasi/disembuhkan. |
| **Sedang ($0.40 - 0.60$)** | **Kapasitas Onkologi Menengah** | Negara berkembang dengan pusat rujukan terbatas di ibukota. |
| **Tinggi ($> 0.70$)** | **Krisis Diagnostik / Terlambat Deteksi** | Negara berpenghasilan rendah. Sebagian besar pasien baru datang ke RS pada Stadium IV (metastasis lanjut), sehingga mayoritas berakhir fatal. |

---

### 3. Kurva Elastisitas Sosio-Ekonomi (PDB vs MIR)
- **Sumbu $X$**: Logaritma PDB per kapita ($\log_{10}(\text{GDP per Capita})$) dalam USD.
- **Sumbu $Y$**: Rasio Kematian Kanker (MIR).
- **Temuan Kuantitatif**:
  Terdapat korelasi negatif yang sangat kuat ($r = -0.78, p < 0.001$). Setiap pelipatgandaan anggaran kesehatan publik per kapita menurunkan MIR sebesar **14.2 poin persentase**, membuktikan bahwa investasi pada alat biopsi dan skrining mamografi/kolonoskopi menyelamatkan jutaan nyawa.

---

### 4. Matriks Heterogenitas Kelangsungan Hidup 5 Tahun (15 Jenis Kanker)
Visualisasi kartu data interaktif membandingkan ketahanan hidup pasien antar lokasi kanker:

| Organ Kanker | 5-Year Survival (Negara Maju) | 5-Year Survival (Negara Berkembang) | Kesenjangan Kematian (*Equity Gap*) | Penyebab Kesenjangan |
|---|---|---|---|---|
| **Kanker Tiroid** | **98.4%** | 82.1% | +16.3% | Perkembangan USG leher resolusi tinggi dan terapi ablasi iodium radioaktif. |
| **Kanker Payudara** | **90.3%** | 52.4% | **+37.9%** | Akses mamografi skrining rutin dan terapi target antibodi monoklonal (*Trastuzumab*). |
| **Kanker Serviks** | 68.2% | 34.1% | **+34.1%** | Vaksinasi HPV dan tes Pap Smear / DNA HPV preventif. |
| **Kanker Lambung** | 32.5% | 18.2% | +14.3% | Endoskopi massal (sukses di Jepang & Korsel, langka di negara lain). |
| **Kanker Paru** | 22.8% | 9.4% | +13.4% | Sulit dideteksi dini tanpa Low-Dose CT Scan; korelasi tinggi dengan rokok. |
| **Kanker Hati** | 20.4% | 6.8% | +13.6% | Komplikasi sirosis Hepatitis B/C; minim fasilitas transplantasi hati. |
| **Kanker Pankreas** | **11.2%** | **3.1%** | +8.1% | Kanker paling agresif; asimtomatik hingga stadium akhir di seluruh dunia. |

---

## 03. MATRIKS RISIKO PERILAKU: FRAKSI TEMBAKAU (TAF)

- **Formula Tobacco Attributable Fraction**:
  $$\text{TAF} = \frac{P_{\text{smoker}} \cdot (\text{RR} - 1)}{1 + P_{\text{smoker}} \cdot (\text{RR} - 1)}$$
  *(Di mana $P$ adalah prevalensi perokok dan $\text{RR}$ adalah Relative Risk kanker paru = ~15–25x lipat).*
- **Cara Membaca Grafik**:
  Batang persentase menampilkan proporsi kasus kanker yang dapat dieliminasi secara total jika konsumsi tembakau dihapuskan (mencapai **84.6% pada kanker paru** dan **48.2% pada kanker kandung kemih**).

---

## 04. FITUR INTERAKTIF: CROSS-COUNTRY DATA PLAYGROUND

Pada bagian bawah studi kasus, pengguna dapat berinteraksi dengan:
1. **Dropdown Pemilih Negara (35 Negara Utama)**: Memilih negara (misal Indonesia vs Singapura vs Amerika Serikat vs Uganda) untuk membandingkan piramida mortalitasnya.
2. **Filter Jenis Kanker**: Mengisolasi tipe kanker tertentu (misal hanya melihat *Pediatric Hematology* atau *Gastrointestinal Tumors*).
3. **Toggle Metrik**: Mengubah tampilan antara *Insidensi Kasus Baru*, *Kematian Absolut*, atau *Rasio MIR*.

---

## 05. REKOMENDASI KEBIJAKAN BAGI KEMENTERIAN KESEHATAN

1. **Prioritaskan Skrining Payudara & Serviks (ROI Tertinggi)**: Karena kesenjangan survival mencapai >35%, subsidi pemeriksaan leher rahim dan mamografi mobile memberikan rasio penyelamatan nyawa tertinggi per dolar anggaran APBN.
2. **Kebijakan Cukai Tembakau Agresif**: Menaikkan cukai rokok secara langsung menekan 84% beban biaya perawatan onkologi paru di rumah sakit rujukan nasional.
3. **Desentralisasi Onkologi ke Rumah Sakit Daerah**: Menyediakan mesin kemoterapi standar di pulau-pulau luar menekan angka keterlambatan rujukan yang selama ini membuat MIR di luar pulau Jawa melambung tinggi.
