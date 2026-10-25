# Master Komponen UI/UX SPMB Politeknik Negeri Samarinda (POLNES)
> **Reverse-Engineered UI Component System & Specification Guide**  
> Dibuat berdasarkan analisis mendalam aset HTML/CSS siAkad Cloud SPMB Polnes (`polnes_home.html`, `polnes_login.html`, `polnes_daftar.html`, `polnes_program_studi.html`, `polnes_main.css`) dan 5 tangkapan layar antarmuka pengguna asli. Bebas dari generic AI-slop, 100% otentik, modular, dan siap digunakan pada proyek frontend modern (Tailwind CSS / Semantic CSS).

---

## 🎨 Ringkasan Design System & Design Tokens

### 1. Color Palette (POLNES Academic Green Theme)
| Token Name | Hex Code | Utility / Context |
| :--- | :--- | :--- |
| `--color-primary` | `#006633` | Warna brand utama POLNES (Navbar, Button Primary, Active Steps, Focus Ring) |
| `--color-primary-dark` | `#004d26` | Hover state button primary, topfooter darker shade |
| `--color-primary-light`| `rgba(0, 102, 51, 0.05)` | Background active tab/pill filter, info container background |
| `--color-secondary` | `#F78100` | Warning, CTA sekunder, status jalur "Akan Dibuka" |
| `--color-danger` | `#EE2737` | Input error, asterisk wajib isi (`*`), status jalur "Tutup", modal alert failed |
| `--color-success` | `#27AE60` | Status jalur "Dibuka", badge sukses pembayaran |
| `--color-wa-green` | `#0DC152` | WhatsApp Floating Action Button & Pulse animation |
| `--color-text-main` | `#2A2A2C` | Heading utama, teks judul prodi, teks label form |
| `--color-text-muted` | `#667686` | Subjudul, deskripsi panduan, tanggal pengumuman, placeholder label |
| `--color-border` | `#DFE3E9` | Border card default, divider, pembatas tabel & list |
| `--color-border-input`| `#D0D5DD` | Border netral input text, textarea, select box |
| `--color-bg-page` | `#F9FAFB` | Background utama halaman web |
| `--color-bg-card` | `#FFFFFF` | Background permukaan kartu kontainer |

### 2. Typography
- **Primary Font Family**: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Headings**:
  - H1 Hero: `font-size: 32px` (desktop: `38px`), `font-weight: 700`, `line-height: 1.2`
  - H2 Section / Card Title: `font-size: 20px`, `font-weight: 600`, `line-height: 32px`
  - H3 Subsection / Card Header: `font-size: 16px`, `font-weight: 600`, `line-height: 24px`
- **Body & Inputs**:
  - Regular Text: `font-size: 14px`, `font-weight: 400`, `line-height: 22px`
  - Small / Meta / Badge: `font-size: 12px`, `font-weight: 500`, `line-height: 18px`
  - Labels: `font-size: 13px - 14px`, `font-weight: 500`, `color: #2A2A2C`

### 3. Shadows & Radii
- **Border Radius**:
  - Small (Inputs, Pills, Buttons): `6px` (`rounded-[6px]`)
  - Medium (Cards Base, Modal Box): `8px` (`rounded-lg`)
  - Large (Hero Contact Us Card): `20px` (`rounded-[20px]`)
  - Pill / Circular (Avatars, FAB): `9999px` (`rounded-full`)
- **Shadows**:
  - Card PMB: `box-shadow: 0px 4px 30px rgba(97, 97, 97, 0.1)`
  - Dropdown Select2: `box-shadow: 0px 6px 16px rgba(34, 34, 34, 0.1)`
  - Floating WhatsApp FAB: `box-shadow: 0px 4px 14px rgba(13, 193, 82, 0.4)`

---

## 🧩 Katalog 25 Komponen UI/UX

---

### 1. Input Text Box (Text, Email, Password, Number)

#### Deskripsi & Peran
Komponen input data esensial untuk formulir registrasi, pencarian, dan autentikasi akun peserta SPMB. Mendukung status wajib (`required` dengan tanda bintang merah), toggle intip kata sandi (*show/hide PIN*), validasi galat, serta penonaktifan (*disabled*).

#### Anatomi Visual & Aturan Styling
- **Padding**: `12px 16px` (`0.75rem 1rem`)
- **Border**: `1px solid #D0D5DD`
- **Border Radius**: `6px` (`0.375rem`)
- **Font**: Poppins, `13px` (`0.8125rem`), warna teks `#2A2A2C`, warna placeholder `#BABDC1`
- **Transition**: `200ms ease`

```
+------------------------------------------------------------+
| Label Teks Input *                                         |
| +--------------------------------------------------------+ |
| | Masukkan ID Pendaftar                      [eye icon]  | |
| +--------------------------------------------------------+ |
| Pesan validasi / format instruksi                          |
+------------------------------------------------------------+
```

#### Markup Semantic HTML & Tailwind CSS
```html
<!-- Input Text Default dengan Label Wajib -->
<div class="form-pmb mb-4 flex flex-col">
  <label for="idpendaftar" class="mb-2 text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    ID Pendaftar <span class="text-[#EE2737] font-semibold">*</span>
  </label>
  <input 
    type="text" 
    id="idpendaftar" 
    name="idpendaftar" 
    placeholder="Masukkan ID Pendaftar"
    class="w-full h-11 px-4 py-3 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] font-sans placeholder-[#BABDC1] transition duration-200 ease-in-out hover:border-[#006633] focus:border-[#006633] focus:outline-none focus:ring-1 focus:ring-[#006633] shadow-sm disabled:bg-[#F3F4F6] disabled:border-[#D0D5DD] disabled:opacity-70 disabled:cursor-not-allowed"
    required
  />
  <span class="mt-1 text-[12px] text-[#667686]">ID Pendaftar tertera pada bukti pembelian voucher bank.</span>
</div>

<!-- Input Password dengan Toggle Show/Hide PIN -->
<div class="form-pmb mb-4 flex flex-col">
  <label for="pin" class="mb-2 text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    PIN / Sandi <span class="text-[#EE2737] font-semibold">*</span>
  </label>
  <div class="relative flex items-center">
    <input 
      type="password" 
      id="pin" 
      name="pin" 
      placeholder="Masukkan PIN (DDMMYYYY)"
      class="w-full h-11 pl-4 pr-11 py-3 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] font-sans placeholder-[#BABDC1] transition duration-200 ease-in-out hover:border-[#006633] focus:border-[#006633] focus:outline-none focus:ring-1 focus:ring-[#006633] shadow-sm"
      required
    />
    <button 
      type="button" 
      onclick="togglePasswordVisibility('pin', this)"
      class="absolute right-3 p-1 text-[#667686] hover:text-[#006633] focus:outline-none"
      aria-label="Tampilkan atau sembunyikan PIN"
    >
      <span class="material-icons-outlined text-[20px] align-middle">visibility_off</span>
    </button>
  </div>
</div>

<!-- Input State Error -->
<div class="form-pmb mb-4 flex flex-col">
  <label for="email" class="mb-2 text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    Email Aktif <span class="text-[#EE2737] font-semibold">*</span>
  </label>
  <input 
    type="email" 
    id="email" 
    name="email" 
    value="format-salah@" 
    class="w-full h-11 px-4 py-3 bg-white border border-[#EE2737] rounded-[6px] text-[#2A2A2C] text-[13px] focus:outline-none focus:border-[#EE2737] focus:ring-1 focus:ring-[#EE2737]"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="mt-1 text-[12px] font-normal text-[#EE2737]">Format email tidak valid. Gunakan format nama@domain.com</span>
</div>
```

#### State Interaksi
- **Default**: Border `#D0D5DD`, latar putih.
- **Hover**: Border berubah menjadi `#006633`, bayangan halus `0px 1px 2px rgba(16, 24, 40, 0.05)`.
- **Focus**: Border aktif `#006633`, outline 0, ring hijau berdimensi tipis.
- **Error**: Border `#EE2737`, ring `#EE2737`, label bantuan berwarna merah.
- **Disabled**: Background `#F3F4F6`, border `#D0D5DD`, kursor tidak diizinkan (`not-allowed`), teks redup (opacity 0.7).

#### Catatan Aksesibilitas (WCAG AA)
- Selalu sandingkan `<label for="[id]">` eksplisit dengan atribut `id` pada input.
- Input error wajib menyertakan atribut `aria-invalid="true"` dan `aria-describedby="[id-error]"`.
- Tombol intip kata sandi wajib memiliki `aria-label` yang jelas.

---

### 2. Textarea (Catatan & Keterangan Tambahan)

#### Deskripsi & Peran
Area input multilinea untuk memasukkan alamat domisili lengkap, catatan kesehatan khusus peserta, atau keterangan riwayat beasiswa.

#### Anatomi Visual & Aturan Styling
- **Padding**: `12px 16px`
- **Border**: `1px solid #D0D5DD`
- **Border Radius**: `6px`
- **Min Height**: `110px`
- **Resize**: `vertical`

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="form-pmb mb-4 flex flex-col">
  <div class="flex justify-between items-center mb-2">
    <label for="alamat" class="text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
      Alamat Domisili Lengkap
    </label>
    <span class="text-[12px] text-[#667686]" id="char-counter">0 / 250 Karakter</span>
  </div>
  <textarea 
    id="alamat" 
    name="alamat" 
    rows="4" 
    placeholder="Tuliskan nama jalan, RT/RW, kelurahan, dan kecamatan..."
    maxlength="250"
    class="w-full px-4 py-3 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] font-sans placeholder-[#BABDC1] transition duration-200 hover:border-[#006633] focus:border-[#006633] focus:outline-none focus:ring-1 focus:ring-[#006633] resize-y min-h-[110px]"
  ></textarea>
</div>
```

---

### 3. Dropdown & Custom Select (Single Select & Cascading Select2)

#### Deskripsi & Peran
Pilihan tunggal bergaya siAkad Cloud Select2 untuk menentukan Jenjang (D3, D4, S2), Program Studi, dan Sistem Kuliah (Reguler / Kelas Malam). Mendukung kustomisasi ikon panah chevron internal berformat SVG encoded base64 dan pencarian typeahead pada dropdown prodi.

#### Anatomi Visual & Aturan Styling
- **Tinggi Elemen**: `44px`
- **Border**: `1px solid #D0D5DD`
- **Border Radius**: `6px`
- **Background**: Putih, chevron down bawaan polnes: `background-image: url("data:image/svg+xml,...")` di sisi kanan `12px`.
- **Dropdown List Container**: `background: #FFFFFF`, `border: 1px solid #ECEFF1`, bayangan `box-shadow: 0px 6px 16px rgba(34, 34, 34, 0.1)`.
- **Item Hover/Selected**: Latar `#006633`, teks putih `#FFFFFF`.

#### Markup Semantic HTML & Tailwind CSS
```html
<!-- Native Styled Custom Select (No external JS dependency) -->
<div class="form-pmb relative mb-4 flex flex-col">
  <label for="select-jenjang" class="mb-2 text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    Pilih Jenjang Pendidikan
  </label>
  <div class="relative">
    <select 
      id="select-jenjang" 
      name="jenjang"
      class="w-full h-11 pl-4 pr-10 py-2.5 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] font-sans appearance-none cursor-pointer transition duration-200 hover:border-[#006633] focus:border-[#006633] focus:outline-none focus:ring-1 focus:ring-[#006633]"
    >
      <option value="" disabled selected>-- Pilih Jenjang --</option>
      <option value="D3">D3 - Diploma Tiga</option>
      <option value="D4">D4 - Sarjana Terapan</option>
      <option value="S2">S2 - Magister Terapan</option>
    </select>
    <!-- Custom Chevron Icon -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#2A2A2C]">
      <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
        <path d="M7 8l3 3 3-3v2l-3 3-3-3z"/>
      </svg>
    </div>
  </div>
</div>

<!-- Select2 Equivalent Structure for Prodi with Search Box -->
<div class="select2-custom-wrapper relative mb-4">
  <label class="mb-2 block text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    Program Studi Pilihan
  </label>
  <!-- Trigger Box -->
  <button 
    type="button" 
    class="w-full h-11 px-4 flex items-center justify-between bg-white border border-[#D0D5DD] rounded-[6px] text-left text-[13px] text-[#2A2A2C] hover:border-[#006633] focus:outline-none focus:border-[#006633]"
    aria-haspopup="listbox" 
    aria-expanded="false"
  >
    <span class="text-[#808080]">-- Pilih Program Studi --</span>
    <span class="material-icons-outlined text-[#667686] text-[18px]">expand_more</span>
  </button>
  
  <!-- Floating Dropdown Panel (Shown when opened) -->
  <div class="hidden absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border border-[#ECEFF1] rounded-[6px] shadow-lg p-2">
    <div class="relative mb-2">
      <span class="material-icons-outlined absolute left-2.5 top-2 text-[#667686] text-[18px]">search</span>
      <input 
        type="text" 
        placeholder="Cari program studi..." 
        class="w-full h-8 pl-8 pr-3 text-[12px] border border-[#D0D5DD] rounded-[4px] focus:outline-none focus:border-[#006633]"
      />
    </div>
    <ul role="listbox" class="max-h-48 overflow-y-auto text-[13px]">
      <li class="px-3 py-2 cursor-pointer rounded hover:bg-[#006633] hover:text-white transition-colors" role="option">
        D3 - Teknik Listrik
      </li>
      <li class="px-3 py-2 cursor-pointer rounded hover:bg-[#006633] hover:text-white transition-colors" role="option">
        D3 - Akuntansi
      </li>
      <li class="px-3 py-2 cursor-pointer rounded hover:bg-[#006633] hover:text-white transition-colors" role="option">
        D4 - Teknologi Rekayasa Komputer
      </li>
    </ul>
  </div>
</div>
```

---

### 4. Radio Button

#### Deskripsi & Peran
Pilihan opsi eksklusif satu dari beberapa, seperti pemilihan Jalur Seleksi (Mandiri / Prestasi / Tes) atau Jenis Kelamin pendaftar.

#### Anatomi Visual & Aturan Styling
- **Dimensi**: Lingkaran luar `24px x 24px`, border `2px solid #D0D5DD`.
- **State Terpilih (Checked)**: Border menebal menjadi `6px solid #006633`, bulatan tengah putih transisi skala (`transform: scale(0.55)`).
- **Disabled**: Border `#D0D5DD`, latar abu netral `#F3F4F6`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="flex flex-col gap-3">
  <!-- Radio Option 1 -->
  <label class="group relative flex items-center cursor-pointer select-none">
    <input 
      type="radio" 
      name="jenis_kelamin" 
      value="L" 
      class="peer sr-only" 
      checked 
    />
    <div class="w-6 h-6 rounded-full border-2 border-[#D0D5DD] bg-white flex items-center justify-center transition-all duration-300 peer-checked:border-[6px] peer-checked:border-[#006633] peer-focus:ring-2 peer-focus:ring-[#006633]/20"></div>
    <span class="ml-3 text-[14px] text-[#2A2A2C] font-normal group-hover:text-[#006633] transition-colors">
      Laki-laki
    </span>
  </label>

  <!-- Radio Option 2 -->
  <label class="group relative flex items-center cursor-pointer select-none">
    <input 
      type="radio" 
      name="jenis_kelamin" 
      value="P" 
      class="peer sr-only" 
    />
    <div class="w-6 h-6 rounded-full border-2 border-[#D0D5DD] bg-white flex items-center justify-center transition-all duration-300 peer-checked:border-[6px] peer-checked:border-[#006633] peer-focus:ring-2 peer-focus:ring-[#006633]/20"></div>
    <span class="ml-3 text-[14px] text-[#2A2A2C] font-normal group-hover:text-[#006633] transition-colors">
      Perempuan
    </span>
  </label>
</div>
```

---

### 5. Checkbox (Syarat Ketentuan & Ingat Sandi)

#### Deskripsi & Peran
Kontrol centang persetujuan syarat dan ketentuan pendaftaran serta opsi "Ingat Saya" pada halaman login peserta.

#### Anatomi Visual & Aturan Styling
- **Dimensi**: Kotak `24px x 24px` (`1.5rem x 1.5rem`)
- **Border**: `1px solid #D0D5DD`, radius `4px` (`rounded-[4px]`)
- **Checked State**: Background `#006633`, border `#006633`, ikon centang SVG putih tegas (`stroke-width: 3`).
- **Focus Ring**: `box-shadow: 0 0 0 0.25rem rgba(0, 102, 51, 0.15)`.

#### Markup Semantic HTML & Tailwind CSS
```html
<label class="inline-flex items-center cursor-pointer select-none">
  <input 
    type="checkbox" 
    id="ingat-saya" 
    name="remember"
    class="peer sr-only"
  />
  <div class="w-6 h-6 rounded-[4px] border border-[#D0D5DD] bg-white flex items-center justify-center transition-all duration-200 peer-checked:bg-[#006633] peer-checked:border-[#006633] peer-focus:ring-2 peer-focus:ring-[#006633]/25">
    <svg class="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
  <span class="ml-3 text-[13px] md:text-[14px] text-[#2A2A2C] font-normal">
    Ingat Saya
  </span>
</label>
```

---

### 6. Datepicker (Air Datepicker / Kalender Tanggal Lahir)

#### Deskripsi & Peran
Input tanggal lahir atau tanggal dokumen ijazah dengan kalender popup interaktif (diadaptasi dari *Air Datepicker v4* siAkad PMB).

#### Anatomi Visual & Aturan Styling
- **Trigger**: Input dengan teks kalender dan ikon Material Icon `calendar_today`.
- **Kalender Container**: Latar putih, border `#DFE3E9`, shadow `0 4px 20px rgba(0,0,0,0.08)`.
- **Selected Day**: Bulatan hijau pekat `#006633` dengan teks putih.
- **Hari Ini**: Border hijau tipis `#006633` teks hijau.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="form-pmb mb-4 flex flex-col">
  <label for="tanggal_lahir" class="mb-2 text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    Tanggal Lahir <span class="text-[#EE2737] font-semibold">*</span>
  </label>
  <div class="relative">
    <input 
      type="text" 
      id="tanggal_lahir" 
      name="tanggal_lahir" 
      placeholder="DD/MM/YYYY" 
      class="w-full h-11 pl-4 pr-11 py-3 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] hover:border-[#006633] focus:border-[#006633] focus:outline-none focus:ring-1 focus:ring-[#006633]"
      autocomplete="off"
    />
    <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667686]">
      <span class="material-icons-outlined text-[20px]">calendar_month</span>
    </div>
  </div>
</div>
```

---

### 7. Toggle Switch

#### Deskripsi & Peran
Sakelar saklar geser on/off untuk aktivasi notifikasi SMS/WhatsApp atau persetujuan klausul tertentu.

#### Anatomi Visual & Aturan Styling
- **Trek (Slider)**: Lebar `44px` (`2.75rem`), tinggi `24px` (`1.5rem`), radius bulat `24px`. Latar tidak aktif `#CCCCCC`, latar aktif `#006633`.
- **Knob (Tombol Putih)**: Lingkaran `16px x 16px`, posisi kiri `4px` berpindah sejauh `20px` saat aktif.

#### Markup Semantic HTML & Tailwind CSS
```html
<label class="relative inline-flex items-center cursor-pointer select-none">
  <input type="checkbox" class="sr-only peer" />
  <div class="w-11 h-6 bg-[#CCCCCC] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006633]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006633]"></div>
  <span class="ml-3 text-[13px] md:text-[14px] font-medium text-[#2A2A2C]">
    Terima update pengumuman via WhatsApp
  </span>
</label>
```

---

### 8. Navigation Bar & Header (Sticky & Responsive Drawer)

#### Deskripsi & Peran
Bilah navigasi utama SPMB Polnes dengan background hijau resmi (`#006633`), identitas ganda (Logo POLNES + Teks 2 baris), menu navigasi aktif bergaris bawah putih, pemilih bahasa (ID/EN), tombol CTA "Masuk", dan laci mobile (*slide-over drawer*).

#### Anatomi Visual & Aturan Styling
- **Background**: Solid Emerald Green `#006633`
- **Tinggi Navbar**: `70px` (desktop)
- **Menu Navigasi Desktop**: Item teks putih `15px`, `font-weight: 500`. Item aktif: `border-bottom: 2.5px solid #FFFFFF; padding-bottom: 4px;`
- **CTA Masuk (Desktop)**: Outline button putih transparan (`border: 1px solid #FFFFFF; color: #FFFFFF; font-weight: 600; padding: 8px 24px; border-radius: 6px;`)
- **Mobile Menu Panel**: Latar putih, fixed fullscreen z-index 120, divider garis bawah `#EEF1F5`.

#### Markup Semantic HTML & Tailwind CSS
```html
<header class="sticky top-0 z-50 bg-[#006633] text-white shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-[70px]">
      
      <!-- Sisi Kiri: Hamburger Mobile & Identitas Kampus -->
      <div class="flex items-center gap-3">
        <!-- Mobile Menu Button -->
        <button 
          type="button" 
          id="btn-mobile-nav"
          class="lg:hidden p-1 text-white hover:text-green-200 focus:outline-none"
          aria-label="Buka Navigasi Mobile"
        >
          <span class="material-icons-round text-[28px]">menu</span>
        </button>

        <!-- Brand Logo & Title -->
        <a href="/spmbfront/home" class="flex items-center gap-3 group">
          <img 
            src="https://assets.siakadcloud.com/uploads/polnes/logoaplikasi/1662.jpg?1733372223" 
            alt="Logo Polnes" 
            class="w-10 h-10 object-contain rounded-full bg-white p-0.5"
          />
          <div class="flex flex-col">
            <span class="text-[11px] font-medium tracking-wide text-green-100 uppercase leading-tight">
              Penerimaan Mahasiswa Baru
            </span>
            <span class="text-[16px] md:text-[17px] font-bold tracking-tight text-white leading-snug">
              Politeknik Negeri Samarinda
            </span>
          </div>
        </a>
      </div>

      <!-- Menu Desktop Tengah -->
      <nav class="hidden lg:flex items-center space-x-8">
        <a href="/spmbfront/home" class="text-white text-[14px] font-semibold border-b-[2.5px] border-white pb-1">
          Beranda
        </a>
        <a href="/spmbfront/jalur-seleksi" class="text-green-100 hover:text-white text-[14px] font-medium transition-colors">
          Jalur Pendaftaran
        </a>
        <a href="/spmbfront/program-studi" class="text-green-100 hover:text-white text-[14px] font-medium transition-colors">
          Program Studi
        </a>
        <a href="/spmbfront/pengumuman" class="text-green-100 hover:text-white text-[14px] font-medium transition-colors">
          Informasi
        </a>
      </nav>

      <!-- Sisi Kanan: Language Switcher & Masuk CTA -->
      <div class="flex items-center gap-4">
        <!-- Language Dropdown -->
        <div class="relative group">
          <button class="flex items-center gap-1 text-[13px] font-medium text-white hover:text-green-200">
            <span>ID</span>
            <span class="material-icons-round text-[18px]">language</span>
          </button>
        </div>

        <!-- Tombol Masuk -->
        <a href="/spmbfront/login">
          <button class="px-5 py-2 border border-white rounded-[6px] text-white text-[13px] font-semibold hover:bg-white hover:text-[#006633] transition-all duration-200">
            Masuk
          </button>
        </a>
      </div>

    </div>
  </div>

  <!-- Mobile Drawer Panel (Slide-in) -->
  <div id="mobile-drawer" class="hidden lg:hidden fixed inset-0 z-40 bg-white text-[#2A2A2C] pt-20 px-6 overflow-y-auto">
    <div class="flex flex-col divide-y divide-[#EEF1F5] text-[15px] font-medium">
      <a href="/spmbfront/home" class="py-3 text-[#006633] font-bold">Beranda</a>
      <a href="/spmbfront/jalur-seleksi" class="py-3 text-[#2A2A2C] hover:text-[#006633]">Jalur Pendaftaran</a>
      <a href="/spmbfront/program-studi" class="py-3 text-[#2A2A2C] hover:text-[#006633]">Program Studi</a>
      <a href="/spmbfront/pengumuman" class="py-3 text-[#2A2A2C] hover:text-[#006633]">Informasi</a>
    </div>
    <div class="mt-8 pt-4 border-t border-[#DFE3E9]">
      <a href="/spmbfront/login" class="block w-full py-3 text-center border-2 border-[#006633] rounded-[6px] text-[#006633] font-semibold">
        Masuk Akun Peserta
      </a>
    </div>
  </div>
</header>
```

---

### 9. Sidebar & Aside Widgets (Brosur, Alur, & Kontak Cepat)

#### Deskripsi & Peran
Blok widget samping pada beranda dan halaman informasi yang memuat:
1. Card Brosur & Rincian Biaya Kuliah (membuka modal Lightbox).
2. Widget Panduan Tata Cara Pendaftaran (4 langkah pendaftaran bertahap).

#### Anatomi Visual & Aturan Styling
- **Card Container**: `.card-base-pmb` (`background: #FFFFFF`, `border: 1px solid #DFE3E9`, `border-radius: 8px`, `padding: 24px`, shadow halus).
- **Tata Cara List**: `<ol>` numerik berjarak renggang, judul langkah tebal (`font-weight: 600`), deskripsi singkat abu-abu (`color: #667686`).

#### Markup Semantic HTML & Tailwind CSS
```html
<aside class="space-y-6">
  <!-- Widget Brosur & Biaya -->
  <div class="bg-white border border-[#DFE3E9] rounded-lg p-6 shadow-sm">
    <h3 class="text-[16px] font-bold text-[#2A2A2C] mb-2">Brosur Dan Informasi Biaya</h3>
    <p class="text-[13px] text-[#667686] leading-relaxed mb-5">
      Unduh brosur resmi dan rincian kelompok UKT selama kuliah di Politeknik Negeri Samarinda.
    </p>
    <button 
      type="button" 
      onclick="bukaModalBrosur()" 
      class="w-full sm:w-auto px-6 py-2.5 border border-[#006633] text-[#006633] text-[13px] font-semibold rounded-[6px] hover:bg-[#006633] hover:text-white transition duration-200"
    >
      Lihat Detail
    </button>
  </div>

  <!-- Widget Tata Cara Pendaftaran -->
  <div class="bg-white border border-[#DFE3E9] rounded-lg p-6 shadow-sm">
    <h3 class="text-[16px] font-bold text-[#2A2A2C] mb-4">
      Tata Cara Pendaftaran Mahasiswa Baru
    </h3>
    <ol class="space-y-4 text-[13px] text-[#667686] list-decimal list-inside">
      <li class="leading-relaxed">
        <strong class="text-[#2A2A2C] font-semibold">Pilih Jalur Pendaftaran</strong>
        <p class="mt-0.5 text-[12px] pl-5">Tentukan jalur masuk sesuai pilihan dan ketentuan kampus.</p>
      </li>
      <li class="leading-relaxed">
        <strong class="text-[#2A2A2C] font-semibold">Isi Formulir Pendaftaran</strong>
        <p class="mt-0.5 text-[12px] pl-5">Lengkapi data diri dan riwayat pendidikan secara akurat.</p>
      </li>
      <li class="leading-relaxed">
        <strong class="text-[#2A2A2C] font-semibold">Bayar Biaya Pendaftaran</strong>
        <p class="mt-0.5 text-[12px] pl-5">Lakukan pembayaran melalui Bank Mitra dengan kode bayar.</p>
      </li>
      <li class="leading-relaxed">
        <strong class="text-[#2A2A2C] font-semibold">Unggah Berkas & Ujian Seleksi</strong>
        <p class="mt-0.5 text-[12px] pl-5">Kirim dokumen digital dan ikuti ujian seleksi sesuai jadwal.</p>
      </li>
    </ol>
  </div>
</aside>
```

---

### 10. Breadcrumbs

#### Deskripsi & Peran
Panduan lokasi hirarkis halaman web dengan ikon beranda dan pemisah panah.

#### Anatomi Visual & Aturan Styling
- **Latar**: Putih bersih, `padding: 14px 0`.
- **Item**: Teks `13px`, warna item sebelumnya `#667686`, item aktif `#2A2A2C` (`font-weight: 600`).
- **Separator**: Tanda garis miring `/` atau panah chevron `chevron_right`.

#### Markup Semantic HTML & Tailwind CSS
```html
<nav class="w-full bg-white border-b border-[#EEF1F5] py-3.5" aria-label="Breadcrumb">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ol class="flex items-center space-x-2 text-[13px]">
      <li class="inline-flex items-center">
        <a href="/spmbfront/home" class="inline-flex items-center text-[#667686] hover:text-[#006633] transition-colors">
          <span class="material-icons-outlined text-[16px] mr-1.5">home</span>
          Beranda
        </a>
      </li>
      <li class="flex items-center text-[#BABDC1]">
        <span class="material-icons text-[14px]">chevron_right</span>
      </li>
      <li>
        <a href="/spmbfront/program-studi" class="text-[#667686] hover:text-[#006633] transition-colors">
          Program Studi
        </a>
      </li>
      <li class="flex items-center text-[#BABDC1]">
        <span class="material-icons text-[14px]">chevron_right</span>
      </li>
      <li class="text-[#2A2A2C] font-semibold truncate" aria-current="page">
        D3 - Teknik Listrik
      </li>
    </ol>
  </div>
</nav>
```

---

### 11. Pagination

#### Deskripsi & Peran
Navigasi perpindahan halaman pada daftar arsip pengumuman dan direktori program studi dengan keterangan jumlah data.

#### Anatomi Visual & Aturan Styling
- **Kotak Nomor Halaman**: Lebar `28px x 28px`, border radius `4px`.
- **State Normal**: Warna teks `#667686`, font Poppins `14px`, `font-weight: 600`.
- **Hover**: Background `#DFE3E9`.
- **Active Page**: Background `#006633`, warna teks `#FFFFFF`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#DFE3E9] mt-8">
  <!-- Detail Informasi Data -->
  <p class="text-[13px] md:text-[14px] text-[#667686]">
    Menampilkan <strong class="text-[#2A2A2C] font-semibold">1</strong> - <strong class="text-[#2A2A2C] font-semibold">8</strong> dari <strong class="text-[#2A2A2C] font-semibold">24</strong> program studi
  </p>

  <!-- Daftar Tombol Paging -->
  <ul class="flex items-center space-x-1.5" role="navigation" aria-label="Pagination">
    <!-- Prev Button -->
    <li>
      <a href="#" class="w-8 h-8 flex items-center justify-center rounded-[4px] text-[#667686] hover:bg-[#DFE3E9] transition-colors" aria-label="Halaman Sebelumnya">
        <span class="material-icons text-[18px]">chevron_left</span>
      </a>
    </li>

    <!-- Page Numbers -->
    <li>
      <a href="#" class="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#006633] text-white text-[13px] font-semibold shadow-sm" aria-current="page">
        1
      </a>
    </li>
    <li>
      <a href="#" class="w-8 h-8 flex items-center justify-center rounded-[4px] text-[#667686] hover:bg-[#DFE3E9] text-[13px] font-semibold transition-colors">
        2
      </a>
    </li>
    <li>
      <a href="#" class="w-8 h-8 flex items-center justify-center rounded-[4px] text-[#667686] hover:bg-[#DFE3E9] text-[13px] font-semibold transition-colors">
        3
      </a>
    </li>

    <!-- Next Button -->
    <li>
      <a href="#" class="w-8 h-8 flex items-center justify-center rounded-[4px] text-[#667686] hover:bg-[#DFE3E9] transition-colors" aria-label="Halaman Berikutnya">
        <span class="material-icons text-[18px]">chevron_right</span>
      </a>
    </li>
  </ul>
</div>
```

---

### 12. Search Bar & Filter Panel

#### Deskripsi & Peran
Panel filter pencarian multi-kriteria untuk menemukan Jalur Pendaftaran dan Program Studi berdasarkan:
1. Jenjang (D3, D4, S2)
2. Program Studi Pilihan
3. Sistem Kuliah (Reguler Pagi / Non-Reguler)

#### Anatomi Visual & Aturan Styling
- **Card Container**: `.card-pencarian` dengan posisi melayang (*floating overlap*) pada bagian bawah hero banner.
- **Layout**: Grid 3 kolom dropdown + 1 tombol submit solid green `#006633`.
- **Search Bar Inline**: `.input-search` dengan ikon kaca pembesar absolute di sisi kiri (`left: 14px`).

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="bg-white border border-[#DFE3E9] rounded-xl p-6 sm:p-8 shadow-lg max-w-7xl mx-auto -mt-16 relative z-20">
  <div class="mb-5">
    <h2 class="text-[20px] md:text-[22px] font-bold text-[#2A2A2C]">Cari Jalur Pendaftaran</h2>
    <p class="text-[13px] md:text-[14px] text-[#667686] mt-1">
      Temukan jalur pendaftaran sesuai dengan pilihan program studi yang diminati.
    </p>
  </div>

  <form method="POST" action="/spmbfront/jalur-seleksi" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
    <!-- Select 1: Jenjang -->
    <div class="relative">
      <select name="jenjang" class="w-full h-11 pl-4 pr-10 py-2.5 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] appearance-none focus:border-[#006633] focus:outline-none">
        <option value="" selected>-- Pilih Jenjang --</option>
        <option value="D3">D3 - Diploma 3</option>
        <option value="D4">D4 - Sarjana Terapan</option>
        <option value="S2">S2 - Strata 2</option>
      </select>
      <span class="material-icons-outlined absolute right-3 top-3 pointer-events-none text-[#667686] text-[18px]">expand_more</span>
    </div>

    <!-- Select 2: Program Studi -->
    <div class="relative">
      <select name="prodi" class="w-full h-11 pl-4 pr-10 py-2.5 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] appearance-none focus:border-[#006633] focus:outline-none">
        <option value="" selected>-- Pilih Program Studi --</option>
        <option value="20403">D3 - Teknik Listrik</option>
        <option value="62401">D3 - Akuntansi</option>
        <option value="58301">D4 - Teknologi Rekayasa Komputer</option>
      </select>
      <span class="material-icons-outlined absolute right-3 top-3 pointer-events-none text-[#667686] text-[18px]">expand_more</span>
    </div>

    <!-- Select 3: Sistem Kuliah -->
    <div class="relative">
      <select name="sistem" class="w-full h-11 pl-4 pr-10 py-2.5 bg-white border border-[#D0D5DD] rounded-[6px] text-[#2A2A2C] text-[13px] appearance-none focus:border-[#006633] focus:outline-none">
        <option value="" selected>-- Pilih Sistem Kuliah --</option>
        <option value="reguler">Reguler Pagi</option>
        <option value="malam">Kelas Karyawan / Malam</option>
      </select>
      <span class="material-icons-outlined absolute right-3 top-3 pointer-events-none text-[#667686] text-[18px]">expand_more</span>
    </div>

    <!-- Tombol Submit -->
    <button 
      type="submit" 
      class="w-full h-11 px-6 bg-[#006633] hover:bg-[#004d26] text-white text-[13px] font-semibold rounded-[6px] transition duration-200 shadow-sm flex items-center justify-center gap-2"
    >
      <span class="material-icons-outlined text-[18px]">search</span>
      Cari Jalur Pendaftaran
    </button>
  </form>
</div>
```

---

### 13. Header & Branding Section

#### Deskripsi & Peran
Area identitas visual kampus pada bagian atas navigasi dan hero banner, merefleksikan identitas resmi Politeknik Negeri Samarinda.

#### Anatomi Visual & Aturan Styling
- **Logo Kampus**: Logo bulat resolusi tinggi POLNES (`w-11 h-11`).
- **Gelar Teks**:
  - Teks atas: `font-size: 11px`, warna hijau muda `rgba(255,255,255,0.85)`, *uppercase*, *tracking-wide*.
  - Judul Instansi: `font-size: 17px`, `font-weight: 700`, teks putih `#FFFFFF`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="flex items-center gap-3.5">
  <img 
    src="https://assets.siakadcloud.com/uploads/polnes/logoaplikasi/1662.jpg?1733372223" 
    alt="Lambang Politeknik Negeri Samarinda" 
    class="w-12 h-12 rounded-full border-2 border-white/30 object-contain bg-white p-1"
  />
  <div class="flex flex-col">
    <span class="text-[11px] font-semibold uppercase tracking-wider text-green-100">
      Penerimaan Mahasiswa Baru
    </span>
    <h1 class="text-[18px] md:text-[20px] font-bold text-white tracking-tight leading-none mt-0.5">
      Politeknik Negeri Samarinda
    </h1>
  </div>
</div>
```

---

### 14. Footer (4 Kolom Lengkap & Copyright Bar)

#### Deskripsi & Peran
Bagian penutup situs yang kaya informasi, terdiri dari 4 kolom terstruktur:
1. Identitas Kampus & Tautan Media Sosial Resmi.
2. Alamat Lengkap & Kontak Resmi SPMB.
3. Menu Navigasi Cepat.
4. Tautan Eksternal Kampus & Hak Cipta.

#### Anatomi Visual & Aturan Styling
- **Latar Topfooter**: `#006633` pekat dengan teks putih.
- **Latar Botfooter**: `#004d26` (hijau lebih gelap) dengan copyright center-aligned.
- **Ikon Kontak**: Material Icons Round (`location_on`, `phone`, `mail`).

#### Markup Semantic HTML & Tailwind CSS
```html
<footer class="bg-[#006633] text-white pt-12 pb-6 border-t border-green-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-green-700/60">
      
      <!-- Kolom 1: Profil Kampus & Sosmed -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <img 
            src="https://assets.siakadcloud.com/uploads/polnes/logoaplikasi/1662.jpg?1733372223" 
            alt="Logo Polnes" 
            class="w-12 h-12 rounded-full bg-white p-1 object-contain"
          />
          <div>
            <p class="text-[11px] text-green-100 uppercase tracking-wide">Seleksi Penerimaan Mahasiswa Baru</p>
            <h2 class="text-[17px] font-bold">Politeknik Negeri Samarinda</h2>
          </div>
        </div>
        <p class="text-[13px] text-green-100 leading-relaxed">
          Pusat layanan pendaftaran dan informasi akademik terpadu calon mahasiswa baru Politeknik Negeri Samarinda.
        </p>
        <!-- Sosmed Row -->
        <div class="flex items-center space-x-3 pt-2">
          <a href="https://www.facebook.com/polnescampus" target="_blank" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <span class="sr-only">Facebook POLNES</span>
            <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
          </a>
          <a href="https://www.instagram.com/polnes.campus/" target="_blank" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <span class="sr-only">Instagram POLNES</span>
            <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        </div>
      </div>

      <!-- Kolom 2: Kontak Resmi -->
      <div class="space-y-3">
        <h3 class="text-[16px] font-bold tracking-wide">Kontak Kami</h3>
        <ul class="space-y-3 text-[13px] text-green-100">
          <li class="flex items-start gap-2.5">
            <span class="material-icons-round text-[18px] text-green-300 mt-0.5">location_on</span>
            <span>Jl. Ciptomangunkusumo, Kampus Gunung Panjang, Samarinda Seberang, Samarinda 75131 Kalimantan Timur</span>
          </li>
          <li class="flex items-center gap-2.5">
            <span class="material-icons-round text-[18px] text-green-300">phone</span>
            <span>+62 851-9157-6963</span>
          </li>
          <li class="flex items-center gap-2.5">
            <span class="material-icons-round text-[18px] text-green-300">mail</span>
            <span>pmb@polnes.ac.id</span>
          </li>
        </ul>
      </div>

      <!-- Kolom 3: Menu Navigasi -->
      <div class="space-y-3">
        <h3 class="text-[16px] font-bold tracking-wide">Menu</h3>
        <ul class="space-y-2 text-[13px] text-green-100">
          <li><a href="/spmbfront/home" class="hover:text-white hover:underline transition-colors">Beranda</a></li>
          <li><a href="/spmbfront/program-studi" class="hover:text-white hover:underline transition-colors">Program Studi</a></li>
          <li><a href="/spmbfront/pengumuman" class="hover:text-white hover:underline transition-colors">Informasi & Pengumuman</a></li>
          <li><a href="/spmbfront/jalur-seleksi" class="hover:text-white hover:underline transition-colors">Jalur Pendaftaran</a></li>
        </ul>
      </div>

      <!-- Kolom 4: Tautan Eksternal -->
      <div class="space-y-3">
        <h3 class="text-[16px] font-bold tracking-wide">Tautan Terkait</h3>
        <ul class="space-y-2 text-[13px] text-green-100">
          <li><a href="https://www.polnes.ac.id" target="_blank" class="hover:text-white hover:underline transition-colors">Website Resmi POLNES</a></li>
          <li><a href="https://siakad.polnes.ac.id" target="_blank" class="hover:text-white hover:underline transition-colors">SIAKAD Cloud POLNES</a></li>
          <li><a href="https://kemdikbud.go.id" target="_blank" class="hover:text-white hover:underline transition-colors">Kemendikbudristek RI</a></li>
        </ul>
      </div>

    </div>

    <!-- Copyright Bar -->
    <div class="pt-6 text-center text-[13px] text-green-200">
      <p>Copyright © 2026 Politeknik Negeri Samarinda. All Rights Reserved.</p>
    </div>
  </div>
</footer>
```

---

### 15. Card Components (Card Base PMB, Prodi Card, News Card)

#### Deskripsi & Peran
Blok kartu multifungsi:
1. `Card-Base-PMB`: Kontainer putih utama dengan border halus dan bayangan elegan.
2. `Card-Prodi`: Kartu baris ringkas program studi dengan tombol CTA "Lihat Detail". Saat kursor diarahkan ke tombol, latar berubah dari outline hijau menjadi hijau pekat `#006633` dan teks putih.
3. `Card-Berita`: Kartu pengumuman dengan thumbnail gambar sudut melengkung, tanggal abu-abu, judul berita 2 baris terpotong rapi (*line clamp*), dan badge kategori.

#### Anatomi Visual & Aturan Styling
- **Card-Base**: `border: 1px solid #DFE3E9`, `border-radius: 8px`, `padding: 24px`, bayangan `0px 4px 30px rgba(97, 97, 97, 0.1)`.
- **Card-Prodi**: `border: 1px solid #DFE3E9`, `border-radius: 6px`, `padding: 16px`.
- **Card-Berita Hover**: Border berubah menjadi `1px solid #006633`, transisi `300ms`.

#### Markup Semantic HTML & Tailwind CSS
```html
<!-- 1. Card Program Studi (Card-Prodi) -->
<div class="flex items-center justify-between p-4 bg-white border border-[#DFE3E9] rounded-[6px] hover:border-[#006633] transition-all duration-200 mb-3">
  <div class="w-2/3 pr-4">
    <h3 class="text-[14px] md:text-[15px] font-semibold text-[#2A2A2C] capitalize">
      D3 - Teknik Listrik
    </h3>
    <p class="text-[12px] md:text-[13px] text-[#667686] mt-0.5">
      Belum ada jalur pendaftaran yang dibuka
    </p>
  </div>
  <a href="/spmbfront/program-studi-detail/20403">
    <button class="px-5 py-2.5 bg-white border border-[#006633] text-[#006633] text-[13px] font-semibold rounded-[6px] hover:bg-[#006633] hover:text-white transition duration-200 shadow-sm whitespace-nowrap">
      Lihat Detail
    </button>
  </a>
</div>

<!-- 2. Card Berita & Pengumuman (Card-Berita) -->
<article class="bg-white border border-[#DFE3E9] hover:border-[#006633] rounded-lg p-3 sm:p-4 transition duration-300 group flex flex-col justify-between h-full cursor-pointer">
  <div>
    <!-- Thumbnail Gambar -->
    <div class="w-full h-48 rounded-[6px] overflow-hidden mb-3.5 bg-gray-100">
      <img 
        src="https://siakad.polnes.ac.id/uploads/polnes/imgpengumumanspmb/thumb/5.jpg" 
        alt="Seleksi Mandiri Konsorsium"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    <!-- Meta Tanggal -->
    <time datetime="2025-07-07" class="text-[12px] text-[#667686] block mb-1">
      7 Juli 2025
    </time>
    <!-- Judul Berita -->
    <h3 class="text-[14px] md:text-[15px] font-semibold text-[#2A2A2C] group-hover:text-[#006633] transition-colors line-clamp-2 leading-snug mb-3">
      Seleksi Mandiri Konsorsium Politeknik Negeri (SMK-PN) Gelombang 2
    </h3>
  </div>

  <!-- Badge Tag Kategori -->
  <div>
    <span class="inline-block px-2.5 py-1 text-[11px] font-medium rounded bg-[#FFEDB7] text-[#462B03]">
      Pengumuman
    </span>
  </div>
</article>
```

---

### 16. Carousel & Slider Pengumuman

#### Deskripsi & Peran
Banner geser interaktif untuk menayangkan jadwal dan poster pengumuman penting SPMB di halaman beranda.

#### Anatomi Visual & Aturan Styling
- **Kontainer**: Rasio aspek 16:9 atau 21:9 dengan tombol navigasi melayang bulat (`chevron_left` / `chevron_right`).
- **Indikator Titik**: Kapsul bulat kecil di bagian bawah tengah slider (aktif: hijau pekat `#006633`, inaktif: putih/abu transparan).

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="relative w-full overflow-hidden rounded-xl bg-gray-900 group" aria-roledescription="carousel">
  <!-- Track Slide -->
  <div class="flex transition-transform duration-500 ease-in-out">
    <div class="min-w-full relative h-[240px] sm:h-[360px] md:h-[440px]">
      <img 
        src="https://siakad.polnes.ac.id/uploads/polnes/settingsim/163.jpg?67449" 
        alt="Poster SNBT 2025" 
        class="w-full h-full object-cover"
      />
      <!-- Gradient Overlay & Caption -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
        <div class="text-white max-w-2xl">
          <span class="inline-block px-2.5 py-1 bg-[#006633] text-[11px] font-semibold rounded mb-2">
            Jadwal Resmi
          </span>
          <h2 class="text-[20px] sm:text-[26px] font-bold leading-tight">
            Pendaftaran Seleksi Nasional Berdasarkan Tes (SNBT) 2025
          </h2>
        </div>
      </div>
    </div>
  </div>

  <!-- Tombol Panah Kiri & Kanan -->
  <button class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2A2A2C] flex items-center justify-center shadow transition-opacity" aria-label="Slide sebelumnya">
    <span class="material-icons text-[22px]">chevron_left</span>
  </button>
  <button class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2A2A2C] flex items-center justify-center shadow transition-opacity" aria-label="Slide selanjutnya">
    <span class="material-icons text-[22px]">chevron_right</span>
  </button>

  <!-- Paginator Dots -->
  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
    <span class="w-6 h-2 rounded-full bg-[#006633]"></span>
    <span class="w-2 h-2 rounded-full bg-white/60"></span>
    <span class="w-2 h-2 rounded-full bg-white/60"></span>
  </div>
</div>
```

---

### 17. Accordion & FAQ Collapse (Alur Pendaftaran & Panduan)

#### Deskripsi & Peran
Komponen lipat akordeon (*collapsible panel*) untuk FAQ dan Tata Cara Pendaftaran pada `polnes_daftar.html` agar antarmuka tetap rapi dan ringkas.

#### Anatomi Visual & Aturan Styling
- **Header**: Padding `16px 20px`, latar putih, teks tebal `font-semibold`, ikon indikator ekspansi panah berotasi 180° saat terbuka.
- **Body**: Garis pembatas atas halus, teks instruksi berformat daftar nomor `<ol>`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="border border-[#DFE3E9] rounded-lg overflow-hidden bg-white mb-4">
  <!-- Accordion Trigger Button -->
  <button 
    type="button" 
    class="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-[15px] text-[#2A2A2C] hover:bg-gray-50 focus:outline-none transition-colors"
    onclick="toggleAccordion('acc-1', this)"
    aria-expanded="false"
    aria-controls="acc-1"
  >
    <span>Tata Cara Pendaftaran Mahasiswa Baru</span>
    <span class="material-icons-outlined text-[#667686] transition-transform duration-200">
      expand_more
    </span>
  </button>

  <!-- Accordion Collapsible Body -->
  <div id="acc-1" class="hidden px-5 py-4 border-t border-[#DFE3E9] text-[13px] text-[#667686] leading-relaxed">
    <ol class="space-y-3 list-decimal list-inside">
      <li><strong class="text-[#2A2A2C]">Pilih Jalur Pendaftaran:</strong> Tentukan jalur masuk sesuai jadwal penerimaan.</li>
      <li><strong class="text-[#2A2A2C]">Isi Formulir Pendaftaran:</strong> Masukkan data identitas lengkap dan nilai rapor.</li>
      <li><strong class="text-[#2A2A2C]">Bayar Biaya Pendaftaran:</strong> Gunakan nomor virtual account pada bank mitra.</li>
      <li><strong class="text-[#2A2A2C]">Unggah Berkas:</strong> Scan ijazah, SKHUN, dan pasfoto terbaru format JPG/PNG.</li>
    </ol>
  </div>
</div>
```

---

### 18. Modal Dialog (Modal Konfirmasi & Brosur Lightbox)

#### Deskripsi & Peran
Kotak dialog pop-up konfirmasi (misal: saat ID Pendaftar atau PIN belum diisi) serta penampil rincian UKT/Brosur dengan backdrop gelap semi-transparan.

#### Anatomi Visual & Aturan Styling
- **Backdrop**: `background-color: rgba(0, 0, 0, 0.5)` dengan efek blur lembut.
- **Dialog Box**: Lebar maksimal `440px`, border radius `8px`, padding `28px`, latar putih bersih.
- **Ikon Status**: Lingkaran tanda seru / tanda silang merah (`icon-failed.svg`) atau centang hijau.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <!-- Modal Card -->
  <div class="w-full max-w-md bg-white rounded-lg p-6 shadow-2xl flex flex-col items-center text-center">
    <!-- Icon Status Bulat -->
    <div class="w-14 h-14 rounded-full bg-red-50 text-[#EE2737] flex items-center justify-center mb-4">
      <span class="material-icons text-[32px]">error_outline</span>
    </div>

    <!-- Judul & Deskripsi Pesan -->
    <h3 id="modal-title" class="text-[17px] font-bold text-[#2A2A2C] mb-2">
      ID Pendaftar dan PIN Harus Diisi
    </h3>
    <p class="text-[13px] text-[#667686] leading-relaxed mb-6">
      Harap mengisi kolom ID Pendaftar dan PIN akun pendaftaran Anda terlebih dahulu sebelum melanjutkan proses login.
    </p>

    <!-- Tombol Aksi -->
    <button 
      type="button" 
      class="w-full py-2.5 px-6 bg-[#006633] hover:bg-[#004d26] text-white text-[13px] font-semibold rounded-[6px] transition duration-200"
    >
      Saya Mengerti
    </button>
  </div>
</div>
```

---

### 19. Badge, Status Ribbons, & Filter Pills

#### Deskripsi & Peran
Penanda status ringkas dan filter taksonomi kategori:
1. `Badge--Warning`: Latar krem `#FFEDB7`, teks coklat gelap `#462B03` ("Pengumuman").
2. `Badge--Info`: Latar biru lembut `#DBE4FA`, teks biru/hijau (`#1D4ED8` atau `#006633`) ("Informasi").
3. `Tag-Category (Filter Pills)`: Tab penyaring jenjang studi (D3 / D4 / S2). Saat aktif: latar `rgba(0, 102, 51, 0.05)`, border `#006633`, teks hijau `#006633`.
4. `Status-Ribbon`: Pita pojok status jalur ("Dibuka" hijau `#27AE60`, "Akan Dibuka" oranye `#F2994A`, "Tutup" merah `#EB5757`).

#### Anatomi Visual & Aturan Styling
- **Pills**: `padding: 8px 16px`, `border-radius: 6px`, `font-size: 13px`, `font-weight: 500`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="flex flex-wrap items-center gap-2 mb-4">
  <!-- Pill Tag Category Inactive -->
  <button class="px-4 py-2 border border-[#DFE3E9] rounded-[6px] text-[13px] text-[#667686] hover:border-[#006633] hover:text-[#006633] transition-colors">
    D4 - Sarjana Terapan
  </button>

  <!-- Pill Tag Category Active -->
  <button class="px-4 py-2 border border-[#006633] bg-[#006633]/5 rounded-[6px] text-[13px] text-[#006633] font-semibold">
    D3 - Diploma 3
  </button>

  <!-- Badges -->
  <span class="px-2.5 py-0.5 text-[11px] font-medium rounded bg-[#FFEDB7] text-[#462B03]">
    Pengumuman
  </span>
  <span class="px-2.5 py-0.5 text-[11px] font-medium rounded bg-[#DBE4FA] text-[#1D4ED8]">
    Informasi
  </span>
  <span class="px-2.5 py-0.5 text-[11px] font-medium rounded bg-[#D0FFD5] text-[#005508]">
    Dibuka
  </span>
  <span class="px-2.5 py-0.5 text-[11px] font-medium rounded bg-red-50 text-[#EE2737]">
    Ditutup
  </span>
</div>
```

---

### 20. Button System (Solid Green, Outline, Ghost, Disabled)

#### Deskripsi & Peran
Hierarki tombol utama SPMB Polnes dengan efek *ripple* interaktif dan status status lengkap.

#### Anatomi Visual & Aturan Styling
- **Primary Solid**: Latar `#006633`, border `#006633`, teks putih `#FFFFFF`. Hover: kecerahan `filter: brightness(90%)`, bayangan inset halus.
- **Outline Green**: Latar transparan, border `1px solid #006633`, teks `#006633`. Hover: latar hijau `#006633`, teks putih.
- **Outline White (Hero/Navbar CTA)**: Latar transparan, border `1px solid #FFFFFF`, teks putih.
- **Ghost (Invisible)**: Latar transparan tanpa border, teks `#006633`.
- **Disabled**: Background `#BABDC1`, border `#BABDC1`, kursor *not-allowed*.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="flex flex-wrap items-center gap-3">
  <!-- Button Primary Solid Hijau -->
  <button class="px-7 py-3 bg-[#006633] hover:bg-[#004d26] text-white text-[13px] md:text-[14px] font-semibold rounded-[6px] transition duration-200 shadow-sm active:scale-98">
    Cari Jalur Pendaftaran
  </button>

  <!-- Button Outline Hijau -->
  <button class="px-7 py-3 bg-transparent border border-[#006633] text-[#006633] hover:bg-[#006633] hover:text-white text-[13px] md:text-[14px] font-semibold rounded-[6px] transition duration-200">
    Lihat Detail
  </button>

  <!-- Button Ghost -->
  <button class="px-5 py-3 bg-transparent text-[#006633] hover:text-[#004d26] text-[13px] md:text-[14px] font-semibold rounded-[6px] hover:underline">
    Lupa ID atau PIN ?
  </button>

  <!-- Button Disabled -->
  <button disabled class="px-7 py-3 bg-[#BABDC1] border border-[#BABDC1] text-white text-[13px] md:text-[14px] font-semibold rounded-[6px] cursor-not-allowed opacity-75">
    Pendaftaran Ditutup
  </button>
</div>
```

---

### 21. Call to Action Banner ("Kami Siap Membantu Anda")

#### Deskripsi & Peran
Banner horisontal besar di atas footer dengan gradasi hijau resmi POLNES dan latar belakang foto gedung kampus, memuat tombol kontak WhatsApp dan tautan unduh petunjuk pendaftaran.

#### Anatomi Visual & Aturan Styling
- **Background**: `linear-gradient(88.41deg, #006633 0%, rgba(0, 102, 51, 0.6) 104.72%), url('/img/banner.png')`
- **Border Radius**: `20px` (desktop), `padding: 48px 56px`.
- **Tombol Aksi**: Tombol frosted outline putih dengan ikon resmi.

#### Markup Semantic HTML & Tailwind CSS
```html
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
  <div class="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#006633] via-[#006633]/90 to-[#006633]/60 p-8 sm:p-12 text-white shadow-xl">
    <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
      
      <!-- Teks Informasi -->
      <div class="max-w-2xl text-center lg:text-left">
        <h2 class="text-[22px] sm:text-[28px] font-bold tracking-tight">
          Kami Siap Membantu Anda
        </h2>
        <p class="text-[13px] sm:text-[14px] text-green-100/90 mt-2 leading-relaxed">
          Apabila Anda memiliki kendala atau pertanyaan seputar registrasi akun dan verifikasi berkas, silakan hubungi tim panitia SPMB atau baca Petunjuk Pendaftaran terlebih dahulu.
        </p>
      </div>

      <!-- Tombol Aksi Kanan -->
      <div class="flex flex-wrap items-center justify-center gap-3.5">
        <!-- Tombol WhatsApp -->
        <a 
          href="https://wa.me/6285191576963?text=Halo%20Admin%20PMB%20POLNES" 
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white rounded-[6px] text-white text-[13px] font-semibold hover:bg-white hover:text-[#006633] transition duration-200"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          WhatsApp
        </a>

        <!-- Tombol Petunjuk Pendaftaran -->
        <a 
          href="/spmbfront/user-guide"
          class="inline-flex items-center px-6 py-3 bg-transparent border border-white rounded-[6px] text-white text-[13px] font-semibold hover:bg-white hover:text-[#006633] transition duration-200"
        >
          Petunjuk Pendaftaran
        </a>
      </div>

    </div>
  </div>
</section>
```

---

### 22. Floating Action Button WhatsApp ("Butuh Bantuan? Hubungi Kami!")

#### Deskripsi & Peran
Tombol mengambang (*sticky floating CTA*) di sudut kanan bawah layar yang selalu dapat diakses untuk memudahkan calon mahasiswa baru bertanya ke layanan Helpdesk PMB Polnes via WhatsApp. Dilengkapi efek riak berdenyut (*pulse animation*).

#### Anatomi Visual & Aturan Styling
- **Posisi**: `position: fixed; bottom: 24px; right: 24px; z-index: 999;`
- **Warna Background**: `#0DC152` (WhatsApp Bright Emerald)
- **Border Radius**: Kapsul melengkung penuh (`rounded-full`, padding `10px 18px`).
- **Efek Pulse**: Lingkaran riak mengembang keluar berulang-ulang (`@keyframes pulse_wa`).

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="fixed bottom-6 right-6 z-50 flex items-center">
  <!-- Efek Riak Berdenyut (Pulse Ring) -->
  <div class="absolute inset-0 rounded-full border-2 border-[#0DC152] animate-ping opacity-40 pointer-events-none"></div>

  <!-- Tombol WhatsApp Mengambang -->
  <a 
    href="https://wa.me/6285191576963?text=Halo%20Admin%20PMB%20Polnes,%20saya%20ingin%20bertanya%20seputar%20pendaftaran" 
    target="_blank" 
    rel="noopener noreferrer"
    class="relative flex items-center gap-2.5 px-5 py-3 bg-[#0DC152] hover:bg-[#0aa846] text-white rounded-full shadow-[0_4px_16px_rgba(13,193,82,0.45)] hover:shadow-[0_6px_20px_rgba(13,193,82,0.6)] transition-all duration-300 group"
  >
    <span class="text-[13px] font-semibold tracking-wide">
      Butuh Bantuan? Hubungi Kami!
    </span>
    <!-- WhatsApp Icon -->
    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
    </svg>
  </a>
</div>
```

---

### 23. Alerts & Flash Notification Box

#### Deskripsi & Peran
Kotak notifikasi peringatan status formulir pendaftaran, batas waktu pembayaran, pengumuman kelulusan, dan konfirmasi sistem.

#### Anatomi Visual & Aturan Styling
- **Alert Info**: Background `rgba(0, 102, 51, 0.05)`, border `1px solid #006633`.
- **Alert Warning**: Background `rgba(247, 129, 0, 0.05)`, border `1px solid #F78100`.
- **Alert Danger**: Background `rgba(238, 39, 55, 0.05)`, border `1px solid #EE2737`.
- **Padding**: `12px 16px` (mobile), `16px` (desktop), border radius `6px`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="space-y-3 mb-6">
  <!-- Alert Info (Tema POLNES Green) -->
  <div class="flex items-start gap-3 p-4 bg-[#006633]/5 border border-[#006633] rounded-[6px] text-[#2A2A2C]" role="alert">
    <span class="material-icons text-[#006633] text-[22px] flex-shrink-0">info</span>
    <div class="flex-1 text-[13px]">
      <strong class="font-semibold text-[#006633] block mb-0.5">Pengumuman Hasil Seleksi</strong>
      Pengumuman kelulusan Jalur Mandiri Konsorsium dapat diakses mulai tanggal 14 Juli 2025 pukul 14.00 WITA.
    </div>
  </div>

  <!-- Alert Warning (Jadwal / Pembayaran) -->
  <div class="flex items-start gap-3 p-4 bg-[#F78100]/5 border border-[#F78100] rounded-[6px] text-[#2A2A2C]" role="alert">
    <span class="material-icons text-[#F78100] text-[22px] flex-shrink-0">warning</span>
    <div class="flex-1 text-[13px]">
      <strong class="font-semibold text-[#F78100] block mb-0.5">Sisa Waktu Pembayaran</strong>
      Voucher pendaftaran Anda akan kedaluwarsa dalam 12 jam ke depan. Segera selesaikan pembayaran di Bank Mitra.
    </div>
  </div>

  <!-- Alert Danger (Gagal / Berkas Kurang) -->
  <div class="flex items-start gap-3 p-4 bg-[#EE2737]/5 border border-[#EE2737] rounded-[6px] text-[#2A2A2C]" role="alert">
    <span class="material-icons text-[#EE2737] text-[22px] flex-shrink-0">error</span>
    <div class="flex-1 text-[13px]">
      <strong class="font-semibold text-[#EE2737] block mb-0.5">Dokumen Belum Lengkap</strong>
      Unggahan kartu keluarga Anda buram atau tidak terbaca. Harap lakukan pemindaian ulang sebelum verifikasi ditutup.
    </div>
  </div>
</div>
```

---

### 24. Progress Bars & Step Tracker

#### Deskripsi & Peran
Indikator visual persentase pengisian formulir pendaftaran 4-tahap (Biodata -> Pilihan Prodi -> Unggah Berkas -> Finalisasi) dan bar progress kapasitas kuota seleksi.

#### Anatomi Visual & Aturan Styling
- **Garis Progress**: Tinggi `6px`, background track `#F6F6FB`, isi bar `#006633`.
- **Lingkaran Step**: Nomor tahap lingkaran bulat `32px x 32px` (Selesai: centang hijau, Aktif: hijau berbingkai cincin, Belum: abu-abu netral).

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="w-full my-6">
  <!-- Baris Lingkaran Langkah -->
  <div class="flex items-center justify-between relative mb-2">
    <!-- Garis Penghubung Latar Belakang -->
    <div class="absolute top-1/2 left-0 right-0 h-[2px] bg-[#DFE3E9] -translate-y-1/2 z-0"></div>
    <div class="absolute top-1/2 left-0 w-2/3 h-[2px] bg-[#006633] -translate-y-1/2 z-0 transition-all duration-300"></div>

    <!-- Step 1: Selesai -->
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-8 h-8 rounded-full bg-[#006633] text-white flex items-center justify-center text-[12px] font-bold shadow-sm">
        <span class="material-icons text-[16px]">check</span>
      </div>
      <span class="text-[11px] font-medium text-[#006633] mt-1.5">Pilih Jalur</span>
    </div>

    <!-- Step 2: Selesai -->
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-8 h-8 rounded-full bg-[#006633] text-white flex items-center justify-center text-[12px] font-bold shadow-sm">
        <span class="material-icons text-[16px]">check</span>
      </div>
      <span class="text-[11px] font-medium text-[#006633] mt-1.5">Isi Formulir</span>
    </div>

    <!-- Step 3: Sedang Aktif -->
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-8 h-8 rounded-full bg-white border-2 border-[#006633] text-[#006633] flex items-center justify-center text-[12px] font-bold ring-4 ring-[#006633]/15">
        3
      </div>
      <span class="text-[11px] font-bold text-[#006633] mt-1.5">Pembayaran</span>
    </div>

    <!-- Step 4: Belum -->
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-8 h-8 rounded-full bg-white border-2 border-[#D0D5DD] text-[#667686] flex items-center justify-center text-[12px] font-medium">
        4
      </div>
      <span class="text-[11px] font-medium text-[#667686] mt-1.5">Konfirmasi</span>
    </div>
  </div>
</div>
```

---

### 25. Tooltip & Popovers

#### Deskripsi & Peran
Petunjuk teks mikro melayang saat kursor menyentuh istilah akademik tertentu (seperti UKT, IPI, Akreditasi BAN-PT, atau format dokumen).

#### Anatomi Visual & Aturan Styling
- **Latar**: Abu gelap pekat `#2A2A2C` dengan panah kecil di tengah.
- **Teks**: Putih `#FFFFFF`, font Poppins `11px`, `padding: 6px 10px`, radius `4px`.

#### Markup Semantic HTML & Tailwind CSS
```html
<div class="inline-block relative group">
  <!-- Trigger Element -->
  <button type="button" class="inline-flex items-center text-[#006633] hover:underline text-[13px] font-medium" aria-describedby="tooltip-ukt">
    Kelompok UKT 1 s.d. 8
    <span class="material-icons-outlined text-[15px] ml-1 text-[#667686]">help_outline</span>
  </button>

  <!-- Floating Tooltip Box -->
  <div 
    id="tooltip-ukt" 
    role="tooltip" 
    class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-50 px-3 py-2 bg-[#2A2A2C] text-white text-[11px] leading-tight rounded-[4px] shadow-lg whitespace-nowrap pointer-events-none"
  >
    Uang Kuliah Tunggal disesuaikan dengan kemampuan ekonomi orang tua
    <!-- Caret Panah Bawah -->
    <div class="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-[#2A2A2C]"></div>
  </div>
</div>
```

---

## 🛠️ Panduan Integrasi Cepat (Quickstart Setup)

Untuk mereproduksi seluruh komponen di atas secara identik tanpa galat CSS, tambahkan pustaka dan dependensi resmi berikut ke dalam berkas HTML utama Anda:

```html
<!-- 1. Google Fonts Poppins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- 2. Google Material Icons (Round & Outlined) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">

<!-- 3. Tailwind CSS CDN (Optional for rapid scaffolding) -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'polnes-green': '#006633',
          'polnes-green-dark': '#004d26',
          'polnes-wa': '#0DC152',
          'polnes-text': '#2A2A2C',
          'polnes-muted': '#667686',
        },
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        }
      }
    }
  }
</script>
```

---
*Dokumen ini disusun sebagai spesifikasi resmi arsitektur UI/UX SPMB Politeknik Negeri Samarinda oleh Frontend Architect & Reverse Engineering Specialist.*
