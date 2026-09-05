# Panduan Komprehensif: Brent Oil 3D Volatility Manifold & Topological Surface Engine

Dokumen ini membedah secara mendalam seluruh visualisasi topologi tiga dimensi, proyeksi geometri Euler, algoritma perurutan kedalaman (*Painter's Algorithm*), suar laser krisis historis (*crisis laser beacons*), serta implementasi matematika kanvas pada proyek **Brent Oil 3D Volatility Manifold** (Evolusi 36 Epoch Tahunan, 19 Bin Imbal Hasil Harian, 1987–2022).

---

## 01. Ringkasan Eksekutif & Konteks Analitik Kuantitatif

### A. Masalah Analisis Finansial Tradisional
Grafik harga 2D standar (*line chart*) hanya mampu memperlihatkan riwayat harga historis nominal. Grafik 2D gagal menangkap **dinamika probabilitas volatilitas**:
1. **Ketidakterlihatan Karakteristik Ekor Tebal (*Fat Tails*)**: Dalam grafik garis, pergeseran dari rezim pasar tenang (*low-volatility Gaussian*) menuju rezim kepanikan pasar (*high-volatility fat-tail*) tidak terlihat secara struktural.
2. **Ketiadaan Dimensi Waktu-ke-Probabilitas**: Analis kuantitatif membutuhkan representasi permukaan (*3D manifold surface*) yang memetakan evolusi fungsi kepadatan probabilitas (*probability density function* / PDF) selama 35,5 tahun secara simultan.

### B. Solusi Rekayasa & Mesin Kanvas Mandiri
- Membangun mesin render topologi 3D interaktif murni di HTML5 Canvas tanpa pustaka eksternal (tanpa Three.js / WebGL) menggunakan transformasi proyeksi perspektif matematika murni dalam TypeScript.
- Memetakan matriks berukuran **$36 \times 19 = 684$ koordinat verteks $\mathbb{R}^3$** yang merefleksikan 36 era tahunan (1987–2022) dan 19 keranjang imbal hasil harian (-15% hingga +15%).
- Mengintegrasikan **7 Suar Laser Krisis Historis (*Crisis Laser Beacons*)** dengan pendar partikel vertikal yang memandu navigasi auditor ke momen-momen dislokasi minyak bumi paling ekstrem di dunia.

---

## 02. Panduan Membaca Geometri & Sumbu Manifold 3D

### Diagram Koordinat Manifold Tiga Dimensi:

```
                  KETINGGIAN Z (Kepadatan Probabilitas / Puncak Leptokurtik)
                             ^
                             |         /\  <- Puncak Tenang (Puncak Kepadatan Tinggi)
                             |        /  \
                             |       /    \
                             |      /      \____ <- Sayap Ekor Tebal (Fat Tails)
                             +------------------------> SUMBU Y (Imbal Hasil Harian %)
                            /  -15%     0%     +15%
                           /
                          /
                         v
                SUMBU X (Garis Waktu: 1987 s.d. 2022)
```

#### Cara Membaca Ketiga Sumbu Ruang:
1. **Sumbu X (Garis Waktu Tahunan: 1987 – 2022)**:
   - Terbentang dari kiri-depan ke kanan-belakang sepanjang 36 tahun.
   - Menggambarkan perjalanan rezim makroekonomi: era Perang Teluk 1990, Krisis Asia 1998, Supercycle Komoditas 2008, Perang Shale AS 2014, Pandemi COVID-19 2020, hingga Invasi Ukraina 2022.
2. **Sumbu Y (Rentang Imbal Hasil Harian: -15% s.d. +15%)**:
   - Terbagi ke dalam 19 keranjang (*bins*).
   - Titik tengah ($Y = 0\%$) mewakili hari-hari perdagangan normal di mana harga minyak tidak banyak berubah.
   - Sayap kiri ($Y < -5\%$) mewakili kepanikan jual (*crash*), sementara sayap kanan ($Y > +5\%$) mewakili lonjakan pasokan (*supply panic*).
3. **Sumbu Z (Elevasi / Ketinggian Permukaan)**:
   - Merepresentasikan **Kepadatan Probabilitas Empiris ($PDF(t, r)$)**.
   - **Puncak Menjulang Tinggi**: Menunjukkan rezim pasar tenang di mana hampir 90% imbal hasil harian mengumpul erat di sekitar 0% (kurtosis tinggi / *leptokurtic*).
   - **Permukaan Rata & Melebar ke Samping**: Menunjukkan rezim krisis ekstrem di mana probabilitas tersebar luas ke sayap -10% hingga -15% (*volatility expansion*).

---

### Skema Gradien Warna Elevasi (*Elevation Color Ramp*)

Permukaan manifold diwarnai secara fotometrik berdasarkan elevasi ketinggian $Z$:

```
[ELEVASI PUNCAK] : Crimson / Amber Panas (#ef4444 -> #f59e0b) -> Kepadatan 80% - 95%
[ELEVASI TENGAH] : Sian Elektrik Neon    (#06b6d4 -> #0891b2) -> Kepadatan 30% - 70%
[ELEVASI DASAR]  : Obsidian Navy Gelap  (#0f172a -> #1e293b) -> Area Ekor / Anomali Langka
```

---

## 03. 7 Suar Laser Krisis Historis (*Historical Crisis Beacons*)

Tujuh tonggak krisis global ditandai dengan pilar sinar laser vertikal yang berdenyut:

| No | Tahun | Nama Peristiwa Krisis | Klasifikasi Syok | Harga Spot Minyak | Dampak Harga 30-Hari | Kejutan Harian ($r$) | Elevasi Volatilitas |
| :-: | :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **1** | **1990** | **Perang Teluk (Invasi Kuwait)** | *Supply Shock* | \$22,25/bbl | **+59,7%** | +8,5% | 8,8 / 10 |
| **2** | **1998** | **Krisis Moneter Asia & Glut** | *Demand Shock* | \$9,55/bbl | **-38,4%** | -6,8% | 6,2 / 10 |
| **3** | **2008** | **All-Time High Supercycle** | *Speculative Spike*| **\$143,95/bbl**| **+112,5%** | +10,4% | **9,9 / 10** |
| **4** | **2011** | **Arab Spring & Perang Libya**| *Geopolitical Disruption*| \$126,65/bbl | **+35,2%** | +5,8% | 6,5 / 10 |
| **5** | **2014** | **Ledakan Shale AS vs OPEC** | *Structural Oversupply*| \$114,55/bbl | **-58,2%** | -7,5% | 7,4 / 10 |
| **6** | **2020** | **Crash Permintaan COVID-19**| *Demand Destruction*| **\$9,10/bbl** | **-68,4%** | **-14,2%** | **10,0 / 10** |
| **7** | **2022** | **Perang Rusia-Ukraina** | *Supply Embargo* | \$133,18/bbl | **+46,8%** | +9,1% | 8,2 / 10 |

---

## 04. Fungsi Interaktif & Kontrol Komponen

Komponen `BrentOil3DManifold` dirancang dengan kendali kamera kinematik:

### 1. Preset Sudut Pandang Kamera (*Camera Presets*)
- **Default Isometric ($\text{yaw} = -0{,}65, \text{pitch} = 0{,}35$)**: Memberikan pandangan spasial optimal untuk mengamati ketinggian puncak dan rentang ekor sekaligus.
- **Top-Down Contour ($\text{pitch} = 1{,}35$)**: Mengarahkan kamera tegak lurus dari atas langit, mengubah permukaan menjadi peta kontur kepadatan dua dimensi (*heat map view*).
- **Horizon Profile ($\text{pitch} = 0{,}05$)**: Menurunkan kamera sejajar dengan garis horizontal untuk memeriksa ketebalan ekor leptokurtik secara frontal.

### 2. Rotasi Orbit Manual & Sentuhan (*Touch Orbit*)
- **Klik Kiri & Geser Mouse (*Mouse Drag*)**: Memutar sumbu *Yaw* (putaran 360° horisontal) dan *Pitch* (sudut kemiringan vertikal yang dibatasi antara $-1{,}4$ hingga $+1{,}4$ radian agar tidak terbalik).
- **Toggle Auto-Rotation**: Memutar kanvas secara otomatis dengan kecepatan sudut konstan $0{,}003\text{ rad/frame}$ untuk presentasi visual.

### 3. Kontrol Zooming Ganda (*Dual Zoom System*)
- **Tombol Zoom (+ / -)**: Memperbesar atau memperkecil jarak kamera $D_{\text{cam}}$ dengan kelipatan $\pm 40\text{ unit}$.
- **Roda Gulir Mouse (*Mouse Wheel*)**: Akselerasi zoom kontinu yang responsif terhadap input presisi trackpad.

### 4. Deteksi Kursor & Tooltip Sumbu (*Raycast Hover Inspection*)
- Mengarahkan kursor ke atas permukaan manifold menghitung sel terdekat via kalkulasi jarak layar:
  - Membuka kotak *floating tooltip* yang menampilkan **Tahun (Epoch)**, **Keranjang Imbal Hasil (%)**, dan **Frekuensi Probabilitas Aktual**.

---

## 05. Formulasi Matematis & Algoritma Grafis Kanvas

### 1. Transformasi Matriks Rotasi Euler 3D

Setiap titik koordinat verteks $\mathbf{p} = (x, y, z)^T$ dirotasikan dalam ruang kamera melalui perkalian matriks rotasi terhadap sumbu $Y$ (Yaw $\theta_y$) dan sumbu $X$ (Pitch $\theta_x$):

$$\begin{pmatrix} x' \\ y' \\ z' \end{pmatrix} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\theta_x & -\sin\theta_x \\ 0 & \sin\theta_x & \cos\theta_x \end{pmatrix} \begin{pmatrix} \cos\theta_y & 0 & \sin\theta_y \\ 0 & 1 & 0 \\ -\sin\theta_y & 0 & \cos\theta_y \end{pmatrix} \begin{pmatrix} x \\ y \\ z \end{pmatrix}$$

Ekspansi aljabar eksplisit untuk performa maksimum:

$$x' = x \cos\theta_y + z \sin\theta_y$$

$$y' = -x \sin\theta_x \sin\theta_y + y \cos\theta_x + z \sin\theta_x \cos\theta_y$$

$$z' = -x \cos\theta_x \sin\theta_y - y \sin\theta_x + z \cos\theta_x \cos\theta_y$$

### 2. Proyeksi Perspektif ke Layar 2D (*Screen Projection*)

Titik kamera berada pada jarak fokus $D$ dan jarak pengamat $D_{\text{cam}}$:

$$X_s = X_{\text{center}} + \frac{x' \cdot D}{z' + D_{\text{cam}}}$$

$$Y_s = Y_{\text{center}} + \frac{y' \cdot D}{z' + D_{\text{cam}}}$$

Di mana $z' + D_{\text{cam}} > 0$ bertindak sebagai pembagi perspektif (*perspective foreshortening*), membuat elemen di depan tampak lebih besar daripada elemen di kejauhan.

### 3. Algoritma Pelukis (*Painter's Depth Sorting Algorithm*)

Kanvas HTML5 2D tidak memiliki *Z-buffer hardware* bawaan. Untuk merender ratusan poligon kuadrilateral secara akurat dengan transparansi alpha tanpa terjadinya *glitch* tumpang tindih:
1. Setiap permukaan segi empat poligon dihitung kedalaman titik tengahnya (*centroid depth*):
   $$\bar{z}' = \frac{z'_1 + z'_2 + z'_3 + z'_4}{4}$$
2. Seluruh poligon diurutkan secara menurun (*descending order*):
   $$\mathcal{P}_{\text{sorted}} = \text{sort}\left(\mathcal{P}, \text{key} = \bar{z}', \text{reverse} = \text{True}\right)$$
3. Poligon yang terletak paling jauh digambar terlebih dahulu di latar belakang, lalu ditimpa secara bertahap oleh poligon yang lebih dekat ke lensa kamera.

---

## 06. Kesimpulan & Wawasan Manajemen Risiko Finansial

1. **Pembuktian Visual Non-Normalitas Pasar Minyak**:
   - Manifold 3D membuktikan secara visual bahwa asumsi kurva lonceng normal Gaussian yang umum dipakai oleh model perbankan standar (Black-Scholes atau VaR varians-kovarians) adalah kekeliruan fatal di pasar komoditas.
   - Puncak manifold yang tajam dipadukan dengan permukaan sayap yang tebal mengonfirmasi nilai **kurtosis empiris sebesar 45,43**.
2. **Identifikasi Rezim Volatilitas Ganda (*Dual-Regime Memory*)**:
   - Pasar minyak berada dalam salah satu dari dua keadaan: *Rezim Dormant* (elevasi tengah tinggi, harga tenang) atau *Rezim Turbulen* (ketinggian runtuh, ekor melebar ke batas -14%). Transisi antar-rezim dipicu oleh peristiwa geopolitik atau dislokasi permintaan yang ditandai oleh 7 suar laser.
3. **Penyusunan Bantalan Modal (*Capital Buffer Calibration*)**:
   - Institusi penyimpan cadangan minyak atau *trading desk* energi wajib menggunakan nilai **Expected Shortfall 99% (-10,42%)** alih-alih VaR tradisional untuk menjamin kecukupan likuiditas saat menghadapi guncangan pasar ekstrem.
