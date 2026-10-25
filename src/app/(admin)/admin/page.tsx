import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  ArrowRight,
  School,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  FileCheck,
  UserX,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PpdbSettingsRow, EducationLevelRow, ApplicantRow } from '@/types/database.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard Overview | Admin TU PPDB',
  description: 'Ringkasan pendaftaran siswa baru jenjang PAUD & TK Yayasan.',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Ambil data pengaturan PPDB
  const { data: settings } = await supabase
    .from('ppdb_settings')
    .select('*')
    .eq('id', 1)
    .single<PpdbSettingsRow>()

  // 2. Ambil data jenjang pendidikan
  const { data: levels } = await supabase
    .from('education_levels')
    .select('*')
    .order('sort_order', { ascending: true })
    .returns<EducationLevelRow[]>()

  // 3. Ambil seluruh data pendaftar untuk perhitungan statistik
  const { data: applicants } = await supabase
    .from('applicants')
    .select('id, level_id, verification_status, selection_status')
    .returns<Pick<ApplicantRow, 'id' | 'level_id' | 'verification_status' | 'selection_status'>[]>()

  const totalApplicants = applicants?.length || 0

  const pendingVerification =
    applicants?.filter((a) => a.verification_status === 'MENUNGGU_VERIFIKASI').length || 0

  const verifiedCount =
    applicants?.filter((a) => a.verification_status === 'TERVERIFIKASI').length || 0

  const revisionCount =
    applicants?.filter((a) => a.verification_status === 'PERLU_REVISI').length || 0

  const acceptedCount =
    applicants?.filter((a) => a.selection_status === 'DITERIMA').length || 0

  const rejectedCount =
    applicants?.filter((a) => a.selection_status === 'DITOLAK').length || 0

  // Hitung jumlah pendaftar per jenjang
  const levelCounts: Record<string, number> = {}
  if (applicants) {
    for (const a of applicants) {
      levelCounts[a.level_id] = (levelCounts[a.level_id] || 0) + 1
    }
  }

  const isPpdbOpen = settings?.is_ppdb_open || false
  const isAnnouncementOpen = settings?.is_announcement_open || false

  return (
    <div className="space-y-8">
      {/* 1. STATUS PPDB BANNER */}
      <div
        className={`p-6 rounded-xl border shadow-sm transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
          isPpdbOpen
            ? 'bg-[#006633]/5 border-[#006633]/30'
            : 'bg-[#EE2737]/5 border-[#EE2737]/20'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${
              isPpdbOpen
                ? 'bg-[#006633] text-white shadow-sm'
                : 'bg-[#EE2737] text-white shadow-sm'
            }`}
          >
            {isPpdbOpen ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] border ${
                  isPpdbOpen
                    ? 'bg-emerald-50 text-[#006633] border-emerald-300'
                    : 'bg-rose-50 text-[#EE2737] border-rose-300'
                }`}
              >
                {isPpdbOpen ? 'PPDB DIBUKA' : 'PPDB DITUTUP'}
              </span>
              <span className="text-xs text-[#667686]">
                Tahun Ajaran: <strong>{settings?.academic_year || '2026/2027'}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#2A2A2C] mt-1">
              {isPpdbOpen
                ? 'Pendaftaran Online Sedang Aktif Menerima Siswa'
                : 'Pendaftaran Online Sedang Ditutup Untuk Umum'}
            </h2>
            <p className="text-xs text-[#667686] mt-0.5 max-w-2xl">
              {isPpdbOpen
                ? 'Formulir pendaftaran publik (/daftar) dapat diakses oleh orang tua calon murid. Berkas yang masuk akan tercatat di menu Data Pendaftar.'
                : 'Akses pendaftaran dikunci dan dicegah secara langsung oleh keamanan Row Level Security database. Buka pendaftaran melalui menu Pengaturan.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link
            href="/admin/pengaturan"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-[#DFE3E9] text-[#2A2A2C] hover:bg-gray-50 shadow-sm transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-[#006633]" />
            <span>Kelola Pengaturan</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#006633] text-white hover:bg-[#004d26] shadow-sm transition-all"
          >
            <span>Lihat Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. STATISTIC CARDS (4-KOLOM DENGAN DESAIN POLNES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Calon Siswa */}
        <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667686] uppercase tracking-wider">
              Total Calon Siswa
            </span>
            <div className="p-2 rounded-lg bg-[#006633]/10 text-[#006633]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[#2A2A2C]">{totalApplicants}</span>
            <span className="text-xs text-[#667686] ml-2">Pendaftar</span>
          </div>
          <p className="text-xs text-[#667686] mt-2 pt-2 border-t border-[#DFE3E9]">
            Akumulasi berkas masuk semua jenjang
          </p>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C55200] uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <div className="p-2 rounded-lg bg-[#FFEDB7] text-[#C55200]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[#2A2A2C]">{pendingVerification}</span>
            <span className="text-xs text-[#C55200] ml-2 font-medium">Perlu Tindakan TU</span>
          </div>
          <p className="text-xs text-[#667686] mt-2 pt-2 border-t border-[#DFE3E9]">
            Berkas baru siap dicek oleh Admin
          </p>
        </div>

        {/* Berkas Terverifikasi */}
        <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#006633] uppercase tracking-wider">
              Berkas Terverifikasi
            </span>
            <div className="p-2 rounded-lg bg-[#D0FFD5] text-[#006633]">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-[#006633]">{verifiedCount}</span>
            <span className="text-xs text-[#667686] ml-2 font-medium">Siswa Valid</span>
          </div>
          <p className="text-xs text-[#667686] mt-2 pt-2 border-t border-[#DFE3E9]">
            KK, Akta, dan KTP sesuai syarat
          </p>
        </div>

        {/* Hasil Seleksi (Diterima / Ditolak) */}
        <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
              Kelulusan Siswa
            </span>
            <div className="p-2 rounded-lg bg-[#DBE4FA] text-[#1E3A8A]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-extrabold text-[#006633]">{acceptedCount}</span>
              <span className="text-xs text-[#006633] ml-1 font-semibold">Diterima</span>
            </div>
            <span className="text-gray-300 font-light">/</span>
            <div>
              <span className="text-lg font-bold text-[#EE2737]">{rejectedCount}</span>
              <span className="text-xs text-[#EE2737] ml-1 font-semibold">Ditolak</span>
            </div>
          </div>
          <p className="text-xs text-[#667686] mt-2 pt-2 border-t border-[#DFE3E9]">
            {isAnnouncementOpen ? 'Pengumuman publik aktif' : 'Pengumuman masih ditutup'}
          </p>
        </div>
      </div>

      {/* 3. KUOTA & PENDAFTAR PER JENJANG (PAUD & TK) */}
      <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-6 border-b border-[#DFE3E9]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#006633]/10 text-[#006633]">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2A2A2C]">Kapasitas & Kuota Penerimaan Jenjang</h2>
              <p className="text-xs text-[#667686]">
                Perbandingan jumlah pendaftar terhadap daya tampung masing-masing jenjang.
              </p>
            </div>
          </div>

          <Link
            href="/admin/pendaftar"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006633] hover:text-[#004d26]"
          >
            <span>Buka Seluruh Pendaftar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels?.map((level) => {
            const count = levelCounts[level.id] || 0
            const percentage = Math.min(Math.round((count / level.quota) * 100), 100)

            return (
              <div
                key={level.id}
                className="p-5 rounded-xl border border-[#DFE3E9] bg-white hover:border-[#006633]/40 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#DFE3E9]/60">
                  <div>
                    <span className="font-bold text-base text-[#2A2A2C] block">{level.name}</span>
                    <span className="text-xs text-[#667686]">{level.age_requirement_text}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-[4px] border ${
                      level.is_active
                        ? 'bg-emerald-50 text-[#006633] border-emerald-300'
                        : 'bg-rose-50 text-[#EE2737] border-rose-300'
                    }`}
                  >
                    {level.is_active ? 'Dibuka' : 'Ditutup'}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-medium text-[#2A2A2C] mb-1.5">
                    <span>
                      Terisi: <strong>{count}</strong> dari {level.quota} Kuota
                    </span>
                    <span className="font-bold text-[#006633]">{percentage}%</span>
                  </div>

                  {/* Progress Bar SPMB Theme */}
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 100
                          ? 'bg-[#EE2737]'
                          : percentage >= 75
                          ? 'bg-[#F78100]'
                          : 'bg-[#006633]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DFE3E9]/60 flex items-center justify-between text-xs">
                  <span className="text-[#667686]">Sisa Kuota:</span>
                  <span className="font-bold text-[#2A2A2C]">
                    {Math.max(level.quota - count, 0)} Kursi
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

