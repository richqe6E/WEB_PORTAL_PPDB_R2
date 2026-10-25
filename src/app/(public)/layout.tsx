import React from 'react'
import Link from 'next/link'
import { Toaster } from 'sonner'
import {
  School,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'
import { PublicHeader } from '@/components/public/public-header'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-[#2A2A2C]">
      <Toaster richColors position="top-right" />

      {/* NAVBAR HEADER PUBLIK (MOBILE-FIRST DENGAN DRAWER & THEME POLNES ACADEMIC GREEN) */}
      <PublicHeader />

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1">{children}</main>

      {/* FLOATING ACTION BUTTON (WHATSAPP HELP WIDGET - REF SPMB POLNES) */}
      <aside aria-label="Bantuan WhatsApp" className="fixed bottom-6 right-6 z-40 print:hidden">
        <a
          href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB%20Yayasan%20ICA,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20PAUD%20dan%20TK."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0DC152] hover:bg-[#0aa846] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-white/50"
        >
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <span className="hidden sm:inline">Butuh Bantuan? Hubungi Kami!</span>
        </a>
      </aside>

      {/* FOOTER 4-KOLOM INSTITUSIONAL RESMI */}
      <footer className="bg-white border-t border-[#DFE3E9] text-sm text-[#2A2A2C] mt-16 print:hidden">
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
                    YAYASAN ICA
                  </span>
                  <span className="block text-xs text-[#667686]">
                    Pendidikan Anak Usia Dini &amp; TK
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#667686] leading-relaxed">
                Membina generasi sholih, cerdas, mandiri, dan berkarakter mulia sejak usia dini melalui lingkungan belajar yang islami, ramah anak, dan berkualitas.
              </p>
            </div>

            {/* Kolom 2: Kontak Sekretariat PPDB */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#2A2A2C] uppercase tracking-wider">
                Sekretariat PPDB
              </h3>
              <ul className="space-y-2.5 text-xs text-[#667686]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#006633] flex-shrink-0 mt-0.5" />
                  <span>Jl. Pendidikan Karakter No. 12, Kompleks Bina Bangsa, Samarinda</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#006633] flex-shrink-0" />
                  <span>0812-3456-7890</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#006633] flex-shrink-0" />
                  <span>Senin - Jumat: 08.00 - 15.00 WITA</span>
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
                    <ChevronRight className="w-3 h-3 text-[#006633]" /> Cek Status Pendaftaran
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#006633] transition-colors flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-[#006633]" /> Login Petugas Tata Usaha
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Jenjang Pendidikan */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#2A2A2C] uppercase tracking-wider">
                Jenjang Pendidikan
              </h3>
              <ul className="space-y-2 text-xs text-[#667686]">
                <li className="p-2.5 rounded-lg bg-gray-50 border border-[#DFE3E9]">
                  <strong className="text-[#2A2A2C] block">PAUD / Kelompok Bermain</strong>
                  <span className="text-[11px] text-[#667686]">Usia 2 - 4 Tahun</span>
                </li>
                <li className="p-2.5 rounded-lg bg-gray-50 border border-[#DFE3E9]">
                  <strong className="text-[#2A2A2C] block">Taman Kanak-Kanak (TK A &amp; B)</strong>
                  <span className="text-[11px] text-[#667686]">Usia 4 - 6 Tahun</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#DFE3E9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#667686] gap-3 text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} YAYASAN ICA. Sistem Informasi Akademik &amp; PPDB Online.
            </p>
            <p className="flex items-center gap-1 justify-center">
              <span>Portal Resmi Penerimaan Peserta Didik Baru</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
