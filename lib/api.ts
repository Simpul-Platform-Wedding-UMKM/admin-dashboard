// Single fetch wrapper for calling the external SIMPUL REST API.
// Auth token is automatically injected from cookie.
// No other module should call fetch directly — always go through this.

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )simpul_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(0, 'NEXT_PUBLIC_API_BASE_URL belum dikonfigurasi. Set di .env.local')
  }

  const token = getToken()

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!res.ok) {
    // Ambil pesan error yang informatif dari berbagai bentuk respons backend
    // ({ error }, { message }, atau { errors: [...] }) agar 400/422 terlihat jelas.
    let message = `API error ${res.status}: ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.error) {
        message = String(body.error)
      } else if (typeof body?.message === 'string') {
        message = body.message
      } else if (Array.isArray(body?.errors) && body.errors.length > 0) {
        message = body.errors
          .map((e: any) => e?.message || e?.msg || JSON.stringify(e))
          .join('; ')
      } else if (body && typeof body === 'object') {
        message = JSON.stringify(body)
      }
    } catch {
      // body bukan JSON — pakai pesan default
    }
    throw new ApiError(res.status, message)
  }

  return res.json()
}
