import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Menghitung usia anak dalam satuan Tahun dan Bulan
 * @param birthDate Tanggal lahir (format YYYY-MM-DD atau objek Date)
 * @param referenceDate Tanggal acuan (default: 1 Juli tahun pendaftaran atau hari ini)
 */
export function calculateChildAge(
  birthDate: string | Date,
  referenceDate: Date = new Date()
): { years: number; months: number; text: string } {
  if (!birthDate) {
    return { years: 0, months: 0, text: '-' }
  }

  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  if (isNaN(birth.getTime())) {
    return { years: 0, months: 0, text: '-' }
  }

  let years = referenceDate.getFullYear() - birth.getFullYear()
  let months = referenceDate.getMonth() - birth.getMonth()

  if (referenceDate.getDate() < birth.getDate()) {
    months--
  }

  if (months < 0) {
    years--
    months += 12
  }

  if (years < 0) {
    return { years: 0, months: 0, text: '0 Tahun 0 Bulan' }
  }

  return {
    years,
    months,
    text: `${years} Tahun ${months} Bulan`
  }
}

/**
 * Format tampilan tanggal Indonesia (contoh: 15 Mei 2026)
 */
export function formatDateIndo(dateStr: string | Date): string {
  if (!dateStr) return '-'
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  if (isNaN(d.getTime())) return '-'
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d)
}

/**
 * Format nomor WhatsApp ke format internasional (contoh: 08123... -> 628123...)
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }
  return cleaned
}

