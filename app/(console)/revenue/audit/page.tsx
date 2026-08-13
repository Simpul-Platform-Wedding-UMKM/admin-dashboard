'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPaymentSplits, updatePaymentSplit } from '@/lib/services/payment'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  TrendingUp, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Building,
  CreditCard,
  Zap,
  Loader2
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils-simpul'
import type { ExtendedPaymentSplit } from '@/lib/types'

export default function RevenueAuditPage() {
  const { toast } = useToast()
  const [splits, setSplits] = useState<ExtendedPaymentSplit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State to track loading for individual force payout actions
  const [forceLoading, setForceLoading] = useState<Record<string, boolean>>({})

  const fetchSplits = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPaymentSplits()
      setSplits(data as ExtendedPaymentSplit[])
    } catch (e: any) {
      setError(e.message || 'Gagal memuat rincian split revenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSplits()
  }, [])

  const handleForcePayout = async (splitId: string) => {
    // Set loading for this specific row
    setForceLoading(prev => ({ ...prev, [splitId]: true }))

    // Simulate 2-second payout confirmation delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      // Update local storage split payment state
      await updatePaymentSplit(splitId, {
        settlementStatus: 'SETTLED' as any,
      })

      // Refresh data
      const data = await getPaymentSplits()
      setSplits(data as ExtendedPaymentSplit[])

      toast({
        title: "Payout Manual Berhasil",
        description: `Split ID ${splitId} telah berhasil dikirimkan ke Bank Mitra.`,
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal memproses payout",
        description: err?.message || "Terjadi kesalahan sistem.",
      })
    } finally {
      setForceLoading(prev => ({ ...prev, [splitId]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, React.ReactNode> = {
      'SETTLED': <Badge className="bg-primary-container text-on-primary-container font-semibold">SETTLED</Badge>,
      'PENDING': <Badge className="bg-surface-container-high text-on-surface-variant font-semibold">PENDING</Badge>,
      'FAILED': <Badge className="bg-error text-on-error font-semibold">FAILED</Badge>,
    }
    return badges[status] || <Badge className="bg-surface-container text-on-surface">{status}</Badge>
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background w-full max-w-full overflow-hidden">
        <Skeleton className="h-6 w-32 mb-xs" />
        <Skeleton className="h-10 w-96 mb-md" />
        <Card className="p-md h-96"><Skeleton className="h-full w-full" /></Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-md py-20 gap-md">
        <AlertCircle className="h-12 w-12 text-error" />
        <h2 className="text-headline-md text-on-surface font-semibold">Gagal Memuat Revenue</h2>
        <p className="text-body-md text-on-surface-variant">{error}</p>
        <Button onClick={fetchSplits} variant="outline">Coba Lagi</Button>
      </main>
    )
  }

  // Aggregate stats
  const settledSplits = splits.filter(s => s.settlementStatus === 'SETTLED')
  const pendingSplits = splits.filter(s => s.settlementStatus === 'PENDING')
  const failedSplits = splits.filter(s => s.settlementStatus === 'FAILED')

  const totalVolume = splits.reduce((sum, s) => sum + s.grossAmount, 0)
  const totalSettled = settledSplits.reduce((sum, s) => sum + s.grossAmount, 0)
  const totalPlatformFee = splits.reduce((sum, s) => sum + s.platformFeeAmount, 0)
  const totalMicroFee = splits.reduce((sum, s) => sum + s.microFeeAmount, 0)

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Audit & Settlement Biaya Platform</h1>
        <p className="text-body-md text-on-surface-variant">Lacak pembagian biaya komisi platform 1%, biaya mikro PJP 0.5%, dan payout real-time ke rekening bank partner</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total Pembayaran (Gross)</p>
          <p className="text-headline-md text-on-surface font-bold">{formatCurrency(totalVolume)}</p>
          <p className="text-label-sm text-on-surface-variant mt-xs">{splits.length} kali transaksi</p>
        </Card>

        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Settled Payouts</p>
          <p className="text-headline-md text-primary font-bold">{formatCurrency(totalSettled)}</p>
          <p className="text-label-sm text-on-surface-variant mt-xs">{settledSplits.length} transfer berhasil</p>
        </Card>

        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Pendapatan Platform Fee (1%)</p>
          <p className="text-headline-md text-tertiary font-bold">{formatCurrency(totalPlatformFee)}</p>
          <p className="text-label-sm text-on-surface-variant mt-xs">Komisi bersih SIMPUL</p>
        </Card>

        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Potongan Biaya PJP (0.5%)</p>
          <p className="text-headline-md text-on-surface-variant font-bold">{formatCurrency(totalMicroFee)}</p>
          <p className="text-label-sm text-on-surface-variant mt-xs">Mikro fee untuk Midtrans/Xendit</p>
        </Card>
      </div>

      {/* Audit Data Table Card */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant w-full max-w-full overflow-hidden">
        <div className="flex justify-between items-center mb-md pb-xs border-b border-outline-variant">
          <h2 className="text-headline-md text-on-surface font-semibold">Ledger Settlement Transaksi</h2>
          <div className="flex flex-wrap gap-xs">
            <Badge className="bg-primary-container text-on-primary-container font-medium">{settledSplits.length} Settled</Badge>
            {pendingSplits.length > 0 && <Badge className="bg-surface-container-high text-on-surface-variant font-medium">{pendingSplits.length} Pending</Badge>}
            {failedSplits.length > 0 && <Badge className="bg-error text-on-error font-medium">{failedSplits.length} Failed</Badge>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant text-label-md text-on-surface font-semibold">
                <th className="text-left px-3 py-2 sticky left-0 bg-surface-container-lowest z-10 shadow-[2px_0_0_-1px_var(--md-sys-color-outline-variant)]">Split ID</th>
                <th className="text-left px-3 py-2">Nama Vendor</th>
                <th className="text-left px-3 py-2 hidden md:table-cell">Paket Resepsi</th>
                <th className="text-right px-3 py-2">Gross Amount</th>
                <th className="text-right px-3 py-2 hidden lg:table-cell">Platform (1%)</th>
                <th className="text-right px-3 py-2 hidden lg:table-cell">PJP Fee (0.5%)</th>
                <th className="text-right px-3 py-2">Net Payout</th>
                <th className="text-center px-3 py-2">Status Settlement</th>
                <th className="text-center px-3 py-2">Aksi Darurat</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((item) => {
                const isActionLoading = forceLoading[item.id] || false
                const isPendingOrFailed = item.settlementStatus === 'PENDING' || item.settlementStatus === 'FAILED'

                return (
                  <tr key={item.id} className="group border-b border-outline-variant hover:bg-surface-container/50 transition-colors">
                    
                    {/* Split ID with link to detail — sticky dengan background SOLID (anti tembus saat scroll) */}
                    <td className="sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container z-10 px-3 py-2 font-mono text-primary font-bold shadow-[2px_0_0_-1px_var(--md-sys-color-outline-variant)]">
                      <Link href={`/transactions/${item.id}`} className="hover:underline flex items-center gap-xs whitespace-nowrap">
                        {item.id} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>

                    <td className="px-3 py-2 text-body-sm text-on-surface font-semibold whitespace-nowrap">{item.vendorName || 'Vendor Partner'}</td>
                    <td className="px-3 py-2 text-body-sm text-on-surface-variant hidden md:table-cell">{(item as any).serviceName || 'Wedding Service'}</td>
                    <td className="px-3 py-2 text-right text-body-sm text-on-surface font-semibold whitespace-nowrap">{formatCurrency(item.grossAmount)}</td>
                    
                    {/* Platform fee */}
                    <td className="px-3 py-2 text-right text-body-sm text-primary font-medium hidden lg:table-cell whitespace-nowrap">{formatCurrency(item.platformFeeAmount)}</td>
                    
                    {/* PJP micro-fee */}
                    <td className="px-3 py-2 text-right text-body-sm text-on-surface-variant hidden lg:table-cell whitespace-nowrap">{formatCurrency(item.microFeeAmount)}</td>
                    
                    {/* Net payout vendor */}
                    <td className="px-3 py-2 text-right text-body-sm text-on-surface font-bold whitespace-nowrap">{formatCurrency(item.netAmount)}</td>
                    
                    {/* Status */}
                    <td className="px-3 py-2 text-center">{getStatusBadge(item.settlementStatus)}</td>

                    {/* Actions */}
                    <td className="px-3 py-2 text-center">
                      {isPendingOrFailed ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleForcePayout(item.id)}
                          disabled={isActionLoading}
                          className="bg-primary-container text-primary-on-container hover:bg-primary/10 border-primary/20 text-xs py-1 h-7 font-bold flex items-center gap-xs mx-auto"
                        >
                          {isActionLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Memproses...
                            </>
                          ) : (
                            <>
                              <Zap className="h-3.5 w-3.5 text-primary" /> Force Payout
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-label-sm text-on-surface-variant flex items-center justify-center gap-xs">
                          <CheckCircle className="h-4 w-4 text-primary" /> Settled Manual
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Audit Instructions Alert */}
      <Card className="p-md bg-surface-container border border-outline-variant flex items-start gap-sm">
        <HelpCircle className="h-5 w-5 text-on-surface-variant mt-0.5 shrink-0" />
        <div>
          <h4 className="text-body-sm font-semibold text-on-surface">Panduan Force Payout Manual Admin</h4>
          <p className="text-label-md text-on-surface-variant mt-xs leading-relaxed">
            Tombol <b>Force Payout</b> digunakan jika PJP Gateway (Midtrans/Xendit) gagal memproses transfer split otomatis ke rekening bank vendor (biasanya karena limit transaksi harian bank atau kendala API). Menekan tombol ini akan memicu instruksi payout darurat secara manual melalui cadangan PJP SIMPUL dan mengonfirmasi penyelesaian transfer di dasbor.
          </p>
        </div>
      </Card>
    </main>
  )
}
