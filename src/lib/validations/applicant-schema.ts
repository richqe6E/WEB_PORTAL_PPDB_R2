import { z } from 'zod'

export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
]

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimal 2MB.`,
    }
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Harap unggah format JPG, PNG, atau PDF.',
    }
  }

  return { valid: true }
}

export const applicantRegistrationSchema = z.object({
  level_id: z.string().uuid('Silakan pilih jenjang pendidikan yang valid'),
  child_full_name: z
    .string()
    .min(3, 'Nama lengkap calon siswa minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  child_nickname: z.string().max(50, 'Nama panggilan maksimal 50 karakter').optional().nullable(),
  child_nik: z
    .string()
    .regex(/^\d{16}$/, 'NIK anak wajib tepat 16 digit angka sesuai Kartu Keluarga'),
  gender: z.enum(['L', 'P'], {
    message: 'Pilih jenis kelamin anak (Laki-laki / Perempuan)',
  }),
  birth_place: z.string().min(2, 'Tempat lahir anak wajib diisi'),
  birth_date: z.string().min(1, 'Tanggal lahir anak wajib diisi'),
  address: z
    .string()
    .min(10, 'Alamat domisili lengkap minimal 10 karakter (termasuk RT/RW, Kelurahan/Desa)'),
  father_name: z.string().min(2, 'Nama lengkap ayah kandung / wali wajib diisi'),
  mother_name: z.string().min(2, 'Nama lengkap ibu kandung / wali wajib diisi'),
  parent_occupation: z.string().max(80, 'Pekerjaan orang tua maksimal 80 karakter').optional().nullable(),
  parent_whatsapp: z
    .string()
    .regex(
      /^(\+?62|0)8[1-9][0-9]{6,11}$/,
      'Nomor WhatsApp tidak valid. Masukkan nomor aktif berawalan 08... atau 628...'
    ),
  doc_kk_url: z.string().min(1, 'Dokumen Kartu Keluarga (KK) wajib diunggah'),
  doc_akta_url: z.string().min(1, 'Dokumen Akta Kelahiran anak wajib diunggah'),
  doc_ktp_url: z.string().min(1, 'Dokumen KTP Orang Tua wajib diunggah'),
  doc_photo_url: z.string().optional().nullable(),
})

export type ApplicantRegistrationInput = z.infer<typeof applicantRegistrationSchema>
