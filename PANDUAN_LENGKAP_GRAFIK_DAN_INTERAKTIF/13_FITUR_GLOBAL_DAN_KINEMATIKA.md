# Panduan Komprehensif: Fitur Global, Kinematika Kupu-Kupu Interaktif & UX Sistem

Dokumen ini membedah secara mendalam seluruh arsitektur interaktif global yang berjalan di seluruh halaman portofolio, mencakup mesin fisika kinematika agen otonom (**Interactive Butterfly Kinematics Engine**), palet perintah keyboard pintar (**Command Palette `Ctrl+K`**), indikator kemajuan gulir (*Scroll Progress Bar*), serta sistem desain tema monokrom kontras tinggi.

---

## 01. Mesin Kinematika Kupu-Kupu Interaktif (*Interactive Butterfly*)

Di seluruh halaman web portofolio, terdapat entitas kupu-kupu piksel digital interaktif yang terbang secara otonom, mendarat di atas judul artikel, dan bereaksi secara fisik terhadap gerakan kursor tetikus pengguna.

### A. Mesin Keadaan Terhingga 4-Fase (*4-State Finite State Machine*)

Perilaku kupu-kupu dikendalikan oleh diagram mesin keadaan terstruktur:

```
+-----------------------------------------------------------------------------------+
| DIAGRAM FINITE STATE MACHINE (FSM) KINEMATIKA KUPU-KUPU                           |
|                                                                                   |
|                   [Kursor Mendekat < 120px]                                        |
|         ┌──────────────────────────────────────────────┐                          |
|         │                                              │                          |
|         ▼                                              │                          |
|  +--------------+   Pencarian Elemen Judul H1/H2/H3  +------------------+         |
|  | EVADE_CURSOR | ◄───────────────────────────────── | IDLE_FLIGHT      |         |
|  +--------------+                                    +------------------+         |
|         │                                              │                          |
|         │ [Selesai Akselerasi Menjauh]                 │ [Target Ditemukan]       |
|         ▼                                              ▼                          |
|  +--------------+      Waktu Istirahat Habis (3-8s)  +------------------+         |
|  | PERCHED      | ─────────────────────────────────► | APPROACH_PERCH   |         |
|  +--------------+                                    +------------------+         |
|    (Hinggap di Teks & Sayap Melipat Pelan 1Hz)         (Menukik Halus ke Judul)   |
+-----------------------------------------------------------------------------------+
```

#### Spesifikasi Keempat Keadaan (*State Specifications*):
1. **`IDLE_FLIGHT` (Terbang Bebas)**:
   - Kupu-kupu terbang melayang mengitari layar (*viewport*) menggunakan kombinasi gelombang sinusoidal periodik menyerupai kebisingan Perlin (*Perlin noise*).
   - Frekuensi kepakan sayap cepat: **$f \approx 8 - 10\text{ Hz}$** (8 hingga 10 kepakan per detik).
   - Menjaga batas ketinggian agar tidak terbang keluar dari tepi jendela browser.
2. **`APPROACH_PERCH` (Pendekatan Mendarat)**:
   - Pemindai DOM mendeteksi elemen-elemen teks strategis (`h1`, `h2`, `h3`, `.project-row`, `.evidence-card`).
   - Kupu-kupu menghitung vektor arah ke sudut kanan atas judul teks dan memperlambat kecepatannya (*smooth deceleration*) menggunakan redaman pegas kritis.
3. **`PERCHED` (Hinggap di Atas Teks)**:
   - Kupu-kupu mendarat stabil di atas huruf judul.
   - Frekuensi kepakan sayap melambat drastis menjadi **$f \approx 1\text{ Hz}$** (gerakan melipat sayap yang lembut dan santai).
   - Durasi hinggap berlangsung antara **3 hingga 8 detik** sebelum kembali terbang mencari target baru, kecuali jika diusik oleh kursor.
4. **`EVADE_CURSOR` (Manuver Menghindar Cepat)**:
   - Jika kursor mouse mendekat dalam radius keamanan **$r_{\text{evade}} = 120\text{ piksel}$**, kupu-kupu membatalkan pendaratan seketika.
   - Menghasilkan vektor akselerasi ledakan (*burst acceleration*) ke arah berlawanan dari posisi kursor dengan kecepatan puncak hingga **$450\text{ px/detik}$**.

---

### B. Formulasi Fisika Vektor Kupu-Kupu

#### 1. Gaya Tolak Kursor Elektrostatis (*Cursor Repulsion Vector*):
Ketika posisi kursor adalah $\mathbf{x}_c = (x_c, y_c)$ dan posisi kupu-kupu adalah $\mathbf{x}_b = (x_b, y_b)$, jarak Euclidean dihitung sebagai $d = \|\mathbf{x}_b - \mathbf{x}_c\|$:

$$\mathbf{F}_{\text{evade}} = \begin{cases}
\frac{k_{\text{repulse}}}{d^2} \cdot \frac{\mathbf{x}_b - \mathbf{x}_c}{d}, & \text{jika } d \le 120\text{ px} \\
\mathbf{0}, & \text{jika } d > 120\text{ px}
\end{cases}$$

#### 2. Vektor Kemudi Menuju Target (*Steering Force Heading*):
Ketika mendekati koordinat mendarat $\mathbf{x}_{\text{target}}$:

$$\mathbf{v}_{\text{desired}} = \text{normalize}(\mathbf{x}_{\text{target}} - \mathbf{x}_b) \cdot v_{\text{approach}}$$

$$\mathbf{F}_{\text{steer}} = \frac{\mathbf{v}_{\text{desired}} - \mathbf{v}_{\text{current}}}{\tau_{\text{steer}}}$$

#### 3. Rotasi Transformasi Sayap 3D (*Perspective CSS Rotation*):
Sudut kepakan sayap kiri dan kanan pada waktu $t$ dihitung menggunakan modulasi sinus:

$$\theta_{\text{wing}}(t) = A_{\text{flap}} \cdot \sin(2\pi f t)$$

Diimplementasikan pada elemen DOM melalui transformasi CSS 3D:
```css
/* Sayap Kiri */
transform: perspective(600px) rotateY(calc(-1 * var(--wing-angle)));
/* Sayap Kanan */
transform: perspective(600px) rotateY(var(--wing-angle));
```

#### 4. Aksesibilitas & Efisiensi Baterai (*Performance Safeguards*):
- Kupu-kupu mendeteksi preferensi pengguna `prefers-reduced-motion: reduce`. Jika aktif, animasi dinonaktifkan secara otomatis.
- Putaran `requestAnimationFrame` otomatis dihentikan sementara (*paused*) ketika tab peramban diminimalkan atau kehilangan fokus (*window blur*), menghemat penggunaan CPU hingga 0%.

---

## 02. Palet Perintah Keyboard Cepat (*Command Palette `Ctrl+K`*)

Untuk mempermudah navigasi profesional tanpa harus menggulir halaman, sistem menyediakan terminal perintah instan:

```
+-----------------------------------------------------------------------------------+
| TERMINAL NAVIGASI GLOBAL [ COMMAND PALETTE ]                 [Esc untuk keluar]   |
|                                                                                   |
| > Ketik perintah atau cari bagian... [                                    ]       |
|                                                                                   |
| [1] Go to work              -> Lompat ke katalog seluruh studi kasus proyek       |
| [2] Read approach           -> Pelajari filosofi rekayasa data & metodologi       |
| [3] Open skills             -> Buka inventaris kompetensi teknis & sertifikasi    |
| [4] Explore career path     -> Tinjau rekam jejak profesional & kepemimpinan      |
| [5] Inspect playground      -> Buka laboratorium simulasi data interaktif         |
| [6] Read opinions & essays  -> Baca artikel pemikiran arsitektur teknologi        |
| [7] Contact Abimael         -> Buka tautan surel, GitHub, dan media sosial        |
+-----------------------------------------------------------------------------------+
```

### Cara Penggunaan:
- **Kombinasi Tombol Pintas**: Tekan `Ctrl + K` (Windows/Linux) atau `Cmd + K` (macOS) di halaman mana pun.
- **Pencarian Cepat**: Ketik huruf kunci (misalnya *"work"*, *"skills"*, *"contact"*).
- **Navigasi Keyboard**: Gunakan tombol panah `↑` dan `↓` lalu tekan `Enter` untuk langsung berpindah ke bagian yang dituju secara instan.
- **Tutup Cepat**: Tekan tombol `Escape` untuk menutup jendela modal dan mengembalikan fokus kursor ke elemen sebelumnya (*focus restoration*).

---

## 03. Indikator Kemajuan Membaca (*Scroll Progress Bar*)

Di bagian paling atas jendela peramban (*viewport header*), terdapat garis indikator horisontal ultra-ramping setinggi 2 piksel dengan pendaran warna aksen sian:

```
[HEADER PERAMBAN]
+====================================-----------------------------------------------+
 ^ Garis Progres Gulir Layar (48% Halaman Selesai Dibaca)
```

### Formulasi Matematis Kalkulasi Gulir:

$$\text{Scroll Percentage} = \min\left(100, \; \left\lfloor \frac{Y_{\text{scroll}}}{\max\left(1, \; H_{\text{document}} - H_{\text{viewport}}\right)} \times 100 \right\rfloor\right)$$

Di mana:
- $Y_{\text{scroll}}$: Posisi gulir vertikal jendela saat ini (`window.scrollY`).
- $H_{\text{document}}$: Ketinggian total seluruh konten halaman (`document.documentElement.scrollHeight`).
- $H_{\text{viewport}}$: Ketinggian jendela layar yang sedang terlihat (`window.innerHeight`).
- Transformasi CSS diterapkan secara perangkat keras (*hardware accelerated*):
  `transform: scaleX(progress / 100); transform-origin: left;`

---

## 04. Sistem Desain & Variabel Tema (*Design Tokens*)

Portofolio dibangun di atas fondasi desain visual monokromatik kontras tinggi dengan aksen pendaran neon:

| Variabel CSS | Nilai Warna Dasar | Peran Semantik dalam Antarmuka |
| :--- | :--- | :--- |
| `--bg` | `#0b0c10` (Obsidian Gelap) | Latar belakang dasar seluruh halaman web |
| `--panel` | `#12131a` (Slate Dalam) | Latar belakang kartu analitik, terminal, dan kontainer |
| `--line` | `#232533` (Garis Batas) | Garis pemisah antar-bagian dan bingkai tabel data |
| `--ink` | `#f1f3f9` (Putih Murni) | Teks utama paragraf dan label data penting |
| `--ink-heading` | `#ffffff` (Putih Kontras) | Tipografi judul utama artikel dan nama proyek |
| `--ink-muted` | `#8b90a5` (Abu-abu Slate) | Keterangan sumbu grafik, tanggal, dan teks sekunder |
| `--accent` | `#06b6d4` (Sian Elektrik) | Tombol aktif, pendaran laser, dan tautan interaktif |
| `--accent-subtle` | `rgba(6, 182, 212, 0.12)` | Latar belakang lencana tag dan indikator status |

---

## 05. Kesimpulan & Filosofi Pengalaman Pengguna (UX)

1. **Perpaduan Sains Data & Seni Interaktif**:
   - Seluruh elemen antarmuka bukan sekadar dekorasi visual pasif, melainkan sistem berbasis fisika dan matematika nyata (dari simulasi kinematika kepakan sayap hingga manifold topologi kuadratik).
2. **Kinerja Tinggi Tanpa Beban Komputasi Berat**:
   - Menghindari ketergantungan pustaka animasi yang berat (seperti Three.js berukuran megabyte) dengan mengimplementasikan perhitungan vektor matematika asli di kanvas HTML5 dan akselerasi GPU CSS3.
3. **Standar Aksesibilitas Web Modern**:
   - Seluruh grafik dan kontrol interaktif dilengkapi atribut `aria-label`, navigasi keyboard penuh, dan perlindungan otomatis terhadap pengguna yang sensitif terhadap gerakan animasi.
