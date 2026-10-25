'use client'

import React, { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  CheckSquare,
  Trash2,
  MessageCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  VerificationBadge,
  SelectionBadge,
  GenderBadge,
} from './status-badges'
import {
  DocumentPreviewModal,
  type DocType,
} from './document-preview-modal'
import {
  getDocumentSignedUrls,
  deleteApplicantAction,
  type DocumentSignedUrls,
} from '@/actions/verification-actions'
import {
  calculateChildAge,
  formatDateIndo,
  formatWhatsAppNumber,
} from '@/lib/utils'
import type {
  ApplicantRow,
  EducationLevelRow,
  VerificationStatusEnum,
  SelectionStatusEnum,
} from '@/types/database.types'
import { toast } from 'sonner'

export type ApplicantWithLevel = ApplicantRow & {
  education_level?: Pick<EducationLevelRow, 'name' | 'code'> | null
}

interface ApplicantsTableProps {
  initialApplicants: ApplicantWithLevel[]
  levels: EducationLevelRow[]
}

export function ApplicantsTable({
  initialApplicants,
  levels,
}: ApplicantsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedVerification, setSelectedVerification] = useState<string>('all')
  const [selectedSelection, setSelectedSelection] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 10

  // State untuk modal pratinjau berkas
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewStudent, setPreviewStudent] = useState<{
    name: string
    regNumber: string
    urls: DocumentSignedUrls
    initialDoc: DocType
  }>({
    name: '',
    regNumber: '',
    urls: { kkUrl: null, aktaUrl: null, ktpUrl: null, photoUrl: null },
    initialDoc: 'kk',
  })

  const [isPending, startTransition] = useTransition()

  // Filter Logika
  const filteredApplicants = useMemo(() => {
    return initialApplicants.filter((item) => {
      // 1. Text Search: Nama, NIK, No Registrasi, Nama Ayah/Ibu
      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.child_full_name.toLowerCase().includes(q) ||
        (item.child_nickname && item.child_nickname.toLowerCase().includes(q)) ||
        item.child_nik.includes(q) ||
        item.registration_number.toLowerCase().includes(q) ||
        item.father_name.toLowerCase().includes(q) ||
        item.mother_name.toLowerCase().includes(q)

      // 2. Filter Jenjang
      const matchLevel =
        selectedLevel === 'all' || item.level_id === selectedLevel

      // 3. Filter Verification Status
      const matchVerification =
        selectedVerification === 'all' ||
        item.verification_status === selectedVerification

      // 4. Filter Selection Status
      const matchSelection =
        selectedSelection === 'all' ||
        item.selection_status === selectedSelection

      return matchSearch && matchLevel && matchVerification && matchSelection
    })
  }, [
    initialApplicants,
    searchTerm,
    selectedLevel,
    selectedVerification,
    selectedSelection,
  ])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / pageSize))
  const paginatedApplicants = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredApplicants.slice(start, start + pageSize)
  }, [filteredApplicants, currentPage, pageSize])

  // Reset page saat filter berubah
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  // Handler Buka Modal Pratinjau Berkas (Signed URLs)
  const handleOpenPreview = async (applicant: ApplicantWithLevel, doc: DocType = 'kk') => {
    setPreviewLoading(true)
    toast.loading('Menyiapkan berkas aman...', { id: 'signed-url' })

    const res = await getDocumentSignedUrls({
      kk: applicant.doc_kk_url,
      akta: applicant.doc_akta_url,
      ktp: applicant.doc_ktp_url,
      photo: applicant.doc_photo_url,
    })

    toast.dismiss('signed-url')
    setPreviewLoading(false)

    if (res.success && res.data) {
      setPreviewStudent({
        name: applicant.child_full_name,
        regNumber: applicant.registration_number,
        urls: res.data,
        initialDoc: doc,
      })
      setPreviewModalOpen(true)
    } else {
      toast.error('Gagal memuat pratinjau berkas: ' + (res.message || ''))
    }
  }

  // Handler Hapus Pendaftar (Hanya data duplikat/spam)
  const handleDelete = (applicant: ApplicantWithLevel) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data pendaftar "${applicant.child_full_name}" (${applicant.registration_number})? Tindakan ini permanen dan akan menghapus berkas dokumen terkait.`
    )
    if (!confirmed) return

    startTransition(async () => {
      const res = await deleteApplicantAction(applicant.id)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  // Export CSV
  const handleExportCSV = () => {
    if (filteredApplicants.length === 0) {
      toast.error('Tidak ada data pendaftar untuk diekspor.')
      return
    }

    const headers = [
      'No Registrasi',
      'Tanggal Daftar',
      'Jenjang',
      'Nama Lengkap Anak',
      'Nama Panggilan',
      'NIK Anak',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Usia Saat Ini',
      'Nama Ayah',
      'Nama Ibu',
      'Pekerjaan Orang Tua',
      'No WhatsApp',
      'Alamat Domisili',
      'Status Verifikasi Berkas',
      'Status Kelulusan',
      'Catatan Panitia TU',
    ]

    const rows = filteredApplicants.map((item) => {
      const age = calculateChildAge(item.birth_date)
      const levelName = item.education_level?.name || 'Jenjang'
      return [
        `"${item.registration_number}"`,
        `"${formatDateIndo(item.created_at)}"`,
        `"${levelName}"`,
        `"${item.child_full_name.replace(/"/g, '""')}"`,
        `"${(item.child_nickname || '-').replace(/"/g, '""')}"`,
        `'${item.child_nik}`,
        `"${item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}"`,
        `"${item.birth_place}"`,
        `"${item.birth_date}"`,
        `"${age.text}"`,
        `"${item.father_name.replace(/"/g, '""')}"`,
        `"${item.mother_name.replace(/"/g, '""')}"`,
        `"${(item.parent_occupation || '-').replace(/"/g, '""')}"`,
        `'${item.parent_whatsapp}`,
        `"${item.address.replace(/"/g, '""')}"`,
        `"${item.verification_status}"`,
        `"${item.selection_status}"`,
        `"${(item.admin_notes || '-').replace(/"/g, '""')}"`,
      ].join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `data_pendaftar_ppdb_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`${filteredApplicants.length} data pendaftar berhasil diekspor ke CSV.`)
  }

  return (
    <div className="space-y-6">
      {/* BARIS KONTROL: PENCARIAN & FILTER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Kolom Pencarian */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari nama anak, 16 digit NIK, No. Registrasi, atau nama orang tua..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#006633] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Reset
              </button>
            )}
          </div>

          {/* Tombol Aksi Export & Print */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors shadow-xs print:hidden"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* Baris Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Filter Jenjang */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Jenjang Pendidikan:</label>
            <select
              value={selectedLevel}
              onChange={(e) => handleFilterChange(setSelectedLevel, e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-[#006633] focus:outline-none"
            >
              <option value="all">Semua Jenjang ({initialApplicants.length})</option>
              {levels.map((lvl) => {
                const count = initialApplicants.filter((a) => a.level_id === lvl.id).length
                return (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.name} ({count})
                  </option>
                )
              })}
            </select>
          </div>

          {/* Filter Status Verifikasi Berkas */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status Verifikasi Berkas:</label>
            <select
              value={selectedVerification}
              onChange={(e) => handleFilterChange(setSelectedVerification, e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-[#006633] focus:outline-none"
            >
              <option value="all">Semua Status Berkas</option>
              <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi TU</option>
              <option value="PERLU_REVISI">Perlu Perbaikan / Revisi</option>
              <option value="TERVERIFIKASI">Berkas Sah & Lengkap</option>
            </select>
          </div>

          {/* Filter Status Kelulusan */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Status Seleksi Kelulusan:</label>
            <select
              value={selectedSelection}
              onChange={(e) => handleFilterChange(setSelectedSelection, e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-[#006633] focus:outline-none"
            >
              <option value="all">Semua Status Seleksi</option>
              <option value="MENUNGGU">Belum Diputuskan (Menunggu)</option>
              <option value="DITERIMA">DITERIMA (Lulus Seleksi)</option>
              <option value="DITOLAK">DITOLAK (Tidak Diterima)</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABEL DATA PENDAFTAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Reg & Tanggal</th>
                <th className="py-3.5 px-4">Calon Peserta Didik</th>
                <th className="py-3.5 px-4">Jenjang</th>
                <th className="py-3.5 px-4">Orang Tua & Kontak</th>
                <th className="py-3.5 px-4 text-center">Status Berkas</th>
                <th className="py-3.5 px-4 text-center">Keputusan</th>
                <th className="py-3.5 px-4 text-center">Aksi TU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data pendaftar yang cocok.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba sesuaikan kata kunci pencarian atau filter status Anda.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedApplicants.map((applicant) => {
                  const age = calculateChildAge(applicant.birth_date)
                  const waNumber = formatWhatsAppNumber(applicant.parent_whatsapp)
                  const waMessage = encodeURIComponent(
                    `Assalamu'alaikum Wr. Wb. Yth. Ayah/Bunda dari ananda ${applicant.child_full_name} (No. Registrasi: ${applicant.registration_number}), kami dari Panitia PPDB Yayasan ICA ingin mengonfirmasi terkait pendaftaran jenjang ${applicant.education_level?.name || 'PAUD/TK'}.`
                  )

                  return (
                    <tr
                      key={applicant.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Kolom 1: No. Reg & Tanggal */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block text-xs">
                          {applicant.registration_number}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDateIndo(applicant.created_at)}
                        </span>
                      </td>

                      {/* Kolom 2: Calon Siswa & Usia */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-2.5">
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{applicant.child_full_name}</span>
                              {applicant.child_nickname && (
                                <span className="text-xs font-normal text-slate-500">
                                  ({applicant.child_nickname})
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <GenderBadge gender={applicant.gender} />
                              <span className="text-[11px] font-mono text-slate-500">
                                NIK: {applicant.child_nik}
                              </span>
                            </div>
                            <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                              Usia: {age.text}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kolom 3: Jenjang */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                          <GraduationCap className="w-3.5 h-3.5 text-[#006633]" />
                          {applicant.education_level?.name || 'PAUD/TK'}
                        </span>
                      </td>

                      {/* Kolom 4: Orang Tua & WA */}
                      <td className="py-4 px-4">
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">
                            Ayah: {applicant.father_name}
                          </p>
                          <p className="text-slate-600 text-[11px]">
                            Ibu: {applicant.mother_name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <a
                              href={`https://wa.me/${waNumber}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors"
                              title="Kirim pesan WhatsApp langsung ke nomor orang tua"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-700" />
                              <span>{applicant.parent_whatsapp}</span>
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Kolom 5: Status Berkas */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <VerificationBadge status={applicant.verification_status} size="sm" />
                        {applicant.admin_notes && (
                          <span
                            className="block text-[10px] text-amber-700 italic max-w-[140px] truncate mx-auto mt-1"
                            title={applicant.admin_notes}
                          >
                            📝 {applicant.admin_notes}
                          </span>
                        )}
                      </td>

                      {/* Kolom 6: Status Kelulusan */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <SelectionBadge status={applicant.selection_status} size="sm" />
                      </td>

                      {/* Kolom 7: Aksi TU */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Preview Modal Button */}
                          <button
                            onClick={() => handleOpenPreview(applicant, 'kk')}
                            disabled={previewLoading}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                            title="Pratinjau Berkas Cepat (KK/Akta/KTP/Foto)"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>

                          {/* Detail & Decision Page */}
                          <Link
                            href={`/admin/pendaftar/${applicant.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#006633] hover:bg-[#004d26] text-white font-bold text-xs transition-colors shadow-xs"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Validasi</span>
                          </Link>

                          {/* Delete Spam / Duplicate */}
                          <button
                            onClick={() => handleDelete(applicant)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                            title="Hapus Pendaftar Duplikat/Spam"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan{' '}
            <span className="font-bold text-slate-800">
              {filteredApplicants.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            -{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * pageSize, filteredApplicants.length)}
            </span>{' '}
            dari <span className="font-bold text-slate-800">{filteredApplicants.length}</span> data
            pendaftar (Total: {initialApplicants.length})
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PRATINJAU DOKUMEN */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        studentName={previewStudent.name}
        registrationNumber={previewStudent.regNumber}
        urls={previewStudent.urls}
        initialDocType={previewStudent.initialDoc}
      />
    </div>
  )
}

