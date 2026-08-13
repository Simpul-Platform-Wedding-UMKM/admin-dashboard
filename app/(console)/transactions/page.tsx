'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPaymentSplits } from '@/lib/services/payment'
import type { PaymentSplit } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TransactionsPage() {
  const [splits, setSplits] = useState<PaymentSplit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSplits = () => {
    setLoading(true)
    setError(null)
    getPaymentSplits()
      .then(setSplits)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSplits()
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-surface-container-high text-on-surface-variant',
      'PAID': 'bg-primary-container text-on-primary-container',
      'EXPIRED': 'bg-surface-container text-on-surface-variant',
      'FAILED': 'bg-error text-on-error',
      'CANCELLED': 'bg-surface-container text-on-surface-variant',
    }
    return colors[status] || 'bg-surface-container text-on-surface'
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl w-full max-w-full overflow-hidden">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Transactions & Payment Splits</h1>
          <p className="text-body-md text-on-surface-variant">Track all payment splits with fee breakdown and QRIS codes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-32" />
            </Card>
          ))}
        </div>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-48 mb-md" />
          <div className="space-y-md">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-md p-md">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Transactions & Payment Splits</h1>
          <p className="text-body-md text-on-surface-variant">Track all payment splits with fee breakdown and QRIS codes</p>
        </div>
        <Card className="p-lg bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center gap-md py-xl">
          <AlertCircle className="h-12 w-12 text-error" />
          <div className="text-center">
            <p className="text-body-lg text-on-surface font-medium">Failed to load transactions</p>
            <p className="text-body-sm text-on-surface-variant mt-xs">{error}</p>
          </div>
          <Button onClick={fetchSplits}>Retry</Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl w-full max-w-full overflow-hidden">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Transactions & Payment Splits</h1>
        <p className="text-body-md text-on-surface-variant">Track all payment splits with fee breakdown and QRIS codes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total Splits</p>
          <p className="text-headline-lg text-on-surface font-semibold">{splits.length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Gross Amount</p>
          <p className="text-headline-lg text-primary font-semibold">Rp {(splits.reduce((sum, s) => sum + s.grossAmount, 0) / 1e9).toFixed(1)}B</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Pending</p>
          <p className="text-headline-lg text-on-surface font-semibold">{splits.filter(s => s.status === 'PENDING').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Paid</p>
          <p className="text-headline-lg text-primary font-semibold">{splits.filter(s => s.status === 'PAID').length}</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant w-full max-w-full overflow-hidden">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Payment Splits</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="sticky left-0 z-10 bg-surface-container-lowest text-left p-md text-label-md text-on-surface font-semibold">Transaction ID</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Item</th>
                <th className="text-right p-md text-label-md text-on-surface font-semibold">Gross</th>
                <th className="text-right p-md text-label-md text-on-surface font-semibold">Micro Fee</th>
                <th className="text-right p-md text-label-md text-on-surface font-semibold">Platform Fee</th>
                <th className="text-right p-md text-label-md text-on-surface font-semibold">Net</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((split) => (
                <tr key={split.id} className="group border-b border-outline-variant hover:bg-surface-container">
                  <td className="sticky left-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container p-md text-body-sm font-mono text-primary">
                    <Link href={`/transactions/${split.id}`} className="hover:underline font-bold text-primary">
                      {split.id}
                    </Link>
                  </td>
                  <td className="p-md text-body-sm text-on-surface">
                    {(split as any).serviceName || split.bookingItemId}
                  </td>
                  <td className="p-md text-right text-body-sm text-on-surface">Rp {(split.grossAmount / 1e6).toFixed(0)}M</td>
                  <td className="p-md text-right text-body-sm text-on-surface-variant">Rp {(split.microFeeAmount / 1e3).toFixed(0)}K</td>
                  <td className="p-md text-right text-body-sm text-on-surface-variant">Rp {(split.platformFeeAmount / 1e3).toFixed(0)}K</td>
                  <td className="p-md text-right text-body-sm font-semibold text-tertiary">Rp {(split.netAmount / 1e6).toFixed(0)}M</td>
                  <td className="p-md"><Badge className={getStatusColor(split.status)}>{split.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
