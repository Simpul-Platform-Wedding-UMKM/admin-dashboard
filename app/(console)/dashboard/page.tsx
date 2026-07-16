'use client'

import { useState, useEffect } from 'react'
import { getVendors } from '@/lib/services/vendor'
import { getPaymentSplits } from '@/lib/services/payment'
import { getDisputes } from '@/lib/services/dispute'
import { getAuditLogs } from '@/lib/services/admin'
import type { Vendor, PaymentSplit, Dispute, AuditLog } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, TrendingUp, Building2, CreditCard, ShieldAlert, Award } from 'lucide-react'
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

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'APPROVE': 'Verifikasi Disetujui',
      'REJECT': 'Verifikasi Ditolak',
      'UPDATE': 'Pembaruan Data',
      'DELETE': 'Penghapusan Data',
      'CREATE': 'Pembuatan Baru',
      'SUSPEND': 'Akses Ditangguhkan'
    }
    return labels[action] || action
  }

  const getEntityLabel = (entity: string) => {
    const labels: Record<string, string> = {
      'VENDOR': 'Vendor',
      'DISPUTE': 'Sengketa',
      'TRANSACTION': 'Transaksi'
    }
    return labels[entity] || entity
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div className="flex flex-col gap-sm">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
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
    { label: 'Total GMV (Peredaran Bruto)', value: `Rp ${(totalGMV / 1e6).toLocaleString('id-ID')} Jt`, change: '+12.5%', color: 'text-primary', icon: TrendingUp },
    { label: 'Vendor Aktif Terverifikasi', value: activeVendors.toString(), change: '+3 vendor baru', color: 'text-tertiary', icon: Building2 },
    { label: 'Total Transaksi Masuk', value: totalTransactions.toString(), change: '+8 transaksi baru', color: 'text-primary', icon: CreditCard },
    { label: 'Kasus Sengketa Aktif', value: totalDisputes.toString(), change: '1 menunggu respon', color: 'text-error', icon: ShieldAlert },
  ]

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg bg-background">
      <div className="flex flex-col gap-sm">
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Ikhtisar Dasbor</h1>
        <p className="text-body-md text-on-surface-variant">Pantau kinerja platform dan metrik keuangan utama secara real-time</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="p-md bg-surface-container-lowest border border-outline-variant hover:shadow-elevated transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-label-sm text-on-surface-variant mb-xs truncate">{kpi.label}</p>
                  <p className="text-headline-md text-on-surface font-bold truncate">{kpi.value}</p>
                </div>
                <Icon className={`w-5 h-5 ${kpi.color} shrink-0`} />
              </div>
              <div className={`flex items-center gap-xs mt-md text-label-xs ${kpi.color} font-medium`}>
                <span>{kpi.change}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-md bg-surface-container-lowest border border-outline-variant">
          <h2 className="text-headline-md text-on-surface font-semibold mb-md">Aktivitas Admin Terbaru</h2>
          <div className="space-y-sm">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-md bg-surface-container rounded-md hover:bg-surface-container-high transition-colors gap-xs">
                <div className="flex-1">
                  <p className="text-body-sm font-bold text-on-surface">{getActionLabel(log.actionType)}</p>
                  <p className="text-label-xs text-on-surface-variant">
                    {getEntityLabel(log.entityType)} &bull; ID Objek: <span className="font-mono text-primary">{log.entityId}</span> &bull; IP: {log.ipAddress}
                  </p>
                </div>
                <span className="text-label-xs text-on-surface-variant shrink-0 bg-background px-2 py-0.5 rounded border border-outline-variant">
                  {new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Holding Funds Card */}
        <Card className="p-md bg-surface-container-lowest border border-outline-variant flex flex-col justify-between">
          <div>
            <h2 className="text-headline-md text-on-surface font-semibold mb-md">Dana Tertahan</h2>
            <p className="text-headline-lg text-primary font-bold mb-xs">Rp {(holdingFunds).toLocaleString('id-ID')}</p>
            <p className="text-body-sm text-on-surface-variant mb-md leading-relaxed">
              Jumlah dana transaksi yang saat ini ditahan sementara (berlaku prinsip zero-holding-funds).
            </p>
          </div>
          <div>
            <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '35%' }}></div>
            </div>
            <p className="text-label-xs text-on-surface-variant mt-sm">35% dari total keseluruhan transaksi</p>
          </div>
        </Card>
      </div>

      {/* Vendor Status Overview */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Ringkasan Status Mitra Vendor</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Aktif</p>
            <p className="text-headline-lg text-primary font-bold">{vendors.filter(v => v.status === 'ACTIVE').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Ditangguhkan</p>
            <p className="text-headline-lg text-error font-bold">{vendors.filter(v => v.status === 'SUSPENDED').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Menunggu KYB</p>
            <p className="text-headline-lg text-tertiary font-bold">{vendors.filter(v => v.status === 'PENDING').length}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Total Terdaftar</p>
            <p className="text-headline-lg text-on-surface font-bold">{vendors.length}</p>
          </div>
        </div>
      </Card>

      {/* System Health */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Metrik Performa & Keandalan Platform</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Uptime Sistem</p>
            <p className="text-headline-lg text-green-600 font-bold">99.98%</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Waktu Respon Rata-rata</p>
            <p className="text-headline-lg text-on-surface font-bold">120ms</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant mb-xs">Peringkat Layanan</p>
              <p className="text-headline-lg text-primary font-bold">4.7★</p>
            </div>
            <Award className="w-8 h-8 text-primary opacity-30" />
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Kepatuhan Regulasi</p>
            <p className="text-headline-lg text-tertiary font-bold">100%</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
