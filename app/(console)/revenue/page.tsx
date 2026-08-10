'use client'

import { useState, useEffect } from 'react'
import { getPaymentSplits } from '@/lib/services/payment'
import type { PaymentSplit } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RevenueFinancialPage() {
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

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Revenue & Financial</h1>
          <p className="text-body-md text-on-surface-variant">Track all platform revenue streams and financial performance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-20 mb-xs" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ))}
        </div>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-40 mb-md" />
          <div className="space-y-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-md">
                <div>
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-40 mb-md" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md">
                <Skeleton className="h-3 w-16 mb-sm" />
                <Skeleton className="h-8 w-12" />
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
          <h1 className="font-heading text-headline-lg text-on-surface">Revenue & Financial</h1>
          <p className="text-body-md text-on-surface-variant">Track all platform revenue streams and financial performance</p>
        </div>
        <Card className="p-lg bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center gap-md py-xl">
          <AlertCircle className="h-12 w-12 text-error" />
          <div className="text-center">
            <p className="text-body-lg text-on-surface font-medium">Failed to load revenue data</p>
            <p className="text-body-sm text-on-surface-variant mt-xs">{error}</p>
          </div>
          <Button onClick={fetchSplits}>Retry</Button>
        </Card>
      </main>
    )
  }

  const totalGMV = splits.reduce((sum, s) => sum + s.grossAmount, 0)
  const totalMicroFees = splits.reduce((sum, s) => sum + s.microFeeAmount, 0)
  const totalPlatformFees = splits.reduce((sum, s) => sum + s.platformFeeAmount, 0)
  const totalSettled = splits.filter(s => s.settlementStatus === 'COMPLETED').reduce((sum, s) => sum + s.netAmount, 0)

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Revenue & Financial</h1>
        <p className="text-body-md text-on-surface-variant">Track all platform revenue streams and financial performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total GMV</p>
          <p className="text-headline-lg text-primary font-semibold">Rp {(totalGMV / 1e9).toFixed(1)}B</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Micro Fees</p>
          <p className="text-headline-lg text-tertiary font-semibold">Rp {(totalMicroFees / 1e6).toFixed(0)}M</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Platform Fees</p>
          <p className="text-headline-lg text-tertiary font-semibold">Rp {(totalPlatformFees / 1e6).toFixed(0)}M</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Settled</p>
          <p className="text-headline-lg text-tertiary-container font-semibold">Rp {(totalSettled / 1e9).toFixed(1)}B</p>
        </Card>
      </div>

      {/* Fee Breakdown */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Fee Breakdown</h2>
        <div className="space-y-md">
          <div className="flex items-center justify-between p-md bg-surface-container rounded-md">
            <div>
              <p className="text-body-md text-on-surface font-medium">Micro Fee (Per Transaction)</p>
              <p className="text-label-sm text-on-surface-variant">1% of transaction value</p>
            </div>
            <p className="text-headline-md text-primary font-semibold">Rp {(totalMicroFees / 1e6).toFixed(0)}M</p>
          </div>
          <div className="flex items-center justify-between p-md bg-surface-container rounded-md">
            <div>
              <p className="text-body-md text-on-surface font-medium">Platform Fee (Operational)</p>
              <p className="text-label-sm text-on-surface-variant">3% of transaction value</p>
            </div>
            <p className="text-headline-md text-primary font-semibold">Rp {(totalPlatformFees / 1e6).toFixed(0)}M</p>
          </div>
          <div className="flex items-center justify-between p-md bg-surface-container rounded-md">
            <div>
              <p className="text-body-md text-on-surface font-medium">Total Revenue</p>
              <p className="text-label-sm text-on-surface-variant">Micro + Platform Fees</p>
            </div>
            <p className="text-headline-md text-tertiary font-semibold">Rp {((totalMicroFees + totalPlatformFees) / 1e6).toFixed(0)}M</p>
          </div>
        </div>
      </Card>

      {/* Settlement Status */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Settlement Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-sm text-on-surface-variant mb-sm">Pending</p>
            <p className="text-headline-lg text-tertiary font-semibold">{splits.filter(s => s.settlementStatus === 'PENDING').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-sm text-on-surface-variant mb-sm">In Progress</p>
            <p className="text-headline-lg text-tertiary font-semibold">{splits.filter(s => s.settlementStatus === 'IN_PROGRESS').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-sm text-on-surface-variant mb-sm">Completed</p>
            <p className="text-headline-lg text-tertiary-container font-semibold">{splits.filter(s => s.settlementStatus === 'COMPLETED').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-md">
            <p className="text-label-sm text-on-surface-variant mb-sm">Failed</p>
            <p className="text-headline-lg text-error font-semibold">{splits.filter(s => s.settlementStatus === 'FAILED').length}</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
