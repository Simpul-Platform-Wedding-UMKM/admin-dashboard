import { apiFetch } from '@/lib/api'
import type { Vendor } from '@/lib/types'

// Shape dari GET /admin/dashboard — endpoint admin dengan mapping lengkap.
interface AdminDashboardResponse {
  vendors: Vendor[]
}

export async function getVendors(): Promise<Vendor[]> {
  const data = await apiFetch<AdminDashboardResponse>('/admin/dashboard')
  return data.vendors
}

export async function getVendorById(id: string): Promise<Vendor> {
  return apiFetch<Vendor>(`/vendors/${id}`)
}

export async function createVendor(data: Partial<Vendor>): Promise<Vendor> {
  return apiFetch<Vendor>('/vendors', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor> {
  return apiFetch<Vendor>(`/vendors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
