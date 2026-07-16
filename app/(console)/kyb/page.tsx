'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
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
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg bg-background">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">Verifikasi KYB</h1>
          <p className="text-body-md text-on-surface-variant">Periksa dan setujui dokumen kepatuhan KYC/KYB mitra vendor pernikahan.</p>
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
    status: 'MENUNGGU',
  }))

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg bg-background animate-fade-in">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Verifikasi KYB</h1>
        <p className="text-body-md text-on-surface-variant">Periksa dan setujui dokumen kepatuhan KYC/KYB mitra vendor pernikahan.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-md">
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
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Mitra Vendor</p>
              <p className="text-headline-lg text-on-surface font-bold">{vendors.length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Lolos Verifikasi KYC</p>
              <p className="text-headline-lg text-green-600 font-bold">{vendors.filter(v => v.kycVerified).length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Menunggu Verifikasi</p>
              <p className="text-headline-lg text-tertiary font-bold">{kybPending.length}</p>
            </Card>
          </>
        )}
      </div>

      {/* KYB Applications */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Pengajuan KYB Masuk</h2>
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
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
                <Link href={`/kyb/${app.vendorId}`} key={app.id} className="block transition-transform hover:scale-[1.02]">
                  <Card className="p-md bg-surface-container border border-outline-variant hover:shadow-elevated cursor-pointer transition-shadow">
                    <div className="mb-md">
                      <h3 className="text-body-md text-on-surface font-bold mb-xs">{app.vendorName}</h3>
                      <p className="text-label-sm text-on-surface-variant">{app.businessType}</p>
                    </div>
                    <div className="space-y-xs mb-md text-label-sm text-on-surface-variant">
                      <p>Badan Usaha: <span className="font-semibold text-on-surface">{app.businessName}</span></p>
                      <p>ID Vendor: <span className="font-mono">{app.vendorId}</span></p>
                    </div>
                    <Badge className="bg-tertiary text-on-tertiary">{app.status}</Badge>
                  </Card>
                </Link>
              ))}
        </div>
      </Card>

      {/* Verified Vendors */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Vendor Terverifikasi KYC</h2>
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
              <Link href={`/kyb/${vendor.id}`} key={vendor.id} className="block transition-transform hover:scale-[1.01]">
                <div className="p-md bg-surface-container rounded-md border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
                  <div>
                    <p className="text-body-md text-on-surface font-bold">{vendor.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{vendor.businessType} &bull; {vendor.businessName}</p>
                    <p className="text-label-xs text-on-surface-variant mt-xs">Diverifikasi: {new Date(vendor.kycVerifiedAt || '').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <Badge className="bg-tertiary-container text-on-tertiary-container w-fit">Terverifikasi</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </main>
  )
}
