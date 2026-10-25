---
name: web-ui-ux-design-skills
description: Master UI/UX design skill and framework for digital web products and organization/foundation websites (Yayasan ICA). Synthesizes 30+ core design skills across visual design, cognitive psychology, interaction design, design systems, and visual critique.
---

# UI/UX Design System & Master Skill: Website Yayasan ICA

Dokumen ini adalah **Master Design Skill & Guideline UI/UX** komprehensif yang dirancang khusus untuk memandu AI Agent dan pengembang dalam merancang, mengevaluasi, serta mengimplementasikan antarmuka (UI) dan pengalaman pengguna (UX) berkualitas tinggi untuk **Website Yayasan ICA**.

Panduan ini disintesis dan diadaptasi langsung dari prinsip-prinsip desain modern [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills), mencakup pondasi visual, psikologi kognitif pengguna, sistem token desain, spesifikasi komponen web, pola interaksi, standar aksesibilitas (WCAG), hingga audit visual critique.

---

## DAFTAR ISI

1. [Filosofi & Peran Desain (Design Philosophy)](#1-filosofi--peran-desain)
2. [Prinsip Psikologi Kognitif & Interaksi (Cognitive Laws)](#2-prinsip-psikologi-kognitif--interaksi)
3. [Hukum Persepsi Visual (Gestalt Principles)](#3-hukum-persepsi-visual-gestalt)
4. [Pondasi Sistem Visual (Visual Foundations)](#4-pondasi-sistem-visual)
   - 4.1 Layout Grid & Responsivitas
   - 4.2 Sistem Spasi (8pt Grid)
   - 4.3 Sistem Warna & Semantik
   - 4.4 Tipografi & Keterbacaan (Readable Measure)
   - 4.5 Hierarki Visual & Fokus
5. [Spesifikasi Komponen Web Utama (Component Specs)](#5-spesifikasi-komponen-web-utama)
   - Header & Navigasi
   - Hero Section Berorientasi Konversi
   - Indikator Dampak & Statistik (Stat Counters)
   - Kartu Program & Kampanye Donasi (Program Cards)
   - Modul Donasi & Kalkulator Zakat/Infaq
   - Cerita Dampak & Testimonial Penerima Manfaat
   - Legalitas, Transparansi & Akuntabilitas
   - Footer & Trust Anchor
6. [Pola Interaksi & Rekayasa Formulir (Interaction & Form UX)](#6-pola-interaksi--rekayasa-formulir)
7. [Standar Aksesibilitas Web (WCAG 2.1 AA)](#7-standar-aksesibilitas-web-wcag-21-aa)
8. [Panduan Khusus Website Yayasan / Non-Profit (Yayasan ICA)](#8-panduan-khusus-website-yayasan-ica)
9. [Rubrik Evaluasi & Visual Critique Checklist](#9-rubrik-evaluasi--visual-critique-checklist)

---

## 1. FILOSOFI & PERAN DESAIN

### 1.1 Peran AI Agent
Ketika merancang atau membuat kode frontend (HTML, Tailwind CSS, React, Vue, Blade, dsb.):
- Bertindaklah sebagai **Lead UI/UX Designer & Design Technologist**.
- Jangan hanya membuat tampilan yang "bisa berjalan secara teknis", tetapi ciptakan tampilan yang **berkarakter, rapi, terpercaya (credible), dan menyentuh emosi manusia**.
- Setiap keputusan layout, warna, dan spasi harus memiliki landasan fungsional (bukan sekadar dekoratif).

### 1.2 Tiga Pilar Desain Website Yayasan
1. **Aesthetic-Usability**: Keindahan dan konsistensi visual bukan kosmetik, melainkan sinyal profesionalitas dan integritas sebuah yayasan. Pengguna mempercayai yayasan yang memiliki website yang rapi dan tertata.
2. **Interfaces That Feel**: Merancang dengan mempertimbangkan kondisi emosional pengunjung (empati, kepedulian sosial, rasa aman saat berdonasi, dan kejelasan tujuan program).
3. **Frictionless Trust**: Memudahkan pengunjung memahami visi, legalitas, transparansi keuangan, dan menyalurkan kontribusi tanpa kebingungan.

---

## 2. PRINSIP PSIKOLOGI KOGNITIF & INTERAKSI

Penerapan hukum psikologi kognitif untuk mengoptimalkan alur interaksi pengguna:

### 2.1 Aesthetic-Usability Effect
*Pengguna mempersepsikan antarmuka yang rapi dan estetis sebagai antarmuka yang lebih mudah digunakan dan lebih dapat dipercaya.*
- **Aplikasi**: Konsistensi spasi (spacing), keselarasan garis (grid alignment), tipografi proporsional, serta status visual (empty state, loading state) yang dipoles dengan baik.
- **Batasan**: Estetika tidak boleh menutupi kelemahan navigasi atau kebingungan informasi.

### 2.2 Jakob's Law
*Pengguna menghabiskan sebagian besar waktu mereka di website lain; mereka mengharapkan website Anda bekerja dengan cara yang sama seperti yang biasa mereka gunakan.*
- **Aplikasi**: Letakkan navigasi di bagian atas, tombol aksi utama di posisi yang lazim, keranjang/status donasi di kanan atas, formulir donasi mengikuti alur standar perbankan/fintech Indonesia (Pilih Nominal $\rightarrow$ Data Diri $\rightarrow$ Metode Pembayaran).
- Jangan membuat navigasi eksperimental yang membingungkan pengunjung umum atau donatur lanjut usia.

### 2.3 Hick's Law
*Waktu yang dibutuhkan untuk membuat keputusan meningkat seiring dengan bertambahnya jumlah dan kompleksitas pilihan.*
- **Aplikasi**:
  - Batasi menu navigasi utama menjadi 5–7 item.
  - Pada formulir donasi, sediakan nominal cepat pilihan (misal: Rp 25.000, Rp 50.000, Rp 100.000, Rp 250.000, Rp 500.000) ditambah opsi input nominal bebas, daripada membiarkan kolom kosong tanpa panduan.
  - Setiap halaman harus memiliki **satu Call-to-Action (CTA) utama** yang paling menonjol.

### 2.4 Miller's Law & Chunking
*Kapasitas memori kerja manusia rata-rata terbatas pada $7 \pm 2$ satuan informasi dalam satu waktu.*
- **Aplikasi**:
  - Pecah formulir panjang menjadi beberapa tahapan (step-by-step progress bar).
  - Format angka rekening bank atau nomor kontak dengan spasi pemisah (contoh: `0812-3456-7890` atau `1234 5678 9012`).
  - Kelompokkan informasi program dalam bentuk kartu (*cards*) yang padat dan jelas.

### 2.5 Fitts's Law
*Waktu yang dibutuhkan untuk mencapai suatu target berbanding lurus dengan jarak ke target dan berbanding terbalik dengan ukuran target.*
- **Aplikasi**:
  - Tombol CTA utama (misal: "Donasi Sekarang", "Konfirmasi Donasi") harus berukuran besar dan mudah ditekan pada layar sentuh (minimal $48 \times 48\text{ px}$).
  - Pada tampilan mobile, posisikan tombol aksi penting di zona jangkauan jempol (*thumb zone*), misalnya menggunakan sticky bottom action bar.

### 2.6 Von Restorff Effect (Isolation Effect)
*Ketika beberapa objek serupa ditampilkan, objek yang berbeda dari yang lain akan menjadi yang paling mudah diingat dan dilihat.*
- **Aplikasi**: Gunakan warna aksen kontras tinggi hanya untuk tombol CTA primer (misal warna Amber/Gold atau Orange hangat di antara dominasi warna Hijau/Navy). Jangan membuat semua tombol berwarna mencolok.

### 2.7 Zeigarnik Effect & Peak-End Rule
*Orang mengingat tugas yang belum selesai lebih baik daripada yang sudah selesai, dan menilai suatu pengalaman berdasarkan titik puncak serta titik akhirnya.*
- **Aplikasi**: Tampilkan progress bar target penggalangan dana (contoh: "Terkumpul 68% dari Rp 50.000.000").
- Saat donasi selesai, tampilkan ucapan terima kasih yang tulus, doa keberkahan, invoice/bukti ringkasan donasi, serta tombol unduh/bagikan ke WhatsApp.

---

## 3. HUKUM PERSEPSI VISUAL (GESTALT PRINCIPLES)

Gunakan prinsip Gestalt untuk mengorganisir tata letak elemen visual tanpa menambah beban kognitif:

| Prinsip Gestalt | Aturan Desain | Implementasi pada Website Yayasan |
|---|---|---|
| **Law of Proximity** | Elemen yang saling berdekatan dipersepsikan sebagai satu kelompok. | Jarak antara label dan input formulir harus lebih rapat ($4\text{–}8\text{ px}$) dibandingkan jarak antarkelompok input ($16\text{–}24\text{ px}$). |
| **Law of Similarity** | Elemen dengan bentuk, warna, atau ukuran serupa dianggap memiliki fungsi sejenis. | Semua kartu program memiliki layout tombol yang identik; semua tag/badge kategori memiliki bentuk konsisten. |
| **Law of Common Region** | Elemen di dalam batas yang sama (border/background) dipersepsikan sebagai satu kesatuan. | Bungkus paket bantuan, rekening donasi, atau rincian transparansi ke dalam kartu (*card*) dengan latar belakang lembut atau border halus. |
| **Law of Continuity** | Mata secara alami mengikuti garis atau kurva berkelanjutan. | Timeline sejarah yayasan, langkah cara berdonasi (1-2-3), atau carousels cerita lapangan. |
| **Law of Figure-Ground** | Otak membedakan objek fokus (figure) dari latar belakang (ground). | Gunakan overlay gelap/transparan saat menampilkan modal popup rincian program donasi agar fokus pengguna tidak terdistraksi. |
| **Law of Closure** | Otak melengkapi bentuk yang tidak utuh secara otomatis. | Pada slider kartu di mobile, biarkan kartu berikutnya terpotong sebagian di tepi layar ($20\text{–}30\text{ px}$) untuk mengisyaratkan bahwa area tersebut dapat digeser. |

---

## 4. PONDASI SISTEM VISUAL (VISUAL FOUNDATIONS)

### 4.1 Layout Grid & Responsivitas
Website harus mengadopsi pendekatan **Mobile-First**, mengingat mayoritas donatur dan pengunjung yayasan di Indonesia mengakses melalui ponsel cerdas.

| Breakpoint | Target Layar | Kolom | Margin Luar | Gutter (Jarak Kolom) | Max Container |
|---|---|:---:|:---:|:---:|:---:|
| **Mobile (`< 640px`)** | Handphone (360–414px) | 4 | $16\text{ px}$ | $12\text{–}16\text{ px}$ | $100\%$ |
| **Tablet (`640px – 1023px`)** | Tablet / iPad (768–834px) | 8 | $24\text{ px}$ | $16\text{–}24\text{ px}$ | $720\text{–}960\text{ px}$ |
| **Desktop (`1024px – 1279px`)** | Laptop standar | 12 | $32\text{ px}$ | $24\text{ px}$ | $1024\text{ px}$ |
| **Wide Desktop (`\ge 1280px`)** | Monitor / Layar Besar | 12 | $auto$ | $32\text{ px}$ | $1200\text{–}1280\text{ px}$ |

### 4.2 Sistem Spasi (8pt Grid System)
Gunakan kelipatan 8px (dengan sub-kelipatan 4px untuk ruang sempit) secara disiplin:
- **`2xs` (2px)**: Garis aksen, border mikro.
- **`xs` (4px)**: Jarak antara ikon dan teks pendukung, badge padding.
- **`sm` (8px)**: Jarak antara label formulir dan field input, padding tombol kecil.
- **`md` (16px)**: Padding standar kartu konten, jarak antarparagraf, gap layout dasar.
- **`lg` (24px)**: Padding kartu besar, jarak antarelemen dalam section.
- **`xl` (32px)**: Jarak antarsubbagian, padding vertikal header/footer.
- **`2xl` (48px)**: Spasi vertikal antarseksi pada layar tablet/mobile.
- **`3xl` (64px - 80px)**: Spasi vertikal antarseksi utama pada layar desktop.

> **Aturan**: Jangan gunakan angka acak seperti `13px`, `27px`, atau `55px`. Selalu ikat ke skala spasi desain.

### 4.3 Sistem Warna & Semantik
Warna yayasan harus memancarkan **Amanah (Trust), Kesejukan (Serenity), Kebajikan (Compassion), dan Keterbukaan (Transparency)**.

```css
/* Color Palette System Tokens */
:root {
  /* Brand Primary: Deep Emerald / Islamic Green (Amanah, Keberkahan, Kesejukan) */
  --color-primary-50:  #ecfdf5;
  --color-primary-100: #d1fae5;
  --color-primary-500: #10b981;
  --color-primary-600: #059669; /* Primary Action & Brand */
  --color-primary-700: #047857; /* Hover State Primary */
  --color-primary-900: #064e3b; /* Deep Contrast Text/Surfaces */

  /* Brand Secondary: Deep Navy / Slate (Stabilitas, Profesionalitas, Akuntabilitas) */
  --color-secondary-600: #1e3a8a;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;

  /* Accent / CTA: Warm Gold / Amber (Ajakan Bertindak, Semangat Donasi, Harapan) */
  --color-accent-500: #f59e0b;
  --color-accent-600: #d97706; /* Primary CTA Button (Donasi) */
  --color-accent-700: #b45309;

  /* Neutral Surface & Typography */
  --color-neutral-0:   #ffffff; /* Surface Background */
  --color-neutral-50:  #f8fafc; /* Card & Background Muted */
  --color-neutral-100: #f1f5f9; /* Border Light */
  --color-neutral-200: #e2e8f0; /* Border / Divider Strong */
  --color-neutral-400: #94a3b8; /* Muted Icon / Placeholder */
  --color-neutral-600: #475569; /* Secondary Body Text */
  --color-neutral-900: #0f172a; /* Primary Headline Text */

  /* Semantic Feedback */
  --color-success: #16a34a; /* Berhasil, Terverifikasi */
  --color-warning: #ea580c; /* Peringatan, Sisa Kuota Terbatas */
  --color-danger:  #dc2626; /* Error Validasi Formulir */
  --color-info:    #0284c7; /* Info Program, Pengumuman */
}
```

### 4.4 Tipografi & Keterbacaan
Gunakan font sans-serif modern yang sangat mudah dibaca (*Plus Jakarta Sans*, *Inter*, atau gabungan font judul berwibawa seperti *Merriweather* / *Outfit*).

| Level Tipografi | Ukuran Desktop | Ukuran Mobile | Bobot (Weight) | Line Height | Penggunaan |
|---|:---:|:---:|:---:|:---:|---|
| **Display Title** | 44–48px | 32–36px | Bold (700/800) | 1.15 | Headline Hero Utama |
| **Heading 1 (H1)** | 32–36px | 26–28px | Bold (700) | 1.2 | Judul Halaman Utama |
| **Heading 2 (H2)** | 24–28px | 20–22px | Semibold (600) | 1.25 | Judul Seksi (Section Title) |
| **Heading 3 (H3)** | 20–22px | 18–19px | Semibold (600) | 1.3 | Judul Kartu Program / Berita |
| **Body Large** | 18px | 16px | Regular (400) / Med | 1.6 | Lead Paragraph / Rangkuman |
| **Body Base** | 16px | 15–16px | Regular (400) | 1.55 | Teks Bacaan Utama & Deskripsi |
| **Body Small** | 14px | 13–14px | Regular / Med (500) | 1.5 | Metadata, Penulis, Keterangan |
| **Caption / Badge** | 12px | 11–12px | Medium / Semibold | 1.4 | Tag Kategori, Label Status |

#### Aturan Keterbacaan (*Readable Measure*):
- Panjang baris teks paragraf utama tidak boleh terlalu panjang: **45 hingga 75 karakter per baris** (gunakan `max-w-prose` atau `max-width: 65ch`).
- Jangan gunakan *justify* (rata kanan-kiri) untuk teks web karena menghasilkan celah kosong (*rivers of white*); gunakan *left-aligned* (rata kiri).

### 4.5 Hierarki Visual
Setiap layar harus memiliki jalur pandang alami (*eye flow*):
1. **Titik Masuk (Entry Point)**: Judul tegas atau gambar emosional yang berbicara.
2. **Konteks Pendukung**: Sub-judul singkat menjelaskan manfaat konkret.
3. **Pemicu Aksi (Primary CTA)**: Tombol donasi atau penjelajahan program yang menonjol secara kontras.
4. **Validasi Sosial (Social Proof)**: Legalitas resmi, statistik penerima manfaat, testimoni nyata.

---

## 5. SPESIFIKASI KOMPONEN WEB UTAMA

### 5.1 Header & Navigasi
- **Sticky / Fixed**: Tetap terlihat saat pengguna menggulir layar untuk memudahkan akses navigasi dan tombol donasi cepat.
- **Struktur Desktop**:
  - Sisi Kiri: Logo resmi Yayasan ICA (jelas, dengan teks nama yayasan).
  - Tengah: Menu ringkas: Beranda, Tentang Kami (Profil, Visi, Legalitas), Program Kerja, Transparansi (Laporan Keuangan), Berita, Kontak.
  - Sisi Kanan: Tombol CTA Primer berlatar kontras: `[Donasi Sekarang]`.
- **Struktur Mobile**:
  - Logo di kiri, Tombol `[Donasi]` ringkas di tengah-kanan, dan Icon Menu Hamburger di kanan ujung.
  - Menu Drawer mobile harus ramah sentuhan (target sentuh minimal $48\text{ px}$).

### 5.2 Hero Section Berorientasi Dampak
- **Tujuan**: Membangun empati dan kepercayaan dalam 5 detik pertama.
- **Elemen Wajib**:
  1. *Eyebrow Badge*: Contoh: `[Resmi Berbadan Hukum: AHU-xxxxxx]`.
  2. *Headline yang Menggugah*: Bukan sekadar "Selamat Datang di Website Kami", melainkan aksi nyata: *"Bersama Menebar Manfaat, Membangun Generasi Berdaya"*.
  3. *Sub-headline*: Penjelasan 2 baris tentang fokus yayasan (pendidikan, santunan, dakwah, kemanusiaan).
  4. *Dual Action Buttons*:
     - Tombol Primer: `[Salurkan Donasi]` (warna aksen, ikon hati/tangan memberi).
     - Tombol Sekunder: `[Pelajari Program Kami]` (outline/ghost button).
  5. *Media Visual*: Foto asli kegiatan penerima manfaat atau anak asuh (resolusi tajam, pencahayaan alami, bukan gambar stok palsu).

### 5.3 Indikator Dampak & Statistik (Stat Counters)
- **Fungsi**: Bukti nyata akuntabilitas yayasan.
- **Format**: Baris 3–4 metrik kunci:
  - Jumlah Penerima Manfaat (contoh: `1.500+ Jiwa`).
  - Program Sosial Terlaksana (contoh: `48+ Kegiatan`).
  - Wilayah Penyaluran (contoh: `12 Kabupaten/Kota`).
  - Transparansi Penyaluran (contoh: `100% Tersalurkan`).

### 5.4 Kartu Program & Kampanye Donasi (Program Cards)
- **Rasio Gambar**: 16:9 dengan *rounded corner* ($12\text{–}16\text{ px}$) dan badge kategori (contoh: *Pendidikan*, *Sosial*, *Wakaf*).
- **Judul Program**: Maksimal 2 baris dengan tipografi tegas.
- **Progress Bar Donasi**:
  - Indikator persentase ketercapaian yang kontras.
  - Rincian angka: `Terkumpul: Rp 35.500.000` dan `Target: Rp 50.000.000`.
  - Informasi sisa waktu atau status berkelanjutan.
- **Tombol Aksi**: `[Donasi Program]` yang langsung membuka alur donasi spesifik program tersebut.

### 5.5 Modul Donasi & Kalkulator Zakat/Infaq
- **Pilihan Nominal Cepat**: Chip tombol dengan nominal umum ($25\text{rb}$, $50\text{rb}$, $100\text{rb}$, $250\text{rb}$, $500\text{rb}$) dan opsi masukan manual.
- **Opsi Anonimitas**: Checkbox `"Sembunyikan nama saya (Hamba Allah)"` untuk menghormati privasi donatur.
- **Kolom Doa & Harapan**: Textarea opsional untuk donatur menitipkan doa.
- **Metode Pembayaran**:
  - Menampilkan logo resmi penyedia pembayaran (QRIS, Transfer Bank Mandiri, BCA, BSI, E-Wallet Gopay/OVO/ShopeePay).
  - Salin Nomor Rekening 1-klik (*One-click copy account number*) dengan feedback visual `[Tersalin!]`.

### 5.6 Cerita Dampak & Testimonial
- Kutipan langsung dari penerima manfaat atau wali santri.
- Foto wajah asli yang bermartabat (menjaga privasi dan kehormatan penerima bantuan).
- Informasi asal daerah/program yang diikuti.

### 5.7 Legalitas, Transparansi & Akuntabilitas
- Tampilkan nomor SK Kemenkumham, NPWP Yayasan, dan Izin Operasional Dinsos/Kemenag.
- Widget unduh laporan keuangan publikasi tahunan (PDF).
- Menyertakan daftar pengurus yayasan (Dewan Pembina, Pengawas, Pengurus Harian) dengan foto resmi untuk menjamin kredibilitas.

### 5.8 Footer & Trust Anchor
- **Kolom 1**: Profil singkat Yayasan ICA, visi, dan logo legalitas.
- **Kolom 2**: Tautan Cepat (Program, Profil, Kontak, Kebijakan Privasi).
- **Kolom 3**: Rekening Resmi atas nama yayasan (bukan rekening pribadi!).
- **Kolom 4**: Alamat kantor sekretariat fisik, integrasi Google Maps, jam operasional, dan nomor WhatsApp resmi.

---

## 6. POLA INTERAKSI & REKAYASA FORMULIR (INTERACTION & FORM UX)

### 6.1 Desain Formulir Ramah Pengguna
- **Satu Kolom Vertikal**: Alur vertikal tunggal memudahkan mata memindai ke bawah tanpa zig-zag.
- **Label di Atas Input (*Top-aligned*)**: Lebih fleksibel untuk berbagai panjang label dan mudah dibaca di mobile.
- **Validasi Formulir yang Manusiawi**:
  - Berikan validasi *on-blur* (ketika pengguna berpindah ke kolom berikutnya), bukan setiap ketukan huruf yang memicu kecemasan.
  - Pesan kesalahan harus bersifat solutif: bukan `"Input salah!"`, melainkan *"Mohon masukkan nomor WhatsApp aktif yang diawali 08..."*.
- **Helper Text**: Letakkan petunjuk tepat di bawah kolom atau label (bukan mengandalkan *placeholder* yang hilang saat diketik).

### 6.2 Pola State Komponen
Setiap komponen interaktif wajib memiliki 6 status (*states*):
1. **Default**: Tampilan tenang dan jelas.
2. **Hover**: Elevasi naik sedikit (shadow halus) atau warna menggelap $5\text{–}10\%$.
3. **Focus**: Outline kontras (ring 2px dengan offset 2px) untuk navigasi keyboard.
4. **Active / Pressed**: Elevasi kembali rata atau tombol terasa sedikit tertekan.
5. **Loading**: Gantikan teks tombol dengan spinner kecil atau tampilkan *skeleton shimmer* pada area konten. Jangan biarkan tombol bisa diklik ganda (*prevent double submission*).
6. **Disabled**: Opasitas berkurang ($40\text{–}50\%$) dengan kursor `not-allowed`.

### 6.3 Prinsip Gerak & Animasi Mikro (Micro-Interactions)
- **Durasi Ideal**: $150\text{–}250\text{ ms}$ untuk respon tombol dan menu; $300\text{–}400\text{ ms}$ untuk modal masuk/keluar.
- **Easing**: Gunakan `ease-out` untuk elemen yang muncul ke layar (terasa mendarat empuk) dan `ease-in` untuk elemen yang keluar. Hindari pergerakan linear yang kaku.
- **Tujuan Animasi**: Animasi hanya digunakan untuk memberi umpan balik status atau memandu fokus pandangan, bukan sekadar riasan visual.

---

## 7. STANDAR AKSESIBILITAS WEB (WCAG 2.1 AA)

Semua halaman harus memenuhi standar aksesibilitas minimum **WCAG 2.1 Level AA**:

1. **Rasio Kontras Warna**:
   - Teks biasa terhadap latar belakang: **minimal 4.5:1**.
   - Teks berukuran besar ($\ge 18\text{pt}$ atau $\ge 14\text{pt}$ bold) dan elemen UI grafis: **minimal 3:1**.
   - Hindari teks abu-abu terang di atas latar putih.
2. **Keterbacaan Non-Warna**:
   - Jangan pernah menggunakan warna sebagai satu-satunya indikator status. Sertakan teks dan ikon (misalnya: tanda centang hijau untuk sukses, tanda silang merah untuk error).
3. **Target Sentuh Layar (Touch Targets)**:
   - Tombol dan tautan di layar mobile minimal berukuran **$44 \times 44\text{ px}$** atau **$48 \times 48\text{ px}$** dengan jarak pemisah yang cukup agar tidak salah tekan.
4. **Navigasi Keyboard**:
   - Seluruh tautan, tombol, dan formulir harus dapat diakses dan dioperasikan menggunakan tombol `Tab`, `Enter`, dan `Spasi`.
   - Jangan pernah menghapus `outline: none` tanpa menyediakan pengganti fokus visual yang jelas.
5. **Alt Text untuk Gambar**:
   - Berikan deskripsi gambar yang bermakna pada atribut `alt` foto kegiatan (contoh: `alt="Penyaluran paket sembako untuk lansia dhuafa oleh relawan Yayasan ICA"` alih-alih `alt="foto1.jpg"`).

---

## 8. PANDUAN KHUSUS WEBSITE YAYASAN (YAYASAN ICA)

Karakteristik khusus yang wajib dipatuhi dalam proyek ini:

### 8.1 Tone of Voice & Copywriting
- **Santun & Berakhlak**: Menggunakan bahasa Indonesia yang lugas, hangat, dan menghargai martabat manusia.
- **Transparan & Akuntabel**: Menggunakan terminologi yang jelas, seperti *"Penyaluran Donasi"*, *"Laporan Donatur"*, *"Akad Zakat/Infaq"*, *"Audit Keuangan"*.
- **Tanpa Manipulasi Emosi Negatif**: Mengedepankan harapan, keberdayaan, dan optimisme masa depan para binaan, bukan eksploitasi kesedihan.

### 8.2 Struktur Halaman yang Dianjurkan
1. **Beranda (Home)**: Hero berenergi positif $\rightarrow$ Metrik Dampak $\rightarrow$ Program Prioritas $\rightarrow$ Ajakan Donasi Cepat $\rightarrow$ Kisah Nyata $\rightarrow$ Legalitas & Mitra $\rightarrow$ Berita Terbaru.
2. **Tentang Kami**: Sejarah, Profil Pendiri/Pengurus, Visi-Misi, Dokumen Legalitas (Kemenkumham), Struktur Organisasi.
3. **Program Yayasan**: Daftar program kerja terinci (pendidikan, beasiswa, santunan, dakwah, dll.) dengan dokumentasi kegiatan.
4. **Pusat Donasi**: Formulir donasi langsung, kalkulator zakat terverifikasi, nomor rekening resmi, panduan konfirmasi transfer.
5. **Laporan & Transparansi**: Arsip laporan tahunan yang dapat diunduh (PDF) dan ringkasan grafik penggunaan dana.
6. **Hubungi Kami**: Peta lokasi sekretariat, form pesan, tautan langsung ke Customer Service WhatsApp.

---

## 9. RUBRIK EVALUASI & VISUAL CRITIQUE CHECKLIST

Gunakan checklist ini setiap kali selesai merancang antarmuka atau mereview halaman website:

```markdown
### Visual Critique Rubric

[ ] 1. Entry Point Check
    - Apakah pandangan mata langsung tertuju pada elemen paling krusial?
    - Apakah ada elemen lain yang bersaing merebut perhatian secara liar?

[ ] 2. Squint Test (Uji Menyipitkan Mata)
    - Jika layar dilihat dengan mata menyipit/buram, apakah hierarki (judul, konten, tombol CTA) tetap terbaca urutannya?

[ ] 3. Spacing & Rhythm
    - Apakah semua margin dan padding konsisten dengan kelipatan 8pt / 4pt?
    - Apakah jarak antarbagian yang tidak berhubungan lebih besar daripada bagian yang saling terkait?

[ ] 4. Color & Contrast
    - Apakah semua teks memenuhi kontras minimal 4.5:1?
    - Apakah warna aksen primer hanya digunakan untuk aksi utama?

[ ] 5. Mobile Ergonomics
    - Apakah tombol penting berada di area jangkauan jempol?
    - Apakah ukuran font di ponsel tetap nyaman dibaca (minimal 16px untuk body)?

[ ] 6. Trust & Transparency Signals
    - Apakah nomor rekening tertera jelas dengan tombol salin otomatis?
    - Apakah nomor legalitas dan identitas yayasan mudah ditemukan?
```

---

> **Panduan ini siap digunakan sebagai referensi utama dalam seluruh sesi perancangan UI/UX proyek Website Yayasan ICA.**

