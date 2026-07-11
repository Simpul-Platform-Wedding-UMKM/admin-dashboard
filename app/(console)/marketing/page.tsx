'use client'

import { useState, useEffect } from 'react'
import { getFeaturedSlots } from '@/lib/services/marketing'
import { getVendors } from '@/lib/services/vendor'
import type { FeaturedSlot, Vendor } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Star, AlertCircle } from 'lucide-react'

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
      setError('Gagal memuat data marketing')
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
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div className="flex flex-col items-center justify-center gap-md py-xl">
          <AlertCircle className="w-12 h-12 text-error" />
          <p className="text-body-md text-on-surface-variant">{error}</p>
          <Button onClick={fetchData} variant="outline">Coba lagi</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Marketing & Featured Slots</h1>
        <p className="text-body-md text-on-surface-variant">Manage premium vendor placements and featured positions</p>
      </div>

      {/* Featured Slots Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
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
              <p className="text-label-sm text-on-surface-variant mb-xs">Active Slots</p>
              <p className="text-headline-lg text-tertiary font-semibold">{activeSlots}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Revenue</p>
              <p className="text-headline-lg text-primary font-semibold">Rp {(totalRevenue / 1e6).toFixed(0)}M</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Premium Vendors</p>
              <p className="text-headline-lg text-tertiary-container font-semibold">{premiumCount}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Platinum Vendors</p>
              <p className="text-headline-lg text-tertiary-fixed font-semibold">{platinumCount}</p>
            </Card>
          </>
        )}
      </div>

      {/* Featured Slots List */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Featured Slots</h2>
        <div className="space-y-md">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <Skeleton className="h-5 w-40 mb-xs" />
                <Skeleton className="h-4 w-24 mb-md" />
                <Skeleton className="h-4 w-60 mb-md" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))
          ) : (
            featuredSlots.map((slot) => {
              const vendor = vendors.find(v => v.id === slot.vendorId)
              return (
                <div key={slot.id} className="p-md bg-surface-container rounded-md border border-outline-variant hover:shadow-elevated transition-shadow">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-xs mb-xs">
                        <p className="text-body-md text-on-surface font-semibold">{vendor?.name}</p>
                        <Star className="w-4 h-4 text-tertiary fill-tertiary" />
                      </div>
                      <p className="text-label-sm text-on-surface-variant">ID: {slot.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={slot.premiumStatus === 'BASIC' ? 'bg-surface-container text-on-surface' : slot.premiumStatus === 'PREMIUM' ? 'bg-tertiary text-on-tertiary' : 'bg-tertiary-fixed text-on-tertiary-fixed'}>
                        {slot.premiumStatus}
                      </Badge>
                      {slot.isActive && (
                        <Badge className="bg-tertiary-container text-on-tertiary-container ml-xs">Active</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mb-md">{slot.id} • Monthly Fee: Rp {(slot.monthlyFee / 1e3).toFixed(0)}K</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-md text-label-sm text-on-surface-variant">
                    <div>Start: {new Date(slot.startDate).toLocaleDateString('id-ID')}</div>
                    <div>End: {new Date(slot.endDate).toLocaleDateString('id-ID')}</div>
                    <div>Created: {new Date(slot.createdAt).toLocaleDateString('id-ID')}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Available Vendors */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Available Vendors for Featured Promotion</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
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
              <Card key={vendor.id} className="p-md bg-surface-container border border-outline-variant hover:shadow-elevated transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-md">
                  <div>
                    <p className="text-body-md text-on-surface font-semibold">{vendor.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{vendor.businessType}</p>
                  </div>
                </div>
                <div className="space-y-xs mb-md">
                  <p className="text-label-sm text-on-surface-variant">Rating: {vendor.averageRating.toFixed(1)}★ ({vendor.totalReviews})</p>
                  <p className="text-label-sm text-on-surface-variant">Revenue: Rp {(vendor.totalRevenue / 1e6).toFixed(0)}M</p>
                </div>
                <button className="w-full py-xs px-sm bg-primary text-on-primary rounded-md text-label-md font-semibold hover:opacity-90 transition-opacity">
                  Promote
                </button>
              </Card>
            ))
          )}
        </div>
      </Card>
    </main>
  )
}
