'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Calendar,
  User,
  GraduationCap,
  Copy,
  Printer,
  MessageCircle,
  ArrowLeft,
  HelpCircle,
  FileText,
  Building,
} from 'lucide-react'
import { checkApplicantStatusAction } from '@/actions/registration-actions'
import { formatDateIndo } from '@/lib/utils'
import type { ApplicantStatusResult } from '@/types/database.types'
import { toast } from 'sonner'

function CekStatusContent() {
  const searchParams = useSearchParams()
  const initialRef = searchParams.get('ref') || ''

  const [identifier, setIdentifier] = useState<string>(initialRef)
  const [applicantData, setApplicantData] = useState<ApplicantStatusResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  // Otomatis mencari jika ada query parameter ?ref=... dari tautan bukti pendaftaran
  useEffect(() => {
    if (initialRef) {
      setIdentifier(initialRef)
      handleSearchQuery(initialRef)
    }
  }, [initialRef])

  const handleSearchQuery = (query: string) => {
    const clean = query.trim()
    if (!clean) {
      toast.error('Masukkan Nomor Registrasi atau NIK Anak terlebih dahulu.')
      return
    }

    setErrorMessage('')
    setHasSearched(true)

    startTransition(async () => {
      const res = await checkApplicantStatusAction(clean)
      if (res.success && res.data) {
        setApplicantData(res.data)
        setErrorMessage('')
      } else {
        setApplicantData(null)
        setErrorMessage(
          res.message ||
            'Data pendaftaran tidak ditemukan. Mohon periksa kembali Nomor Registrasi atau NIK yang Anda masukkan.'
        )
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearchQuery(identifier)
  }

  const handleCopyRegistrationNumber = (num: string) => {
    navigator.clipboard.writeText(num)
    toast.success(`Nomor registrasi ${num} disalin ke clipboard!`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-200px)] py-8 md:py-12 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigasi (Disembunyikan saat dicetak) */}
        <nav className="mb-6 flex items-center space-x-2 text-xs md:text-sm text-slate-500 print:hidden">
          <Link
            href="/"
            className="hover:text-[#006633] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Cek Status Pendaftaran</span>
        </nav>

        {/* Header Section (Disembunyikan saat dicetak) */}
        <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-lg p-6 sm:p-8 shadow-xs mb-8 print:hidden">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2C] tracking-tight mb-2">
              Cek Status Pendaftaran
            </h1>
            <p className="text-sm text-[#667686] leading-relaxed">
              Masukkan Nomor Registrasi PPDB atau 16 digit NIK anak Anda untuk melihat status verifikasi berkas dan hasil seleksi.
            </p>
          </div>

          {/* Form Pencarian */}
          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="identifier-input"
              className="block text-xs md:text-sm font-bold text-slate-800 mb-2"
            >
              Nomor Registrasi PPDB atau 16 Digit NIK Anak
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  id="identifier-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: PPDB-2026-0001 atau 3201012345670001"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006633] focus:border-transparent transition-all shadow-sm text-sm md:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !identifier.trim()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#006633] hover:bg-[#004d26] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm md:text-base transition-all shadow-sm shrink-0"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Periksa Status</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Masukkan Nomor Registrasi yang tertera pada bukti pendaftaran Anda atau NIK anak
              sesuai Kartu Keluarga.
            </p>
          </form>
        </div>

        {/* PESAN ERROR / TIDAK DITEMUKAN */}
        {hasSearched && !isPending && errorMessage && (
          <div className="bg-white rounded-2xl border border-rose-200 p-6 md:p-8 shadow-sm mb-8 text-center print:hidden">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Data Tidak Ditemukan</h3>
            <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed mb-6">
              {errorMessage}
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800">Petunjuk Pengecekan:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Pastikan format Nomor Registrasi tepat (contoh: <code>PPDB-2026-0001</code>).</li>
                <li>Jika menggunakan NIK, pastikan tepat 16 digit angka tanpa spasi/tanda hubung.</li>
                <li>Jika Anda baru saja mendaftar, pastikan proses unggah formulir telah tuntas.</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB,%20saya%20mengalami%20kendala%20saat%20cek%20status%20pendaftaran"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Bantuan WhatsApp Panitia
              </a>
            </div>
          </div>
        )}

        {/* HASIL DATA PENDAFTARAN DITEMUKAN */}
        {applicantData && !isPending && (
          <div className="space-y-6">
            {/* Header Cetak Formal (Hanya tampil saat dicetak) */}
            <div className="hidden print:block pb-4 mb-4 border-b-2 border-slate-900 text-center">
              <h2 className="text-xl font-bold tracking-tight uppercase text-slate-900">
                YAYASAN ICA
              </h2>
              <p className="text-xs text-slate-700">
                PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB) ONLINE PAUD &amp; TK
              </p>
              <p className="text-[11px] text-slate-500">
                Jl. Pendidikan Karakter No. 12, Kompleks Bina Bangsa, Samarinda | Telp/WA: 0812-3456-7890
              </p>
              <div className="mt-2 text-sm font-bold uppercase underline">
                LEMBAR STATUS RESMI PENDAFTARAN &amp; SELEKSI
              </div>
            </div>

            {/* KARTU IDENTITAS PENDAFTAR (STANDAR POLNES, BEBAS GARIS WARNA SAMPING/ATAS) */}
            <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-lg p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nomor Registrasi Resmi
                  </span>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="font-mono text-xl md:text-2xl font-black text-slate-900 tracking-wider">
                      {applicantData.registration_number}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyRegistrationNumber(applicantData.registration_number)
                      }
                      title="Salin Nomor Registrasi"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors print:hidden cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                    <GraduationCap className="w-4 h-4 text-[#006633]" />
                    Jenjang {applicantData.level_name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Terdaftar: {formatDateIndo(applicantData.created_at)}
                  </span>
                </div>
              </div>

                {/* Nama Calon Siswa */}
                <div className="pt-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Nama Lengkap Calon Siswa
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                    {applicantData.child_full_name}
                  </h2>
                </div>
              </div>

            {/* STATUS 1: VERIFIKASI BERKAS OLEH PANITIA TATA USAHA (TU) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base md:text-lg">
                    Tahap 1: Verifikasi Dokumen & Administrasi
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Verifikator: Panitia TU</span>
              </div>

              {/* Status Badge & Penjelasan */}
              {applicantData.verification_status === 'TERVERIFIKASI' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-emerald-100 text-[#006633] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-[#006633] text-base">
                          BERKAS SAH & TERVERIFIKASI
                        </span>
                        <span className="px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Lengkap
                        </span>
                      </div>
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        Alhamdulillah, seluruh dokumen persyaratan (Kartu Keluarga, Akta Kelahiran, dan
                        KTP Orang Tua) telah diperiksa oleh Panitia TU dan dinyatakan sah, lengkap,
                        serta memenuhi ketentuan administrasi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {applicantData.verification_status === 'MENUNGGU_VERIFIKASI' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-amber-900 text-base">
                          SEDANG DALAM ANTREAN VERIFIKASI
                        </span>
                        <span className="px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Proses TU
                        </span>
                      </div>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Berkas pendaftaran Anda telah berhasil tersimpan di sistem kami. Saat ini Panitia
                        Tata Usaha (TU) sedang memeriksa keabsahan dan kejelasan dokumen yang diunggah.
                        Pemeriksaan berkas dilakukan berurutan sesuai nomor pendaftaran.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {applicantData.verification_status === 'PERLU_REVISI' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-rose-900 text-base">
                          DOKUMEN MEMERLUKAN PERBAIKAN / REVISI
                        </span>
                        <span className="px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          Tindakan Diperlukan
                        </span>
                      </div>
                      <p className="text-sm text-rose-800 leading-relaxed">
                        Panitia mendapati dokumen persyaratan yang Anda unggah belum jelas, terpotong,
                        atau memerlukan konfirmasi data lanjutan. Mohon perhatikan catatan verifikasi di
                        bawah ini.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CATATAN PANITIA TU JIKA ADA */}
              {applicantData.admin_notes && (
                <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-4 text-slate-800">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Catatan Khusus dari Verifikator TU:
                  </span>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-800">
                    "{applicantData.admin_notes}"
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    * Silakan hubungi nomor WhatsApp Panitia dengan menyertakan Nomor Registrasi Anda
                    untuk pengiriman berkas perbaikan.
                  </p>
                </div>
              )}
            </div>

            {/* STATUS 2: PENGUMUMAN HASIL KELULUSAN / SELEKSI AKHIR */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#006633] font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base md:text-lg">
                    Tahap 2: Hasil Akhir Seleksi Penerimaan Siswa Baru
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Keputusan: Panitia PPDB</span>
              </div>

              {/* LOGIKA PENGUMUMAN SESUAI SAKLAR ADMIN TU */}
              {!applicantData.is_announcement_open ? (
                // SAKLAR PENGUMUMAN MASIH DITUTUP
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-blue-950 mb-1">
                    PENGUMUMAN RESMI KELULUSAN BELUM DIBUKA
                  </h4>
                  <p className="text-xs md:text-sm text-blue-800 max-w-lg mx-auto leading-relaxed">
                    Pengumuman penetapan kelulusan calon peserta didik baru belum dirilis secara serentak
                    oleh panitia. Silakan pantau pengumuman resmi sesuai tanggal jadwal yang tertera di
                    halaman beranda website.
                  </p>
                </div>
              ) : (
                // SAKLAR PENGUMUMAN TELAH DIBUKA RESMI
                <div>
                  {applicantData.selection_status === 'DITERIMA' && (
                    <div className="card-base-pmb bg-white border-2 border-emerald-600 rounded-lg p-6 md:p-8 text-center relative">
                      <div className="w-14 h-14 rounded-lg bg-[#006633] text-white flex items-center justify-center mx-auto mb-4 shadow-xs">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <span className="inline-block px-3 py-1 rounded-[4px] text-xs font-bold tracking-wider uppercase bg-[#006633] text-white mb-3">
                        KEPUTUSAN RESMI PANITIA
                      </span>
                      <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                        SELAMAT! CALON SISWA DINYATAKAN DITERIMA
                      </h4>
                      <p className="text-sm md:text-base text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
                        Selamat kepada ananda{' '}
                        <span className="font-extrabold text-slate-900">
                          {applicantData.child_full_name}
                        </span>
                        , telah berhasil lulus seleksi penerimaan peserta didik baru jenjang{' '}
                        <span className="font-extrabold text-slate-900">
                          {applicantData.level_name}
                        </span>
                        .
                      </p>

                      {/* Petunjuk Daftar Ulang */}
                      <div className="bg-white/90 border border-emerald-300 rounded-xl p-5 text-left max-w-lg mx-auto text-xs md:text-sm text-slate-700 space-y-2.5 shadow-sm">
                        <div className="font-bold text-[#006633] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Petunjuk Tahapan Daftar Ulang:
                        </div>
                        <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                          <li>Cetak atau simpan lembar bukti penetapan ini sebagai berkas registrasi.</li>
                          <li>
                            Lakukan konfirmasi kehadiran dan pengisian berkas komitmen sekolah melalui
                            kantor Tata Usaha atau nomor resmi panitia.
                          </li>
                          <li>
                            Pemberitahuan perlengkapan seragam dan orientasi awal siswa akan diinfokan
                            melalui grup WhatsApp resmi.
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {applicantData.selection_status === 'DITOLAK' && (
                    <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 md:p-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <h4 className="text-xl font-extrabold text-slate-900 mb-2">
                        MOHON MAAF, BELUM DAPAT DITERIMA
                      </h4>
                      <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Berdasarkan evaluasi kuota daya tampung kelas serta pertimbangan hasil verifikasi
                        administrasi, ananda{' '}
                        <span className="font-semibold text-slate-800">
                          {applicantData.child_full_name}
                        </span>{' '}
                        belum dapat kami terima pada periode ini. Kami mengucapkan terima kasih banyak
                        atas kepercayaan dan partisipasi Ayah/Bunda.
                      </p>
                    </div>
                  )}

                  {applicantData.selection_status === 'MENUNGGU' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-extrabold text-amber-950 mb-1">
                        HASIL SELEKSI MASIH DALAM PROSES SIDANG PLENO
                      </h4>
                      <p className="text-xs md:text-sm text-amber-800 max-w-lg mx-auto leading-relaxed">
                        Data calon siswa sedang dalam proses evaluasi kuota bersama tim dewan guru. Hasil
                        resmi akan segera diperbarui secara berkala.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* LEMBAR PENGESAHAN CETAK RESMI (Hanya tampil saat dicetak) */}
            <div className="hidden print:grid grid-cols-2 gap-8 pt-6 text-center text-xs text-black border-t border-slate-400 mt-6 break-inside-avoid">
              <div>
                <p className="text-slate-700">Mengetahui,</p>
                <p className="font-semibold text-slate-800">Orang Tua / Wali Calon Siswa</p>
                <div className="h-16" />
                <p className="font-bold border-t border-black inline-block px-8 pt-1">
                  ( .................................................... )
                </p>
              </div>
              <div>
                <p className="text-slate-700">
                  Ditetapkan pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="font-semibold text-slate-800">Panitia PPDB Online Yayasan ICA</p>
                <div className="h-16" />
                <p className="font-bold border-t border-black inline-block px-8 pt-1">
                  ( Kepala Tata Usaha / Panitia )
                </p>
              </div>
            </div>

            {/* BARIS TOMBOL AKSI (Disembunyikan saat dicetak) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 print:hidden">
              <button
                onClick={() => {
                  setApplicantData(null)
                  setHasSearched(false)
                  setIdentifier('')
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" />
                Cari Siswa Lain
              </button>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Lembar Status
                </button>

                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Panitia%20PPDB,%20saya%20ingin%20mengonfirmasi%20status%20pendaftaran%20ananda%20${encodeURIComponent(
                    applicantData.child_full_name
                  )}%20(No.%20Registrasi:%20${applicantData.registration_number})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Konfirmasi ke WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* PANDUAN & FAQ KECIL DI BAGIAN BAWAH (Disembunyikan saat dicetak) */}
        {!applicantData && !isPending && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm print:hidden">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <HelpCircle className="w-5 h-5 text-[#006633]" />
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                Informasi & Pertanyaan Umum (FAQ)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#006633]" />
                  Berapa lama verifikasi berkas dilakukan?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Panitia TU melakukan verifikasi berkas dalam 1–2 hari kerja setelah formulir pendaftaran
                  diunggah secara online.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Bagaimana jika status saya "Perlu Revisi"?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Cek catatan panitia yang tampil pada hasil pencarian, kemudian kirimkan foto/file
                  dokumen perbaikan langsung ke kontak WhatsApp resmi Panitia PPDB.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CekStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006633] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-600">Memuat Halaman Cek Status...</p>
        </div>
      }
    >
      <CekStatusContent />
    </Suspense>
  )
}

