'use client'

export const dynamic = 'force-dynamic'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  LogIn,
} from 'lucide-react'
import { signInAction, type AuthActionResponse } from '@/actions/auth-actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResponse | null, FormData>(
    signInAction,
    null
  )
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Tombol Kembali ke Portal Publik */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-600 hover:text-[#006633] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Beranda</span>
          </Link>
        </div>

        {/* Kartu Login */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          {/* Header Aksen Hijau POLNES */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#006633]" />

          <div className="text-center pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#006633] flex items-center justify-center mx-auto mb-3 shadow-xs border border-emerald-100">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-[#006633] mb-2">
              Panel Autentikasi Resmi
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Login Petugas Tata Usaha (TU)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan kredensial akun panitia untuk mengelola pendaftar, saklar PPDB, dan jadwal seleksi.
            </p>
          </div>

          {/* Notifikasi Pesan Error jika Login Gagal */}
          {state && !state.success && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{state.message}</div>
            </div>
          )}

          {/* Form Login */}
          <form action={formAction} className="mt-6 space-y-4">
            {/* Input Email */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
              >
                Alamat Email Petugas TU
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@yayasan.sch.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006633] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
              >
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006633] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Submit Login */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#006633] hover:bg-[#004d26] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Dashboard TU</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Catatan Keamanan */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Akses portal ini dipantau demi perlindungan data pribadi dan dokumen resmi calon siswa.
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} Yayasan Islam Amanah Ummat. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  )
}
