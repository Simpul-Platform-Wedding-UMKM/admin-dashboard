import { apiFetch } from '@/lib/api'
import { dummyDb, type ExtendedVendor } from '@/lib/dummyData'
import type { VendorVerification, VerificationLog } from '@/lib/types'

// ── Vendor Verifications ──────────────────────────────────────────────

export async function getVendorVerifications(): Promise<VendorVerification[]> {
  try {
    return await apiFetch<VendorVerification[]>('/admin/vendor-verifications')
  } catch {
    // Fallback to dummy data
    const vendors = dummyDb.getVendors()
    return vendors.map(v => ({
      vendorId: v.id,
      businessName: v.businessName,
      category: v.businessType,
      region: v.region,
      status: v.status === 'ACTIVE'
        ? 'VERIFIED'
        : v.status === 'REJECTED'
          ? 'REJECTED'
          : 'PENDING',
      submittedAt: v.createdAt,
      documents: {
        ktpUrl: v.ktpUrl || '',
        npwpUrl: v.npwpUrl || '',
        siupUrl: v.siupUrl || '',
        mouUrl: v.mouUrl || '',
      },
    } as VendorVerification))
  }
}

export async function getVendorVerificationById(id: string): Promise<ExtendedVendor> {
  try {
    return await apiFetch<ExtendedVendor>(`/admin/vendor-verifications/${id}`)
  } catch {
    const vendor = dummyDb.getVendorById(id)
    if (!vendor) throw new Error('Vendor tidak ditemukan')
    return vendor
  }
}

// ── Verification Actions ──────────────────────────────────────────────

export async function approveVerification(vendorId: string, notes?: string): Promise<void> {
  try {
    await apiFetch(`/admin/vendor-verifications/${vendorId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    })
  } catch {
    // Fallback: update local dummy data
    dummyDb.updateVendor(vendorId, {
      kycVerified: true,
      status: 'ACTIVE' as any,
      kycVerifiedAt: new Date().toISOString(),
    })
  }

  // Always record the log locally
  dummyDb.addVerificationLog({
    vendorId,
    adminId: 'admin-1',
    adminName: 'Admin Super',
    action: 'APPROVE',
    notes,
  })
}

export async function rejectVerification(
  vendorId: string,
  reason: string,
  rejectedDocuments: string[] = [],
): Promise<void> {
  try {
    await apiFetch(`/admin/vendor-verifications/${vendorId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason, rejectedDocuments }),
    })
  } catch {
    // Fallback: update local dummy data
    dummyDb.updateVendor(vendorId, {
      kycVerified: false,
      status: 'REJECTED' as any,
      rejectionReason: reason,
    } as any)
  }

  // Always record the log locally
  dummyDb.addVerificationLog({
    vendorId,
    adminId: 'admin-1',
    adminName: 'Admin Super',
    action: 'REJECT',
    reason,
    rejectedDocuments,
  })
}

// ── Verification Logs ─────────────────────────────────────────────────

export async function getVerificationLogs(vendorId?: string): Promise<VerificationLog[]> {
  try {
    const url = vendorId
      ? `/admin/vendor-verifications/${vendorId}/logs`
      : '/admin/vendor-verifications/logs'
    return await apiFetch<VerificationLog[]>(url)
  } catch {
    return dummyDb.getVerificationLogs(vendorId)
  }
}
