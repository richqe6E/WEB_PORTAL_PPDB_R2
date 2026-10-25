# MASTER DOKUMEN KONTEKS & ARSITEKTUR PROYEK (SINGLE SOURCE OF TRUTH)
> **Proyek:** Sistem Informasi Akademik & Portal PPDB Online Yayasan ICA (Jenjang PAUD & TK)  
> **Terakhir Diperbarui:** 25 Oktober 2026  
> **Status Produksi:** Aktif & Ter-deploy di Vercel (CI/CD Otomatis)

---

## 1. Tautan & Lingkungan Produksi Resmi

- **Live Production URL:** [https://web-portal-ppdb-r2.vercel.app/](https://web-portal-ppdb-r2.vercel.app/)
- **GitHub Repository:** [https://github.com/richqe6E/WEB_PORTAL_PPDB_R2](https://github.com/richqe6E/WEB_PORTAL_PPDB_R2) (Branch: `main`)
- **Backend / Database:** Supabase PostgreSQL (`https://iupgvywzsdctwkozjwgm.supabase.co`)
- **Storage Bucket:** Private Bucket `registration-docs` (Kartu Keluarga, Akta Kelahiran, KTP, Pas Foto)

---

## 2. Profil Lembaga & Ruang Lingkup Sistem

- **Nama Resmi Lembaga:** **YAYASAN ICA**
- **Jenjang Pendidikan:**
  1. **PAUD (Kelompok Bermain):** Usia 2 - 4 Tahun
  2. **TK A:** Usia 4 - 5 Tahun
  3. **TK B:** Usia 5 - 6 Tahun
- **Tahun Ajaran Aktif:** 2026/2027
- **Fungsi Utama:**
  - **Portal Publik (Orang Tua / Wali):** Pendaftaran mandiri siswa baru, upload berkas digital, unduh/cetak lembar tanda bukti resmi (standar A4 dengan kop resmi & tanda tangan), dan pemantauan status seleksi/verifikasi secara transparan via Nomor Registrasi atau NIK.
  - **Portal Admin Tata Usaha (TU):** Saklar global Buka/Tutup PPDB (`is_ppdb_open`), pengaturan kuota jenjang, verifikasi berkas digital via Document Viewer (zoom/rotate/pratinjau), pencatatan catatan revisi (`admin_notes`), penetapan status kelulusan (DITERIMA / DITOLAK), dan integrasi konfirmasi WhatsApp.

---

## 3. Tech Stack & Standar Rekayasa

- **Framework:** Next.js 16 (App Router dengan Turbopack)
- **Bahasa:** TypeScript (Strict Mode, 0 Error `tsc --noEmit`)
- **Styling:** Tailwind CSS v4, Semantic Tokens, `@media print` untuk standar kertas fisik A4.
- **Form & Validasi:** React Hook Form + Zod (validasi NIK 16 digit, nomor WA, ukuran/tipe berkas foto/PDF).
- **Notifikasi UI:** Sonner Toast.
- **Caching & RLS Strategy:** `export const dynamic = 'force-dynamic'` pada seluruh rute data agar status saklar dan keputusan admin selalu tersinkronisasi instan ke publik tanpa *freeze/stale cache*.

---

## 4. Master Design System & Anti-AI Slop (Wajib Dipatuhi)

Desain proyek ini **WAJIB** tunduk pada dua panduan yang telah disusun di dalam repositori:
1. `.agents/skills/web-ui-ux-design/SKILL.md`
2. `.agents/skills/components-reference/SKILL.md` (Standar SPMB Politeknik Negeri Samarinda - siAkad Cloud)

### Aturan Visual & Komponen Mutlak:
1. **Warna Brand:**
   - Primary: `#006633` (POLNES Academic Green)
   - Secondary / CTA Aksen: `#F78100` (Amber / Orange)
   - Background Halaman: `#F9FAFB`
   - Border Netral: `#DFE3E9` / `#D0D5DD`
   - Teks Utama: `#2A2A2C`
2. **Kartu Kontainer (`card-base-pmb`):**
   - Latar putih (`#FFFFFF`), border `1px solid #DFE3E9`, sudut `rounded-lg` (8px), bayangan halus (`shadow-xs` / `0px 4px 30px rgba(97,97,97,0.08)`).
   - **DILARANG** menggunakan garis aksen warna tebal vertikal di samping kiri/atas kartu (`border-l-4` atau `w-2 h-full bg-[#006633]`).
3. **Badge & Status Tag:**
   - Menggunakan bentuk kotak tegas bersudut presisi (`rounded-[4px]`) dengan border tipis dan kontras warna tinggi (WCAG AA).
   - **DILARANG** menggunakan badge lonjong bulat (`rounded-full`) dan dilarang menggunakan background hijau mint pucat beresiko rendah kontras (`#D0FFD5`).
4. **Pembersihan Ikon AI:**
   - **DILARANG** menggunakan ikon bintang `Sparkles` di halaman mana pun. Gunakan ikon semantik: `CheckCircle2`, `Award`, `Clock`, `AlertTriangle`.
5. **Navigasi Mobile-First:**
   - Header mobile harus bersih dan lega (hanya Logo Yayasan ICA + 1 Tombol Hamburger interaktif).
   - Menu dibuka melalui **Slide-Over Drawer** vertikal berjenjang dengan *thumb-zone* ramah jempol.
6. **Mikro-Interaksi UI (Uiverse Refined):**
   - Animated 3-bar burger button (`Cevorob`).
   - Sleek 3px indeterminate progress line loader (`satyamchaudharydev` - `.pmb-line-loader`).
   - Tactile button elevation & sliding arrow on hover (`Jedi-hongbin`).
   - Dismissable error/warning alert card (`ilkhoeri`).

---

## 5. Struktur Direktori & Rute Utama

```text
src/
├── actions/
│   ├── admin-actions.ts          # Server actions: verifikasi dokumen, keputusan seleksi, toggle PPDB
│   └── registration-actions.ts   # Server actions: pendaftaran publik, cek status pendaftar
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx          # Dashboard ringkasan stat kuota & pendaftar
│   │   │   ├── pendaftar/
│   │   │   │   ├── page.tsx      # Tabel lengkap pendaftar (filter, search, usia, download)
│   │   │   │   └── [id]/page.tsx # Split-screen verifikasi berkas & form keputusan TU
│   │   │   └── pengaturan/       # Master saklar PPDB, kuota jenjang, teks jadwal
│   │   └── layout.tsx            # Admin layout dengan sidebar proteksi auth
│   ├── (public)/
│   │   ├── page.tsx              # Landing page institusional (Hero, Jenjang, Linimasa)
│   │   ├── daftar/page.tsx       # Wizard formulir pendaftaran 4-langkah
│   │   ├── cek-status/page.tsx   # Portal cek status & cetak surat keputusan mandiri
│   │   └── layout.tsx            # Header publik drawer & footer 4-kolom
│   ├── login/page.tsx            # Autentikasi login resmi petugas TU
│   └── globals.css               # Token CSS, @media print A4, dan pmb-line-loader
├── components/
│   ├── admin/                    # Applicants table, document viewer modal, form settings
│   └── public/                   # Public header (drawer), registration wizard form
└── lib/
    ├── supabase/                 # Server & client Supabase helpers (SSR cookie-based)
    └── utils.ts                  # Format tanggal Indo, kalkulasi usia anak, no WA format
```

---

## 6. Riwayat Perubahan Terkini (Changelog)

- **v1.2.0 (25 Okt 2026):**
  - Pembersihan total seluruh elemen AI slop (penghapusan garis samping kartu, standardisasi `card-base-pmb`).
  - Pembuatan navigasi mobile *Slide-Over Drawer* (Yayasan At-Tarbiyyah) dengan 3-bar animated hamburger.
  - Penambahan sleek line loader (`.pmb-line-loader`) dan dismissable alert banner.
  - Standardisasi nama lembaga menjadi **YAYASAN ICA**.
  - Sinkronisasi otomatis ke Vercel via GitHub `main`.
- **v1.1.0 (25 Okt 2026):**
  - Implementasi Document Viewer Split-Screen untuk verifikasi berkas TU.
  - Implementasi format cetak fisik A4 (`@media print`) untuk bukti registrasi dan tanda kelulusan.
  - Setup Supabase Auth, RLS, Storage Bucket, dan Next.js Dynamic Routing.
- **v1.0.0 (24 Okt 2026):**
  - Inisialisasi proyek Next.js 16 dengan TypeScript & Tailwind CSS v4.
