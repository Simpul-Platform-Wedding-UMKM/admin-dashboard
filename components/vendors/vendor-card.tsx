import { Vendor } from '@/lib/types'
import { Star, MapPin, Phone, Badge } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VendorCardProps {
  vendor: Vendor
  onSelect: (vendor: Vendor) => void
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  aktif: { bg: 'bg-primary-fixed', text: 'text-primary', label: 'Aktif' },
  nonaktif: { bg: 'bg-surface-container', text: 'text-on-surface-variant', label: 'Nonaktif' },
  menunggu: { bg: 'bg-tertiary-fixed', text: 'text-tertiary', label: 'Menunggu' },
  ditangguhkan: { bg: 'bg-error-container', text: 'text-error', label: 'Ditangguhkan' },
  ditolak: { bg: 'bg-error-container', text: 'text-error', label: 'Ditolak' },
}

const categoryLabels: Record<string, string> = {
  katering: 'Katering',
  fotografi: 'Fotografi',
  dekorasi: 'Dekorasi',
  entertainment: 'Entertainment',
  transportasi: 'Transportasi',
  akomodasi: 'Akomodasi',
}

export function VendorCard({ vendor, onSelect }: VendorCardProps) {
  const statusInfo = statusColors[vendor.status]

  return (
    <div
      onClick={() => onSelect(vendor)}
      className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6 shadow-elevated hover:shadow-elevated-lg hover:border-primary/50 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-body-lg font-semibold text-on-surface mb-1">
            {vendor.nama}
          </h3>
          <p className="text-label-sm text-on-surface-variant">
            {categoryLabels[vendor.kategori]}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {vendor.rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(vendor.rating)
                      ? 'fill-tertiary text-tertiary'
                      : 'text-outline-variant'
                  }`}
                />
              ))}
            </div>
            <span className="text-label-sm text-on-surface-variant">
              {vendor.rating.toFixed(1)} ({vendor.jumlahReview})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
          <MapPin className="h-4 w-4" />
          <span>{vendor.region}</span>
        </div>

        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
          <Phone className="h-4 w-4" />
          <span>{vendor.kontak}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-outline-variant">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(vendor)
          }}
          variant="outline"
          className="w-full text-primary border-primary hover:bg-primary-fixed"
        >
          Lihat Detail
        </Button>
      </div>
    </div>
  )
}
