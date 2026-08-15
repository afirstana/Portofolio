# Robots & Search Indexing Specification

Dokumen ini mendefinisikan kebijakan perayap mesin pencari (*search engine crawlers*), bot AI, sitemap, dan indexing pada website portofolio Abimael.

---

## 1. File Konfigurasi Mesin Pencari

| Endpoint | File Sumber | Deskripsi |
| :--- | :--- | :--- |
| `/robots.txt` | `app/robots.ts` & `public/robots.txt` | Memberi izin akses perayapan (`Allow: /`) ke seluruh mesin pencari (Googlebot, Bingbot, dll) dan menyertakan URL sitemap. |
| `/sitemap.xml` | `app/sitemap.ts` | Daftar lengkap semua halaman publik (Homepage dan 5 rute studi kasus project) dengan frekuensi pembaruan bulanan. |
| `/llms.txt` | `public/llms.txt` | File standar ringkasan konten berformat Markdown untuk mesin pencari berbasis AI (ChatGPT, Perplexity, Claude). |
| `/manifest.webmanifest` | `app/manifest.ts` | Manifest PWA untuk metadata nama aplikasi, tema warna `#050506`, dan icon perangkat. |

---

## 2. Aturan Perayapan (`robots.txt`)

```text
User-Agent: *
Allow: /

Sitemap: https://abimael-data.vercel.app/sitemap.xml
```

---

## 3. Struktur Metadata SEO & OpenGraph

Setiap halaman di-generate secara statis dengan metadata berikut:
- **Title Tag**: Template dinamis `%s | Abimael.Data`
- **Meta Description**: Deskripsi ringkas per studi kasus dan beranda
- **Canonical URL**: `https://abimael-data.vercel.app/...`
- **OpenGraph & Twitter Card**: `type: website`, `card: summary`
- **Structured Data (JSON-LD)**: Schema `Person` & `CreativeWork` di `components/StructuredData.tsx`
