# Abimael — Static Markdown Portfolio

Portfolio ini menggunakan **Next.js App Router**, Tailwind CSS, dan Markdown lokal di `content/`. Tidak ada database, autentikasi, cloud storage, API backend, maupun kebutuhan server runtime.

## Edit dan build

Perbarui berkas Markdown di `content/`, lalu jalankan:

```bash
pnpm install
pnpm build
```

`next.config.ts` memakai `output: "export"`; hasil situs ada di `out/` dan dapat dideploy ke Vercel atau Cloudflare Pages. Setiap build juga menyertakan salinan source lengkap pada `out/source/`, termasuk `app/`, `components/`, `lib/`, `content/`, skrip, dan konfigurasi. Lihat `SOURCE_EXPORT.md` untuk rinciannya.
