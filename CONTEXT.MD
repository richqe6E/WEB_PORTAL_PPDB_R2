# AI Agent Context & Architecture Blueprint (`CONTEXT.md`)
**Proyek:** Sistem Informasi Akademik & PPDB Yayasan (PAUD & TK)
**Instruksi untuk AI Agent (Gemini):** Bacalah dokumen ini sebagai kebenaran mutlak (*Single Source of Truth*) sebelum membuat atau memodifikasi file apa pun di dalam repositori ini.

---

## 1. Tech Stack & Library Standar
* **Framework:** Next.js 14/15 (App Router) dengan TypeScript (`strict: true`).
* **Styling & UI:** Tailwind CSS + `shadcn/ui` + `lucide-react` (ikon).
* **Form & Validasi:** `react-hook-form` + `zod` + `@hookform/resolvers`.
* **Database, Auth, & Storage:** Supabase (`@supabase/supabase-js` & `@supabase/ssr`).
* **Deployment Target:** Vercel.

---

## 2. Struktur Folder Proyek
Patuhi struktur direktori berikut saat membuat komponen atau halaman baru:

```text
├── src/
│   ├── app/
│   │   ├── (public)/                    # Grup rute publik (Tanpa Login)
│   │   │   ├── layout.tsx               # Navbar & Footer Yayasan
│   │   │   ├── page.tsx                 # Landing page: Info PPDB, Jadwal Dinamis, Status Buka/Tutup
│   │   │   ├── daftar/
│   │   │   │   └── page.tsx             # Halaman Form PPDB (Terkunci jika is_ppdb_open = false)
│   │   │   └── cek-status/
│   │   │       └── page.tsx             # Halaman cek status berkas & pengumuman kelulusan via NIK/No.Reg
│   │   ├── (admin)/                     # Grup rute Portal Admin TU (Wajib Login)
│   │   │   ├── layout.tsx               # Sidebar & Header Dashboard Admin TU
│   │   │   └── admin/
│   │   │       ├── page.tsx             # Overview statistik pendaftar PAUD & TK
│   │   │       ├── pengaturan/
│   │   │       │   └── page.tsx         # Toggle Buka/Tutup PPDB, Edit Jadwal, & Toggle Jenjang Aktif
│   │   │       └── pendaftar/
│   │   │           ├── page.tsx         # Tabel daftar calon siswa + Filter & Pencarian
│   │   │           └── [id]/page.tsx    # Detail siswa, Preview Berkas (KK/Akta/KTP), & Validasi Kelulusan
│   │   ├── login/
│   │   │   └── page.tsx                 # Halaman Login Admin TU
│   │   └── layout.tsx                   # Root Layout
│   ├── actions/                         # Next.js Server Actions (Mutasi Data + revalidatePath)
│   │   ├── settings-actions.ts          # Action untuk update jadwal, toggle PPDB, & jenjang
│   │   ├── registration-actions.ts      # Action untuk submit pendaftaran publik
│   │   └── verification-actions.ts      # Action untuk validasi berkas & status diterima/ditolak
│   ├── components/
│   │   ├── ui/                          # Komponen bawaan shadcn/ui
│   │   ├── public/                      # Komponen halaman publik (Banner Status, Jadwal, Form Step)
│   │   └── admin/                       # Komponen dashboard (StatCard, DocumentPreviewModal, StatusBadge)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                # Browser Supabase Client
│   │   │   ├── server.ts                # Server Component / Server Action Supabase Client
│   │   │   └── middleware.ts            # Session refresh & proteksi rute /admin
│   │   ├── validations/
│   │   │   ├── applicant-schema.ts      # Skema Zod untuk form pendaftaran PAUD/TK
│   │   │   └── settings-schema.ts       # Skema Zod untuk pengaturan jadwal & jenjang
│   │   └── utils.ts                     # Helper (termasuk fungsi hitung usia anak dari tanggal lahir)
│   ├── types/
│   │   └── database.types.ts            # Tipe TypeScript untuk tabel Supabase
│   └── middleware.ts                    # Next.js Middleware utama
```

---

## 3. Skema Database Supabase (PostgreSQL)

### A. Enum Types
* `verification_status_enum`: `'MENUNGGU_VERIFIKASI'`, `'PERLU_REVISI'`, `'TERVERIFIKASI'`
* `selection_status_enum`: `'MENUNGGU'`, `'DITERIMA'`, `'DITOLAK'`
* `gender_enum`: `'L'`, `'P'`

### B. Tabel `ppdb_settings` (Single-Row Configuration Table)
Hanya memiliki 1 baris data dengan `id = 1`.
* `id` (`int8`, PK, default `1`, constraint `id = 1`)
* `academic_year` (`text`, not null, contoh: `'2026/2027'`)
* `is_ppdb_open` (`boolean`, not null, default `false`) — *Mengontrol apakah form pendaftaran dibuka.*
* `is_announcement_open` (`boolean`, not null, default `false`) — *Mengontrol apakah hasil kelulusan ditampilkan.*
* `schedule_registration_text` (`text`, not null) — *Teks rentang tanggal pendaftaran.*
* `schedule_verification_text` (`text`, not null) — *Teks rentang tanggal pengecekan berkas.*
* `schedule_announcement_text` (`text`, not null) — *Teks tanggal pengumuman kelulusan.*
* `announcement_banner_text` (`text`, nullable) — *Pesan pengumuman tambahan di halaman depan.*
* `updated_at` (`timestamptz`, default `now()`)

### C. Tabel `education_levels` (Manajemen Jenjang Yayasan)
Data awal (*seed*): **PAUD (Kelompok Bermain)**, **TK A**, **TK B**.
* `id` (`uuid`, PK, default `gen_random_uuid()`)
* `code` (`text`, unique, not null) — *Contoh: `'PAUD'`, `'TK-A'`, `'TK-B'`*
* `name` (`text`, not null) — *Contoh: `'PAUD / Kelompok Bermain'`, `'TK Kelompok A'`, `'TK Kelompok B'`*
* `age_requirement_text` (`text`, not null) — *Contoh: `'Usia 4 - 5 Tahun'`*
* `quota` (`int4`, not null, default `30`)
* `is_active` (`boolean`, not null, default `true`) — *Jika `false`, tidak muncul di form pendaftaran publik.*
* `sort_order` (`int4`, not null, default `1`)

### D. Tabel `applicants` (Data Calon Siswa PAUD & TK)
* `id` (`uuid`, PK, default `gen_random_uuid()`)
* `registration_number` (`text`, unique, not null) — *Format otomatis: `PPDB-YYYY-XXXX`*
* `level_id` (`uuid`, FK ke `education_levels.id`, not null)
* `child_full_name` (`text`, not null)
* `child_nickname` (`text`, nullable)
* `child_nik` (`varchar(16)`, unique, not null) — *16 digit NIK Anak dari KK*
* `gender` (`gender_enum`, not null)
* `birth_place` (`text`, not null)
* `birth_date` (`date`, not null)
* `address` (`text`, not null)
* `father_name` (`text`, not null)
* `mother_name` (`text`, not null)
* `parent_occupation` (`text`, nullable)
* `parent_whatsapp` (`varchar(20)`, not null)
* `doc_kk_url` (`text`, not null) — *Path/URL Kartu Keluarga di Storage*
* `doc_akta_url` (`text`, not null) — *Path/URL Akta Kelahiran di Storage*
* `doc_ktp_url` (`text`, not null) — *Path/URL KTP Orang Tua di Storage*
* `doc_photo_url` (`text`, nullable) — *Path/URL Pas Foto Anak di Storage*
* `verification_status` (`verification_status_enum`, default `'MENUNGGU_VERIFIKASI'`)
* `selection_status` (`selection_status_enum`, default `'MENUNGGU'`)
* `admin_notes` (`text`, nullable) — *Catatan dari Admin TU untuk orang tua*
* `created_at` (`timestamptz`, default `now()`)
* `updated_at` (`timestamptz`, default `now()`)

---

## 4. Aturan Row Level Security (RLS) & Storage Wajib
1. **`ppdb_settings` & `education_levels`:**
   * `SELECT`: Diizinkan untuk semua (`anon` dan `authenticated`).
   * `UPDATE / INSERT / DELETE`: Hanya diizinkan untuk `authenticated` (Admin TU).
2. **`applicants`:**
   * `INSERT`: Diizinkan untuk `anon` **HANYA JIKA** `(SELECT is_ppdb_open FROM ppdb_settings WHERE id = 1) = true` **DAN** `(SELECT is_active FROM education_levels WHERE id = level_id) = true`.
   * `SELECT`: Diizinkan penuh untuk `authenticated` (Admin TU). Untuk publik (`anon`), pencarian status dilakukan melalui fungsi RPC (`get_applicant_status_by_nik_or_reg`) agar publik tidak bisa melakukan *dumping* seluruh tabel siswa.
   * `UPDATE / DELETE`: Hanya diizinkan untuk `authenticated` (Admin TU).
3. **Supabase Storage Bucket (`ppdb-documents`):**
   * Maksimal ukuran file: `2MB`.
   * Tipe MIME yang diizinkan: `image/jpeg`, `image/png`, `application/pdf`.

---

## 5. Aturan Penulisan Kode (Coding Rules untuk AI Agent)
1. **Sinkronisasi Real-Time (Zero Stale Data):** Setiap Server Action di dalam `src/actions/` yang mengubah pengaturan PPDB, jenjang, atau status siswa **wajib** memanggil `revalidatePath('/', 'layout')` agar perubahan dari Admin TU langsung terlihat oleh publik tanpa jeda cache.
2. **Validasi Ganda:** Selalu validasi form di sisi klien menggunakan `zod` + `react-hook-form` (contoh: NIK wajib 16 digit angka) dan validasi ulang di dalam Server Action sebelum dikirim ke Supabase.
3. **Bahasa Antarmuka:** Seluruh teks UI, label tombol, dan pesan *error* menggunakan **Bahasa Indonesia** yang sopan, jelas, dan mudah dipahami oleh orang tua murid PAUD/TK maupun staf Admin TU.
4. **Prinsip Modular:** Jangan menulis komponen raksasa dalam satu file. Pisahkan tabel, modal preview dokumen, dan form ke dalam komponen terpisah di `src/components/`.