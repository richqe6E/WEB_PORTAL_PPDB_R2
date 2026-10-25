'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Sparkles,
  Save,
  MessageCircle,
  Copy,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Image as ImageIcon,
  GraduationCap,
  Calendar,
  MapPin,
  User,
  Users,
  FileCheck,
  Phone,
} from 'lucide-react'
import {
  updateApplicantVerification,
  type DocumentSignedUrls,
} from '@/actions/verification-actions'
import {
  calculateChildAge,
  formatDateIndo,
  formatWhatsAppNumber,
} from '@/lib/utils'
import {
  VerificationBadge,
  SelectionBadge,
  GenderBadge,
} from './status-badges'
import type {
  ApplicantRow,
  EducationLevelRow,
  VerificationStatusEnum,
  SelectionStatusEnum,
} from '@/types/database.types'
import { toast } from 'sonner'

export type ApplicantDetailData = ApplicantRow & {
  education_level?: Pick<EducationLevelRow, 'name' | 'code' | 'age_requirement_text'> | null
}

interface VerificationFormViewerProps {
  applicant: ApplicantDetailData
  signedUrls: DocumentSignedUrls
}

type DocTabKey = 'kk' | 'akta' | 'ktp' | 'photo'

export function VerificationFormViewer({
  applicant,
  signedUrls,
}: VerificationFormViewerProps) {
  // Form State
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatusEnum>(
    applicant.verification_status
  )
  const [selectionStatus, setSelectionStatus] = useState<SelectionStatusEnum>(
    applicant.selection_status
  )
  const [adminNotes, setAdminNotes] = useState<string>(applicant.admin_notes || '')
  const [isPending, startTransition] = useTransition()

  // Document Viewer State
  const [activeDocTab, setActiveDocTab] = useState<DocTabKey>('kk')
  const [zoom, setZoom] = useState<number>(100)
  const [rotation, setRotation] = useState<number>(0)

  const age = calculateChildAge(applicant.birth_date)
  const waNumber = formatWhatsAppNumber(applicant.parent_whatsapp)
  const waMessage = encodeURIComponent(
    `Assalamu'alaikum Wr. Wb. Yth. Ayah/Bunda dari ananda ${applicant.child_full_name} (No. Registrasi: ${applicant.registration_number}), kami dari Panitia PPDB Yayasan Islam ingin mengonfirmasi terkait dokumen pendaftaran jenjang ${applicant.education_level?.name || 'PAUD/TK'}.`
  )

  const docTabs: { key: DocTabKey; label: string; url: string | null }[] = [
    { key: 'kk', label: 'Kartu Keluarga (KK)', url: signedUrls.kkUrl },
    { key: 'akta', label: 'Akta Kelahiran', url: signedUrls.aktaUrl },
    { key: 'ktp', label: 'KTP Orang Tua', url: signedUrls.ktpUrl },
    { key: 'photo', label: 'Pas Foto Anak', url: signedUrls.photoUrl },
  ]

  const currentTab = docTabs.find((t) => t.key === activeDocTab) || docTabs[0]
  const currentUrl = currentTab.url
  const isPdf = currentUrl?.toLowerCase().includes('.pdf') ?? false

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} disalin ke clipboard!`)
  }

  // Quick Template Buttons untuk Catatan Panitia TU
  const quickTemplates = [
    {
      title: 'Berkas Lengkap',
      text: 'Berkas fisik dan digital telah diperiksa, lengkap, sah, serta memenuhi syarat administrasi.',
      presetVerification: 'TERVERIFIKASI' as VerificationStatusEnum,
    },
    {
      title: 'KK Buram / Tidak Jelas',
      text: 'Foto Kartu Keluarga (KK) yang diunggah buram atau terpotong. Mohon kirimkan foto ulang yang jelas via WhatsApp Panitia TU.',
      presetVerification: 'PERLU_REVISI' as VerificationStatusEnum,
    },
    {
      title: 'Akta Kurang Jelas',
      text: 'Foto Akta Kelahiran tidak terbaca jelas pada bagian nama anak dan tanggal lahir. Mohon kirimkan konfirmasi dokumen perbaikan.',
      presetVerification: 'PERLU_REVISI' as VerificationStatusEnum,
    },
    {
      title: 'Selamat Diterima',
      text: 'Alhamdulillah, selamat ananda dinyatakan DITERIMA. Silakan membawa berkas fisik asli saat konfirmasi daftar ulang di kantor TU.',
      presetVerification: 'TERVERIFIKASI' as VerificationStatusEnum,
      presetSelection: 'DITERIMA' as SelectionStatusEnum,
    },
  ]

  const handleApplyTemplate = (tmpl: (typeof quickTemplates)[0]) => {
    setAdminNotes(tmpl.text)
    if (tmpl.presetVerification) setVerificationStatus(tmpl.presetVerification)
    if (tmpl.presetSelection) setSelectionStatus(tmpl.presetSelection)
    toast.info(`Template "${tmpl.title}" diterapkan ke form.`)
  }

  // Submit Handler
  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const res = await updateApplicantVerification(applicant.id, {
        verification_status: verificationStatus,
        selection_status: selectionStatus,
        admin_notes: adminNotes,
      })

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* TOP BAR / BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pendaftar"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            title="Kembali ke Daftar Pendaftar"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006633] border border-emerald-200">
                {applicant.registration_number}
              </span>
              <span className="text-xs text-slate-500">
                Terdaftar: {formatDateIndo(applicant.created_at)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Pemeriksaan Berkas: {applicant.child_full_name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VerificationBadge status={verificationStatus} />
          <SelectionBadge status={selectionStatus} />
        </div>
      </div>

      {/* ERGONOMIC SPLIT-SCREEN (2 KOLOM PADA DESKTOP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (5 KOLOM / 12): BIODATA & FORM KEPUTUSAN ADMIN */}
        <div className="lg:col-span-5 space-y-6">
          {/* KARTU BIODATA CALON SISWA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-[#006633]" />
                Biodata Calon Siswa
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#006633] border border-emerald-200">
                <GraduationCap className="w-3.5 h-3.5" />
                {applicant.education_level?.name || 'PAUD/TK'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">
                  Nama Lengkap & Panggilan:
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {applicant.child_full_name}{' '}
                  {applicant.child_nickname && `(${applicant.child_nickname})`}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium">Nomor Induk Kependudukan (NIK):</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                  <span>{applicant.child_nik}</span>
                  <button
                    onClick={() => handleCopy(applicant.child_nik, 'NIK')}
                    className="p-1 hover:text-[#006633] text-slate-400"
                    title="Salin NIK"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium">Jenis Kelamin:</span>
                <GenderBadge gender={applicant.gender} />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium">Tempat, Tanggal Lahir:</span>
                <span className="font-semibold text-slate-800">
                  {applicant.birth_place}, {formatDateIndo(applicant.birth_date)}
                </span>
              </div>

              {/* Usia Presisi Terhitung */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#006633] block">
                    Usia Saat Ini:
                  </span>
                  <span className="font-black text-slate-900 text-sm">{age.text}</span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  Syarat: {applicant.education_level?.age_requirement_text || '-'}
                </div>
              </div>

              <div className="pt-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium block mb-0.5">Alamat Domisili:</span>
                <span className="text-slate-800 leading-relaxed block">
                  {applicant.address}
                </span>
              </div>
            </div>
          </div>

          {/* KARTU DATA ORANG TUA / WALI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[#006633]" />
                Data Orang Tua / Wali
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nama Ayah Kandung:</span>
                <span className="font-bold text-slate-800">{applicant.father_name}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                <span className="text-slate-500">Nama Ibu Kandung:</span>
                <span className="font-bold text-slate-800">{applicant.mother_name}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                <span className="text-slate-500">Pekerjaan Orang Tua:</span>
                <span className="font-semibold text-slate-700">
                  {applicant.parent_occupation || '-'}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-slate-500 block mb-1">Kontak WhatsApp:</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    {applicant.parent_whatsapp}
                  </span>
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FORM KEPUTUSAN & VALIDASI ADMIN TU */}
          <form
            onSubmit={handleSaveDecision}
            className="bg-white rounded-2xl border-2 border-emerald-600/30 shadow-sm p-5 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Save className="w-4 h-4 text-[#006633]" />
                Panel Keputusan Admin TU
              </h2>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Real-time Sync
              </span>
            </div>

            {/* 1. STATUS VERIFIKASI BERKAS */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Status Verifikasi Berkas Fisik/Digital:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVerificationStatus('MENUNGGU_VERIFIKASI')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    verificationStatus === 'MENUNGGU_VERIFIKASI'
                      ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-400/40'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-amber-700" />
                  <span>Menunggu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationStatus('PERLU_REVISI')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    verificationStatus === 'PERLU_REVISI'
                      ? 'bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-400/40'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-rose-700" />
                  <span>Perlu Revisi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationStatus('TERVERIFIKASI')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    verificationStatus === 'TERVERIFIKASI'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500/40'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-[#006633]" />
                  <span>Terverifikasi</span>
                </button>
              </div>
            </div>

            {/* 2. KEPUTUSAN HASIL SELEKSI KELULUSAN */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                2. Keputusan Hasil Seleksi Akhir (Kelulusan):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectionStatus('MENUNGGU')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectionStatus === 'MENUNGGU'
                      ? 'bg-slate-200 text-slate-900 border-slate-400 ring-2 ring-slate-400/40'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                  <span>Belum Putus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionStatus('DITERIMA')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectionStatus === 'DITERIMA'
                      ? 'bg-[#006633] text-white border-[#004d26] ring-2 ring-emerald-600/40'
                      : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1 text-emerald-300" />
                  <span>DITERIMA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionStatus('DITOLAK')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectionStatus === 'DITOLAK'
                      ? 'bg-rose-600 text-white border-rose-700 ring-2 ring-rose-500/40'
                      : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <XCircle className="w-4 h-4 mx-auto mb-1 text-rose-300" />
                  <span>DITOLAK</span>
                </button>
              </div>
            </div>

            {/* 3. CATATAN PANITIA TU (ADMIN NOTES) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label htmlFor="admin-notes" className="block text-xs font-bold text-slate-800">
                3. Catatan Panitia TU untuk Orang Tua:
              </label>

              {/* Template Cepat */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {quickTemplates.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(t)}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors"
                  >
                    + {t.title}
                  </button>
                ))}
              </div>

              <textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Tuliskan catatan verifikasi atau arahan perbaikan berkas di sini..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-[#006633] focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400">
                Catatan ini akan langsung terlihat oleh orang tua saat memeriksa di halaman Cek Status.
              </p>
            </div>

            {/* TOMBOL SIMPAN KEPUTUSAN */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#006633] hover:bg-[#004d26] disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan Keputusan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan & Keputusan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* KOLOM KANAN (7 KOLOM / 12): PENAMPIL DOKUMEN BERDAMPINGAN */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[820px]">
          {/* TAB BAR DOKUMEN */}
          <div className="flex items-center gap-1.5 p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0">
            {docTabs.map((tab) => {
              const isActive = activeDocTab === tab.key
              const hasFile = Boolean(tab.url)

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveDocTab(tab.key)
                    setZoom(100)
                    setRotation(0)
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#006633] text-white shadow-xs'
                      : hasFile
                      ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      : 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed'
                  }`}
                >
                  {tab.key === 'photo' ? (
                    <ImageIcon className="w-3.5 h-3.5" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  <span>{tab.label}</span>
                  {hasFile ? (
                    <FileCheck
                      className={`w-3 h-3 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">(-)</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TOOLBAR CONTROLS */}
          {currentUrl && (
            <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 text-xs shrink-0">
              <div className="flex items-center gap-1.5">
                {!isPdf && (
                  <>
                    <button
                      onClick={() => setZoom((z) => Math.max(z - 25, 50))}
                      disabled={zoom <= 50}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                      title="Perkecil"
                    >
                      <ZoomOut className="w-4 h-4 text-slate-700" />
                    </button>
                    <span className="font-mono font-semibold text-slate-700 w-10 text-center text-[11px]">
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(z + 25, 250))}
                      disabled={zoom >= 250}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                      title="Perbesar"
                    >
                      <ZoomIn className="w-4 h-4 text-slate-700" />
                    </button>
                    <button
                      onClick={() => {
                        setZoom(100)
                        setRotation(0)
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px]"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                      title="Putar 90 Derajat"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </>
                )}
                {isPdf && (
                  <span className="text-slate-500 font-medium">Dokumen PDF Tersemat</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
                <a
                  href={currentUrl}
                  download
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#006633] hover:bg-[#004d26] text-white font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
              </div>
            </div>
          )}

          {/* DOKUMEN VIEWPORT */}
          <div className="flex-1 bg-slate-900/5 overflow-auto p-4 flex items-center justify-center relative">
            {!currentUrl ? (
              <div className="text-center p-8 bg-white rounded-xl border border-slate-200 max-w-sm shadow-xs">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Dokumen Tidak Tersedia</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pendaftar belum mengunggah file {currentTab.label} saat pendaftaran online.
                </p>
              </div>
            ) : isPdf ? (
              <div className="w-full h-full bg-white rounded-xl shadow-xs overflow-hidden">
                <iframe
                  src={currentUrl}
                  title={currentTab.label}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
                <img
                  src={currentUrl}
                  alt={currentTab.label}
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="max-w-full max-h-[720px] object-contain rounded-lg shadow-md bg-white border border-slate-200"
                />
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span>
              Menampilkan berkas: <strong>{currentTab.label}</strong>
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              Signed URL Aman (Aktif 60 Menit)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

