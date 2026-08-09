// Mock session storage using a plain cookie so the `middleware.ts` route
// guard (which runs on the edge, no `localStorage`/`document`) can read it.
//
// Swap this whole file for NextAuth/JWT later — `getSession`/`clearSession`
// are the only two functions the rest of the app touches (SiteHeader,
// NavUser, middleware), so the surface area to migrate is small.

import type { AccountRole } from './types'

export const SESSION_COOKIE = 'simpul_session'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: AccountRole
}

// Cookie attributes: Secure (HTTPS prod) + SameSite=Lax (anti-CSRF).
// HttpOnly tidak bisa dipakai karena token dibaca JS client-side (api.ts);
// trade-off dicatat di docs/DEPLOY_SECURITY.md.
const COOKIE_ATTRS =
  typeof window !== 'undefined' && window.location.protocol === 'https:'
    ? '; Secure; SameSite=Lax'
    : '; SameSite=Lax'

export function setSession(user: SessionUser, remember: boolean) {
  const value = encodeURIComponent(JSON.stringify(user))
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined // 30 days, or browser-session cookie
  document.cookie = `${SESSION_COOKIE}=${value}; path=/${maxAge ? `; max-age=${maxAge}` : ''}${COOKIE_ATTRS}`
}

export function getSession(): SessionUser | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return null
  }
}

export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
  document.cookie = `simpul_token=; path=/; max-age=0`
}

export const TOKEN_COOKIE = 'simpul_token'

// JWT disimpan 12 jam (lebih pendek dari expiry 7d di backend) — mengurangi
// jendela paparan jika token bocor.
const TOKEN_MAX_AGE = 60 * 60 * 12

export function setToken(token: string) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}${COOKIE_ATTRS}`
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`
}
