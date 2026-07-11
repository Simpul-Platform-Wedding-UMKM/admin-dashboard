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
    throw new ApiError(res.status, `API error ${res.status}: ${res.statusText}`)
  }

  return res.json()
}
