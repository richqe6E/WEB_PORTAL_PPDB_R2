import { z } from 'zod'

export const ppdbSettingsSchema = z.object({
  academic_year: z.string().min(1, 'Tahun ajaran wajib diisi (contoh: 2026/2027)'),
  is_ppdb_open: z.boolean(),
  is_announcement_open: z.boolean(),
  schedule_registration_text: z.string().min(1, 'Jadwal pendaftaran wajib diisi'),
  schedule_verification_text: z.string().min(1, 'Jadwal verifikasi berkas wajib diisi'),
  schedule_announcement_text: z.string().min(1, 'Jadwal pengumuman wajib diisi'),
  announcement_banner_text: z.string().nullable().optional(),
})

export type PpdbSettingsInput = z.infer<typeof ppdbSettingsSchema>

export const educationLevelSchema = z.object({
  id: z.string().uuid('ID jenjang tidak valid'),
  name: z.string().min(1, 'Nama jenjang wajib diisi'),
  age_requirement_text: z.string().min(1, 'Syarat usia wajib diisi (contoh: Usia 4 - 5 Tahun)'),
  quota: z.coerce.number().min(1, 'Kuota minimal adalah 1 siswa'),
  is_active: z.boolean(),
})

export type EducationLevelInput = z.infer<typeof educationLevelSchema>

