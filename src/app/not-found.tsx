import React from 'react'
import Link from 'next/link'
import { Home, Search, AlertCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-[#DFE3E9] p-8 text-center shadow-sm">
        {/* Ikon 404 */}
        <div className="w-14 h-14 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#006633] border border-emerald-300 mb-3">
          Error 404 - Halaman Tidak Ditemukan
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Halaman yang Anda Cari Tidak Tersedia
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Mohon maaf, tautan yang Anda tuju mungkin salah ketik, telah dipindahkan, atau telah dinonaktifkan oleh pengelola portal.
        </p>

        {/* Tombol Aksi */}
        <div className="space-y-2.5">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#006633] hover:bg-[#004d26] text-white font-bold text-sm shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </Link>

          <Link
            href="/cek-status"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-white border border-[#DFE3E9] hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Cek Status Pendaftaran Calon Siswa</span>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 mt-6">
          Yayasan ICA &bull; Portal PPDB Online PAUD & TK
        </p>
      </div>
    </div>
  )
}

