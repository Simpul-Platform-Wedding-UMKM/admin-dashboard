import { apiFetch } from '@/lib/api'
import type { Vendor, Dispute, HeatmapPoint } from '@/lib/types'

// Shape response GET /admin/dashboard — satu endpoint untuk seluruh ringkasan.
export interface DashboardSummary {
  vendors: Vendor[]
  paymentSplits: number
  disputes: Dispute[]
  heatmap: HeatmapPoint[]
  kpis: {
    totalGMV: number
    activeVendors: number
    totalTransactions: number
    openDisputes: number
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>('/admin/dashboard')
}
