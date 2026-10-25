'use client'

import React, { useState } from 'react'
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  FileCheck,
} from 'lucide-react'
import type { DocumentSignedUrls } from '@/actions/verification-actions'

export type DocType = 'kk' | 'akta' | 'ktp' | 'photo'

interface DocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  registrationNumber: string
  urls: DocumentSignedUrls
  initialDocType?: DocType
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  studentName,
  registrationNumber,
  urls,
  initialDocType = 'kk',
}: DocumentPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<DocType>(initialDocType)
  const [zoom, setZoom] = useState<number>(100)
  const [rotation, setRotation] = useState<number>(0)

  if (!isOpen) return null

  const tabs: { key: DocType; label: string; url: string | null }[] = [
    { key: 'kk', label: 'Kartu Keluarga (KK)', url: urls.kkUrl },
    { key: 'akta', label: 'Akta Kelahiran', url: urls.aktaUrl },
    { key: 'ktp', label: 'KTP Orang Tua', url: urls.ktpUrl },
    { key: 'photo', label: 'Pas Foto Anak', url: urls.photoUrl },
  ]

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0]
  const currentUrl = currentTab.url

  // Menentukan apakah berkas adalah PDF berdasarkan path URL
  const isPdf = currentUrl?.toLowerCase().includes('.pdf') ?? false

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 250))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleResetZoom = () => {
    setZoom(100)
    setRotation(0)
  }
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#006633] border border-emerald-200">
                {registrationNumber}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Pratinjau Berkas: {studentName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              URL berkas aman (Signed URL) berlaku selama 60 menit khusus verifikasi Panitia TU.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB SWITCHER DOKUMEN */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            const hasFile = Boolean(tab.url)

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  handleResetZoom()
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
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
                  <FileCheck className={`w-3 h-3 ${isActive ? 'text-emerald-200' : 'text-emerald-600'}`} />
                ) : (
                  <span className="text-[10px] text-slate-400 italic">(Kosong)</span>
                )}
              </button>
            )
          })}
        </div>

        {/* TOOLBAR KONTROL GAMBAR (Hanya jika gambar) */}
        {!isPdf && currentUrl && (
          <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4 text-slate-700" />
              </button>
              <span className="font-mono font-semibold text-slate-700 w-12 text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 250}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4 text-slate-700" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleRotate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Putar 90 Derajat"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Putar</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
              <a
                href={currentUrl}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006633] hover:bg-[#004d26] text-white font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </a>
            </div>
          </div>
        )}

        {/* AREA KONTEN PRATINJAU */}
        <div className="flex-1 bg-slate-950/5 relative overflow-auto p-4 flex items-center justify-center">
          {!currentUrl ? (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-200 max-w-sm shadow-xs">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">Dokumen Belum Diunggah</h4>
              <p className="text-xs text-slate-500 mt-1">
                Calon peserta didik belum mengunggah dokumen {currentTab.label} atau proses unggah
                dilewati.
              </p>
            </div>
          ) : isPdf ? (
            /* IFRAME PDF VIEWER */
            <div className="w-full h-full bg-white rounded-xl shadow-xs overflow-hidden flex flex-col">
              <div className="p-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-600" />
                  Pratinjau Dokumen PDF
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Tab Baru
                  </a>
                  <a
                    href={currentUrl}
                    download
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#006633] text-white text-xs font-semibold hover:bg-[#004d26]"
                  >
                    <Download className="w-3 h-3" />
                    Unduh PDF
                  </a>
                </div>
              </div>
              <iframe
                src={currentUrl}
                title={currentTab.label}
                className="w-full flex-1 border-0"
              />
            </div>
          ) : (
            /* IMAGE VIEWER DENGAN ZOOM & ROTASI */
            <div className="overflow-auto max-w-full max-h-full flex items-center justify-center p-4">
              <img
                src={currentUrl}
                alt={currentTab.label}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md bg-white border border-slate-200"
              />
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Menampilkan: {currentTab.label}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  )
}

