'use client'

import { useState, useEffect } from 'react'
import { getVendors } from '@/lib/services/vendor'
import { getPaymentSplits } from '@/lib/services/payment'
import { getDisputes } from '@/lib/services/dispute'
import { getAuditLogs } from '@/lib/services/admin'
import type { Vendor, PaymentSplit, Dispute, AuditLog } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OverviewPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([])
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getVendors(),
      getPaymentSplits(),
      getDisputes(),
      getAuditLogs(),
    ])
      .then(([v, p, d, a]) => {
        setVendors(v)
        setPaymentSplits(p)
        setDisputes(d)
        setAuditLogs(a)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div className="flex flex-col gap-sm">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-32 mb-md" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          <Card className="lg:col-span-2 p-md bg-surface-container-lowest border border-outline-variant">
            <Skeleton className="h-6 w-48 mb-md" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-sm mb-sm">
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </Card>
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <Skeleton className="h-6 w-32 mb-md" />
            <Skeleton className="h-9 w-36 mb-md" />
            <Skeleton className="h-2 w-full mb-md" />
            <Skeleton className="h-4 w-40" />
          </Card>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <div className="flex items-start gap-md">
            <AlertCircle className="w-6 h-6 text-error mt-0.5" />
            <div className="flex-1">
              <h2 className="text-headline-md text-on-surface font-semibold mb-sm">Gagal Memuat Data</h2>
              <p className="text-body-md text-on-surface-variant mb-md">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Coba lagi
              </Button>
            </div>
          </div>
        </Card>
      </main>
    )
  }

  // Calculate KPIs from API data
  const activeVendors = vendors.filter(v => v.status === 'ACTIVE').length
  const totalGMV = vendors.reduce((sum, v) => sum + v.totalRevenue, 0)
  const totalTransactions = paymentSplits.length
  const totalDisputes = disputes.length
  const holdingFunds = vendors.reduce((sum, v) => sum + v.holdingFunds, 0)

  const kpis = [
    { label: 'Total GMV', value: `Rp ${(totalGMV / 1e9).toFixed(1)}B`, change: '+12.5%', color: 'text-primary' },
    { label: 'Active Vendors', value: activeVendors.toString(), change: '+3', color: 'text-tertiary' },
    { label: 'Transactions', value: totalTransactions.toString(), change: '+8', color: 'text-primary' },
    { label: 'Open Disputes', value: totalDisputes.toString(), change: '+1', color: 'text-error' },
  ]

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div className="flex flex-col gap-sm">
        <h1 className="font-heading text-headline-lg text-on-surface">Overview Dashboard</h1>
        <p className="text-body-md text-on-surface-variant">Monitor platform performance and key metrics in real-time</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="p-md bg-surface-container-lowest border border-outline-variant hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-label-md text-on-surface-variant mb-xs">{kpi.label}</p>
                <p className="text-headline-md text-on-surface font-semibold">{kpi.value}</p>
              </div>
              <TrendingUp className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className={`flex items-center gap-xs mt-md text-label-sm ${kpi.color}`}>
              <span>↑ {kpi.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-md bg-surface-container-lowest border border-outline-variant">
          <h2 className="text-headline-md text-on-surface font-semibold mb-md">Recent Admin Activity</h2>
          <div className="space-y-sm">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-sm bg-surface-container rounded-md hover:bg-surface-container-high transition-colors">
                <div className="flex-1">
                  <p className="text-body-md text-on-surface font-medium">{log.actionType}</p>
                  <p className="text-label-sm text-on-surface-variant">{log.entityType} • {log.entityId}</p>
                </div>
                <span className="text-label-sm text-on-surface-variant">{new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Holding Funds Card */}
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <h2 className="text-headline-md text-on-surface font-semibold mb-md">Holding Funds</h2>
          <p className="text-headline-lg text-primary font-semibold mb-md">Rp {(holdingFunds / 1e6).toFixed(0)}M</p>
          <p className="text-body-sm text-on-surface-variant mb-md">Amount held pending release (zero-holding-funds principle applies)</p>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '35%' }}></div>
          </div>
          <p className="text-label-sm text-on-surface-variant mt-md">35% of total transactions</p>
        </Card>
      </div>

      {/* Vendor Status Overview */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Vendor Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Active</p>
            <p className="text-headline-lg text-primary font-semibold">{vendors.filter(v => v.status === 'ACTIVE').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Suspended</p>
            <p className="text-headline-lg text-error font-semibold">{vendors.filter(v => v.status === 'SUSPENDED').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Pending</p>
            <p className="text-headline-lg text-tertiary font-semibold">{vendors.filter(v => v.status === 'PENDING').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Total Vendors</p>
            <p className="text-headline-lg text-on-surface font-semibold">{vendors.length}</p>
          </div>
        </div>
      </Card>

      {/* System Health */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Uptime</p>
            <p className="text-headline-lg text-tertiary font-semibold">99.98%</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Avg Response</p>
            <p className="text-headline-lg text-on-surface font-semibold">120ms</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Platform Rating</p>
            <p className="text-headline-lg text-primary font-semibold">4.7★</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg">
            <p className="text-label-sm text-on-surface-variant mb-sm">Compliance</p>
            <p className="text-headline-lg text-tertiary font-semibold">100%</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
