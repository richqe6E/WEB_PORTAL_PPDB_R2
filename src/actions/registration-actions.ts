'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  applicantRegistrationSchema,
  type ApplicantRegistrationInput,
} from '@/lib/validations/applicant-schema'
import type { ApplicantStatusResult } from '@/types/database.types'

export interface SubmitRegistrationResponse {
  success: boolean
  message: string
  registration_number?: string
  child_name?: string
}

export interface CheckStatusResponse {
  success: boolean
  message: string
  data?: ApplicantStatusResult
}

/**
 * Menyimpan pendaftaran calon siswa baru dari formulir publik
 */
export async function submitApplicantRegistration(
  payload: ApplicantRegistrationInput
): Promise<SubmitRegistrationResponse> {
  try {
    const supabase = await createClient()

    // 1. Validasi struktur data menggunakan skema Zod
    const validated = applicantRegistrationSchema.parse(payload)

    // 2. Verifikasi status buka/tutup PPDB di database
    const { data: settings, error: settingsError } = await supabase
      .from('ppdb_settings')
      .select('is_ppdb_open, academic_year')
      .eq('id', 1)
      .single()

    if (settingsError || !settings?.is_ppdb_open) {
      return {
        success: false,
        message:
          'Mohon maaf, pendaftaran PPDB saat ini sedang DITUTUP oleh panitia. Data tidak dapat disimpan.',
      }
    }

    // 3. Verifikasi apakah jenjang yang dipilih sedang aktif
    const { data: level, error: levelError } = await supabase
      .from('education_levels')
      .select('is_active, name')
      .eq('id', validated.level_id)
      .single()

    if (levelError || !level?.is_active) {
      return {
        success: false,
        message: `Mohon maaf, jenjang ${level?.name || 'tersebut'} saat ini sedang tidak dibuka untuk pendaftaran.`,
      }
    }

    // 4. Periksa apakah NIK anak sudah pernah didaftarkan
    const { data: existingApplicant } = await supabase
      .from('applicants')
      .select('registration_number')
      .eq('child_nik', validated.child_nik)
      .maybeSingle()

    if (existingApplicant) {
      return {
        success: false,
        message: `NIK Anak ini (${validated.child_nik}) sudah terdaftar pada sistem PPDB kami dengan Nomor Registrasi: ${existingApplicant.registration_number}. Silakan cek status pendaftaran pada menu Cek Status.`,
      }
    }

    // 5. Simpan data calon siswa ke tabel applicants
    const { data: inserted, error: insertError } = await supabase
      .from('applicants')
      .insert({
        level_id: validated.level_id,
        child_full_name: validated.child_full_name,
        child_nickname: validated.child_nickname || null,
        child_nik: validated.child_nik,
        gender: validated.gender,
        birth_place: validated.birth_place,
        birth_date: validated.birth_date,
        address: validated.address,
        father_name: validated.father_name,
        mother_name: validated.mother_name,
        parent_occupation: validated.parent_occupation || null,
        parent_whatsapp: validated.parent_whatsapp,
        doc_kk_url: validated.doc_kk_url,
        doc_akta_url: validated.doc_akta_url,
        doc_ktp_url: validated.doc_ktp_url,
        doc_photo_url: validated.doc_photo_url || null,
        verification_status: 'MENUNGGU_VERIFIKASI',
        selection_status: 'MENUNGGU',
      })
      .select('registration_number, child_full_name')
      .single()

    if (insertError) {
      throw insertError
    }

    // Sinkronkan data ke dashboard Admin TU
    revalidatePath('/admin')
    revalidatePath('/admin/pendaftar')

    return {
      success: true,
      message: 'Pendaftaran calon siswa baru berhasil dikirim dan tersimpan!',
      registration_number: inserted.registration_number,
      child_name: inserted.child_full_name,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat menyimpan pendaftaran.'
    return { success: false, message }
  }
}

/**
 * Pengecekan status pendaftaran publik via Nomor Registrasi atau NIK
 */
export async function checkApplicantStatusAction(
  identifier: string
): Promise<CheckStatusResponse> {
  try {
    const cleanId = identifier?.trim()
    if (!cleanId) {
      return {
        success: false,
        message: 'Silakan masukkan Nomor Pendaftaran atau NIK Anak 16 digit.',
      }
    }

    const supabase = await createClient()

    // Panggil fungsi RPC get_applicant_status
    const { data, error } = await supabase.rpc('get_applicant_status', {
      p_identifier: cleanId,
    })

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message:
          'Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran (contoh: PPDB-2026-0001) atau 16 digit NIK Anak sudah benar sesuai Kartu Keluarga.',
      }
    }

    return {
      success: true,
      message: 'Data pendaftaran berhasil ditemukan.',
      data: data[0] as ApplicantStatusResult,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal melakukan pengecekan status pendaftaran.'
    return { success: false, message }
  }
}

