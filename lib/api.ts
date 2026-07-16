import { dummyDb } from './dummyData'

// Single fetch wrapper for calling the external SIMPUL REST API.
// Auth token is automatically injected from cookie.
// No other module should call fetch directly — always go through this.

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )simpul_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

// ponytail: Force mock mode to true for Phase 1 local visual simulation.
// To connect to a real backend later, change this to false or use process.env.NEXT_PUBLIC_USE_MOCK.
const SHOULD_MOCK = true

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ponytail: Mock API response handler for local simulation
async function handleMockRequest(endpoint: string, options?: RequestInit): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const method = options?.method ?? 'GET'
  const body = options?.body ? JSON.parse(options.body as string) : null

  // POST /auth/login
  if (endpoint === '/auth/login' && method === 'POST') {
    if (body.email === 'admin@simpul.com' && body.password === 'admin123') {
      return {
        token: 'mock-session-jwt-token-xyz',
        account: {
          id: 'admin-1',
          email: 'admin@simpul.com',
          name: 'Simpul Admin',
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        }
      }
    } else {
      throw new ApiError(401, 'Email atau password salah')
    }
  }

  // GET /vendors
  if (endpoint === '/vendors' && method === 'GET') {
    return dummyDb.getVendors()
  }

  // GET /vendors/:id
  const vendorGetMatch = endpoint.match(/^\/vendors\/([^/]+)$/)
  if (vendorGetMatch && method === 'GET') {
    const id = vendorGetMatch[1]
    const vendor = dummyDb.getVendorById(id)
    if (!vendor) throw new ApiError(404, 'Vendor tidak ditemukan')
    return vendor
  }

  // PATCH /vendors/:id
  if (vendorGetMatch && method === 'PATCH') {
    const id = vendorGetMatch[1]
    try {
      return dummyDb.updateVendor(id, body)
    } catch {
      throw new ApiError(404, 'Vendor tidak ditemukan')
    }
  }

  // GET /payment-splits
  if (endpoint === '/payment-splits' && method === 'GET') {
    return dummyDb.getPaymentSplits()
  }

  // GET /payment-splits/:id
  const splitMatch = endpoint.match(/^\/payment-splits\/([^/]+)$/)
  if (splitMatch && method === 'GET') {
    const id = splitMatch[1]
    const split = dummyDb.getPaymentSplitById(id)
    if (!split) throw new ApiError(404, 'Payment split tidak ditemukan')
    return split
  }

  // PATCH /payment-splits/:id
  if (splitMatch && method === 'PATCH') {
    const id = splitMatch[1]
    try {
      return dummyDb.updatePaymentSplit(id, body)
    } catch {
      throw new ApiError(404, 'Payment split tidak ditemukan')
    }
  }

  // GET /disputes
  if (endpoint === '/disputes' && method === 'GET') {
    return dummyDb.getDisputes()
  }

  // GET /disputes/:id
  const disputeMatch = endpoint.match(/^\/disputes\/([^/]+)$/)
  if (disputeMatch && method === 'GET') {
    const id = disputeMatch[1]
    const dispute = dummyDb.getDisputeById(id)
    if (!dispute) throw new ApiError(404, 'Dispute tidak ditemukan')
    return dispute
  }

  // PATCH /disputes/:id
  if (disputeMatch && method === 'PATCH') {
    const id = disputeMatch[1]
    try {
      return dummyDb.updateDispute(id, body)
    } catch {
      throw new ApiError(404, 'Dispute tidak ditemukan')
    }
  }

  // GET /heatmap
  if (endpoint === '/heatmap' && method === 'GET') {
    return dummyDb.getHeatmapData()
  }

  // GET /audit-logs
  if (endpoint === '/audit-logs' && method === 'GET') {
    return dummyDb.getAuditLogs()
  }

  // GET /system-users
  if (endpoint === '/system-users' && method === 'GET') {
    return dummyDb.getSystemUsers()
  }

  // GET /featured-slots
  if (endpoint === '/featured-slots' && method === 'GET') {
    return dummyDb.getFeaturedSlots()
  }

  // GET /compliance-checks
  if (endpoint === '/compliance-checks' && method === 'GET') {
    return dummyDb.getComplianceChecks()
  }

  // GET /ai-analytics-logs
  if (endpoint === '/ai-analytics-logs' && method === 'GET') {
    return dummyDb.getAIAnalyticsLogs()
  }

  throw new ApiError(404, `Mock endpoint ${method} ${endpoint} tidak ditemukan`)
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (SHOULD_MOCK) {
    return handleMockRequest(endpoint, options) as Promise<T>
  }

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

