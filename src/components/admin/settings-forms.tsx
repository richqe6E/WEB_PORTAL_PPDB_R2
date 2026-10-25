'use client'

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  ShieldAlert,
  Calendar,
  Layers,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  Unlock,
  Radio,
  Clock,
  Megaphone,
  School,
  Users
} from 'lucide-react'

import {
  ppdbSettingsSchema,
  educationLevelSchema,
  type PpdbSettingsInput,
  type EducationLevelInput,
} from '@/lib/validations/settings-schema'
import {
  togglePpdbMasterSwitch,
  toggleAnnouncementSwitch,
  updatePpdbScheduleSettings,
  updateEducationLevel,
  toggleEducationLevelStatus,
} from '@/actions/settings-actions'
import type { PpdbSettingsRow, EducationLevelRow } from '@/types/database.types'

interface SettingsFormsProps {
  initialSettings: PpdbSettingsRow
  initialLevels: (EducationLevelRow & { applicant_count?: number })[]
}

export function SettingsForms({ initialSettings, initialLevels }: SettingsFormsProps) {
  return (
    <div className="space-y-8">
      {/* 1. Panel Kontrol Utama: Master Switches */}
      <MasterSwitchesCard initialSettings={initialSettings} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Form Editor Jadwal & Tahun Ajaran */}
        <div className="lg:col-span-7">
          <ScheduleSettingsCard initialSettings={initialSettings} />
        </div>

        {/* 3. Panel Manajemen Jenjang Yayasan */}
        <div className="lg:col-span-5">
          <EducationLevelsCard initialLevels={initialLevels} />
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   1. MASTER SWITCHES CARD (BUKA/TUTUP PPDB & PENGUMUMAN)
   ========================================================================= */
function MasterSwitchesCard({ initialSettings }: { initialSettings: PpdbSettingsRow }) {
  const [isPpdbOpen, setIsPpdbOpen] = useState(initialSettings.is_ppdb_open)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(initialSettings.is_announcement_open)
  const [isPendingPpdb, startTransitionPpdb] = useTransition()
  const [isPendingAnnouncement, startTransitionAnnouncement] = useTransition()

  const handleTogglePpdb = (newValue: boolean) => {
    startTransitionPpdb(async () => {
      setIsPpdbOpen(newValue)
      const res = await togglePpdbMasterSwitch(newValue)
      if (res.success) {
        toast.success(res.message)
      } else {
        setIsPpdbOpen(!newValue)
        toast.error(res.message)
      }
    })
  }

  const handleToggleAnnouncement = (newValue: boolean) => {
    startTransitionAnnouncement(async () => {
      setIsAnnouncementOpen(newValue)
      const res = await toggleAnnouncementSwitch(newValue)
      if (res.success) {
        toast.success(res.message)
      } else {
        setIsAnnouncementOpen(!newValue)
        toast.error(res.message)
      }
    })
  }

  return (
    <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#DFE3E9]">
        <div className="p-2.5 rounded-lg bg-[#006633]/10 text-[#006633]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2A2A2C]">Panel Kontrol Saklar Utama (Master Switch)</h2>
          <p className="text-sm text-[#667686]">
            Kendali real-time untuk membuka/menutup akses pendaftaran publik dan rilis pengumuman hasil seleksi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAKLAR 1: STATUS PENDAFTARAN PPDB */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            isPpdbOpen
              ? 'border-[#006633] bg-[#006633]/5 ring-1 ring-[#006633]/30'
              : 'border-[#EE2737]/40 bg-[#EE2737]/5 ring-1 ring-[#EE2737]/20'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isPpdbOpen ? (
                  <Unlock className="w-5 h-5 text-[#006633]" />
                ) : (
                  <Lock className="w-5 h-5 text-[#EE2737]" />
                )}
                <h3 className="font-bold text-[#2A2A2C] text-base">Pendaftaran PPDB Online</h3>
              </div>
              <p className="text-xs text-[#667686] leading-relaxed">
                {isPpdbOpen
                  ? 'Formulir publik (/daftar) sedang AKTIF. Calon siswa baru dapat mendaftar dan mengunggah berkas.'
                  : 'Formulir publik TERKUNCI. Database secara otomatis memblokir setiap upaya pendaftaran baru.'}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isPpdbOpen}
              disabled={isPendingPpdb}
              onClick={() => handleTogglePpdb(!isPpdbOpen)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#006633] focus:ring-offset-2 ${
                isPpdbOpen ? 'bg-[#006633]' : 'bg-[#D0D5DD]'
              } ${isPendingPpdb ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isPpdbOpen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isPpdbOpen
                    ? 'bg-[#D0FFD5] text-[#006633] border border-[#006633]/30'
                    : 'bg-[#FEE2E2] text-[#EE2737] border border-[#EE2737]/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPpdbOpen ? 'bg-[#006633] animate-pulse' : 'bg-[#EE2737]'
                  }`}
                />
                {isPpdbOpen ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP'}
              </span>
            </div>
            {isPendingPpdb && (
              <span className="flex items-center gap-1 text-xs text-[#667686]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
              </span>
            )}
          </div>
        </div>

        {/* SAKLAR 2: STATUS PENGUMUMAN KELULUSAN */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            isAnnouncementOpen
              ? 'border-[#006633] bg-[#006633]/5 ring-1 ring-[#006633]/30'
              : 'border-[#F78100]/40 bg-[#F78100]/5 ring-1 ring-[#F78100]/20'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Radio
                  className={`w-5 h-5 ${isAnnouncementOpen ? 'text-[#006633]' : 'text-[#F78100]'}`}
                />
                <h3 className="font-bold text-[#2A2A2C] text-base">Hasil Kelulusan & Seleksi</h3>
              </div>
              <p className="text-xs text-[#667686] leading-relaxed">
                {isAnnouncementOpen
                  ? 'Pengumuman DIBUKA. Orang tua dapat memeriksa status Diterima / Ditolak melalui halaman Cek Status.'
                  : 'Pengumuman DITUTUP. Status kelulusan disamarkan sebagai "MENUNGGU" di halaman Cek Status publik.'}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isAnnouncementOpen}
              disabled={isPendingAnnouncement}
              onClick={() => handleToggleAnnouncement(!isAnnouncementOpen)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#006633] focus:ring-offset-2 ${
                isAnnouncementOpen ? 'bg-[#006633]' : 'bg-[#D0D5DD]'
              } ${isPendingAnnouncement ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnouncementOpen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isAnnouncementOpen
                    ? 'bg-[#D0FFD5] text-[#006633] border border-[#006633]/30'
                    : 'bg-[#FFEDB7] text-[#C55200] border border-[#F78100]/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAnnouncementOpen ? 'bg-[#006633]' : 'bg-[#F78100]'
                  }`}
                />
                {isAnnouncementOpen ? 'PENGUMUMAN DIBUKA' : 'PENGUMUMAN DITUTUP'}
              </span>
            </div>
            {isPendingAnnouncement && (
              <span className="flex items-center gap-1 text-xs text-[#667686]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   2. FORM EDITOR JADWAL & TAHUN AJARAN
   ========================================================================= */
function ScheduleSettingsCard({ initialSettings }: { initialSettings: PpdbSettingsRow }) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PpdbSettingsInput>({
    resolver: zodResolver(ppdbSettingsSchema),
    defaultValues: {
      academic_year: initialSettings.academic_year,
      is_ppdb_open: initialSettings.is_ppdb_open,
      is_announcement_open: initialSettings.is_announcement_open,
      schedule_registration_text: initialSettings.schedule_registration_text,
      schedule_verification_text: initialSettings.schedule_verification_text,
      schedule_announcement_text: initialSettings.schedule_announcement_text,
      announcement_banner_text: initialSettings.announcement_banner_text || '',
    },
  })

  const onSubmit = (data: PpdbSettingsInput) => {
    startTransition(async () => {
      const res = await updatePpdbScheduleSettings(data)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#DFE3E9]">
        <div className="p-2.5 rounded-lg bg-[#006633]/10 text-[#006633]">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2A2A2C]">Jadwal & Informasi Tahun Ajaran</h2>
          <p className="text-sm text-[#667686]">
            Teks jadwal yang tampil dinamis di halaman utama publik dan banner pengumuman.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tahun Ajaran */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A2C] mb-1.5">
            Tahun Ajaran Aktif <span className="text-[#EE2737]">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: 2026/2027"
            {...register('academic_year')}
            className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none transition-all"
          />
          {errors.academic_year && (
            <p className="text-xs text-[#EE2737] mt-1">{errors.academic_year.message}</p>
          )}
        </div>

        {/* Jadwal Pendaftaran */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A2C] mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#006633]" />
            Rentang Waktu Pendaftaran Online <span className="text-[#EE2737]">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: 1 Mei - 30 Juni 2026"
            {...register('schedule_registration_text')}
            className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none transition-all"
          />
          {errors.schedule_registration_text && (
            <p className="text-xs text-[#EE2737] mt-1">
              {errors.schedule_registration_text.message}
            </p>
          )}
        </div>

        {/* Jadwal Verifikasi */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A2C] mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#006633]" />
            Rentang Waktu Verifikasi Berkas Fisik & Online <span className="text-[#EE2737]">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: 1 Juli - 7 Juli 2026"
            {...register('schedule_verification_text')}
            className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none transition-all"
          />
          {errors.schedule_verification_text && (
            <p className="text-xs text-[#EE2737] mt-1">
              {errors.schedule_verification_text.message}
            </p>
          )}
        </div>

        {/* Jadwal Pengumuman */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A2C] mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#006633]" />
            Tanggal Pengumuman Hasil Seleksi & Kelulusan <span className="text-[#EE2737]">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: 10 Juli 2026"
            {...register('schedule_announcement_text')}
            className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none transition-all"
          />
          {errors.schedule_announcement_text && (
            <p className="text-xs text-[#EE2737] mt-1">
              {errors.schedule_announcement_text.message}
            </p>
          )}
        </div>

        {/* Banner Pengumuman Teks */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A2C] mb-1.5 flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-[#F78100]" />
            Teks Banner Pengumuman Halaman Depan (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Pesan khusus yang akan tampil pada banner berjalan / highlight di halaman utama..."
            {...register('announcement_banner_text')}
            className="w-full border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-[#2A2A2C] focus:border-[#006633] focus:ring-1 focus:ring-[#006633] focus:outline-none transition-all resize-y"
          />
        </div>

        {/* Tombol Simpan */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn-pmb-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#006633] hover:bg-[#004d26] disabled:opacity-50 transition-all shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Perubahan Jadwal
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

/* =========================================================================
   3. PANEL MANAJEMEN JENJANG YAYASAN (PAUD & TK)
   ========================================================================= */
function EducationLevelsCard({
  initialLevels,
}: {
  initialLevels: (EducationLevelRow & { applicant_count?: number })[]
}) {
  return (
    <div className="card-base-pmb bg-white border border-[#DFE3E9] rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#DFE3E9]">
        <div className="p-2.5 rounded-lg bg-[#006633]/10 text-[#006633]">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#2A2A2C]">Manajemen Jenjang</h2>
          <p className="text-sm text-[#667686]">
            Pengaturan kuota dan status aktif jenjang PAUD & TK.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {initialLevels.map((level) => (
          <EducationLevelItem key={level.id} level={level} />
        ))}
      </div>

      <div className="mt-6 p-3.5 rounded-lg bg-[#F8FAF9] border border-[#DFE3E9] text-xs text-[#667686] flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#F78100] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Perhatian:</strong> Hanya jenjang yang berstatus <strong>Aktif</strong> yang akan
          muncul sebagai opsi pilihan pada formulir pendaftaran orang tua calon murid.
        </p>
      </div>
    </div>
  )
}

function EducationLevelItem({
  level,
}: {
  level: EducationLevelRow & { applicant_count?: number }
}) {
  const [isActive, setIsActive] = useState(level.is_active)
  const [name, setName] = useState(level.name)
  const [ageText, setAgeText] = useState(level.age_requirement_text)
  const [quota, setQuota] = useState(level.quota)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (newStatus: boolean) => {
    startTransition(async () => {
      setIsActive(newStatus)
      const res = await toggleEducationLevelStatus(level.id, newStatus)
      if (res.success) {
        toast.success(res.message)
      } else {
        setIsActive(!newStatus)
        toast.error(res.message)
      }
    })
  }

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateEducationLevel({
        id: level.id,
        name,
        age_requirement_text: ageText,
        quota,
        is_active: isActive,
      })
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isActive
          ? 'border-[#DFE3E9] bg-white shadow-sm'
          : 'border-[#DFE3E9] bg-[#F9FAFB] opacity-75'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#DFE3E9]/60">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#006633] bg-[#006633]/10 px-2 py-0.5 rounded">
            {level.code}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isActive
                ? 'bg-[#D0FFD5] text-[#006633]'
                : 'bg-[#FEE2E2] text-[#EE2737]'
            }`}
          >
            {isActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        {/* Toggle Active Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          disabled={isPending}
          onClick={() => handleToggle(!isActive)}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#006633] ${
            isActive ? 'bg-[#006633]' : 'bg-[#D0D5DD]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isActive ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#667686] mb-1">Nama Jenjang</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#D0D5DD] rounded-md px-2.5 py-1.5 text-xs text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-medium text-[#667686] mb-1">Syarat Usia</label>
            <input
              type="text"
              value={ageText}
              onChange={(e) => setAgeText(e.target.value)}
              className="w-full border border-[#D0D5DD] rounded-md px-2.5 py-1.5 text-xs text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#667686] mb-1">Kuota Maksimal</label>
            <input
              type="number"
              min={1}
              value={quota}
              onChange={(e) => setQuota(Number(e.target.value))}
              className="w-full border border-[#D0D5DD] rounded-md px-2.5 py-1.5 text-xs text-[#2A2A2C] focus:border-[#006633] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#667686]">
            <Users className="w-3.5 h-3.5 text-[#006633]" />
            <span>Pendaftar: <strong>{level.applicant_count || 0}</strong> / {quota}</span>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold text-white bg-[#006633] hover:bg-[#004d26] disabled:opacity-50 transition-all"
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

