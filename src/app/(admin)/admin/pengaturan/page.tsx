import React from 'react'
import type { Metadata } from 'next'
import { SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SettingsForms } from '@/components/admin/settings-forms'
import type { PpdbSettingsRow, EducationLevelRow, ApplicantRow } from '@/types/database.types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pengaturan PPDB & Jenjang | Admin TU',
  description: 'Kelola status buka/tutup pendaftaran, pengumuman, jadwal tahapan, dan kuota jenjang PAUD & TK.',
}

export default async function PengaturanPage() {
  const supabase = await createClient()

  // 1. Ambil data pengaturan utama PPDB
  const { data: settingsData, error: settingsError } = await supabase
    .from('ppdb_settings')
    .select('*')
    .eq('id', 1)
    .single<PpdbSettingsRow>()

  if (settingsError || !settingsData) {
    throw new Error('Gagal memuat konfigurasi PPDB dari database.')
  }

  // 2. Ambil data jenjang pendidikan
  const { data: levelsData, error: levelsError } = await supabase
    .from('education_levels')
    .select('*')
    .order('sort_order', { ascending: true })
    .returns<EducationLevelRow[]>()

  if (levelsError || !levelsData) {
    throw new Error('Gagal memuat data jenjang pendidikan.')
  }

  // 3. Ambil jumlah pendaftar per jenjang untuk informasi kuota
  const { data: applicantsData } = await supabase
    .from('applicants')
    .select('level_id')
    .returns<Pick<ApplicantRow, 'level_id'>[]>()

  const countMap: Record<string, number> = {}
  if (applicantsData) {
    for (const item of applicantsData) {
      countMap[item.level_id] = (countMap[item.level_id] || 0) + 1
    }
  }

  const levelsWithCounts = levelsData.map((level) => ({
    ...level,
    applicant_count: countMap[level.id] || 0,
  }))

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#DFE3E9]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006633]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tata Usaha &bull; Kontrol Operasional</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2A2A2C] mt-1">Pengaturan PPDB & Jenjang</h1>
          <p className="text-sm text-[#667686] mt-0.5">
            Kelola master switch pendaftaran, jadwal seleksi dinamis, dan kuota penerimaan PAUD & TK.
          </p>
        </div>
      </div>

      {/* INTERACTIVE SETTINGS FORMS */}
      <SettingsForms
        initialSettings={settingsData}
        initialLevels={levelsWithCounts}
      />
    </div>
  )
}

