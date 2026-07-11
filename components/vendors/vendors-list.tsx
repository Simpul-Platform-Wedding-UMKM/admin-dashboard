'use client'

import { useState } from 'react'
import { Vendor } from '@/lib/types'
import { VendorCard } from './vendor-card'
import { VendorDetailDrawer } from './vendor-detail-drawer'

interface VendorsListProps {
  vendors: Vendor[]
}

export function VendorsList({ vendors }: VendorsListProps) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsOpen(true)
  }

  if (vendors.length === 0) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-surface-container mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="font-heading text-headline-md text-on-surface mb-2">
          Tidak ada vendor ditemukan
        </h3>
        <p className="text-body-md text-on-surface-variant">
          Coba ubah filter atau tambah vendor baru
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onSelect={handleSelectVendor}
          />
        ))}
      </div>

      {selectedVendor && (
        <VendorDetailDrawer
          vendor={selectedVendor}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  )
}
