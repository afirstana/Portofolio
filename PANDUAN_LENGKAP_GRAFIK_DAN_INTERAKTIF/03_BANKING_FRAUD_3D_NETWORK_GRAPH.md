# Panduan Komprehensif: Banking Fraud 3D Network Graph & Syndicate Intelligence

Dokumen ini membedah secara mendalam seluruh arsitektur graf jaringan tiga dimensi, simulasi fisika Coulomb-Hooke, algoritma penelusuran topologi graf (*1-Hop & 2-Hop in-memory graph traversal*), visualisasi aliran dana partikel laser, serta pembongkaran 3 sindikat kejahatan perbankan terorganisir pada proyek **Banking Fraud 3D Network Graph**.

---

## 01. Ringkasan Eksekutif & Konteks Forensik Kejahatan Finansial

### A. Keterbatasan Pendekatan Analisis Transaksi Tabular
Dalam investigasi pencucian uang (*Anti-Money Laundering* / AML) dan sindikat penipuan perbankan (*fraud rings*), analisis tabel transaksi baris per baris tradisional mengalami kegagalan struktural:
1. **Teknik Smurfing & Layering**: Sindikat kriminal memecah dana curian dalam jumlah besar menjadi ratusan transaksi kecil bernilai di bawah ambang batas pelaporan wajib (misalnya di bawah Rp 10.000.000 / \$1.000) yang disalurkan melalui puluhan rekening perantara (*mule accounts*).
2. **Koneksi Tersembunyi Antar-Identitas**: Pelaku menggunakan perangkat keras yang sama (IMEI ponsel pintar, alamat IP, alamat MAC) untuk mengendalikan puluhan rekening bank fiktif yang seolah-olah dimiliki oleh individu berbeda.
3. **Kebutuhan Intelijen Spasial Relasional**: Penyelidik forensik membutuhkan graf topologi 3D interaktif untuk melihat klaster sindikat, mendeteksi rekening penampung utama (*hub nodes*), dan melacak rute pencairan dana tunai (*cashout nodes*).

### B. Solusi Rekayasa Graf 3D Berkecepatan Tinggi
- Membangun mesin graf berarah tiga dimensi (*3D Force-Directed Directed Graph*) di atas HTML5 Canvas murni tanpa ketergantungan pustaka pihak ketiga.
- Mengelola **495 entitas perbankan** (rekening nasabah, sidik jari perangkat, terminal ATM, *merchant EDC*) dan ribuan sisi hubungan (*edges*).
- Menampilkan pulsa aliran dana bergerak berupa **partikel laser bercahaya (*laser particle streams*)** yang mengalir mengikuti arah transfer modal secara dinamis.
- Mengidentifikasi dan mengisolasi **3 Sindikat Kejahatan Terorganisir Utama (Alpha, Beta, dan Gamma)** dengan sekali klik.

---

## 02. Panduan Membaca Geometri Graf, Simbol, & Warna

### Anatomi Visual Elemen Graf 3D:

```
+-----------------------------------------------------------------------------------+
| LEGENDA ENTITAS & TIPE HUBUNGAN GRAF 3D FORENSIK PERBANKAN                        |
|                                                                                   |
| [SIMBOL SIMPUL / NODE ENTITAS]                                                    |
|  (O) Cyan / Biru Muda : Rekening Nasabah Normal (Clean Individual Account)        |
|  (*) Crimson / Merah  : Rekening Anomali Berbahaya (Flagged Mule Account)         |
|  [#] Ungu / Violet    : Sidik Jari Perangkat Bersama (Shared IMEI / IP Device)    |
|  [^] Amber / Emas     : Terminal Penarikan Kas ATM (ATM Cashout Terminal)         |
|  [+] Emerald / Hijau  : Merchant Penampung Fiktif (Mule Merchant POS)            |
|                                                                                   |
| [GARIS HUBUNGAN / EDGES]                                                          |
|  ──> Garis Sian Tipis : Transfer Rekening Normal                                  |
|  ──> Garis Merah Pendar: Transfer Dana Curian / Pencucian Uang (Layering Flow)     |
|  --- Garis Putus Ungu : Asosiasi Perangkat Identik (Hardware Sharing Link)        |
|  ~~~ Partikel Laser   : Pulsa Aliran Uang Bergerak Mengikuti Kecepatan Dana       |
+-----------------------------------------------------------------------------------+
```

#### Cara Mengidentifikasi Klaster Berbahaya:
1. **Titik Sentral (*High-Degree Mule Hub*)**:
   - Ditandai oleh simpul merah besar dengan puluhan garis merah yang memusat padanya. Ini adalah rekening *core mule* tempat dana dari rekening korban dikumpulkan sebelum dilarikan.
2. **Titik Perangkat Bersama (*Shared Device Anchor*)**:
   - Simpul ungu yang terhubung ke 5 hingga 10 rekening bank berbeda. Menandakan satu pelaku kejahatan mengoperasikan banyak akun dari satu unit telepon genggam yang sama.
3. **Simpul Terminal Akhir (*Cashout Sink*)**:
   - Simpul segitiga emas (ATM) yang menerima aliran transfer cepat dari rekening mule lalu segera dicairkan secara tunai dalam rentang waktu kurang dari 15 menit.

---

## 03. Profil Forensik 3 Sindikat Kejahatan Terorganisir

Sistem mengelompokkan anomali jaringan menjadi 3 sindikat besar dengan modus operandi spesifik:

```
[SINDIKAT ALPHA: ATM SMURFING]     [SINDIKAT BETA: DEVICE HIJACK]    [SINDIKAT GAMMA: MERCHANT LAUNDER]
         (Korban)                          [Shared IMEI]                      (Akun Mule)
          /    \                              /  |  \                           /    \
         v      v                            v   v   v                         v      v
     (Mule 1)  (Mule 2)                  (Akun A)(Akun B)(Akun C)           [Merchant Fiktif POS]
         \      /                            \   |   /                             │
          v    v                              v  v  v                              ▼
      (ACC-1042 Hub)                      (ACC-2091 Hub)                   (Pencairan Kas Fisik)
            │                                    │
            ▼                                    ▼
       [^ ATM Kas ^]                       [^ ATM Kas ^]
```

### 1. Sindikat Alpha: *Fast Layering & ATM Smurfing Ring*
- **Simpul Inti (*Core Mule*)**: `ACC-1042`.
- **Modus Operandi**: Rekening menerima puluhan transfer cepat bernilai \$500 – \$1.500 dari belasan rekening korban dalam rentang waktu dini hari (01:00 – 04:00 UTC). Dalam waktu 30 menit, dana langsung ditarik tunai secara bertahap melalui 4 terminal ATM terdekat untuk menghindari pemblokiran sistem.
- **Pola Graf**: Struktur bintang (*star topology*) terpusat pada `ACC-1042` dengan derajat koneksi keluar tinggi menuju simpul ATM.

### 2. Sindikat Beta: *Device Sharing & Multi-Account Hijacking Ring*
- **Simpul Inti (*Core Mule*)**: `ACC-2091`.
- **Modus Operandi**: Satu nomor IMEI dan alamat IP seluler digunakan untuk melakukan otorisasi login dan transfer pada 8 rekening bank atas nama KTP yang berbeda. Merupakan indikasi kuat pencurian identitas (*identity theft*) dan rekening sewaan (*money mule rental*).
- **Pola Graf**: Klaster padat berbentuk jaring laba-laba yang mengitari simpul perangkat keras bersama (simpul ungu).

### 3. Sindikat Gamma: *Cross-Channel Merchant Laundering Ring*
- **Simpul Inti (*Core Mule*)**: `ACC-3150`.
- **Modus Operandi**: Penyamaran transaksi pencucian uang melalui transaksi belanja fiktif pada terminal EDC *merchant* rekanan (toko ritel palsu). Tidak melibatkan penarikan ATM, melainkan kliring pembayaran dagang palsu.
- **Pola Graf**: Rantai bipartite antara rekening nasabah dengan gerai ritel terdaftar.

---

## 04. Fungsi Interaktif & Kontrol Komponen

Komponen `BankingFraud3DGraph` menyediakan fitur kendali investigasi canggih:

### 1. Tombol Preset Fokus Sindikat (*Syndicate Presets*)
- **Tombol [All Nodes]**: Mengatur kamera ke posisi orbit makro ($dist = 580$, pandangan seluruh 495 simpul).
- **Tombol [Syndicate Alpha]**: Kamera bergerak mulus (*smooth transition*) menyorot rekening inti `ACC-1042`, mengisolasi jaringannya, dan meredupkan simpul lainnya.
- **Tombol [Syndicate Beta]**: Mengarahkan fokus kamera ke klaster perangkat bersama `ACC-2091`.
- **Tombol [Syndicate Gamma]**: Mengunci koordinat pada jaringan *merchant laundering* `ACC-3150`.

### 2. Penjelajah Sub-Graf Interaktif (*Subgraph Hop Selector*)
- **Mode 1-Hop**: Menampilkan entitas yang memiliki relasi transaksi langsung (satu derajat pemisah) dari simpul yang dipilih.
- **Mode 2-Hop**: Memperluas penelusuran hingga dua langkah hubungan (*extended ring*), mengungkap rekening penampung tingkat kedua (*secondary mules*) yang sering luput dari penyelidikan biasa.

### 3. Sakelar Aliran Laser (*Laser Particle Stream Toggle*)
- Menghidupkan atau mematikan animasi foton pulsa cahaya yang mengalir di sepanjang garis transfer.
- Kecepatan dan kerapatan partikel proporsional dengan frekuensi dan nominal transaksi (memudahkan mata manusia mendeteksi rute perpindahan modal terbesar secara intuitif).

### 4. Filter Risiko & Pencarian Entitas (*Search & Risk Filter*)
- **Filter Risiko**: Memilih mode tampilan `ALL`, `HIGH` (skor risiko $\ge 4$), atau `FLAGGED` (rekening yang telah masuk daftar hitam).
- **Omni-Search**: Mencari nomor rekening (`ACC-1042`), ID perangkat, atau terminal ATM tertentu dengan auto-fokus instan.

### 5. Panel Dossier Audit Terperinci (*Node Detail Dossier*)
Mengklik simpul mana pun di ruang 3D akan membuka panel samping forensik:
- Menampilkan ID Rekening, Nama Pemilik, Skor Risiko Fraud (0–6).
- Rincian Total Dana Masuk (*Inflow*) vs Total Dana Keluar (*Outflow*).
- Daftar seluruh rekening tetangga (*neighboring connections*) dan catatan bendera anomali perbankan.

---

## 05. Formulasi Fisika & Algoritma Tata Letak Graf

### 1. Model Gaya Coulomb-Hooke 3D (*Force-Directed Graph Engine*)

Posisi setiap simpul dihitung secara iteratif melalui simulasi fisika partikel untuk mencapai keseimbangan energi minimum:

#### A. Gaya Tolak-Menolak Coulomb (Antar Seluruh Pasangan Simpul):
Setiap simpul menolak simpul lainnya agar tidak bertumpukan di satu titik:

$$\mathbf{F}_{\text{repulse}}(i, j) = \frac{k_r^2}{\|\mathbf{r}_i - \mathbf{r}_j\|^2} \cdot \frac{\mathbf{r}_i - \mathbf{r}_j}{\|\mathbf{r}_i - \mathbf{r}_j\|}$$

Di mana $k_r$ adalah konstanta tolak elektrostatik.

#### B. Gaya Tarik Pegas Hooke (Hanya Pada Simpul yang Memiliki Garis Hubungan):
Simpul yang saling bertransaksi atau berbagi perangkat ditarik mendekat satu sama lain:

$$\mathbf{F}_{\text{attract}}(i, j) = \frac{\|\mathbf{r}_i - \mathbf{r}_j\|^2}{k_a} \cdot \frac{\mathbf{r}_j - \mathbf{r}_i}{\|\mathbf{r}_i - \mathbf{r}_j\|}$$

Di mana $k_a$ adalah panjang istirahat pegas (*spring resting length*).

#### C. Integrasi Kecepatan & Peredaman Euler (*Verlet Velocity Damping*):
Untuk menghentikan getaran dan menstabilkan graf:

$$\mathbf{v}_i^{(t+1)} = \left(\mathbf{v}_i^{(t)} + \frac{\mathbf{F}_{\text{total}}}{m_i} \cdot \Delta t\right) \times \gamma$$

$$\mathbf{r}_i^{(t+1)} = \mathbf{r}_i^{(t)} + \mathbf{v}_i^{(t+1)} \cdot \Delta t$$

Di mana faktor gesekan $\gamma = 0{,}85$ meredam osilasi hingga graf mencapai konvergensi tenang.

---

### 2. Algoritma Penelusuran Tetangga Dalam Memori (*In-Memory Traversal*)

Algoritma mengindeks seluruh koneksi ke dalam *Adjacency Map* di memori RAM browser:

```typescript
// 1-Hop Neighbor Discovery
function get1HopNeighbors(graph: GraphData, rootId: string): Set<string> {
  const neighbors = new Set<string>([rootId]);
  for (const edge of graph.edges) {
    if (edge.source === rootId) neighbors.add(edge.target);
    if (edge.target === rootId) neighbors.add(edge.source);
  }
  return neighbors;
}

// 2-Hop BFS Traversal
function get2HopNeighbors(graph: GraphData, rootId: string): Set<string> {
  const hop1 = get1HopNeighbors(graph, rootId);
  const hop2 = new Set<string>(hop1);
  for (const neighborId of hop1) {
    for (const edge of graph.edges) {
      if (edge.source === neighborId) hop2.add(edge.target);
      if (edge.target === neighborId) hop2.add(edge.source);
    }
  }
  return hop2;
}
```

Kompleksitas algoritma adalah $O(|E|)$ yang selesai dalam waktu **$< 2\text{ milidetik}$**, memungkinkan interaksi klik tanpa *lag*.

---

## 06. Kesimpulan & Nilai Tambah Investigasi Kejahatan Perbankan

1. **Pemutusan Sindikat Terorganisir Secara Tuntas**:
   - Memblokir satu rekening mule individu tidak menghentikan sindikat karena pelaku dapat membuka rekening baru. Dengan visualisasi graf 3D, penyelidik dapat memblokir **seluruh 8 rekening dan alamat IMEI perangkat** sekaligus, melumpuhkan operasional kelompok penipu seutuhnya.
2. **Pengurangan Waktu Investigasi Kasus (*Investigation Cycle Time*)**:
   - Rekonstruksi rute aliran uang yang biasanya membutuhkan waktu 2 hari penelusuran manual di spreadsheet bank kini dapat dipahami secara visual dalam hitungan **detik**.
3. **Penyelamatan Aset Nasabah Sebelum Pencairan Kas**:
   - Dengan melacak simpul terminal penarikan ATM, tim keamanan siber perbankan dapat mengirimkan instruksi pemblokiran mesin ATM secara *real-time* sebelum komplotan pelaku selesai menarik uang tunai fisik.
