import { apiFetch } from '@/lib/api'
import type { VendorVerification, VerificationLog } from '@/lib/types'

// ── Vendor Verifications (backend real, no mock fallback) ─────────────
// Backend admin router di-mount di "/" — endpoint tanpa prefix /admin
// (konsisten dengan /payment-splits, /system-users).

export async function getVendorVerifications(): Promise<VendorVerification[]> {
  return apiFetch<VendorVerification[]>('/vendor-verifications')
}

export async function getVendorVerificationById(id: string): Promise<any> {
  return apiFetch(`/vendor-verifications/${id}`)
}

// ── Verification Actions (reuse PATCH /vendors/:id) ────────────────────

export async function approveVerification(vendorId: string, notes?: string): Promise<void> {
  await apiFetch(`/vendors/${vendorId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      kybStatus: 'VERIFIED',
      kybVerified: true,
      rejectedReason: null,
    }),
  })
}

export async function rejectVerification(
  vendorId: string,
  reason: string,
  rejectedDocuments: string[] = [],
): Promise<void> {
  await apiFetch(`/vendors/${vendorId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      kybStatus: 'REJECTED',
      kybVerified: false,
      rejectedReason: reason,
    }),
  })
}

// ── Verification Logs ──────────────────────────────────────────────────
// Backend belum punya tabel log verifikasi — dashboard tidak menampilkan
// log dari mock lagi. Return kosong (UI menampilkan "Belum ada riwayat").
export async function getVerificationLogs(vendorId?: string): Promise<VerificationLog[]> {
  return []
}
