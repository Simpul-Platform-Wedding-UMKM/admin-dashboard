// ============================================================================
// SIMPUL Admin Console - Utility Functions
// Enhanced with support for new Prisma schema
// ============================================================================

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(value: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format large numbers with abbreviations (M, B, K)
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(0)}M`
  if (num >= 1e3) return `Rp ${(num / 1e3).toFixed(0)}K`
  return `Rp ${num}`
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: string | Date, locale: string = 'id-ID'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date, locale: string = 'id-ID'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate fee breakdown for a transaction
 */
export function calculateFeeBreakdown(grossAmount: number) {
  const microFee = grossAmount * 0.01 // 1% micro fee
  const platformFee = grossAmount * 0.03 // 3% platform fee
  const netAmount = grossAmount - microFee - platformFee

  return {
    grossAmount,
    microFee,
    platformFee,
    netAmount,
    vendorPayout: netAmount,
  }
}

/**
 * Get status badge color for all entity types
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Vendor statuses
    'ACTIVE': 'bg-tertiary text-on-tertiary',
    'SUSPENDED': 'bg-error text-on-error',
    'PENDING': 'bg-tertiary-container text-on-tertiary-container',
    'REJECTED': 'bg-error-container text-on-error-container',
    // Booking statuses
    'CONFIRMED': 'bg-tertiary text-on-tertiary',
    'CANCELLED': 'bg-error text-on-error',
    'COMPLETED': 'bg-tertiary-container text-on-tertiary-container',
    // Dispute statuses
    'OPEN': 'bg-error text-on-error',
    'IN_REVIEW': 'bg-tertiary text-on-tertiary',
    'RESOLVED': 'bg-tertiary-container text-on-tertiary-container',
    'CLOSED': 'bg-surface-container text-on-surface',
    // Payment split statuses
    'HOLDING': 'bg-tertiary text-on-tertiary',
    'RELEASED': 'bg-tertiary-container text-on-tertiary-container',
    'FAILED': 'bg-error text-on-error',
    // Old Indonesian labels for backwards compatibility
    'aktif': 'bg-tertiary text-on-tertiary',
    'nonaktif': 'bg-surface-container text-on-surface',
    'menunggu': 'bg-tertiary-container text-on-tertiary-container',
  }
  return colors[status] || 'bg-surface-container text-on-surface'
}

/**
 * Get role badge color
 */
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    'SUPER_ADMIN': 'bg-error text-on-error',
    'ADMIN': 'bg-tertiary text-on-tertiary',
    'MODERATOR': 'bg-tertiary-container text-on-tertiary-container',
    'ANALYST': 'bg-surface-container text-on-surface',
  }
  return colors[role] || 'bg-surface-container text-on-surface'
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    'LOW': 'bg-tertiary-container text-on-tertiary-container',
    'MEDIUM': 'bg-tertiary text-on-tertiary',
    'HIGH': 'bg-tertiary-fixed text-on-tertiary-fixed',
    'CRITICAL': 'bg-error text-on-error',
  }
  return colors[level] || 'bg-surface-container text-on-surface'
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`

  return `${Math.floor(days / 365)}y ago`
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) return `(${cleaned.slice(0, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  if (cleaned.length === 11) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  return phone
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function sortByDate(arr: any[], key: string, direction: 'asc' | 'desc' = 'desc'): any[] {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a[key]).getTime()
    const dateB = new Date(b[key]).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

export function filterByStatus(arr: any[], key: string, status: string): any[] {
  if (status === 'semua' || status === 'all') return arr
  return arr.filter((item) => item[key] === status)
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * Calculate vendor metrics summary
 */
export function calculateVendorMetrics(vendors: any[]) {
  return {
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'ACTIVE').length,
    suspendedVendors: vendors.filter(v => v.status === 'SUSPENDED').length,
    pendingVendors: vendors.filter(v => v.status === 'PENDING').length,
    totalGMV: vendors.reduce((sum, v) => sum + v.totalRevenue, 0),
    totalBookings: vendors.reduce((sum, v) => sum + v.totalBookings, 0),
    averageRating: vendors.length > 0 
      ? (vendors.reduce((sum, v) => sum + v.averageRating, 0) / vendors.length).toFixed(1)
      : 0,
  }
}

/**
 * Format permission string to readable format
 */
export function formatPermission(permission: string): string {
  return permission
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Calculate dispute aging (how long open)
 */
export function getDisputeAge(createdAt: string): string {
  const now = new Date()
  const created = new Date(createdAt)
  const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

/**
 * Generate color for vendor based on rating
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-tertiary-container'
  if (rating >= 4.0) return 'text-tertiary'
  if (rating >= 3.5) return 'text-tertiary-fixed'
  return 'text-error'
}
