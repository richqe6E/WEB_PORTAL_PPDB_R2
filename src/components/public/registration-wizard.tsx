'use client'

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  FileText,
  User,
  Users,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Copy,
  Printer,
  Loader2,
  FileCheck,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  Search,
} from 'lucide-react'

import {
  applicantRegistrationSchema,
  validateDocumentFile,
  type ApplicantRegistrationInput,
} from '@/lib/validations/applicant-schema'
import { submitApplicantRegistration } from '@/actions/registration-actions'
import { createClient } from '@/lib/supabase/client'
import { calculateChildAge } from '@/lib/utils'
import type { EducationLevelRow } from '@/types/database.types'

interface RegistrationWizardProps {
  levels: EducationLevelRow[]
  academicYear: string
  preselectedLevelId?: string
}

export function RegistrationWizard({
  levels,
  academicYear,
  preselectedLevelId,
}: RegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isPending, startTransition] = useTransition()
  const [uploadProgress, setUploadProgress] = useState<string>('')

  // File state untuk diunggah ke Supabase Storage pada Langkah 4
  const [kkFile, setKkFile] = useState<File | null>(null)
  const [aktaFile, setAktaFile] = useState<File | null>(null)
  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // Status bukti pendaftaran selesai
  const [registeredData, setRegisteredData] = useState<{
    regNumber: string
    childName: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ApplicantRegistrationInput>({
    resolver: zodResolver(applicantRegistrationSchema),
    defaultValues: {
      level_id: preselectedLevelId || (levels.length > 0 ? levels[0].id : ''),
      gender: 'L',
      doc_kk_url: '',
      doc_akta_url: '',
      doc_ktp_url: '',
      doc_photo_url: '',
    },
  })

  const selectedLevelId = watch('level_id')
  const birthDateValue = watch('birth_date')
  const childNikValue = watch('child_nik') || ''
  const childAgeInfo = calculateChildAge(birthDateValue)

  // Navigasi ke langkah berikutnya dengan validasi bertahap
  const handleNextStep = async () => {
    let isValid = false

    if (currentStep === 1) {
      isValid = await trigger(['level_id'])
    } else if (currentStep === 2) {
      isValid = await trigger([
        'child_full_name',
        'child_nickname',
        'child_nik',
        'gender',
        'birth_place',
        'birth_date',
        'address',
      ])
    } else if (currentStep === 3) {
      isValid = await trigger([
        'father_name',
        'mother_name',
        'parent_occupation',
        'parent_whatsapp',
      ])
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Upload satu file ke Supabase Storage
  const uploadToStorage = async (file: File, docType: string, nik: string) => {
    const supabase = createClient()
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${new Date().getFullYear()}/${nik}/${docType}-${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('ppdb-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(`Gagal mengunggah ${docType}: ${error.message}`)
    }

    return data.path
  }

  // Submit Final
  const onSubmit = (formData: ApplicantRegistrationInput) => {
    // Validasi file wajib
    if (!kkFile) {
      toast.error('File Kartu Keluarga (KK) wajib dipilih.')
      return
    }
    if (!aktaFile) {
      toast.error('File Akta Kelahiran wajib dipilih.')
      return
    }
    if (!ktpFile) {
      toast.error('File KTP Orang Tua wajib dipilih.')
      return
    }

    startTransition(async () => {
      try {
        setUploadProgress('Mengunggah dokumen persyaratan ke server aman...')

        // 1. Unggah berkas ke Supabase Storage
        const kkPath = await uploadToStorage(kkFile, 'kartu-keluarga', formData.child_nik)
        const aktaPath = await uploadToStorage(aktaFile, 'akta-kelahiran', formData.child_nik)
        const ktpPath = await uploadToStorage(ktpFile, 'ktp-orang-tua', formData.child_nik)
        let photoPath: string | null = null

        if (photoFile) {
          photoPath = await uploadToStorage(photoFile, 'pas-foto', formData.child_nik)
        }

        setUploadProgress('Menyimpan biodata pendaftar...')

        // 2. Kirim data lengkap ke Server Action
        const res = await submitApplicantRegistration({
          ...formData,
          doc_kk_url: kkPath,
          doc_akta_url: aktaPath,
          doc_ktp_url: ktpPath,
          doc_photo_url: photoPath,
        })

        if (!res.success) {
          toast.error(res.message)
          setUploadProgress('')
          return
        }

        // Sukses!
        setRegisteredData({
          regNumber: res.registration_number || 'PPDB-BERHASIL',
          childName: res.child_name || formData.child_full_name,
        })
        setCurrentStep(5)
        toast.success(res.message)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Terjadi kegagalan proses pendaftaran.'
        toast.error(msg)
      } finally {
        setUploadProgress('')
      }
    })
  }

  // LANGKAH 5: BUKTI PENDAFTARAN SUKSES
  if (currentStep === 5 && registeredData) {
    const values = getValues()
    const chosenLevel = levels.find((l) => l.id === values.level_id)
    const todayDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    return (
      <div>
        {/* =========================================================================
            1. TAMPILAN RESMI KHUSUS CETAK KERTAS A4 (hidden print:block)
            ========================================================================= */}
        <div className="hidden print:block text-black bg-white p-6 max-w-3xl mx-auto space-y-4">
          {/* KOP SURAT YAYASAN */}
          <div className="border-b-2 border-black pb-3 text-center relative">
            <h1 className="text-xl font-bold uppercase tracking-wide text-black">
              YAYASAN ICA
            </h1>
            <p className="text-xs uppercase font-bold tracking-wider text-black mt-0.5">
              PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB) ONLINE TAHUN AJARAN {academicYear}
            </p>
            <p className="text-[10px] text-gray-700 mt-0.5">
              Jl. Pendidikan Karakter No. 12, Kompleks Bina Bangsa | Telp/WA: 0812-3456-7890 | Website: https://yayasan-ppdb.ac.id
            </p>
            <div className="mt-2 text-xs font-black uppercase tracking-widest py-1 border-t border-b border-black">
              TANDA BUKTI RESMI PENDAFTARAN CALON PESERTA DIDIK BARU
            </div>
          </div>

          {/* NOMOR REGISTRASI BESAR & TANGGAL CETAK */}
          <div className="flex items-center justify-between border border-black p-3 bg-gray-50 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-600 block">
                Nomor Registrasi PPDB:
              </span>
              <span className="font-mono text-xl font-black text-black tracking-wider">
                {registeredData.regNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-600 block">
                Jenjang Pilihan:
              </span>
              <span className="font-bold text-sm text-black">
                {chosenLevel?.name || 'PAUD / TK'}
              </span>
            </div>
          </div>

          {/* TABEL DATA CALON SISWA */}
          <div className="text-xs space-y-1">
            <h2 className="font-bold uppercase text-[11px] border-b border-gray-400 pb-0.5">
              A. Biodata Calon Peserta Didik
            </h2>
            <table className="w-full text-left border-collapse text-[11px]">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-1 w-44 font-semibold text-gray-700">Nama Lengkap</td>
                  <td className="py-1 font-bold text-black">: {values.child_full_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Nama Panggilan</td>
                  <td className="py-1 text-black">: {values.child_nickname || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">NIK Calon Siswa</td>
                  <td className="py-1 font-mono font-bold text-black">: {values.child_nik}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Jenis Kelamin</td>
                  <td className="py-1 text-black">
                    : {values.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Tempat, Tanggal Lahir</td>
                  <td className="py-1 text-black">
                    : {values.birth_place}, {values.birth_date}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Alamat Domisili</td>
                  <td className="py-1 text-black">: {values.address}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TABEL DATA ORANG TUA / WALI */}
          <div className="text-xs space-y-1 pt-2">
            <h2 className="font-bold uppercase text-[11px] border-b border-gray-400 pb-0.5">
              B. Data Orang Tua / Wali
            </h2>
            <table className="w-full text-left border-collapse text-[11px]">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-1 w-44 font-semibold text-gray-700">Nama Ayah Kandung</td>
                  <td className="py-1 font-bold text-black">: {values.father_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Nama Ibu Kandung</td>
                  <td className="py-1 font-bold text-black">: {values.mother_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Pekerjaan Orang Tua</td>
                  <td className="py-1 text-black">: {values.parent_occupation || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1 font-semibold text-gray-700">Nomor WhatsApp Aktif</td>
                  <td className="py-1 font-mono font-bold text-black">: {values.parent_whatsapp}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PETUNJUK DAFTAR ULANG */}
          <div className="border border-black p-2.5 rounded text-[10px] bg-gray-50 leading-relaxed">
            <strong className="block font-bold uppercase text-black mb-0.5">
              Ketentuan & Petunjuk Tahap Selanjutnya:
            </strong>
            <ol className="list-decimal pl-4 space-y-0.5 text-gray-800">
              <li>Simpan lembar bukti pendaftaran resmi ini dengan baik sebagai tanda terima sah.</li>
              <li>Pantau status verifikasi berkas secara berkala melalui menu <strong>Cek Status</strong> pada portal PPDB menggunakan Nomor Registrasi atau NIK di atas.</li>
              <li>Bawa bukti pendaftaran ini beserta dokumen asli (KK, Akta Kelahiran, KTP) saat verifikasi tatap muka atau daftar ulang di kantor TU Yayasan.</li>
            </ol>
          </div>

          {/* KOLOM TANDA TANGAN */}
          <div className="grid grid-cols-2 gap-8 pt-4 text-center text-xs">
            <div>
              <p className="text-gray-700">Orang Tua / Wali Calon Siswa,</p>
              <div className="h-16" />
              <p className="font-bold text-black border-t border-black inline-block px-8 pt-1">
                ( {values.father_name || values.mother_name} )
              </p>
            </div>
            <div>
              <p className="text-gray-700">Dicetak pada: {todayDate}</p>
              <p className="text-gray-700">Panitia PPDB Online Yayasan,</p>
              <div className="h-14" />
              <p className="font-bold text-black border-t border-black inline-block px-8 pt-1">
                ( Panitia Tata Usaha )
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. TAMPILAN SCREEN INTERAKTIF (print:hidden)
            ========================================================================= */}
        <div className="print:hidden card-base-pmb bg-white border border-[#DFE3E9] rounded-lg p-6 sm:p-10 shadow-sm max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-lg bg-emerald-50 text-[#006633] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#006633] bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-[4px]">
              Pendaftaran Berhasil Dikirim
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2A2C] mt-3">
              Selamat, Data Calon Siswa Diterima!
            </h2>
            <p className="text-xs sm:text-sm text-[#667686] mt-2 max-w-md mx-auto">
              Terima kasih telah mendaftarkan ananda <strong>{registeredData.childName}</strong> di Yayasan ICA untuk Tahun Ajaran {academicYear}.
            </p>
          </div>

          {/* KARTU NOMOR REGISTRASI */}
          <div className="p-6 rounded-lg bg-gray-50 border-2 border-dashed border-[#006633]/40 space-y-2">
            <span className="text-xs text-[#667686] uppercase font-semibold tracking-wider">
              Nomor Pendaftaran Resmi Anda
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#006633] tracking-wider font-mono">
              {registeredData.regNumber}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(registeredData.regNumber)
                toast.success('Nomor Pendaftaran berhasil disalin ke clipboard!')
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006633] hover:underline pt-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Salin Nomor Pendaftaran
            </button>
          </div>

          {/* PANDUAN PENTING */}
          <div className="p-4 rounded-xl bg-[#FFEDB7]/50 border border-[#F78100]/30 text-left text-xs text-[#8B4500] space-y-1">
            <strong className="block font-bold">Catatan Penting untuk Orang Tua / Wali:</strong>
            <p>
              1. Simpan atau cetak nomor pendaftaran di atas. Anda akan menggunakannya untuk mengecek hasil verifikasi berkas dan pengumuman seleksi.
            </p>
            <p>
              2. Panitia Tata Usaha Yayasan akan segera memvalidasi dokumen yang telah Anda unggah.
            </p>
          </div>

          {/* TOMBOL AKSI */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white border border-[#DFE3E9] text-[#2A2A2C] hover:bg-gray-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Bukti Pendaftaran
            </button>
            <a
              href={`/cek-status?ref=${registeredData.regNumber}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#006633] hover:bg-[#004d26] text-white shadow-sm transition-all"
            >
              <Search className="w-4 h-4" /> Buka Halaman Cek Status
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* STEPPER PROGRESS BAR (4 TAHAPAN) */}
      <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Step 1 */}
          <div className="space-y-1.5">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto text-xs sm:text-sm font-bold transition-all ${
                currentStep >= 1
                  ? 'bg-[#006633] text-white shadow-sm'
                  : 'bg-gray-100 text-[#667686]'
              }`}
            >
              1
            </div>
            <span
              className={`block text-[11px] sm:text-xs font-semibold ${
                currentStep >= 1 ? 'text-[#006633]' : 'text-[#667686]'
              }`}
            >
              Pilih Jenjang
            </span>
          </div>

          {/* Step 2 */}
          <div className="space-y-1.5">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto text-xs sm:text-sm font-bold transition-all ${
                currentStep >= 2
                  ? 'bg-[#006633] text-white shadow-sm'
                  : 'bg-gray-100 text-[#667686]'
              }`}
            >
              2
            </div>
            <span
              className={`block text-[11px] sm:text-xs font-semibold ${
                currentStep >= 2 ? 'text-[#006633]' : 'text-[#667686]'
              }`}
            >
              Data Anak
            </span>
          </div>

          {/* Step 3 */}
          <div className="space-y-1.5">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto text-xs sm:text-sm font-bold transition-all ${
                currentStep >= 3
                  ? 'bg-[#006633] text-white shadow-sm'
                  : 'bg-gray-100 text-[#667686]'
              }`}
            >
              3
            </div>
            <span
              className={`block text-[11px] sm:text-xs font-semibold ${
                currentStep >= 3 ? 'text-[#006633]' : 'text-[#667686]'
              }`}
            >
              Orang Tua
            </span>
          </div>

          {/* Step 4 */}
          <div className="space-y-1.5">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto text-xs sm:text-sm font-bold transition-all ${
                currentStep >= 4
                  ? 'bg-[#006633] text-white shadow-sm'
                  : 'bg-gray-100 text-[#667686]'
              }`}
            >
              4
            </div>
            <span
              className={`block text-[11px] sm:text-xs font-semibold ${
                currentStep >= 4 ? 'text-[#006633]' : 'text-[#667686]'
              }`}
            >
              Unggah Berkas
            </span>
          </div>
        </div>
      </div>

      {/* FORM UTAMA */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* =========================================================================
            LANGKAH 1: PILIH JENJANG PENDIDIKAN
            ========================================================================= */}
        {currentStep === 1 && (
          <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006633] font-bold">
                Langkah 1 dari 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2A2A2C] mt-1">
                Pilih Jenjang Sekolah yang Dituju
              </h2>
              <p className="text-xs sm:text-sm text-[#667686] mt-0.5">
                Pilih jenjang kelas sesuai usia tumbuh kembang ananda tercinta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levels.map((level) => {
                const isSelected = selectedLevelId === level.id

                return (
                  <div
                    key={level.id}
                    onClick={() => setValue('level_id', level.id, { shouldValidate: true })}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#006633] bg-[#006633]/5 ring-2 ring-[#006633]/20 shadow-xs'
                        : 'border-[#DFE3E9] hover:border-gray-400 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#DFE3E9]">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-[#006633]/10 text-[#006633]">
                          {level.code}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#006633] bg-[#006633]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-[#2A2A2C] mt-3">{level.name}</h3>
                      <p className="text-xs font-semibold text-[#006633] mt-1">
                        {level.age_requirement_text}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#DFE3E9]/60 text-xs text-[#667686] flex justify-between">
                      <span>Daya Tampung:</span>
                      <strong className="text-[#2A2A2C]">{level.quota} Kursi</strong>
                    </div>
                  </div>
                )
              })}
            </div>

            {errors.level_id && (
              <p className="text-xs text-[#EE2737] font-semibold">{errors.level_id.message}</p>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-pmb-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#006633] hover:bg-[#004d26] text-white shadow-sm"
              >
                <span>Lanjut ke Data Diri Anak</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            LANGKAH 2: DATA DIRI CALON SISWA (ANAK)
            ========================================================================= */}
        {currentStep === 2 && (
          <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006633] font-bold">
                Langkah 2 dari 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2A2A2C] mt-1">
                Data Diri Calon Siswa (Anak)
              </h2>
              <p className="text-xs sm:text-sm text-[#667686] mt-0.5">
                Pastikan data yang diisi sesuai dengan yang tercantum pada Akta Kelahiran &amp; Kartu Keluarga.
              </p>
            </div>

            <div className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Nama Lengkap Anak <span className="text-[#EE2737]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap sesuai Akta Kelahiran"
                  {...register('child_full_name')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none"
                />
                {errors.child_full_name && (
                  <p className="text-xs text-[#EE2737] mt-1">{errors.child_full_name.message}</p>
                )}
              </div>

              {/* Nama Panggilan */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Nama Panggilan Ananda (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Fathan / Aisyah"
                  {...register('child_nickname')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none"
                />
              </div>

              {/* NIK Anak 16 Digit */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C]">
                    Nomor Induk Kependudukan (NIK Anak 16 Digit){' '}
                    <span className="text-[#EE2737]">*</span>
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      childNikValue.length === 16 ? 'text-[#006633] font-bold' : 'text-[#667686]'
                    }`}
                  >
                    {childNikValue.length}/16 Digit
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="16 digit angka yang tertera di Kartu Keluarga (KK)"
                  {...register('child_nik')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm font-mono text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none"
                />
                {errors.child_nik && (
                  <p className="text-xs text-[#EE2737] mt-1">{errors.child_nik.message}</p>
                )}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1.5">
                  Jenis Kelamin <span className="text-[#EE2737]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border border-[#D0D5DD] hover:border-[#006633] has-[:checked]:border-[#006633] has-[:checked]:bg-[#006633]/5">
                    <input
                      type="radio"
                      value="L"
                      {...register('gender')}
                      className="accent-[#006633] w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-[#2A2A2C]">Laki-laki</span>
                  </label>
                  <label className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border border-[#D0D5DD] hover:border-[#006633] has-[:checked]:border-[#006633] has-[:checked]:bg-[#006633]/5">
                    <input
                      type="radio"
                      value="P"
                      {...register('gender')}
                      className="accent-[#006633] w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-[#2A2A2C]">Perempuan</span>
                  </label>
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                    Tempat Lahir <span className="text-[#EE2737]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Kota / Kabupaten tempat lahir"
                    {...register('birth_place')}
                    className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
                  />
                  {errors.birth_place && (
                    <p className="text-xs text-[#EE2737] mt-1">{errors.birth_place.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                    Tanggal Lahir <span className="text-[#EE2737]">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('birth_date')}
                    className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
                  />
                  {errors.birth_date && (
                    <p className="text-xs text-[#EE2737] mt-1">{errors.birth_date.message}</p>
                  )}

                  {/* LIVE BADGE USIA ANAK */}
                  {birthDateValue && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#006633] bg-[#006633]/10 px-2.5 py-1 rounded">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Usia saat ini: {childAgeInfo.text}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alamat Tempat Tinggal */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Alamat Lengkap Tempat Tinggal <span className="text-[#EE2737]">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Jalan, RT/RW, No. Rumah, Kelurahan/Desa, Kecamatan, Kota/Kabupaten"
                  {...register('address')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:outline-none resize-y"
                />
                {errors.address && (
                  <p className="text-xs text-[#EE2737] mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#DFE3E9] text-[#2A2A2C] hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-pmb-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#006633] hover:bg-[#004d26] text-white shadow-sm"
              >
                <span>Lanjut ke Data Orang Tua</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            LANGKAH 3: DATA ORANG TUA / WALI
            ========================================================================= */}
        {currentStep === 3 && (
          <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006633] font-bold">
                Langkah 3 dari 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2A2A2C] mt-1">
                Data Orang Tua / Wali Calon Siswa
              </h2>
              <p className="text-xs sm:text-sm text-[#667686] mt-0.5">
                Pastikan nomor WhatsApp yang dimasukkan aktif untuk keperluan verifikasi dan konfirmasi panitia.
              </p>
            </div>

            <div className="space-y-4">
              {/* Nama Ayah */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Nama Lengkap Ayah Kandung / Wali <span className="text-[#EE2737]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap ayah"
                  {...register('father_name')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
                />
                {errors.father_name && (
                  <p className="text-xs text-[#EE2737] mt-1">{errors.father_name.message}</p>
                )}
              </div>

              {/* Nama Ibu */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Nama Lengkap Ibu Kandung / Wali <span className="text-[#EE2737]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap ibu"
                  {...register('mother_name')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
                />
                {errors.mother_name && (
                  <p className="text-xs text-[#EE2737] mt-1">{errors.mother_name.message}</p>
                )}
              </div>

              {/* Pekerjaan Orang Tua */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Pekerjaan Orang Tua / Wali (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Karyawan Swasta / Wiraswasta / PNS"
                  {...register('parent_occupation')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
                />
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C] mb-1">
                  Nomor WhatsApp Aktif <span className="text-[#EE2737]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  {...register('parent_whatsapp')}
                  className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm font-mono text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
                />
                {errors.parent_whatsapp && (
                  <p className="text-xs text-[#EE2737] mt-1">{errors.parent_whatsapp.message}</p>
                )}
                <p className="text-xs text-[#667686] mt-1">
                  Pemberitahuan verifikasi berkas dan jadwal tes/wawancara akan dikirimkan ke nomor ini.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#DFE3E9] text-[#2A2A2C] hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-pmb-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#006633] hover:bg-[#004d26] text-white shadow-sm"
              >
                <span>Lanjut ke Unggah Berkas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            LANGKAH 4: UNGGAH BERKAS PERSYARATAN (STORAGE)
            ========================================================================= */}
        {currentStep === 4 && (
          <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#006633] font-bold">
                Langkah 4 dari 4 (Terakhir)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2A2A2C] mt-1">
                Unggah Berkas Persyaratan Digital
              </h2>
              <p className="text-xs sm:text-sm text-[#667686] mt-0.5">
                Format file yang didukung: <strong>JPG, PNG, atau PDF</strong>. Ukuran masing-masing file maksimal <strong>2MB</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File 1: Kartu Keluarga */}
              <div className="p-4 rounded-xl border border-[#DFE3E9] bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C]">
                    1. Scan / Foto Kartu Keluarga (KK) <span className="text-[#EE2737]">*</span>
                  </label>
                  {kkFile && <CheckCircle2 className="w-4 h-4 text-[#006633]" />}
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      const v = validateDocumentFile(f)
                      if (!v.valid) {
                        toast.error(v.error)
                        e.target.value = ''
                        return
                      }
                      setKkFile(f)
                    }
                  }}
                  className="w-full text-xs text-[#667686] file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#006633] file:text-white hover:file:bg-[#004d26] cursor-pointer"
                />
                {kkFile && (
                  <p className="text-[11px] text-[#006633] font-medium truncate">
                    Terpilih: {kkFile.name} ({(kkFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              {/* File 2: Akta Kelahiran */}
              <div className="p-4 rounded-xl border border-[#DFE3E9] bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C]">
                    2. Scan / Foto Akta Kelahiran Anak <span className="text-[#EE2737]">*</span>
                  </label>
                  {aktaFile && <CheckCircle2 className="w-4 h-4 text-[#006633]" />}
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      const v = validateDocumentFile(f)
                      if (!v.valid) {
                        toast.error(v.error)
                        e.target.value = ''
                        return
                      }
                      setAktaFile(f)
                    }
                  }}
                  className="w-full text-xs text-[#667686] file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#006633] file:text-white hover:file:bg-[#004d26] cursor-pointer"
                />
                {aktaFile && (
                  <p className="text-[11px] text-[#006633] font-medium truncate">
                    Terpilih: {aktaFile.name} ({(aktaFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              {/* File 3: KTP Orang Tua */}
              <div className="p-4 rounded-xl border border-[#DFE3E9] bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C]">
                    3. Scan / Foto KTP Orang Tua / Wali <span className="text-[#EE2737]">*</span>
                  </label>
                  {ktpFile && <CheckCircle2 className="w-4 h-4 text-[#006633]" />}
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      const v = validateDocumentFile(f)
                      if (!v.valid) {
                        toast.error(v.error)
                        e.target.value = ''
                        return
                      }
                      setKtpFile(f)
                    }
                  }}
                  className="w-full text-xs text-[#667686] file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#006633] file:text-white hover:file:bg-[#004d26] cursor-pointer"
                />
                {ktpFile && (
                  <p className="text-[11px] text-[#006633] font-medium truncate">
                    Terpilih: {ktpFile.name} ({(ktpFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              {/* File 4: Pas Foto Anak (Opsional) */}
              <div className="p-4 rounded-xl border border-[#DFE3E9] bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-[#2A2A2C]">
                    4. Pas Foto Berwarna Anak (Opsional)
                  </label>
                  {photoFile && <CheckCircle2 className="w-4 h-4 text-[#006633]" />}
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      const v = validateDocumentFile(f)
                      if (!v.valid) {
                        toast.error(v.error)
                        e.target.value = ''
                        return
                      }
                      setPhotoFile(f)
                    }
                  }}
                  className="w-full text-xs text-[#667686] file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#006633] file:text-white hover:file:bg-[#004d26] cursor-pointer"
                />
                {photoFile && (
                  <p className="text-[11px] text-[#006633] font-medium truncate">
                    Terpilih: {photoFile.name} ({(photoFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>
            </div>

            {/* STATUS LOADING PROGRES UPLOAD */}
            {isPending && (
              <div className="p-4 rounded-xl bg-[#006633]/10 border border-[#006633]/20 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#006633] animate-spin flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#006633]">
                  {uploadProgress || 'Sedang memproses data pendaftaran...'}
                </span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                disabled={isPending}
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#DFE3E9] text-[#2A2A2C] hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn-pmb-primary inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-[#F78100] hover:bg-[#d97706] text-white shadow-md disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengirim Pendaftaran...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" /> Kirim Formulir Pendaftaran Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
