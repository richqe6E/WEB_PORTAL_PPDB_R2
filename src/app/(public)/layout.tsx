import React from 'react'
import Link from 'next/link'
import { Toaster } from 'sonner'
import {
  School,
  FileText,
  Search,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  LogIn,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-[#2A2A2C]">
      <Toaster richColors position="top-right" />

      {/* NAVBAR HEADER PUBLIK (THEME POLNES ACADEMIC GREEN) */}
      <header className="sticky top-0 z-50 bg-[#006633] text-white shadow-md border-b border-[#004d26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* BRAND IDENTITAS YAYASAN */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all shadow-sm">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-[#D0FFD5] font-semibold">
                  Penerimaan Siswa Baru
                </span>
                <span className="block font-bold text-base sm:text-lg leading-tight text-white tracking-tight">
                  PPDB Yayasan PAUD &amp; TK
                </span>
              </div>
            </Link>

            {/* NAV LINKS DESKTOP */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-white hover:text-[#D0FFD5] transition-colors py-1 border-b-2 border-transparent hover:border-[#D0FFD5]"
              >
                Beranda
              </Link>
              <Link
                href="/#jenjang"
                className="text-white/90 hover:text-[#D0FFD5] transition-colors py-1"
              >
                Pilihan Jenjang
              </Link>
              <Link
                href="/#jadwal"
                className="text-white/90 hover:text-[#D0FFD5] transition-colors py-1"
              >
                Jadwal Seleksi
              </Link>
              <Link
                href="/cek-status"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#D0FFD5] transition-colors py-1"
              >
                <Search className="w-4 h-4 text-[#D0FFD5]" />
                <span>Cek Status</span>
              </Link>
            </nav>

            {/* ACTION BUTTONS (DAFTAR & MASUK TU) */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/cek-status"
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Cek Status Pendaftaran"
              >
                <Search className="w-5 h-5" />
              </Link>

              <Link
                href="/daftar"
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#F78100] hover:bg-[#d97706] text-white transition-all shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Daftar Sekarang</span>
              </Link>

              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold border border-white/40 hover:bg-white/10 text-white transition-colors"
                title="Masuk Portal Admin TU"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login TU</span>
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE SUB-NAV TABS */}
        <div className="md:hidden bg-[#004d26] px-4 py-2 flex items-center justify-around text-xs border-t border-white/10">
          <Link href="/" className="text-white hover:text-[#D0FFD5] font-medium py-1">
            Beranda
          </Link>
          <Link href="/#jenjang" className="text-white/90 hover:text-[#D0FFD5] py-1">
            Jenjang
          </Link>
          <Link href="/#jadwal" className="text-white/90 hover:text-[#D0FFD5] py-1">
            Jadwal
          </Link>
          <Link href="/cek-status" className="text-[#D0FFD5] font-semibold py-1">
            Cek Status
          </Link>
          <Link href="/login" className="text-white/80 py-1">
            Login TU
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1">{children}</main>

      {/* FLOATING ACTION BUTTON (WHATSAPP HELP WIDGET - REF SPMB POLNES) */}
      <aside aria-label="Bantuan WhatsApp" className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20Yayasan,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20PAUD%20dan%20TK."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0DC152] hover:bg-[#0aa846] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-white/50"
        >
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <span className="hidden sm:inline">Butuh Bantuan? Hubungi Kami!</span>
          <span className="sm:hidden">Bantuan</span>
        </a>
      </aside>

      {/* FOOTER 4-KOLOM INSTITUSIONAL RESMI */}
      <footer className="bg-white border-t border-[#DFE3E9] text-sm text-[#2A2A2C] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Kolom 1: Profil Yayasan */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#006633] flex items-center justify-center text-white">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-base text-[#006633]">
                    Yayasan Insan Cita
                  </span>
                  <span className="block text-xs text-[#667686]">
                    Pendidikan Anak Usia Dini &amp; TK
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#667686] leading-relaxed">
                Membina generasi sholih, cerdas, mandiri, dan berkarakter mulia sejak usia dini melalui lingkungan belajar yang islami, ramah anak, dan berkualitas.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#006633] font-semibold bg-[#006633]/5 px-3 py-1.5 rounded-lg border border-[#006633]/20 w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span>Izin Operasional Resmi Kemendikbud</span>
              </div>
            </div>

            {/* Kolom 2: Kontak Sekretariat PPDB */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#2A2A2C] uppercase tracking-wider">
                Sekretariat PPDB
              </h3>
              <ul className="space-y-2.5 text-xs text-[#667686]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#006633] flex-shrink-0 mt-0.5" />
                  <span>Jl. Pendidikan Karakter No. 12, Kompleks Yayasan, Samarinda / Jakarta</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#006633] flex-shrink-0" />
                  <span>(021) 8765-4321 / 0812-3456-7890</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#006633] flex-shrink-0" />
                  <span>Senin - Jumat: 08.00 - 15.00 WITA/WIB</span>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Tautan Navigasi */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#2A2A2C] uppercase tracking-wider">
                Tautan Cepat
              </h3>
              <ul className="space-y-2 text-xs text-[#667686]">
                <li>
                  <Link href="/" className="hover:text-[#006633] transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#006633]" /> Beranda Informasi
                  </Link>
                </li>
                <li>
                  <Link href="/daftar" className="hover:text-[#006633] transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#006633]" /> Formulir Pendaftaran Online
                  </Link>
                </li>
                <li>
                  <Link href="/cek-status" className="hover:text-[#006633] transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#006633]" /> Cek Status &amp; Pengumuman
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#006633] transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#006633]" /> Login Admin Tata Usaha
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Jenjang Pendidikan */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#2A2A2C] uppercase tracking-wider">
                Jenjang Dikelola
              </h3>
              <ul className="space-y-2 text-xs text-[#667686]">
                <li className="p-2 rounded bg-gray-50 border border-[#DFE3E9]">
                  <strong className="text-[#2A2A2C] block">PAUD / Kelompok Bermain</strong>
                  <span className="text-[11px] text-[#667686]">Usia 2 - 4 Tahun</span>
                </li>
                <li className="p-2 rounded bg-gray-50 border border-[#DFE3E9]">
                  <strong className="text-[#2A2A2C] block">Taman Kanak-Kanak (TK A &amp; B)</strong>
                  <span className="text-[11px] text-[#667686]">Usia 4 - 6 Tahun</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#DFE3E9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#667686] gap-3 text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} Yayasan Insan Cita. Sistem Informasi Akademik &amp; PPDB Online.
            </p>
            <p className="flex items-center gap-1 justify-center">
              <span>Dibangun dengan standar institusional &amp; ramah anak</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

