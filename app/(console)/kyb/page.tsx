'use client'

import { useEffect, useState, useCallback } from 'react'
import { getVendors } from '@/lib/services/vendor'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Vendor } from '@/lib/types'

export default function KYBVerificationPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getVendors()
      setVendors(data)
    } catch {
      setError('Gagal memuat data vendor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">KYB Verification</h1>
          <p className="text-body-md text-on-surface-variant">Verify and approve vendor KYC/KYB documentation</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-md">
          <AlertCircle className="h-12 w-12 text-error" />
          <p className="text-body-md text-on-surface-variant text-center">{error}</p>
          <Button onClick={fetchVendors} variant="outline">
            Coba lagi
          </Button>
        </div>
      </main>
    )
  }

  const kybPending = vendors.filter(v => !v.kycVerified).map(v => ({
    id: `KYB-${v.id}`,
    vendorId: v.id,
    vendorName: v.name,
    businessName: v.businessName,
    businessType: v.businessType,
    status: 'PENDING' as const,
  }))

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">KYB Verification</h1>
        <p className="text-body-md text-on-surface-variant">Verify and approve vendor KYC/KYB documentation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {loading ? (
          <>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          </>
        ) : (
          <>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Vendors</p>
              <p className="text-headline-lg text-on-surface font-semibold">{vendors.length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">KYC Verified</p>
              <p className="text-headline-lg text-tertiary-container font-semibold">{vendors.filter(v => v.kycVerified).length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Pending KYC</p>
              <p className="text-headline-lg text-tertiary font-semibold">{kybPending.length}</p>
            </Card>
          </>
        )}
      </div>

      {/* KYB Applications */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">KYB Applications</h2>
        <div className="grid gap-md md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-md bg-surface-container border border-outline-variant">
                  <Skeleton className="h-5 w-32 mb-xs" />
                  <Skeleton className="h-4 w-24 mb-md" />
                  <Skeleton className="h-4 w-full mb-xs" />
                  <Skeleton className="h-4 w-20" />
                </Card>
              ))
            : kybPending.map((app) => (
                <Card key={app.id} className="p-md bg-surface-container border border-outline-variant hover:shadow-elevated transition-shadow">
                  <div className="mb-md">
                    <h3 className="text-body-md text-on-surface font-semibold mb-xs">{app.vendorName}</h3>
                    <p className="text-label-sm text-on-surface-variant">{app.businessType}</p>
                  </div>
                  <div className="space-y-xs mb-md text-label-sm text-on-surface-variant">
                    <p>Business: {app.businessName}</p>
                    <p>ID: {app.vendorId}</p>
                  </div>
                  <Badge className="bg-tertiary text-on-tertiary">{app.status}</Badge>
                </Card>
              ))}
        </div>
      </Card>

      {/* Verified Vendors */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">KYC Verified Vendors</h2>
        {loading ? (
          <div className="space-y-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <Skeleton className="h-5 w-40 mb-sm" />
                <Skeleton className="h-4 w-24 mb-sm" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-md">
            {vendors.filter(v => v.kycVerified).slice(0, 5).map((vendor) => (
              <div key={vendor.id} className="p-md bg-surface-container rounded-md border border-outline-variant hover:bg-surface-container-high transition-colors">
                <div className="flex items-start justify-between mb-sm">
                  <div>
                    <p className="text-body-md text-on-surface font-semibold">{vendor.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{vendor.businessType}</p>
                  </div>
                  <Badge className="bg-tertiary-container text-on-tertiary-container">Verified</Badge>
                </div>
                <p className="text-label-sm text-on-surface-variant">Verified: {new Date(vendor.kycVerifiedAt || '').toLocaleDateString('id-ID')}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  )
}
