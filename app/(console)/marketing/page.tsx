'use client'

import { useState, useEffect } from 'react'
import { getFeaturedSlots } from '@/lib/services/marketing'
import { getVendors } from '@/lib/services/vendor'
import type { FeaturedSlot, Vendor } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Star, AlertCircle, Sparkles } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils-simpul'

export default function MarketingFeaturedPage() {
  const [featuredSlots, setFeaturedSlots] = useState<FeaturedSlot[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [slots, allVendors] = await Promise.all([
        getFeaturedSlots(),
        getVendors(),
      ])
      setFeaturedSlots(slots)
      setVendors(allVendors)
    } catch {
      setError('Gagal memuat data pemasaran')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const activeSlots = featuredSlots.filter(s => s.isActive).length
  const totalRevenue = featuredSlots.reduce((sum, s) => sum + s.monthlyFee, 0)
  const premiumCount = featuredSlots.filter(s => s.premiumStatus === 'PREMIUM').length
  const platinumCount = featuredSlots.filter(s => s.premiumStatus === 'PLATINUM').length

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-md py-xl">
          <AlertCircle className="w-12 h-12 text-error" />
          <p className="text-body-md text-on-surface-variant">{error}</p>
          <Button onClick={fetchData} variant="outline">Coba lagi</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Pemasaran & Slot Unggulan</h1>
        <p className="text-body-md text-on-surface-variant">Kelola penempatan vendor premium, slot promosi, dan status keunggulan mitra.</p>
      </div>

      {/* Featured Slots Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
                <Skeleton className="h-4 w-20 mb-xs" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Slot Aktif</p>
              <p className="text-headline-lg text-tertiary font-bold">{activeSlots}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Omzet Promo</p>
              <p className="text-headline-lg text-primary font-bold break-words">{formatNumber(totalRevenue)}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Vendor Premium</p>
              <p className="text-headline-lg text-tertiary-container font-bold">{premiumCount}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Vendor Platinum</p>
              <p className="text-headline-lg text-tertiary-fixed font-bold">{platinumCount}</p>
            </Card>
          </>
        )}
      </div>

      {/* Featured Slots List */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Daftar Slot Unggulan Aktif</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <Skeleton className="h-5 w-40 mb-xs" />
                <Skeleton className="h-4 w-24 mb-md" />
                <Skeleton className="h-4 w-60 mb-md" />
                <div className="grid grid-cols-3 gap-md">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))
          ) : (
            featuredSlots.map((slot) => {
              const vendor = vendors.find(v => v.id === slot.vendorId)
              return (
                <div key={slot.id} className="p-md bg-surface-container rounded-md border border-outline-variant hover:shadow-elevated transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-sm">
                      <div className="min-w-0">
                        <div className="flex items-center gap-xs mb-xs">
                          <p className="text-body-md text-on-surface font-bold truncate">{vendor?.businessName || vendor?.name}</p>
                          <Star className="w-4 h-4 text-tertiary fill-tertiary shrink-0" />
                        </div>
                        <p className="text-label-xs text-on-surface-variant font-mono">ID Slot: {slot.id}</p>
                      </div>
                      <div className="flex gap-xs items-center shrink-0">
                        <Badge className={slot.premiumStatus === 'BASIC' ? 'bg-surface-container text-on-surface' : slot.premiumStatus === 'PREMIUM' ? 'bg-tertiary text-on-tertiary' : 'bg-tertiary-fixed text-on-tertiary-fixed'}>
                          {slot.premiumStatus}
                        </Badge>
                        {slot.isActive && (
                          <Badge className="bg-tertiary-container text-on-tertiary-container">Aktif</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-body-sm text-on-surface font-semibold mb-md">
                      Biaya Iklan: <span className="text-primary">{formatCurrency(slot.monthlyFee)}</span> <span className="text-label-sm font-normal text-on-surface-variant">/ bulan</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-xs pt-xs border-t border-outline-variant text-label-xs text-on-surface-variant">
                    <div>Mulai: {new Date(slot.startDate).toLocaleDateString('id-ID')}</div>
                    <div>Selesai: {new Date(slot.endDate).toLocaleDateString('id-ID')}</div>
                    <div>Dibuat: {new Date(slot.createdAt).toLocaleDateString('id-ID')}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Available Vendors */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md flex items-center gap-xs">
          <Sparkles className="h-5 w-5 text-tertiary" /> Vendor Aktif yang Tersedia untuk Promosi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-md bg-surface-container border border-outline-variant">
                <Skeleton className="h-5 w-32 mb-xs" />
                <Skeleton className="h-4 w-24 mb-md" />
                <Skeleton className="h-4 w-28 mb-xs" />
                <Skeleton className="h-4 w-28 mb-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </Card>
            ))
          ) : (
            vendors.filter(v => v.status === 'ACTIVE' && !featuredSlots.find(s => s.vendorId === v.id)).slice(0, 6).map((vendor) => (
              <Card key={vendor.id} className="p-md bg-surface-container border border-outline-variant hover:shadow-elevated transition-shadow flex flex-col justify-between gap-md">
                <div>
                  <div className="mb-sm">
                    <p className="text-body-md text-on-surface font-bold">{vendor.businessName}</p>
                    <p className="text-label-sm text-on-surface-variant">{vendor.businessType} &bull; {vendor.region}</p>
                  </div>
                  <div className="space-y-xs text-label-sm text-on-surface-variant">
                    <p>Peringkat Mitra: <span className="font-semibold text-on-surface">{vendor.averageRating.toFixed(1)}★</span> ({vendor.totalReviews} ulasan)</p>
                    <p>Total Omzet Mitra: <span className="font-semibold text-on-surface">{formatCurrency(vendor.totalRevenue)}</span></p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </main>
  )
}
