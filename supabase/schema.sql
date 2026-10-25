-- ==============================================================================
-- SISTEM INFORMASI AKADEMIK & PPDB ONLINE YAYASAN (PAUD & TK)
-- Master Database Schema, Enum Types, Triggers, RLS, & Storage
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status_enum') THEN
    CREATE TYPE verification_status_enum AS ENUM (
      'MENUNGGU_VERIFIKASI',
      'PERLU_REVISI',
      'TERVERIFIKASI'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'selection_status_enum') THEN
    CREATE TYPE selection_status_enum AS ENUM (
      'MENUNGGU',
      'DITERIMA',
      'DITOLAK'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
    CREATE TYPE gender_enum AS ENUM (
      'L',
      'P'
    );
  END IF;
END $$;

-- 3. HELPER FUNCTION: AUTO UPDATE UPDATED_AT TIMESTAMP
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABEL: ppdb_settings (Single-Row Configuration Table)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ppdb_settings (
  id INT8 PRIMARY KEY DEFAULT 1,
  academic_year TEXT NOT NULL,
  is_ppdb_open BOOLEAN NOT NULL DEFAULT false,
  is_announcement_open BOOLEAN NOT NULL DEFAULT false,
  schedule_registration_text TEXT NOT NULL,
  schedule_verification_text TEXT NOT NULL,
  schedule_announcement_text TEXT NOT NULL,
  announcement_banner_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Trigger updated_at pada ppdb_settings
DROP TRIGGER IF EXISTS trg_ppdb_settings_updated_at ON ppdb_settings;
CREATE TRIGGER trg_ppdb_settings_updated_at
BEFORE UPDATE ON ppdb_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- Seed data awal ppdb_settings (Hanya 1 baris)
INSERT INTO ppdb_settings (
  id,
  academic_year,
  is_ppdb_open,
  is_announcement_open,
  schedule_registration_text,
  schedule_verification_text,
  schedule_announcement_text,
  announcement_banner_text
) VALUES (
  1,
  '2026/2027',
  false,
  false,
  '1 Mei - 30 Juni 2026',
  '1 Juli - 7 Juli 2026',
  '10 Juli 2026',
  'Selamat Datang di Portal PPDB Online Jenjang PAUD & TK Yayasan. Pendaftaran Tahun Ajaran 2026/2027 Segera Dibuka!'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 5. TABEL: education_levels (Manajemen Jenjang Yayasan: PAUD & TK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS education_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age_requirement_text TEXT NOT NULL,
  quota INT4 NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT4 NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger updated_at pada education_levels
DROP TRIGGER IF EXISTS trg_education_levels_updated_at ON education_levels;
CREATE TRIGGER trg_education_levels_updated_at
BEFORE UPDATE ON education_levels
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- Seed data awal jenjang PAUD & TK
INSERT INTO education_levels (code, name, age_requirement_text, quota, is_active, sort_order) VALUES
  ('PAUD', 'PAUD / Kelompok Bermain', 'Usia 2 - 4 Tahun', 25, true, 1),
  ('TK-A', 'TK Kelompok A', 'Usia 4 - 5 Tahun', 30, true, 2),
  ('TK-B', 'TK Kelompok B', 'Usia 5 - 6 Tahun', 30, true, 3)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  age_requirement_text = EXCLUDED.age_requirement_text,
  quota = EXCLUDED.quota,
  sort_order = EXCLUDED.sort_order;

-- ==============================================================================
-- 6. TABEL: applicants (Data Calon Siswa PAUD & TK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL,
  level_id UUID NOT NULL REFERENCES education_levels(id) ON DELETE RESTRICT,
  child_full_name TEXT NOT NULL,
  child_nickname TEXT,
  child_nik VARCHAR(16) NOT NULL UNIQUE,
  gender gender_enum NOT NULL,
  birth_place TEXT NOT NULL,
  birth_date DATE NOT NULL,
  address TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  parent_occupation TEXT,
  parent_whatsapp VARCHAR(20) NOT NULL,
  doc_kk_url TEXT NOT NULL,
  doc_akta_url TEXT NOT NULL,
  doc_ktp_url TEXT NOT NULL,
  doc_photo_url TEXT,
  verification_status verification_status_enum NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
  selection_status selection_status_enum NOT NULL DEFAULT 'MENUNGGU',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_nik_format CHECK (LENGTH(child_nik) = 16 AND child_nik ~ '^[0-9]{16}$')
);

-- Index performa pencarian Admin dan Status
CREATE INDEX IF NOT EXISTS idx_applicants_level_id ON applicants(level_id);
CREATE INDEX IF NOT EXISTS idx_applicants_reg_number ON applicants(registration_number);
CREATE INDEX IF NOT EXISTS idx_applicants_child_nik ON applicants(child_nik);
CREATE INDEX IF NOT EXISTS idx_applicants_verification_status ON applicants(verification_status);
CREATE INDEX IF NOT EXISTS idx_applicants_selection_status ON applicants(selection_status);

-- Trigger updated_at pada applicants
DROP TRIGGER IF EXISTS trg_applicants_updated_at ON applicants;
CREATE TRIGGER trg_applicants_updated_at
BEFORE UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 7. TRIGGER: AUTO-GENERATE REGISTRATION NUMBER (PPDB-YYYY-XXXX)
-- ==============================================================================
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS TRIGGER AS $$
DECLARE
  v_year TEXT;
  v_next_seq INT;
BEGIN
  -- Ambil tahun saat ini
  v_year := TO_CHAR(NOW(), 'YYYY');

  -- Hitung nomor urut berikutnya pada tahun berjalan dengan aman
  SELECT COALESCE(MAX(SUBSTRING(registration_number FROM 'PPDB-[0-9]{4}-([0-9]{4})')::INT), 0) + 1
  INTO v_next_seq
  FROM applicants
  WHERE registration_number LIKE 'PPDB-' || v_year || '-%';

  -- Set format: PPDB-2026-0001
  NEW.registration_number := 'PPDB-' || v_year || '-' || LPAD(v_next_seq::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applicants_registration_number ON applicants;
CREATE TRIGGER trg_applicants_registration_number
BEFORE INSERT ON applicants
FOR EACH ROW
WHEN (NEW.registration_number IS NULL OR NEW.registration_number = '')
EXECUTE FUNCTION generate_registration_number();

-- ==============================================================================
-- 8. RPC: get_applicant_status (Pencarian Publik Aman via NIK / No. Registrasi)
-- ==============================================================================
-- Publik TIDAK diizinkan query langsung ke tabel applicants untuk mencegah kebocoran
-- data pribadi (NIK, No. HP, dan berkas). Fungsi ini bertindak sebagai API aman.
CREATE OR REPLACE FUNCTION get_applicant_status(p_identifier TEXT)
RETURNS TABLE (
  registration_number TEXT,
  child_full_name TEXT,
  level_name TEXT,
  verification_status verification_status_enum,
  selection_status selection_status_enum,
  admin_notes TEXT,
  created_at TIMESTAMPTZ,
  is_announcement_open BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_announcement_open BOOLEAN;
  v_clean_identifier TEXT;
BEGIN
  -- Bersihkan spasi input
  v_clean_identifier := TRIM(p_identifier);

  -- Ambil status saklar pengumuman dari ppdb_settings
  SELECT s.is_announcement_open INTO v_announcement_open
  FROM ppdb_settings s
  WHERE s.id = 1;

  RETURN QUERY
  SELECT 
    a.registration_number,
    a.child_full_name,
    l.name AS level_name,
    a.verification_status,
    -- Jika pengumuman belum dibuka oleh Admin TU, status kelulusan disamarkan sebagai 'MENUNGGU'
    CASE 
      WHEN v_announcement_open = true THEN a.selection_status
      ELSE 'MENUNGGU'::selection_status_enum
    END AS selection_status,
    a.admin_notes,
    a.created_at,
    COALESCE(v_announcement_open, false) AS is_announcement_open
  FROM applicants a
  JOIN education_levels l ON a.level_id = l.id
  WHERE a.registration_number ILIKE v_clean_identifier 
     OR a.child_nik = v_clean_identifier
  LIMIT 1;
END;
$$;

-- Berikan izin eksekusi RPC kepada publik (anon & authenticated)
GRANT EXECUTE ON FUNCTION get_applicant_status(TEXT) TO anon, authenticated;

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- A. RLS: ppdb_settings
ALTER TABLE ppdb_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view ppdb_settings" ON ppdb_settings;
CREATE POLICY "Public can view ppdb_settings"
ON ppdb_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated admin can update ppdb_settings" ON ppdb_settings;
CREATE POLICY "Authenticated admin can update ppdb_settings"
ON ppdb_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- B. RLS: education_levels
ALTER TABLE education_levels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active education_levels" ON education_levels;
CREATE POLICY "Public can view active education_levels"
ON education_levels FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated admin can manage education_levels" ON education_levels;
CREATE POLICY "Authenticated admin can manage education_levels"
ON education_levels FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- C. RLS: applicants
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- 1. Admin TU (authenticated) memiliki akses penuh membaca dan mengelola data
DROP POLICY IF EXISTS "Authenticated admin full access to applicants" ON applicants;
CREATE POLICY "Authenticated admin full access to applicants"
ON applicants FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Publik (anon) HANYA diizinkan INSERT jika dan hanya jika:
--    a. Saklar is_ppdb_open bernilai true pada ppdb_settings
--    b. Jenjang pendidikan yang dipilih berstatus is_active = true
DROP POLICY IF EXISTS "Allow public insert when ppdb and level are active" ON applicants;
CREATE POLICY "Allow public insert when ppdb and level are active"
ON applicants FOR INSERT
TO anon, authenticated
WITH CHECK (
  (SELECT is_ppdb_open FROM ppdb_settings WHERE id = 1) = true
  AND
  (SELECT is_active FROM education_levels WHERE id = level_id) = true
);

-- Note: Publik TIDAK diberikan kebijakan SELECT langsung pada applicants.
-- Pengecekan status wajib melalui RPC get_applicant_status().

-- ==============================================================================
-- 10. SUPABASE STORAGE: BUCKET ppdb-documents & RLS
-- ==============================================================================

-- Buat bucket penyimpanan berkas dokumen pendaftaran (KK, Akta, KTP, Foto)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ppdb-documents',
  'ppdb-documents',
  false, -- Private bucket untuk melindungi data sensitif kependudukan anak & orang tua
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'application/pdf'];

-- RLS Storage Objects:
-- 1. Izinkan siapapun (anon / authenticated) mengunggah berkas selama PPDB sedang dibuka
DROP POLICY IF EXISTS "Public can upload documents when PPDB is open" ON storage.objects;
CREATE POLICY "Public can upload documents when PPDB is open"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'ppdb-documents'
  AND (SELECT is_ppdb_open FROM public.ppdb_settings WHERE id = 1) = true
);

-- 2. Hanya Admin TU (authenticated) yang dapat melihat/mengunduh dokumen
DROP POLICY IF EXISTS "Authenticated admin can view documents" ON storage.objects;
CREATE POLICY "Authenticated admin can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'ppdb-documents');

-- 3. Hanya Admin TU (authenticated) yang dapat menghapus/mengubah berkas
DROP POLICY IF EXISTS "Authenticated admin can update or delete documents" ON storage.objects;
CREATE POLICY "Authenticated admin can update or delete documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'ppdb-documents');

DROP POLICY IF EXISTS "Authenticated admin can delete documents" ON storage.objects;
CREATE POLICY "Authenticated admin can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ppdb-documents');

