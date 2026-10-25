import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Lock,
  Calendar,
  MessageCircle,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Search,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { RegistrationWizard } from '@/components/public/registration-wizard'
import type { EducationLevelRow, PpdbSettingsRow } from '@/types/database.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran Siswa Baru PAUD & TK | PPDB Yayasan',
  description:
    'Formulir pendaftaran online penerimaan peserta didik baru (PPDB) jenjang PAUD, TK A, dan TK B Yayasan Islam Amanah.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DaftarPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const preselectedLevel =
    typeof resolvedSearchParams.jenjang === 'string'
      ? resolvedSearchParams.jenjang
      : undefined

  const supabase = await createClient()

  // Ambil data pengaturan PPDB real-time
  const { data: settingsData } = await supabase
    .from('ppdb_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const settings = settingsData as PpdbSettingsRow | null

  // Ambil daftar jenjang aktif terurut
  const { data: levelsData } = await supabase
    .from('education_levels')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const activeLevels = (levelsData || []) as EducationLevelRow[]

  // JIKA SAKLAR PPDB SEDANG DITUTUP OLEH ADMIN TU
  if (!settings?.is_ppdb_open) {
    return (
      <div className="bg-[#f8fafc] min-h-[calc(100vh-200px)] py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb navigasi */}
          <nav className="mb-6 flex items-center space-x-2 text-sm text-slate-500">
            <Link
              href="/"
              className="hover:text-[#006633] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Pendaftaran Siswa Baru</span>
          </nav>

          {/* Kartu Status Tertutup */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top Accent Strip */}
            <div className="h-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 text-rose-600 mb-6 border-4 border-rose-100 ring-8 ring-rose-50/50">
                <Lock className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-100 text-rose-800 border border-rose-200 mb-4">
                Pendaftaran Sedang Ditutup
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                Penerimaan Peserta Didik Baru Belum / Tidak Dibuka
              </h1>

              <p className="text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
                Mohon maaf Ayah/Bunda, saat ini sistem pendaftaran online Tahun Ajaran{' '}
                <span className="font-semibold text-slate-800">
                  {settings?.academic_year || '2026/2027'}
                </span>{' '}
                sedang ditutup sementara oleh Panitia PPDB atau masa penerimaan berkas telah berakhir.
              </p>

              {/* Box Rincian Jadwal Resmi */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left max-w-lg mx-auto mb-8">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200">
                  <Calendar className="w-5 h-5 text-[#006633]" />
                  <h3 className="font-bold text-slate-900 text-sm tracking-wide">
                    Jadwal Resmi Agenda PPDB
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-500">Masa Pendaftaran Berkas:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {settings?.schedule_registration_text || 'Menunggu jadwal resmi'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-500">Verifikasi Dokumen:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {settings?.schedule_verification_text || 'Menunggu jadwal resmi'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-500">Pengumuman Kelulusan:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {settings?.schedule_announcement_text || 'Menunggu jadwal resmi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Tindakan */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Beranda
                </Link>

                <Link
                  href="/cek-status"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
                >
                  <Search className="w-4 h-4 text-[#006633]" />
                  Cek Status Pendaftaran Anda
                </Link>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB,%20saya%20ingin%20menanyakan%20informasi%20jadwal%20pembukaan%20pendaftaran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Panitia
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // JIKA SAKLAR PPDB SEDANG DIBUKA
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-200px)] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs & Judul Halaman */}
        <div className="mb-6">
          <nav className="mb-3 flex items-center space-x-2 text-xs md:text-sm text-slate-500">
            <Link
              href="/"
              className="hover:text-[#006633] inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Beranda
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Formulir Pendaftaran Siswa Baru</span>
          </nav>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
            {/* Background Decorative Accent */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-emerald-50 pointer-events-none" />
            <div className="absolute top-0 left-0 w-2 h-full bg-[#006633]" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#006633] border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tahun Ajaran {settings?.academic_year || '2026/2027'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Jenjang PAUD & TK
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Pendaftaran Calon Peserta Didik Baru
              </h1>

              <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
                Silakan lengkapi formulir pendaftaran 4 langkah berikut dengan teliti. Siapkan berkas
                Kartu Keluarga (KK), Akta Kelahiran anak, dan KTP orang tua untuk proses unggah dokumen.
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Form Multi-Langkah */}
        <RegistrationWizard
          levels={activeLevels}
          academicYear={settings?.academic_year || '2026/2027'}
          preselectedLevelId={preselectedLevel}
        />
      </div>
    </div>
  )
}
