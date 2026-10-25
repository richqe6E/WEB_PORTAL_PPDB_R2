import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  School,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOutAction } from '@/actions/auth-actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Jika tidak ada user, redirect ke halaman login
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      <Toaster richColors position="top-right" />

      {/* ADMIN TOP NAVBAR (POLNES ACADEMIC GREEN THEME) */}
      <header className="sticky top-0 z-50 bg-[#006633] text-white shadow-md border-b border-[#004d26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* BRANDING */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-white/80 font-medium">
                  Portal Tata Usaha
                </span>
                <span className="block font-bold text-base leading-tight text-white">
                  PPDB Yayasan (PAUD & TK)
                </span>
              </div>
            </div>

            {/* NAV LINKS DESKTOP */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-white/80" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/admin/pendaftar"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Users className="w-4 h-4 text-white/80" />
                <span>Data Pendaftar</span>
              </Link>

              <Link
                href="/admin/pengaturan"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4 text-white/80" />
                <span>Pengaturan PPDB</span>
              </Link>
            </nav>

            {/* USER & ACTIONS */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Buka Website Publik di Tab Baru"
              >
                <span>Halaman Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D0FFD5]" />
                <span className="max-w-[150px] truncate">{user.email}</span>
              </div>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EE2737] hover:bg-[#c51c2a] text-white transition-colors shadow-sm"
                  title="Keluar dari Portal Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* MOBILE SUB-NAV */}
        <div className="md:hidden border-t border-white/10 bg-[#004d26] px-4 py-2 flex items-center justify-around text-xs">
          <Link
            href="/admin"
            className="flex items-center gap-1 py-1.5 px-2.5 rounded text-white font-medium hover:bg-white/10"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/pendaftar"
            className="flex items-center gap-1 py-1.5 px-2.5 rounded text-white font-medium hover:bg-white/10"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pendaftar</span>
          </Link>
          <Link
            href="/admin/pengaturan"
            className="flex items-center gap-1 py-1.5 px-2.5 rounded text-white font-medium hover:bg-white/10"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* FOOTER ADMIN */}
      <footer className="bg-white border-t border-[#DFE3E9] py-4 text-center text-xs text-[#667686]">
        &copy; {new Date().getFullYear()} Sistem Informasi Akademik & PPDB Yayasan (Jenjang PAUD & TK). Hak Cipta Dilindungi.
      </footer>
    </div>
  )
}

