export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type VerificationStatusEnum = 'MENUNGGU_VERIFIKASI' | 'PERLU_REVISI' | 'TERVERIFIKASI'
export type SelectionStatusEnum = 'MENUNGGU' | 'DITERIMA' | 'DITOLAK'
export type GenderEnum = 'L' | 'P'

export type Database = {
  public: {
    Tables: {
      ppdb_settings: {
        Row: {
          id: number
          academic_year: string
          is_ppdb_open: boolean
          is_announcement_open: boolean
          schedule_registration_text: string
          schedule_verification_text: string
          schedule_announcement_text: string
          announcement_banner_text: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          academic_year: string
          is_ppdb_open?: boolean
          is_announcement_open?: boolean
          schedule_registration_text: string
          schedule_verification_text: string
          schedule_announcement_text: string
          announcement_banner_text?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          academic_year?: string
          is_ppdb_open?: boolean
          is_announcement_open?: boolean
          schedule_registration_text?: string
          schedule_verification_text?: string
          schedule_announcement_text?: string
          announcement_banner_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      education_levels: {
        Row: {
          id: string
          code: string
          name: string
          age_requirement_text: string
          quota: number
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          age_requirement_text: string
          quota?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          age_requirement_text?: string
          quota?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      applicants: {
        Row: {
          id: string
          registration_number: string
          level_id: string
          child_full_name: string
          child_nickname: string | null
          child_nik: string
          gender: GenderEnum
          birth_place: string
          birth_date: string
          address: string
          father_name: string
          mother_name: string
          parent_occupation: string | null
          parent_whatsapp: string
          doc_kk_url: string
          doc_akta_url: string
          doc_ktp_url: string
          doc_photo_url: string | null
          verification_status: VerificationStatusEnum
          selection_status: SelectionStatusEnum
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registration_number?: string
          level_id: string
          child_full_name: string
          child_nickname?: string | null
          child_nik: string
          gender: GenderEnum
          birth_place: string
          birth_date: string
          address: string
          father_name: string
          mother_name: string
          parent_occupation?: string | null
          parent_whatsapp: string
          doc_kk_url: string
          doc_akta_url: string
          doc_ktp_url: string
          doc_photo_url?: string | null
          verification_status?: VerificationStatusEnum
          selection_status?: SelectionStatusEnum
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registration_number?: string
          level_id?: string
          child_full_name?: string
          child_nickname?: string | null
          child_nik?: string
          gender?: GenderEnum
          birth_place?: string
          birth_date?: string
          address?: string
          father_name?: string
          mother_name?: string
          parent_occupation?: string | null
          parent_whatsapp?: string
          doc_kk_url?: string
          doc_akta_url?: string
          doc_ktp_url?: string
          doc_photo_url?: string | null
          verification_status?: VerificationStatusEnum
          selection_status?: SelectionStatusEnum
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicants_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "education_levels"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_applicant_status: {
        Args: {
          p_identifier: string
        }
        Returns: {
          registration_number: string
          child_full_name: string
          level_name: string
          verification_status: VerificationStatusEnum
          selection_status: SelectionStatusEnum
          admin_notes: string | null
          created_at: string
          is_announcement_open: boolean
        }[]
      }
    }
    Enums: {
      verification_status_enum: VerificationStatusEnum
      selection_status_enum: SelectionStatusEnum
      gender_enum: GenderEnum
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type ApplicantRow = Database['public']['Tables']['applicants']['Row']
export type EducationLevelRow = Database['public']['Tables']['education_levels']['Row']
export type PpdbSettingsRow = Database['public']['Tables']['ppdb_settings']['Row']
export type ApplicantStatusResult = Database['public']['Functions']['get_applicant_status']['Returns'][0]
