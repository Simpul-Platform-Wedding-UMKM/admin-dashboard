'use client'

import { useState, useEffect } from 'react'
import { getVendors } from '@/lib/services/vendor'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Eye, Ban, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Vendor } from '@/lib/types'
import { VendorDetailDrawer } from '@/components/vendors/vendor-detail-drawer'

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    getVendors()
      .then(setVendors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'ACTIVE': 'bg-tertiary text-on-tertiary',
      'SUSPENDED': 'bg-error text-on-error',
      'PENDING': 'bg-tertiary-container text-on-tertiary-container',
      'REJECTED': 'bg-error-container text-on-error-container',
    }
    return colors[status] || 'bg-surface-container text-on-surface'
  }

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl w-full max-w-full overflow-hidden">
        <div className="flex flex-col gap-sm mb-md">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant mb-md">
          <Skeleton className="h-10 w-full rounded-md" />
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-40 mb-md" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full mb-sm" />
          ))}
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <div className="flex flex-col gap-sm mb-md">
          <h1 className="font-heading text-headline-lg text-on-surface">Vendor Management</h1>
          <p className="text-body-md text-on-surface-variant">Monitor, approve, and manage all vendor accounts</p>
        </div>
        <Card className="p-md bg-error-container border border-error flex items-center gap-md">
          <AlertCircle className="w-5 h-5 text-error shrink-0" />
          <div className="flex-1">
            <p className="text-body-md text-on-error-container font-medium">Failed to load vendors</p>
            <p className="text-body-sm text-on-error-container/80">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setError(null)
              setLoading(true)
              getVendors()
                .then(setVendors)
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false))
            }}
          >
            Coba lagi
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl w-full max-w-full overflow-hidden">
      <div className="flex flex-col gap-sm mb-md">
        <h1 className="font-heading text-headline-lg text-on-surface">Vendor Management</h1>
        <p className="text-body-md text-on-surface-variant">Monitor, approve, and manage all vendor accounts</p>
      </div>

      {/* Vendor Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total Vendors</p>
          <p className="text-headline-lg text-on-surface font-semibold">{vendors.length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Active</p>
          <p className="text-headline-lg text-tertiary font-semibold">{vendors.filter(v => v.status === 'ACTIVE').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Pending</p>
          <p className="text-headline-lg text-tertiary-container font-semibold">{vendors.filter(v => v.status === 'PENDING').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Suspended</p>
          <p className="text-headline-lg text-error font-semibold">{vendors.filter(v => v.status === 'SUSPENDED').length}</p>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant mb-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search vendors by name, type, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-md rounded-md border border-outline-variant bg-surface-container text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Vendors Table */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant w-full max-w-full overflow-hidden">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">All Vendors ({filteredVendors.length})</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="sticky left-0 z-10 bg-surface-container-lowest text-left p-md text-label-md text-on-surface font-semibold">Vendor Name</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Business Type</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Region</th>
                <th className="text-center p-md text-label-md text-on-surface font-semibold">Rating</th>
                <th className="text-center p-md text-label-md text-on-surface font-semibold">Revenue</th>
                <th className="text-center p-md text-label-md text-on-surface font-semibold">Bookings</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Status</th>
                <th className="text-center p-md text-label-md text-on-surface font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="group border-b border-outline-variant hover:bg-surface-container transition-colors">
                  <td className="sticky left-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container p-md text-body-md text-on-surface font-medium">{vendor.name}</td>
                  <td className="p-md text-body-md text-on-surface-variant">{vendor.businessType}</td>
                  <td className="p-md text-body-md text-on-surface-variant">{vendor.region}</td>
                  <td className="p-md text-center text-body-md font-medium">
                    <span className="text-tertiary">{vendor.averageRating.toFixed(1)}★</span>
                  </td>
                  <td className="p-md text-center text-body-md font-medium">
                    <span className="text-primary">Rp {(vendor.totalRevenue / 1e6).toFixed(0)}M</span>
                  </td>
                  <td className="p-md text-center text-body-md font-medium">{vendor.totalBookings}</td>
                  <td className="p-md">
                    <Badge className={`${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </Badge>
                  </td>
                  <td className="p-md text-center">
                    <div className="flex items-center justify-center gap-xs">
                      <button
                        className="p-xs hover:bg-surface-container rounded transition-colors"
                        title="View Details"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </button>
                      {vendor.status === 'ACTIVE' && (
                        <button className="p-xs hover:bg-surface-container rounded transition-colors" title="Suspend">
                          <Ban className="w-4 h-4 text-error" />
                        </button>
                      )}
                      {vendor.status === 'PENDING' && (
                        <button className="p-xs hover:bg-surface-container rounded transition-colors" title="Approve">
                          <Check className="w-4 h-4 text-tertiary" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
                </tbody>
              </table>
            </div>
    
            {filteredVendors.length === 0 && (
              <div className="text-center py-lg text-on-surface-variant">
                <p className="text-body-md">No vendors found matching your search</p>
              </div>
            )}
          </Card>

          <VendorDetailDrawer vendor={selectedVendor as Vendor} isOpen={selectedVendor !== null} onOpenChange={(open) => setSelectedVendor(open ? selectedVendor : null)} />
        </main>
  )
}
