'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  VerificationStatusEnum,
  SelectionStatusEnum,
} from '@/types/database.types'

export interface ActionResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface DocumentSignedUrls {
  kkUrl: string | null
  aktaUrl: string | null
  ktpUrl: string | null
  photoUrl: string | null
}

/**
 * Helper untuk verifikasi sesi Admin TU.
 * Seluruh fungsi dalam modul ini wajib dieksekusi oleh akun admin terautentikasi.
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
 * Membersihkan path berkas untuk storage API
 */
function cleanStoragePath(path: string | null | undefined): string {
  if (!path) return ''
  // Menghapus protokol/domain jika ada, atau nama bucket di awal
  return path
    .replace(/^https?:\/\/[^\/]+\/storage\/v1\/object\/(?:public|sign)\/ppdb-documents\//, '')
    .replace(/^ppdb-documents\//, '')
    .replace(/^\//, '')
    .trim()
}

/**
 * 1. Memperbarui status verifikasi berkas, kelulusan, dan catatan Admin TU
 */
export async function updateApplicantVerification(
  applicantId: string,
  payload: {
    verification_status: VerificationStatusEnum
    selection_status: SelectionStatusEnum
    admin_notes?: string | null
  }
): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    if (!applicantId) {
      return { success: false, message: 'ID pendaftar tidak valid.' }
    }

    const { error } = await supabase
      .from('applicants')
      .update({
        verification_status: payload.verification_status,
        selection_status: payload.selection_status,
        admin_notes: payload.admin_notes ? payload.admin_notes.trim() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicantId)

    if (error) {
      console.error('Error updateApplicantVerification:', error)
      return {
        success: false,
        message: `Gagal memperbarui data: ${error.message}`,
      }
    }

    // Sinkronisasi instan ke seluruh cache layout publik dan admin
    revalidatePath('/', 'layout')
    revalidatePath('/admin/pendaftar')
    revalidatePath(`/admin/pendaftar/${applicantId}`)
    revalidatePath('/cek-status')

    return {
      success: true,
      message: 'Status pendaftar dan catatan verifikasi berhasil disimpan.',
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
    return { success: false, message }
  }
}

/**
 * 2. Menghasilkan Signed URLs (berlaku 1 jam / 3600 detik) untuk berkas private pendaftar
 */
export async function getDocumentSignedUrls(paths: {
  kk: string
  akta: string
  ktp: string
  photo?: string | null
}): Promise<ActionResponse<DocumentSignedUrls>> {
  try {
    const { supabase } = await verifyAdminAuth()

    const cleanKk = cleanStoragePath(paths.kk)
    const cleanAkta = cleanStoragePath(paths.akta)
    const cleanKtp = cleanStoragePath(paths.ktp)
    const cleanPhoto = cleanStoragePath(paths.photo)

    // Generate signed URLs secara paralel
    const [kkRes, aktaRes, ktpRes, photoRes] = await Promise.all([
      cleanKk
        ? supabase.storage.from('ppdb-documents').createSignedUrl(cleanKk, 3600)
        : Promise.resolve({ data: null, error: null }),
      cleanAkta
        ? supabase.storage.from('ppdb-documents').createSignedUrl(cleanAkta, 3600)
        : Promise.resolve({ data: null, error: null }),
      cleanKtp
        ? supabase.storage.from('ppdb-documents').createSignedUrl(cleanKtp, 3600)
        : Promise.resolve({ data: null, error: null }),
      cleanPhoto
        ? supabase.storage.from('ppdb-documents').createSignedUrl(cleanPhoto, 3600)
        : Promise.resolve({ data: null, error: null }),
    ])

    return {
      success: true,
      message: 'Signed URLs berhasil dibuat.',
      data: {
        kkUrl: kkRes.data?.signedUrl || null,
        aktaUrl: aktaRes.data?.signedUrl || null,
        ktpUrl: ktpRes.data?.signedUrl || null,
        photoUrl: photoRes.data?.signedUrl || null,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengakses berkas'
    return {
      success: false,
      message,
      data: {
        kkUrl: null,
        aktaUrl: null,
        ktpUrl: null,
        photoUrl: null,
      },
    }
  }
}

/**
 * 3. Menghapus pendaftar (hanya untuk data duplikat/spam) beserta berkas dokumennya di Storage
 */
export async function deleteApplicantAction(applicantId: string): Promise<ActionResponse> {
  try {
    const { supabase } = await verifyAdminAuth()

    if (!applicantId) {
      return { success: false, message: 'ID pendaftar tidak valid.' }
    }

    // 1. Ambil path berkas terlebih dahulu
    const { data: applicant, error: fetchErr } = await supabase
      .from('applicants')
      .select('doc_kk_url, doc_akta_url, doc_ktp_url, doc_photo_url, child_full_name')
      .eq('id', applicantId)
      .single()

    if (fetchErr || !applicant) {
      return { success: false, message: 'Data pendaftar tidak ditemukan.' }
    }

    // 2. Kumpulkan file yang perlu dihapus dari bucket
    const filesToDelete = [
      cleanStoragePath(applicant.doc_kk_url),
      cleanStoragePath(applicant.doc_akta_url),
      cleanStoragePath(applicant.doc_ktp_url),
      cleanStoragePath(applicant.doc_photo_url),
    ].filter(Boolean)

    if (filesToDelete.length > 0) {
      const { error: storageErr } = await supabase.storage
        .from('ppdb-documents')
        .remove(filesToDelete)

      if (storageErr) {
        console.warn('Peringatan: Gagal menghapus sebagian berkas storage:', storageErr)
      }
    }

    // 3. Hapus data baris dari tabel applicants
    const { error: deleteErr } = await supabase
      .from('applicants')
      .delete()
      .eq('id', applicantId)

    if (deleteErr) {
      return {
        success: false,
        message: `Gagal menghapus pendaftar: ${deleteErr.message}`,
      }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/admin/pendaftar')
    revalidatePath('/cek-status')

    return {
      success: true,
      message: `Data pendaftar "${applicant.child_full_name}" berhasil dihapus permanen.`,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
    return { success: false, message }
  }
}

