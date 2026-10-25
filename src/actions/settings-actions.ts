'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  ppdbSettingsSchema,
  educationLevelSchema,
  type PpdbSettingsInput,
  type EducationLevelInput,
} from '@/lib/validations/settings-schema'

export interface ActionResponse {
  success: boolean
  message: string
}

/**
 * Helper untuk verifikasi sesi Admin TU.
 * Wajib login sebelum melakukan mutasi data.
 */
async function verifyAdminAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Akses ditolak: Anda harus login terlebih dahulu sebagai Admin TU.')
  }

  return { supabase, user }
}

/**
 * Mengubah saklar utama Buka/Tutup PPDB (is_ppdb_open)
 */
export async function togglePpdbMasterSwitch(isOpen: boolean): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    const { error } = await supabase
      .from('ppdb_settings')
      .update({ is_ppdb_open: isOpen })
      .eq('id', 1)

    if (error) {
      throw error
    }

    // Sinkronisasi instan ke seluruh halaman publik
    revalidatePath('/', 'layout')

    return {
      success: true,
      message: `Status PPDB berhasil ${isOpen ? 'DIBUKA' : 'DITUTUP'}. Halaman publik telah diperbarui seketika.`,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui status PPDB.'
    return { success: false, message }
  }
}

/**
 * Mengubah saklar pengumuman kelulusan (is_announcement_open)
 */
export async function toggleAnnouncementSwitch(isOpen: boolean): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    const { error } = await supabase
      .from('ppdb_settings')
      .update({ is_announcement_open: isOpen })
      .eq('id', 1)

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: `Status Pengumuman Hasil Seleksi berhasil ${isOpen ? 'DIBUKA' : 'DITUTUP'}.`,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui status pengumuman.'
    return { success: false, message }
  }
}

/**
 * Menyimpan pembaruan Tahun Ajaran, Teks Jadwal, dan Banner Pengumuman
 */
export async function updatePpdbScheduleSettings(data: PpdbSettingsInput): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    const validated = ppdbSettingsSchema.parse(data)

    const { error } = await supabase
      .from('ppdb_settings')
      .update({
        academic_year: validated.academic_year,
        is_ppdb_open: validated.is_ppdb_open,
        is_announcement_open: validated.is_announcement_open,
        schedule_registration_text: validated.schedule_registration_text,
        schedule_verification_text: validated.schedule_verification_text,
        schedule_announcement_text: validated.schedule_announcement_text,
        announcement_banner_text: validated.announcement_banner_text || null,
      })
      .eq('id', 1)

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Jadwal dan pengaturan PPDB berhasil diperbarui.',
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menyimpan pengaturan jadwal.'
    return { success: false, message }
  }
}

/**
 * Mengubah status aktif/nonaktif jenjang pendidikan (PAUD / TK A / TK B)
 */
export async function toggleEducationLevelStatus(
  id: string,
  isActive: boolean
): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    const { error } = await supabase
      .from('education_levels')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: `Status jenjang berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui status jenjang.'
    return { success: false, message }
  }
}

/**
 * Memperbarui nama, syarat usia, kuota, dan status aktif pada jenjang pendidikan
 */
export async function updateEducationLevel(data: EducationLevelInput): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    const validated = educationLevelSchema.parse(data)

    const { error } = await supabase
      .from('education_levels')
      .update({
        name: validated.name,
        age_requirement_text: validated.age_requirement_text,
        quota: validated.quota,
        is_active: validated.is_active,
      })
      .eq('id', validated.id)

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: `Data jenjang ${validated.name} berhasil disimpan.`,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui data jenjang.'
    return { success: false, message }
  }
}

