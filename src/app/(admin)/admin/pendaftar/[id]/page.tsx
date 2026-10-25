import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  VerificationFormViewer,
  type ApplicantDetailData,
} from '@/components/admin/verification-form-viewer'
import { getDocumentSignedUrls } from '@/actions/verification-actions'

export const dynamic = 'force-dynamic'

interface AdminPendaftarDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminPendaftarDetailPage({
  params,
}: AdminPendaftarDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Ambil data pendaftar beserta detail jenjang
  const { data: rawApplicant, error } = await supabase
    .from('applicants')
    .select('*, education_level:education_levels(name, code, age_requirement_text)')
    .eq('id', id)
    .single()

  if (error || !rawApplicant) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Data Pendaftar Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Data calon siswa dengan ID tersebut mungkin telah dihapus atau link yang Anda buka salah.
        </p>
        <Link
          href="/admin/pendaftar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006633] text-white font-bold text-xs hover:bg-[#004d26] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pendaftar</span>
        </Link>
      </div>
    )
  }

  const applicant = rawApplicant as unknown as ApplicantDetailData

  // 2. Generate Signed URLs (60 menit) di sisi server untuk berkas private
  const signedUrlsRes = await getDocumentSignedUrls({
    kk: applicant.doc_kk_url,
    akta: applicant.doc_akta_url,
    ktp: applicant.doc_ktp_url,
    photo: applicant.doc_photo_url,
  })

  const signedUrls = signedUrlsRes.data || {
    kkUrl: null,
    aktaUrl: null,
    ktpUrl: null,
    photoUrl: null,
  }

  return (
    <VerificationFormViewer
      applicant={applicant}
      signedUrls={signedUrls}
    />
  )
}

