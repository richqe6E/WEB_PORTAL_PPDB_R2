import React from 'react'
import Link from 'next/link'
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  ApplicantsTable,
  type ApplicantWithLevel,
} from '@/components/admin/applicants-table'
import type { EducationLevelRow } from '@/types/database.types'

export const dynamic = 'force-dynamic'

export default async function AdminPendaftarPage() {
  const supabase = await createClient()

  // 1. Ambil seluruh data applicants dengan join education_levels
  const { data: rawApplicants, error: applicantsError } = await supabase
    .from('applicants')
    .select('*, education_level:education_levels(name, code)')
    .order('created_at', { ascending: false })

  if (applicantsError) {
    console.error('Error fetching applicants:', applicantsError)
  }

  // 2. Ambil seluruh master data jenjang aktif maupun non-aktif
  const { data: rawLevels, error: levelsError } = await supabase
    .from('education_levels')
    .select('*')
    .order('sort_order', { ascending: true })

  if (levelsError) {
    console.error('Error fetching education levels:', levelsError)
  }

  const applicants = (rawApplicants || []) as unknown as ApplicantWithLevel[]
  const levels = (rawLevels || []) as EducationLevelRow[]

  // Hitung ringkasan statistik cepat
  const totalCount = applicants.length
  const waitingVerificationCount = applicants.filter(
    (a) => a.verification_status === 'MENUNGGU_VERIFIKASI'
  ).length
  const needsRevisionCount = applicants.filter(
    (a) => a.verification_status === 'PERLU_REVISI'
  ).length
  const verifiedCount = applicants.filter(
    (a) => a.verification_status === 'TERVERIFIKASI'
  ).length
  const acceptedCount = applicants.filter(
    (a) => a.selection_status === 'DITERIMA'
  ).length

  return (
    <div className="space-y-6">
      {/* HEADER UTAMA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-[#006633] transition-colors">
              Dashboard Admin TU
            </Link>
            <span>/</span>
            <span className="text-slate-800">Manajemen Calon Siswa</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Data Calon Peserta Didik Baru (PPDB)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Verifikasi kelengkapan berkas fisik/digital, berikan catatan perbaikan, dan tetapkan hasil
            akhir seleksi pendaftar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pengaturan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Pengaturan PPDB</span>
          </Link>
        </div>
      </div>

      {/* KARTU RINGKASAN STATISTIK CEPAT (5 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Pendaftar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wide">Total Calon Siswa</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Seluruh Jenjang</span>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white rounded-xl border border-amber-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wide">Antrean Verifikasi</span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900">{waitingVerificationCount}</div>
          <span className="text-[11px] text-amber-700 mt-0.5 block">Perlu diperiksa TU</span>
        </div>

        {/* Perlu Revisi */}
        <div className="bg-white rounded-xl border border-rose-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wide">Perlu Revisi</span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-900">{needsRevisionCount}</div>
          <span className="text-[11px] text-rose-700 mt-0.5 block">Berkas belum pas</span>
        </div>

        {/* Berkas Sah & Terverifikasi */}
        <div className="bg-white rounded-xl border border-emerald-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#006633] mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wide">Terverifikasi</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-[#006633]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950">{verifiedCount}</div>
          <span className="text-[11px] text-[#006633] mt-0.5 block">Dokumen lengkap</span>
        </div>

        {/* Lulus Diterima */}
        <div className="bg-white rounded-xl border border-emerald-300 p-4 shadow-xs bg-gradient-to-br from-white to-emerald-50/40 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-800 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wide">Lulus Diterima</span>
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950">{acceptedCount}</div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">Siap daftar ulang</span>
        </div>
      </div>

      {/* TABEL DATA PENDAFTAR DENGAN FILTER & SEARCH */}
      <ApplicantsTable initialApplicants={applicants} levels={levels} />
    </div>
  )
}
