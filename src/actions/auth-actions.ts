'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface AuthActionResponse {
  success: boolean
  message: string
}

/**
 * Server Action: Login Admin TU
 */
export async function signInAction(
  prevState: AuthActionResponse | null,
  formData: FormData
): Promise<AuthActionResponse> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      success: false,
      message: 'Email dan password wajib diisi.',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    return {
      success: false,
      message: 'Email atau password yang Anda masukkan salah. Pastikan akun Admin telah terdaftar di Supabase Auth.',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

/**
 * Server Action: Logout Admin TU
 */
export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
