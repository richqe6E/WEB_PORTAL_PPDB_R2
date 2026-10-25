import React from 'react'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  VerificationStatusEnum,
  SelectionStatusEnum,
  GenderEnum,
} from '@/types/database.types'

interface VerificationBadgeProps {
  status: VerificationStatusEnum
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export function VerificationBadge({
  status,
  className,
  showIcon = true,
  size = 'md',
}: VerificationBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  switch (status) {
    case 'TERVERIFIKASI':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-bold rounded-[4px] border bg-emerald-50 text-emerald-900 border-emerald-300',
            sizeClasses,
            className
          )}
        >
          {showIcon && <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-[#006633]'} />}
          <span>Terverifikasi</span>
        </span>
      )
    case 'PERLU_REVISI':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-bold rounded-[4px] border bg-rose-50 text-rose-900 border-rose-300',
            sizeClasses,
            className
          )}
        >
          {showIcon && <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-rose-700'} />}
          <span>Perlu Revisi</span>
        </span>
      )
    case 'MENUNGGU_VERIFIKASI':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-bold rounded-[4px] border bg-amber-50 text-amber-900 border-amber-300',
            sizeClasses,
            className
          )}
        >
          {showIcon && <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-amber-700'} />}
          <span>Menunggu</span>
        </span>
      )
  }
}

interface SelectionBadgeProps {
  status: SelectionStatusEnum
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export function SelectionBadge({
  status,
  className,
  showIcon = true,
  size = 'md',
}: SelectionBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  switch (status) {
    case 'DITERIMA':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-bold rounded-[4px] bg-[#006633] text-white border border-[#004d26] shadow-2xs',
            sizeClasses,
            className
          )}
        >
          {showIcon && <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
          <span>DITERIMA</span>
        </span>
      )
    case 'DITOLAK':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-bold rounded-[4px] border bg-rose-100 text-rose-900 border-rose-300',
            sizeClasses,
            className
          )}
        >
          {showIcon && <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
          <span>DITOLAK</span>
        </span>
      )
    case 'MENUNGGU':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-semibold rounded-[4px] border bg-slate-100 text-slate-700 border-slate-300',
            sizeClasses,
            className
          )}
        >
          {showIcon && <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
          <span>Belum Putus</span>
        </span>
      )
  }
}

export function GenderBadge({ gender }: { gender: GenderEnum }) {
  if (gender === 'L') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
        <User className="w-3 h-3" />
        Laki-laki
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-pink-50 text-pink-800 border border-pink-200">
      <User className="w-3 h-3" />
      Perempuan
    </span>
  )
}
