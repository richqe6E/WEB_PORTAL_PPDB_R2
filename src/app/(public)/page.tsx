import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Heart,
  Baby,
  Smile,
  Megaphone,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PpdbSettingsRow, EducationLevelRow } from '@/types/database.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'PPDB Online PAUD & TK Yayasan Islam',
  description:
    'Penerimaan Peserta Didik Baru jenjang PAUD / Kelompok Bermain, TK A, dan TK B Yayasan Islam.',
}

export default async function PublicLandingPage() {
  const supabase = await createClient()

  // 1. Ambil pengaturan PPDB real-time
  const { data: settings } = await supabase
    .from('ppdb_settings')
    .select('*')
    .eq('id', 1)
    .single<PpdbSettingsRow>()

  // 2. Ambil daftar jenjang pendidikan
  const { data: levels } = await supabase
    .from('education_levels')
    .select('*')
    .order('sort_order', { ascending: true })
    .returns<EducationLevelRow[]>()

  const isPpdbOpen = settings?.is_ppdb_open || false
  const academicYear = settings?.academic_year || '2026/2027'

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. DYNAMIC ANNOUNCEMENT BANNER */}
      {settings?.announcement_banner_text && (
        <section aria-label="Pengumuman Penting" className="bg-[#FFEDB7] border-b border-[#F78100]/30 text-[#8B4500] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-center">
            <Megaphone className="w-4 h-4 text-[#F78100] flex-shrink-0 animate-bounce" />
            <span>{settings.announcement_banner_text}</span>
          </div>
        </section>
      )}

      {/* 2. HERO SECTION DENGAN INDIKATOR STATUS REAL-TIME */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-[#006633]/8 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* SISI KIRI: VALUE PROPOSITION & STATUS */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* STATUS BADGE REAL-TIME */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs transition-all">
                {isPpdbOpen ? (
                  <span className="flex items-center gap-2 text-[#006633] bg-[#D0FFD5] px-3 py-1 rounded-full border border-[#006633]/20">
                    <span className="w-2 h-2 rounded-full bg-[#006633] animate-ping" />
                    <Unlock className="w-3.5 h-3.5" />
                    PENDAFTARAN DIBUKA &bull; TA {academicYear}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-[#EE2737] bg-[#FEE2E2] px-3 py-1 rounded-full border border-[#EE2737]/20">
                    <Lock className="w-3.5 h-3.5" />
                    PENDAFTARAN DITUTUP &bull; TA {academicYear}
                  </span>
                )}
              </div>

              {/* HEADLINE UTAMA */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#2A2A2C] tracking-tight leading-[1.15]">
                Membangun Pondasi Karakter &amp; Kecerdasan Anak Sejak Dini
              </h1>

              {/* SUBTITLE */}
              <p className="text-base sm:text-lg text-[#667686] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Selamat datang di Portal Resmi Penerimaan Peserta Didik Baru (PPDB) jenjang{' '}
                <strong className="text-[#006633]">PAUD (Kelompok Bermain)</strong> dan{' '}
                <strong className="text-[#006633]">Taman Kanak-Kanak (TK A &amp; B)</strong> Yayasan Insan Cita. Lingkungan islami, ramah anak, dan terakreditasi resmi.
              </p>

              {/* ACTION BUTTONS (CALL TO ACTION) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                {isPpdbOpen ? (
                  <Link
                    href="/daftar"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold bg-[#F78100] hover:bg-[#d97706] text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Daftar Siswa Baru Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="w-full sm:w-auto p-3.5 rounded-xl bg-gray-100 border border-[#DFE3E9] text-xs text-[#667686] text-center">
                    <p className="font-semibold text-[#EE2737] flex items-center justify-center gap-1.5">
                      <Lock className="w-4 h-4" /> Pendaftaran Online Sedang Ditutup
                    </p>
                    <span className="block mt-0.5">
                      Jadwal Pembukaan: <strong>{settings?.schedule_registration_text || 'Segera'}</strong>
                    </span>
                  </div>
                )}

                <Link
                  href="/cek-status"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white border border-[#DFE3E9] text-[#2A2A2C] hover:bg-gray-50 hover:border-[#006633] shadow-xs transition-all"
                >
                  <Search className="w-4 h-4 text-[#006633]" />
                  <span>Cek Status Pendaftaran</span>
                </Link>
              </div>

              {/* TRUST BADGES KECIL */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#667686]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006633]" />
                  <span>Izin Resmi Kemendikbud</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006633]" />
                  <span>Kurikulum Merdeka Islami</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006633]" />
                  <span>Guru Berpengalaman &amp; Sabar</span>
                </div>
              </div>
            </div>

            {/* SISI KANAN: KARTU HIGHLIGHT TAHAPAN & IKHTISAR */}
            <div className="lg:col-span-5">
              <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-6 sm:p-8 shadow-md relative">
                <div className="flex items-center justify-between pb-4 border-b border-[#DFE3E9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#006633]/10 text-[#006633] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#2A2A2C]">Informasi PPDB Online</h3>
                      <span className="text-xs text-[#667686]">Tahun Ajaran {academicYear}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#006633]/10 text-[#006633]">
                    PAUD &amp; TK
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-[#DFE3E9]/60">
                    <div className="w-7 h-7 rounded-full bg-[#006633] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#2A2A2C] block">Pendaftaran Online Mudah</strong>
                      <span className="text-[#667686]">
                        Cukup siapkan NIK anak dan foto dokumen (KK, Akta, KTP Orang Tua).
                      </span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-[#DFE3E9]/60">
                    <div className="w-7 h-7 rounded-full bg-[#006633] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#2A2A2C] block">Verifikasi Berkas Cepat</strong>
                      <span className="text-[#667686]">
                        Admin TU memeriksa kelengkapan berkas secara langsung.
                      </span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-[#DFE3E9]/60">
                    <div className="w-7 h-7 rounded-full bg-[#006633] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#2A2A2C] block">Cek Hasil Kelulusan Mandiri</strong>
                      <span className="text-[#667686]">
                        Lihat status penerimaan secara transparan menggunakan NIK / No. Registrasi.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DFE3E9] text-center">
                  <Link
                    href="/#jadwal"
                    className="text-xs font-semibold text-[#006633] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Lihat Rincian Jadwal Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BAGIAN PILIHAN JENJANG PENDIDIKAN (#jenjang) */}
      <section id="jenjang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#006633] font-bold">
            Program Pendidikan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2C] mt-1">
            Pilihan Jenjang Pendidikan Yayasan
          </h2>
          <p className="text-xs sm:text-sm text-[#667686] mt-1.5">
            Kami menyediakan program belajar terstruktur yang dirancang sesuai tahapan perkembangan motorik, sosial, dan kognitif anak usia emas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels?.map((level) => {
            const isLevelActive = level.is_active && isPpdbOpen

            return (
              <div
                key={level.id}
                className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#006633] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#DFE3E9]">
                    <span className="px-2.5 py-1 rounded-md bg-[#006633]/10 text-[#006633] font-bold text-xs">
                      {level.code}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isLevelActive
                          ? 'bg-[#D0FFD5] text-[#006633]'
                          : 'bg-[#FEE2E2] text-[#EE2737]'
                      }`}
                    >
                      {isLevelActive ? 'Pendaftaran Dibuka' : 'Ditutup'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-lg text-[#2A2A2C]">{level.name}</h3>
                    <p className="text-xs text-[#006633] font-semibold mt-1">
                      {level.age_requirement_text}
                    </p>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-[#DFE3E9]/60 text-xs text-[#667686] space-y-1">
                    <div className="flex justify-between">
                      <span>Daya Tampung / Kuota:</span>
                      <strong className="text-[#2A2A2C]">{level.quota} Siswa</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Metode Belajar:</span>
                      <strong className="text-[#2A2A2C]">Sentra &amp; Bermain</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DFE3E9]">
                  {isLevelActive ? (
                    <Link
                      href={`/daftar?jenjang=${level.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-[#006633] hover:bg-[#004d26] text-white transition-all shadow-xs"
                    >
                      <span>Pilih &amp; Daftar Jenjang Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-lg text-xs font-semibold bg-gray-100 text-[#667686] cursor-not-allowed border border-[#DFE3E9]"
                    >
                      Saat Ini Tidak Dibuka
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. LINIMASA / JADWAL RESMI PPDB (#jadwal) */}
      <section id="jadwal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="card-base-pmb bg-gradient-to-br from-white to-[#F9FAFB] border border-[#DFE3E9] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#006633] font-bold">
              Tahapan Seleksi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2C] mt-1">
              Jadwal Resmi PPDB Online {academicYear}
            </h2>
            <p className="text-xs sm:text-sm text-[#667686] mt-1.5">
              Catat tanggal penting pelaksanaan tahapan penerimaan siswa baru agar tidak terlewat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TAHAP 1 */}
            <div className="p-6 rounded-xl bg-white border border-[#DFE3E9] shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#006633] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                1
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#006633] block">
                Tahap Pertama
              </span>
              <h3 className="font-bold text-base text-[#2A2A2C] mt-1">Pendaftaran Online</h3>
              <div className="mt-3 p-3 rounded-lg bg-[#006633]/5 border border-[#006633]/15">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#006633]">
                  <Calendar className="w-4 h-4" />
                  <span>{settings?.schedule_registration_text || '1 Mei - 30 Juni 2026'}</span>
                </div>
              </div>
              <p className="text-xs text-[#667686] mt-3 leading-relaxed">
                Pengisian formulir identitas anak dan orang tua serta unggah dokumen persyaratan digital.
              </p>
            </div>

            {/* TAHAP 2 */}
            <div className="p-6 rounded-xl bg-white border border-[#DFE3E9] shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#006633] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                2
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#006633] block">
                Tahap Kedua
              </span>
              <h3 className="font-bold text-base text-[#2A2A2C] mt-1">Verifikasi Dokumen</h3>
              <div className="mt-3 p-3 rounded-lg bg-[#006633]/5 border border-[#006633]/15">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#006633]">
                  <Calendar className="w-4 h-4" />
                  <span>{settings?.schedule_verification_text || '1 - 7 Juli 2026'}</span>
                </div>
              </div>
              <p className="text-xs text-[#667686] mt-3 leading-relaxed">
                Pemeriksaan kesesuaian berkas (KK, Akta Kelahiran, KTP) oleh panitia Tata Usaha Yayasan.
              </p>
            </div>

            {/* TAHAP 3 */}
            <div className="p-6 rounded-xl bg-white border border-[#DFE3E9] shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-[#F78100] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                3
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F78100] block">
                Tahap Ketiga
              </span>
              <h3 className="font-bold text-base text-[#2A2A2C] mt-1">Pengumuman &amp; Daftar Ulang</h3>
              <div className="mt-3 p-3 rounded-lg bg-[#F78100]/10 border border-[#F78100]/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C55200]">
                  <Calendar className="w-4 h-4" />
                  <span>{settings?.schedule_announcement_text || '10 Juli 2026'}</span>
                </div>
              </div>
              <p className="text-xs text-[#667686] mt-3 leading-relaxed">
                Pengumuman hasil akhir kelulusan dapat dicek mandiri melalui menu Cek Status Pendaftaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BANNER AJAKAN DAFTAR (CALL TO ACTION BANNER - REF POLNES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#006633] text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Mendaftarkan Buah Hati Anda?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Daftar sekarang sebelum kuota kelas terpenuhi. Hubungi layanan konsultasi kami jika membutuhkan informasi lebih lanjut mengenai program PAUD &amp; TK.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {isPpdbOpen && (
              <Link
                href="/daftar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#F78100] hover:bg-[#d97706] text-white transition-all shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Formulir Pendaftaran</span>
              </Link>
            )}
            <Link
              href="/cek-status"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

