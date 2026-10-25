import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  FileText,
  Search,
  Calendar,
  ArrowRight,
  GraduationCap,
  School,
  Lock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PpdbSettingsRow, EducationLevelRow } from '@/types/database.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portal PPDB Online PAUD & TK Yayasan ICA',
  description:
    'Portal Resmi Penerimaan Peserta Didik Baru (PPDB) jenjang PAUD, TK A, dan TK B Yayasan ICA.',
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
    <div className="space-y-12 lg:space-y-20 pb-16">
      {/* 1. HERO SECTION INSTITUSIONAL (CLEAN & TO-THE-POINT) */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-10 sm:pb-16 border-b border-[#DFE3E9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* SISI KIRI: VALUE PROPOSITION UTAMA */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-[#006633] block">
                Tahun Ajaran {academicYear} &bull; Yayasan ICA
              </span>

              {/* HEADLINE UTAMA (LUGAS & TEGAS SESUAI REVISI) */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#2A2A2C] tracking-tight leading-[1.2]">
                PORTAL PENERIMAAN PESERTA DIDIK BARU (PPDB) ONLINE
              </h1>

              {/* SUBTITLE RINGKAS */}
              <p className="text-sm sm:text-base text-[#667686] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Selamat datang di Portal Resmi PPDB Yayasan ICA. Melayani pendaftaran mandiri calon peserta didik baru jenjang{' '}
                <strong className="text-[#006633]">PAUD</strong>,{' '}
                <strong className="text-[#006633]">TK A</strong>, dan{' '}
                <strong className="text-[#006633]">TK B</strong> secara transparan, mudah, dan terintegrasi.
              </p>

              {/* ACTION BUTTONS (CALL TO ACTION) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                {isPpdbOpen ? (
                  <Link
                    href="/daftar"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-[#006633] hover:bg-[#004d26] text-white shadow-xs btn-pmb-interactive group"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Daftar Siswa Baru</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-700 text-center">
                    <p className="font-bold text-slate-800">Pendaftaran Online Sedang Ditutup</p>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Jadwal Pembukaan: <strong>{settings?.schedule_registration_text || 'Segera'}</strong>
                    </span>
                  </div>
                )}

                <Link
                  href="/cek-status"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-white border border-[#DFE3E9] text-[#2A2A2C] hover:bg-slate-50 hover:border-[#006633] shadow-xs transition-all"
                >
                  <Search className="w-4 h-4 text-[#006633]" />
                  <span>Cek Status Pendaftaran</span>
                </Link>
              </div>
            </div>

            {/* SISI KANAN: KARTU IKHTISAR INFORMASI PPDB (STANDAR SPMB POLNES) */}
            <div className="lg:col-span-5">
              <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-lg p-6 shadow-xs relative">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#DFE3E9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-[#006633] text-white flex items-center justify-center font-bold">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#2A2A2C]">Alur Pendaftaran PPDB</h3>
                      <span className="text-xs text-[#667686]">Yayasan ICA &bull; TA {academicYear}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] border border-slate-300 bg-slate-100 text-slate-800">
                    PAUD &amp; TK
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Langkah 1 */}
                  <div className="flex items-start gap-3 p-3 rounded-md bg-slate-50/70 border border-[#DFE3E9]">
                    <div className="w-6 h-6 rounded-md bg-[#006633] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#2A2A2C] block">Pengisian Formulir Online</strong>
                      <span className="text-[#667686]">
                        Siapkan NIK calon anak dan foto dokumen (Kartu Keluarga, Akta Kelahiran, KTP Orang Tua).
                      </span>
                    </div>
                  </div>

                  {/* Langkah 2 */}
                  <div className="flex items-start gap-3 p-3 rounded-md bg-slate-50/70 border border-[#DFE3E9]">
                    <div className="w-6 h-6 rounded-md bg-[#006633] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#2A2A2C] block">Verifikasi Berkas Panitia TU</strong>
                      <span className="text-[#667686]">
                        Petugas Tata Usaha memeriksa kelengkapan dan keabsahan berkas calon peserta didik.
                      </span>
                    </div>
                  </div>

                  {/* Langkah 3 */}
                  <div className="flex items-start gap-3 p-3 rounded-md bg-slate-50/70 border border-[#DFE3E9]">
                    <div className="w-6 h-6 rounded-md bg-[#006633] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#2A2A2C] block">Cek Hasil Kelulusan Mandiri</strong>
                      <span className="text-[#667686]">
                        Pantau status berkas dan penetapan kelulusan transparan menggunakan Nomor Registrasi atau NIK.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#DFE3E9] text-center">
                  <Link
                    href="/#jadwal"
                    className="text-xs font-semibold text-[#006633] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Lihat Jadwal Pelaksanaan Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BAGIAN PILIHAN JENJANG PENDIDIKAN (#jenjang) */}
      <section id="jenjang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider text-[#006633] font-bold">
            Program Pendidikan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2C] mt-1">
            Pilihan Jenjang Pendidikan Yayasan ICA
          </h2>
          <p className="text-xs sm:text-sm text-[#667686] mt-1">
            Program belajar terstruktur sesuai tahapan perkembangan motorik, sosial, dan kognitif anak usia dini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels?.map((level) => {
            const isLevelActive = level.is_active && isPpdbOpen

            return (
              <div
                key={level.id}
                className="card-base-pmb card-interactive bg-white border border-[#DFE3E9] rounded-lg p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* BADGE KOTAK TEGAS DENGAN KONTRAS TINGGI SESUAI REVISI 7 */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#DFE3E9]">
                    <span className="px-2.5 py-1 rounded-[4px] border border-slate-300 bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider">
                      {level.code}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-[4px] border ${
                        isLevelActive
                          ? 'bg-[#006633] text-white border-[#004d26] shadow-2xs'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {isLevelActive ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-base text-[#2A2A2C] group-hover:text-[#006633] transition-colors">{level.name}</h3>
                    <p className="text-xs text-[#006633] font-semibold mt-0.5">
                      {level.age_requirement_text}
                    </p>
                  </div>

                  <div className="mt-4 p-3 rounded-md bg-slate-50 border border-[#DFE3E9] text-xs text-[#667686] space-y-1.5">
                    <div className="flex justify-between">
                      <span>Daya Tampung / Kuota:</span>
                      <strong className="text-[#2A2A2C]">{level.quota} Siswa</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Metode Pembelajaran:</span>
                      <strong className="text-[#2A2A2C]">Sentra &amp; Karakter</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#DFE3E9]">
                  {isLevelActive ? (
                    <Link
                      href={`/daftar?jenjang=${level.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-bold bg-[#006633] hover:bg-[#004d26] text-white btn-pmb-interactive shadow-xs group/btn"
                    >
                      <span>Pilih &amp; Daftar Jenjang Ini</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-500 cursor-not-allowed border border-[#DFE3E9]"
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

      {/* 3. LINIMASA / JADWAL RESMI PPDB (#jadwal) */}
      <section id="jadwal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-wider text-[#006633] font-bold">
              Tahapan Seleksi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2C] mt-1">
              Jadwal Resmi PPDB Online {academicYear}
            </h2>
            <p className="text-xs sm:text-sm text-[#667686] mt-1">
              Jadwal pelaksanaan tahapan penerimaan siswa baru Yayasan ICA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TAHAP 1 */}
            <div className="p-5 rounded-md bg-slate-50/80 border border-[#DFE3E9] relative">
              <div className="w-8 h-8 rounded-md bg-[#006633] text-white flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#006633] block">
                Tahap Pertama
              </span>
              <h3 className="font-bold text-sm text-[#2A2A2C] mt-0.5">Pendaftaran Online</h3>
              <div className="mt-2.5 p-2.5 rounded-md bg-white border border-[#DFE3E9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#006633]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{settings?.schedule_registration_text || '1 Mei - 30 Juni 2026'}</span>
                </div>
              </div>
              <p className="text-xs text-[#667686] mt-2.5 leading-relaxed">
                Pengisian formulir identitas anak dan orang tua serta unggah dokumen persyaratan digital.
              </p>
            </div>

            {/* TAHAP 2 */}
            <div className="p-5 rounded-md bg-slate-50/80 border border-[#DFE3E9] relative">
              <div className="w-8 h-8 rounded-md bg-[#006633] text-white flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#006633] block">
                Tahap Kedua
              </span>
              <h3 className="font-bold text-sm text-[#2A2A2C] mt-0.5">Verifikasi Dokumen</h3>
              <div className="mt-2.5 p-2.5 rounded-md bg-white border border-[#DFE3E9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#006633]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{settings?.schedule_verification_text || '1 - 7 Juli 2026'}</span>
                </div>
              </div>
              <p className="text-xs text-[#667686] mt-2.5 leading-relaxed">
                Pemeriksaan kesesuaian berkas (KK, Akta Kelahiran, KTP) oleh panitia Tata Usaha Yayasan ICA.
              </p>
            </div>

            {/* TAHAP 3 */}
            <div className="p-5 rounded-md bg-slate-50/80 border border-[#DFE3E9] relative">
              <div className="w-8 h-8 rounded-md bg-[#006633] text-white flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#006633] block">
                Tahap Ketiga
              </span>
              <h3 className="font-bold text-sm text-[#2A2A2C] mt-0.5">Pengumuman &amp; Daftar Ulang</h3>
              <div className="mt-2.5 p-2.5 rounded-md bg-white border border-[#DFE3E9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#006633]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{settings?.schedule_announcement_text || '10 Juli 2026'}</span>
                </div>
              </div>
              <p className="text-xs text-[#667686] mt-2.5 leading-relaxed">
                Pengumuman hasil seleksi dapat dicek secara mandiri melalui menu Cek Status Pendaftaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BANNER AJAKAN DAFTAR (CALL TO ACTION BANNER - REF POLNES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-lg bg-[#006633] text-white shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Pendaftaran Siswa Baru Yayasan ICA
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Daftarkan putra-putri Anda sekarang untuk jenjang PAUD &amp; TK secara online. Hubungi kontak panitia jika membutuhkan panduan lebih lanjut.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {isPpdbOpen && (
              <Link
                href="/daftar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold bg-[#F78100] hover:bg-[#d97706] text-white transition-all shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Formulir Pendaftaran</span>
              </Link>
            )}
            <Link
              href="/cek-status"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all"
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
