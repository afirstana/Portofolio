# 🏛️ PANDUAN LENGKAP PROYEK 01: BANKING TRANSACTION ANTI-FRAUD & BEHAVIORAL SURVEILLANCE SUITE

> **Studi Kasus**: [Banking Transaction Anti-Fraud & Forensic Surveillance](#1)  
> **Route URL**: [`/projects/banking-transaction-anti-fraud/`](http://localhost:3000/projects/banking-transaction-anti-fraud/)  
> **Dataset**: 2.512 Transaksi Sintetis Deterministik, 495 Rekening Nasabah, 100 Merchant, 43 Kota  
> **Kategori**: Enterprise SQL Engine, Power BI Business Intelligence & Behavioral Analytics  

---

## 01. TUJUAN BISNIS & ARSITEKTUR ANALITIK

### Masalah Bisnis yang Dijawab:
Sektor perbankan modern menghadapi serangan penipuan terdistribusi (*distributed financial crime*) seperti pengurasan saldo akun (*balance drain*), percobaan pembobolan kata sandi secara berulang (*brute-force login*), dan pencairan tunai di luar jam wajar (*odd-hour cashouts*).

Proyek ini menghadirkan **solusi 2 dimensi enterprise** yang menggabungkan:
1. **6 Dashboard Power BI Interaktif**: Analisis komprehensif dari level eksekutif C-level hingga audit forensik per transaksi.
2. **Mesin SQL Window Function Interaktif**: 8 query SQL canggih dengan fungsi analitik (`LAG()`, `AVG() OVER()`, `DENSE_RANK()`) yang dieksekusi langsung di browser.
3. **Simulasi Anomali "What-If"**: Simulator interaktif untuk menguji skor risiko suatu transaksi baru secara real-time.

---

## 02. BEDAH 6 DASHBOARD POWER BI & CARA MEMBACANYA

```diagram
Lane: Arsitektur 6 Dashboard Power BI
[01. Executive Overview] ➔ [02. Geographic Exposure] ➔ [03. Channel Dynamics]
         ⬇                             ⬇                         ⬇
[04. Branch Operations]  ➔ [05. Behavioral Profiles] ➔ [06. Forensic Audit]
```

### Dashboard 01: Executive Surveillance Summary
- **Tujuan**: Memberikan ringkasan tingkat tinggi bagi Chief Risk Officer (CRO) mengenai total kerugian dan rasio penipuan bulanan.
- **Grafik Utama**:
  - **KPI Cards**: *Total Monitored Volume* (\$1.82M), *Flagged Fraud Amount* (\$214.5k), *Global Fraud Rate* (8.54%).
  - **Grafik Garis Bulanan (Monthly Fraud Exposure)**:
    - **Sumbu $X$**: Bulan kalender (Jan 2023 s.d. Des 2023).
    - **Sumbu $Y$**: Nilai transaksi (USD).
    - **Arti Garis**: Garis biru adalah total perputaran dana, garis merah berpendar adalah dana yang terindikasi penipuan. Lonjakan garis merah di Q3 mengindikasikan serangan terkoordinasi musiman.
- **Wawasan Bisnis**: CRO dapat langsung melihat apakah program mitigasi risiko di semester kedua berhasil menekan rasio penipuan.

---

### Dashboard 02: Geographic & City-Level Exposure
- **Tujuan**: Mengidentifikasi titik panas (*hotspots*) geografis tempat transaksi penipuan paling banyak terjadi di antara 43 kota.
- **Grafik Utama**:
  - **Peta Geografis & Bubble Chart**:
    - **Sumbu $X$ / $Y$**: Garis Bujur (*Longitude*) dan Lintang (*Latitude*).
    - **Ukuran Lingkaran (Bubble Size)**: Total volume dana yang mengalir.
    - **Warna Lingkaran**: Hijau = Kota aman (<5% fraud); Oranye = Waspada (5–10%); Merah = Kritis (>10% fraud).
- **Wawasan Bisnis**: Kota-kota metropolitan besar seperti Jakarta dan Surabaya menunjukkan frekuensi transaksi tinggi, namun kota perbatasan sekunder sering memiliki rasio penipuan per kapita yang jauh lebih tinggi karena lemahnya pengawasan fisik ATM.

---

### Dashboard 03: Channel & Transaction Dynamics
- **Tujuan**: Membandingkan kerentanan antara kanal perbankan: **ATM**, **Branch (Kantor Cabang)**, dan **Online (Mobile/Web)**.
- **Grafik Utama**:
  - **Stacked Bar Chart (Kanal vs Tipe Transaksi)**:
    - **Sumbu $X$**: Kanal (ATM, Branch, Online).
    - **Sumbu $Y$**: Persentase transaksi Debit vs Credit.
  - **Scatter Plot (Durasi Transaksi vs Nominal)**:
    - **Sumbu $X$**: Durasi transaksi (detik, rentang 10 s.d. 300 detik).
    - **Sumbu $Y$**: Nominal transaksi (\$20 s.d. \$1.900).
- **Wawasan Bisnis**: Transaksi penipuan online cenderung memiliki durasi sangat cepat (<25 detik) dengan nominal mendekati batas maksimum, menandakan eksekusi otomatis oleh skrip bot (*scripted takeover*).

---

### Dashboard 04: Branch Operations & Teller Performance
- **Tujuan**: Mengawasi anomali operasional di tingkat kantor cabang fisik.
- **Grafik Utama**:
  - **Scatter Plot (Volume Cabang vs Rasio Anomali)**:
    - Memetakan kantor cabang yang memiliki volume normal namun memiliki lonjakan anomali rasio di atas 15%.
- **Wawasan Bisnis**: Menemukan indikasi kelalaian SOP internal teller atau sindikat pembobolan yang sengaja menyasar kantor cabang pembantu di pinggiran kota.

---

### Dashboard 05: Behavioral Profiles (Age & Occupation Matrix)
- **Tujuan**: Profiling demografis nasabah yang paling sering menjadi target penipuan berdasarkan pekerjaan (*Doctor, Engineer, Retired, Student*) dan usia (18–80 tahun).
- **Grafik Utama**:
  - **Heatmap Matriks Risiko (Demographic Risk Matrix)**:
    - **Sumbu Baris**: Kelompok Usia (18–25, 26–40, 41–60, 60+).
    - **Sumbu Kolom**: Pekerjaan.
    - **Gradasi Warna**: Dari Cyan pudar (Risiko Rendah) hingga Merah Pekat (Risiko Tinggi).
- **Wawasan Bisnis**: Kelompok usia pensiunan (*Retired*) usia 60+ memiliki kerentanan tertinggi terhadap penipuan pengurasan saldo via rekayasa sosial (*social engineering*), sedangkan mahasiswa (*Student*) sering disusupi untuk dijadikan rekening penampung (*money mule*).

---

### Dashboard 06: Forensic Audit Trail & Transaction Bitmask
- **Tujuan**: Alat investigasi granular bagi petugas kepatuhan AML untuk menerbitkan *Suspicious Activity Report* (SAR).
- **Grafik Utama**:
  - **Tabel Forensik Dinamis**: Menampilkan rincian setiap transaksi lengkap dengan bendera peringatan (*risk flags*) yang menyala:
    1. `High Amount (> 3x Avg Historical)`
    2. `Failed Logins (>= 3 Attempts)`
    3. `Odd Hour (00:00–04:00 UTC)`
    4. `Rapid Succession (< 5 Minutes)`
    5. `New Device / Location Pairing`
    6. `Balance Drain (> 70% Balance)`

---

## 03. MESIN SQL WINDOW FUNCTION & QUERY RUNNER

Halaman ini dilengkapi **terminal eksekusi SQL interaktif**. Setiap query mengimplementasikan kalkulasi analitik tingkat lanjut:

| Query SQL | Fungsi Analitik yang Digunakan | Tujuan Deteksi Forensik |
|---|---|---|
| **Query 1: Velocity Spikes** | `LAG(transaction_date) OVER (PARTITION BY account_id ORDER BY transaction_date)` | Mendeteksi transaksi beruntun yang terjadi dalam jeda waktu < 5 menit (*rapid succession velocity*). |
| **Query 2: Historical Deviation** | `AVG(amount) OVER (PARTITION BY account_id)` | Membandingkan nominal transaksi saat ini dengan rata-rata historis rekening nasabah (memicu alarm jika > 300%). |
| **Query 3: Cumulative Balance Drain** | `SUM(amount) OVER (PARTITION BY account_id ORDER BY transaction_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` | Mengukur akumulasi pengurasan dana dari waktu ke waktu terhadap saldo awal rekening. |
| **Query 4: Multi-Account Device Sharing** | `COUNT(DISTINCT account_id) OVER (PARTITION BY device_id)` | Menemukan satu perangkat (*device_id*) yang digunakan untuk login ke banyak rekening berbeda (*credential stuffing*). |

---

## 04. SIMULATOR RISIKO INTERAKTIF ("WHAT-IF" ENGINE)

Di bagian bawah halaman, terdapat widget **Interactive Anomaly Simulator** yang memungkinkan pengguna mengubah parameter secara langsung:

```
[Transaction Amount: $1,450]   [Historical Avg: $250]   [Failed Logins: 4]
[Hour of Day: 02:00 UTC]       [Delta Mins: 3 mins]     [New Device: YES]
                            ⬇
             HASIL EVALUASI REAL-TIME:
        ╔══════════════════════════════════════╗
        ║ SKOR RISIKO : 6 / 6 (CRITICAL HIGH) ║
        ║ STATUS      : FLAGGED (BLOCKED)      ║
        ╚══════════════════════════════════════╝
```

### 🎛️ Kontrol Slider & Dampak Kalkulasinya:
1. **Nominal Transaksi vs Historical Avg**: Jika rasio $\frac{\text{Amount}}{\text{Historical Avg}} > 3.0$, bendera *High Amount* aktif (+1 skor).
2. **Failed Logins Slider (1 s.d. 5)**: Jika nilai $\ge 3$, bendera *Brute Force Login* aktif (+1 skor).
3. **Jam Transaksi (0 s.d. 23 UTC)**: Jika jam berada di antara $00:00$ hingga $04:00$, bendera *Odd Hour* aktif (+1 skor).
4. **Jeda Waktu Sejak Transaksi Terakhir (Menit)**: Jika $< 5$ menit, bendera *Rapid Succession* aktif (+1 skor).
5. **Toggle Perangkat Baru**: Mengaktifkan bendera *New Device / Unrecognized IP* (+1 skor).
6. **Persentase Kuras Saldo**: Jika nominal $> 70\%$ dari sisa saldo, bendera *Balance Drain* aktif (+1 skor).

---

## 05. PANDUAN PENGAMBILAN KEPUTUSAN EKSEKUTIF

Bagi seorang analis kepatuhan atau manajer risiko perbankan:
- **Tindakan Level 1 (Skor 0–1)**: Transaksi diproses otomatis (*Straight-Through Processing / STP*).
- **Tindakan Level 2 (Skor 2–3, Risiko Sedang)**: Sistem memicu verifikasi lapis kedua (*Step-Up Authentication*, misal SMS OTP atau verifikasi biometrik wajah).
- **Tindakan Level 3 (Skor 4–6, Risiko Tinggi)**: Transaksi **otomatis ditahan (*hard block*)**, kartu debit dinonaktifkan sementara, dan tiket investigasi SAR otomatis diterbitkan ke divisi AML.
