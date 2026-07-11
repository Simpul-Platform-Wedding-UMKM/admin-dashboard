import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VendorFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const statusOptions = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Nonaktif' },
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'ditangguhkan', label: 'Ditangguhkan' },
  { value: 'ditolak', label: 'Ditolak' },
]

const categoryOptions = [
  { value: 'semua', label: 'Semua Kategori' },
  { value: 'katering', label: 'Katering' },
  { value: 'fotografi', label: 'Fotografi' },
  { value: 'dekorasi', label: 'Dekorasi' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'transportasi', label: 'Transportasi' },
  { value: 'akomodasi', label: 'Akomodasi' },
]

export function VendorFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
}: VendorFiltersProps) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 md:p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari nama vendor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-outline-variant bg-surface-container text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status and Category Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-label-sm font-semibold text-on-surface mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedStatus !== 'semua' || selectedCategory !== 'semua') && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-label-sm font-medium hover:bg-primary-fixed/80"
              >
                {searchTerm}
                <X className="h-3 w-3" />
              </button>
            )}
            {selectedStatus !== 'semua' && (
              <button
                onClick={() => onStatusChange('semua')}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-secondary text-label-sm font-medium hover:bg-secondary-fixed/80"
              >
                {statusOptions.find((o) => o.value === selectedStatus)?.label}
                <X className="h-3 w-3" />
              </button>
            )}
            {selectedCategory !== 'semua' && (
              <button
                onClick={() => onCategoryChange('semua')}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-label-sm font-medium hover:bg-tertiary-fixed/80"
              >
                {categoryOptions.find((o) => o.value === selectedCategory)?.label}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
