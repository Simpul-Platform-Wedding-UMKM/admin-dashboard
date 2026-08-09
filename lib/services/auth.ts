// Auth service — calls backend login endpoint.
// Token is stored separately from session cookie.

import { apiFetch } from '@/lib/api'
import { setSession, setToken } from '@/lib/session'
import type { Account } from '@/lib/types'

export type LoginResult =
  | { success: true }
  | { success: false; message: string }

export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const res = await apiFetch<{ token: string; account: Account }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    setToken(res.token)
    const account = res.account as any
    setSession({
      id: account.id,
      email: account.email,
      name: account.fullName ?? account.name ?? '',
      role: account.role,
    }, true)

    return { success: true }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan saat login'
    return { success: false, message }
  }
}
