<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mandatory Project Rule: Context Persistence & Single Source of Truth

Setiap AI Agent yang bekerja pada repositori ini **WAJIB** mematuhi aturan berikut tanpa pengecualian:

1. **Read Context First**: Di awal setiap sesi percakapan atau sebelum memulai tugas pengkodean/desain baru, baca file [`PROJECT_CONTEXT.md`](file:///d:/PROJEK%20WEBISDE%20YAYASAN_ICA/PROJECT_CONTEXT.md) untuk memahami konteks arsitektur, keputusan desain, dan progres fitur terkini.
2. **Preserve Design Integrity (Anti-AI Slop)**: Selalu patuhi standar desain yang telah ditetapkan di `.agents/skills/web-ui-ux-design/SKILL.md` dan `.agents/skills/components-reference/SKILL.md`:
   - Warna brand utama: `#006633` (POLNES Academic Green), aksen `#F78100`.
   - Standar kartu institusional `card-base-pmb` (rounded-lg, border `#DFE3E9`, simetris, tanpa garis samping warna).
   - Bentuk badge kotak tegas (`rounded-[4px]`), dilarang menggunakan badge lonjong `rounded-full` dan dilarang menggunakan latar mint pucat `#D0FFD5`.
   - Ikon semantik (DILARANG menggunakan `Sparkles`).
   - Nama resmi lembaga: **YAYASAN ICA**.
3. **Continuous Context Update**: Setiap kali menyelesaikan task, penambahan fitur, atau perbaikan desain:
   - Wajib memperbarui status dan catatan teknis di [`PROJECT_CONTEXT.md`](file:///d:/PROJEK%20WEBISDE%20YAYASAN_ICA/PROJECT_CONTEXT.md).
   - Wajib menjalankan validasi type check (`tsc --noEmit`) dan build test (`npm run build`) dengan hasil 0 error.
   - Lakukan `git add`, `git commit` dengan pesan semantik deskriptif, dan `git push origin main`.
4. **Production Deployment Awareness**: Proyek ini terhubung otomatis ke Vercel di [https://web-portal-ppdb-r2.vercel.app/](https://web-portal-ppdb-r2.vercel.app/) melalui branch `main` GitHub. Setiap push ke `main` langsung memperbarui web produksi.
