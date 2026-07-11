'use client'

import { Vendor } from '@/lib/types'
import { X, Mail, Phone, MapPin, Calendar, Star } from 'lucide-react'

interface VendorDetailDrawerProps {
  vendor: Vendor
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function VendorDetailDrawer({
  vendor,
  isOpen,
  onOpenChange,
}: VendorDetailDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer: full-screen on mobile, side-panel on sm+ */}
      <div className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-full sm:max-w-lg z-50 bg-surface-container-lowest border-l border-outline-variant shadow-elevated-lg flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant p-md flex items-start justify-between shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-headline-md text-on-surface mb-xs truncate">
              {vendor.name}
            </h2>
            <p className="text-label-md text-on-surface-variant">{vendor.businessType}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors shrink-0 ml-2"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-md space-y-lg">
          {/* Status & Rating */}
          <div className="flex flex-wrap items-center gap-md">
            <span className="px-3 py-1 rounded-full text-label-sm font-semibold bg-primary-container text-on-primary-container">
              {vendor.status}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-tertiary text-tertiary" />
              <span className="text-label-sm font-semibold text-on-surface">
                {vendor.averageRating.toFixed(1)}
              </span>
              <span className="text-label-sm text-on-surface-variant">
                ({vendor.totalReviews} ulasan)
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-heading text-label-md font-semibold uppercase text-on-surface">Kontak</h3>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-label-sm text-on-surface-variant">Email</p>
                <p className="text-body-md text-on-surface break-all">{vendor.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-label-sm text-on-surface-variant">Telepon</p>
                <p className="text-body-md text-on-surface">{vendor.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-label-sm text-on-surface-variant">Lokasi</p>
                <p className="text-body-md text-on-surface">{vendor.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-label-sm text-on-surface-variant">Bergabung</p>
                <p className="text-body-md text-on-surface">
                  {new Date(vendor.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Info */}
          <div className="space-y-3">
            <h3 className="font-heading text-label-md font-semibold uppercase text-on-surface">Rekening</h3>
            <div className="p-md bg-surface-container rounded-md space-y-1">
              <p className="text-body-sm text-on-surface-variant">{vendor.bankName}</p>
              <p className="text-body-md text-on-surface font-medium">{vendor.bankAccountNumber}</p>
              <p className="text-label-sm text-on-surface-variant">{vendor.bankAccountName}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-md">
            <div className="p-md bg-surface-container rounded-md text-center">
              <p className="text-headline-md text-primary font-semibold">{vendor.totalBookings}</p>
              <p className="text-label-sm text-on-surface-variant">Booking</p>
            </div>
            <div className="p-md bg-surface-container rounded-md text-center">
              <p className="text-headline-md text-primary font-semibold">
                Rp {(vendor.totalRevenue / 1e6).toFixed(0)}M
              </p>
              <p className="text-label-sm text-on-surface-variant">Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
