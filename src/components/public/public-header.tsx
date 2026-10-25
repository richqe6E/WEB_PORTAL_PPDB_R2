'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  School,
  Menu,
  X,
  ChevronRight,
  Search,
  FileText,
  LogIn,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Calendar,
} from 'lucide-react'

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#006633] text-white shadow-md border-b border-[#004d26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* BRAND IDENTITAS YAYASAN */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all shadow-xs">
                <School className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
                  PPDB Online &bull; PAUD &amp; TK
                </span>
                <span className="block font-bold text-base sm:text-lg leading-tight text-white tracking-tight">
                  YAYASAN ICA
                </span>
              </div>
            </Link>

            {/* NAV LINKS DESKTOP (HANYA DITAMPILKAN DI MD KE ATAS) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-white hover:text-emerald-200 transition-colors py-1 border-b-2 border-transparent hover:border-emerald-200"
              >
                Beranda
              </Link>
              <Link
                href="/#jenjang"
                className="text-white/90 hover:text-emerald-200 transition-colors py-1"
              >
                Pilihan Jenjang
              </Link>
              <Link
                href="/#jadwal"
                className="text-white/90 hover:text-emerald-200 transition-colors py-1"
              >
                Jadwal Seleksi
              </Link>
              <Link
                href="/cek-status"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-emerald-200 transition-colors py-1"
              >
                <Search className="w-4 h-4 text-emerald-300" />
                <span>Cek Status</span>
              </Link>
            </nav>

            {/* SISI KANAN DESKTOP */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-white/30 hover:bg-white/10 text-white transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login TU</span>
              </Link>

              <Link
                href="/daftar"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#F78100] hover:bg-[#d97706] text-white transition-all shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Daftar Sekarang</span>
              </Link>
            </div>

            {/* SISI KANAN MOBILE: ANIMATED HAMBURGER TOGGLE (REF CEVOROB) */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center p-2.5 transition-colors cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
              >
                <span
                  className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-200 my-1 ${
                    isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 origin-center ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          DRAWER NAVIGASI MOBILE (SLIDE-OVER SESUAI REFERENSI YAYASAN AT-TARBIYYAH)
          ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop gelap */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Panel Konten Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-250 border-l border-slate-200">
            <div>
              {/* Header Drawer */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#006633] text-white flex items-center justify-center font-bold">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-sm text-slate-900 leading-tight">
                      YAYASAN ICA
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Portal Resmi PPDB Online
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Daftar Menu Vertikal Berjenjang */}
              <div className="p-4 space-y-1.5">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-[#006633]" />
                    <span>Beranda</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/#jenjang"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-[#006633]" />
                    <span>Pilihan Jenjang (PAUD &amp; TK)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/#jadwal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#006633]" />
                    <span>Jadwal &amp; Agenda Seleksi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/cek-status"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-[#006633]" />
                    <span>Cek Status Pendaftaran</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Tombol Aksi Utama di Layar HP */}
              <div className="px-4 pt-2 pb-4 space-y-2.5">
                <Link
                  href="/daftar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#006633] hover:bg-[#004d26] text-white shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Daftar PPDB Online</span>
                </Link>

                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Login Petugas TU</span>
                </Link>
              </div>
            </div>

            {/* Footer Kotak Informasi Yayasan di Dalam Drawer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 block">
                Kontak Resmi Yayasan ICA
              </span>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-[#006633]" />
                <span className="font-mono">0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-[#006633]" />
                <span>info@yayasan-ica.sch.id</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                &copy; {new Date().getFullYear()} Yayasan ICA
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

