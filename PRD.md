# Product Requirements Document (PRD)
**Nama Proyek:** Sistem Informasi Akademik & PPDB Online Yayasan (Jenjang PAUD & TK)
**Platform:** Web Application (Responsive Desktop & Mobile)
**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, Vercel

---

## 1. Tujuan Sistem
Membangun platform satu pintu untuk pengelolaan Penerimaan Peserta Didik Baru (PPDB) jenjang PAUD dan TK di lingkungan Yayasan. Sistem ini menghubungkan kontrol operasional Admin Tata Usaha (TU) secara *real-time* dengan halaman pendaftaran publik yang diakses oleh orang tua/wali calon siswa.

---

## 2. Aktor & Hak Akses Pengguna
| Aktor | Akses Autentikasi | Tanggung Jawab & Hak Akses Utama |
| :--- | :--- | :--- |
| **Orang Tua / Wali (Publik)** | Tanpa Login (Akses Publik) | Melihat informasi jadwal PPDB, memeriksa status buka/tutup pendaftaran, memilih jenjang yang aktif (PAUD/TK A/TK B), mengisi formulir pendaftaran anak, mengunggah berkas, dan mengecek status kelulusan/verifikasi menggunakan Nomor Pendaftaran atau NIK Anak. |
| **Admin TU Yayasan** | Wajib Login (`/login`) via Supabase Auth | Mengontrol saklar utama Buka/Tutup PPDB, mengubah teks tanggal jadwal tahapan, mengaktifkan/menonaktifkan jenjang yang dibuka beserta kuotanya, memeriksa biodata dan berkas pendaftar, serta menetapkan status verifikasi berkas dan keputusan kelulusan. |

---

## 3. Spesifikasi Fitur Utama (Functional Requirements)

### 3.1. Modul Kontrol Global & Jadwal PPDB (Admin -> Publik)
* **Master Switch PPDB (`is_ppdb_open`):** Tombol *toggle* di Dashboard Admin untuk membuka atau menutup akses pendaftaran secara instan.
  * *Kondisi BUKA (`true`):* Halaman publik menampilkan indikator "Pendaftaran Dibuka", tombol "Daftar Sekarang" aktif, dan halaman `/daftar` dapat diakses.
  * *Kondisi TUTUP (`false`):* Halaman `/daftar` otomatis terkunci dan menampilkan pesan pemberitahuan bahwa PPDB sedang ditutup. Database menolak segala percobaan *insert* data baru.
* **Master Switch Pengumuman (`is_announcement_open`):** Tombol *toggle* untuk mengizinkan orang tua melihat hasil akhir seleksi (Diterima/Ditolak) di halaman `/cek-status`.
* **Editor Jadwal Dinamis:** Admin dapat mengubah teks informasi jadwal yang tampil di halaman depan tanpa menyentuh kode:
  * Tahun Ajaran Aktif (contoh: `2026/2027`).
  * Tanggal Pembukaan & Penutupan Pendaftaran.
  * Tanggal Verifikasi & Pengecekan Berkas.
  * Tanggal Pengumuman Hasil Seleksi & Daftar Ulang.

### 3.2. Modul Manajemen Jenjang Yayasan (PAUD & TK)
* Admin dapat mengelola daftar jenjang yang tersedia di Yayasan (contoh: **PAUD / Kelompok Bermain**, **TK A**, **TK B**).
* Setiap jenjang memiliki atribut: `Nama Jenjang`, `Batas Usia Minimal`, `Kuota Maksimal`, dan saklar status `Aktif / Nonaktif` (`is_active`).
* **Sinkronisasi Formulir:** Dropdown pilihan jenjang pada formulir pendaftaran publik (`/daftar`) hanya menampilkan jenjang yang berstatus `is_active = true`.

### 3.3. Modul Formulir Pendaftaran & Unggah Berkas (Publik)
Formulir dirancang bertahap (*Multi-step Form*) untuk memudahkan orang tua:
1. **Langkah 1 - Pilihan Jenjang:** Memilih jenjang yang sedang dibuka (PAUD / TK A / TK B).
2. **Langkah 2 - Data Diri Calon Siswa (Anak):**
   * Nama Lengkap Anak & Nama Panggilan.
   * NIK Anak (16 digit angka, divalidasi unik per tahun ajaran).
   * Jenis Kelamin (`Laki-laki` / `Perempuan`).
   * Tempat & Tanggal Lahir (sistem otomatis menghitung usia anak dalam Tahun & Bulan).
   * Alamat Lengkap Tempat Tinggal.
3. **Langkah 3 - Data Orang Tua / Wali:**
   * Nama Lengkap Ayah & Ibu / Wali.
   * Pekerjaan Orang Tua.
   * Nomor WhatsApp Aktif (untuk konfirmasi dan komunikasi TU).
4. **Langkah 4 - Unggah Berkas Persyaratan (Supabase Storage):**
   * Scan/Foto Kartu Keluarga (KK) - *Wajib (Format JPG/PNG/PDF, Maks 2MB)*.
   * Scan/Foto Akta Kelahiran Anak - *Wajib (Format JPG/PNG/PDF, Maks 2MB)*.
   * Scan/Foto KTP Orang Tua - *Wajib (Format JPG/PNG/PDF, Maks 2MB)*.
   * Pas Foto Anak - *Opsional/Wajib sesuai pengaturan (Format JPG/PNG, Maks 2MB)*.
5. **Output Pendaftaran:** Sistem menghasilkan **Nomor Pendaftaran Unik** (contoh: `PPDB-2026-0001`) yang dapat disimpan/diunduh oleh orang tua sebagai bukti pendaftaran.

### 3.4. Modul Verifikasi Berkas & Validasi Kelulusan (Admin TU)
* **Statistik Ringkasan:** Menampilkan jumlah total pendaftar, jumlah per jenjang (PAUD, TK A, TK B), jumlah berkas belum diverifikasi, serta total siswa Diterima/Ditolak.
* **Tabel Manajemen Pendaftar:** Dilengkapi fitur pencarian (berdasarkan Nama Anak / NIK / No. Pendaftaran) dan filter berdasarkan Jenjang, Status Berkas, serta Status Kelulusan.
* **Pratinjau Dokumen (Document Previewer):** Admin dapat melihat gambar/PDF Kartu Keluarga, Akta Kelahiran, dan KTP langsung melalui *Modal/Drawer* di dalam dashboard tanpa harus mengunduh file satu per satu.
* **Validasi Ganda oleh Admin:**
  1. **Status Verifikasi Berkas:** `MENUNGGU_VERIFIKASI` $\rightarrow$ `TERVERIFIKASI` atau `PERLU_REVISI`.
  2. **Status Keputusan Seleksi:** `MENUNGGU_PENGUMUMAN` $\rightarrow$ `DITERIMA` atau `DITOLAK`.
  3. **Catatan Admin TU (`admin_notes`):** Kolom teks bagi Admin untuk menuliskan pesan kepada orang tua (misal: *"Foto KK buram, mohon bawaKK asli saat daftar ulang"* atau alasan penolakan).

### 3.5. Modul Cek Status Pendaftaran & Pengumuman (Publik)
* Orang tua memasukkan **Nomor Pendaftaran** atau **NIK Anak** pada halaman `/cek-status`.
* Sistem menampilkan tahapan status anak saat ini:
  * Status Verifikasi Berkas beserta catatan dari Admin TU (jika ada revisi).
  * Status Kelulusan Akhir (hanya tampil jika saklar `is_announcement_open = true`).

---

## 4. Kebutuhan Non-Fungsional (Security & Performance)
1. **Keamanan Level Database (RLS):** Status buka/tutup PPDB (`is_ppdb_open`) dan status jenjang aktif (`is_active`) wajib divalidasi langsung oleh *Row Level Security (RLS)* di PostgreSQL Supabase, bukan hanya disembunyikan di tampilan depan.
2. **Keamanan Dokumen Pribadi:** Dokumen KK, Akta, dan KTP adalah data sensitif. Bucket penyimpanan menggunakan akses terbatas atau URL terproteksi yang hanya bisa dikelola penuh oleh Admin TU.
3. **Sinkronisasi Instan:** Setiap perubahan pengaturan di Dashboard Admin wajib memicu `revalidatePath()` pada Next.js Server Actions agar halaman publik langsung memperbarui tampilan detik itu juga.