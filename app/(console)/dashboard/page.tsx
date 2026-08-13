'use client'

import { useState, useEffect } from 'react'
import { getDashboardSummary, type DashboardSummary } from '@/lib/services/dashboard'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, TrendingUp, Building2, CreditCard, ShieldAlert, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardHeatmapCard } from '@/components/dashboard/dashboard-heatmap-card'

export default function OverviewPage() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    getDashboardSummary()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
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

  if (error || !data) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <div className="flex items-start gap-md">
            <AlertCircle className="w-6 h-6 text-error mt-0.5" />
            <div className="flex-1">
              <h2 className="text-headline-md text-on-surface font-semibold mb-sm">Gagal Memuat Data</h2>
              <p className="text-body-md text-on-surface-variant mb-md">{error ?? 'Data dashboard tidak tersedia'}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>
                Coba lagi
              </Button>
            </div>
          </div>
        </Card>
      </main>
    )
  }

  const { vendors, disputes, heatmap, kpis } = data

  // ── KPI dari endpoint ringkasan (angka real dari DB) ──
  const totalGMV = kpis.totalGMV
  const activeVendors = kpis.activeVendors
  const totalTransactions = kpis.totalTransactions
  const totalDisputes = kpis.openDisputes
  const holdingFunds = vendors.reduce((sum, v) => sum + v.holdingFunds, 0)
  const suspendedVendors = vendors.filter(v => v.status === 'SUSPENDED').length
  const pendingKyb = vendors.filter(v => v.status === 'PENDING').length
  const rejectedKyb = vendors.filter(v => v.status === 'REJECTED').length
  const unsubmittedKyb = vendors.filter(v => v.status === 'UNSUBMITTED').length

  const kpiCards = [
    { label: 'Total GMV (Peredaran Bruto)', value: `Rp ${(totalGMV / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt`, change: 'Dari pembayaran lunas', color: 'text-primary', icon: TrendingUp },
    { label: 'Vendor Aktif Terverifikasi', value: activeVendors.toString(), change: `Dari ${vendors.length} vendor terdaftar`, color: 'text-tertiary', icon: Building2 },
    { label: 'Total Transaksi Masuk', value: totalTransactions.toString(), change: 'Semua payment split', color: 'text-primary', icon: CreditCard },
    { label: 'Kasus Sengketa Aktif', value: totalDisputes.toString(), change: `${disputes.length} total sengketa`, color: 'text-error', icon: ShieldAlert },
  ]

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      <div className="flex flex-col gap-sm">
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Ikhtisar Dasbor</h1>
        <p className="text-body-md text-on-surface-variant">Pantau kinerja platform dan metrik keuangan utama secara real-time</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {kpiCards.map((kpi, idx) => {
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

      {/* ── Heatmap kepadatan QRIS ── */}
      <DashboardHeatmapCard points={heatmap} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Recent Disputes (aktivitas admin real belum ada tabel audit) */}
        <Card className="lg:col-span-2 p-md bg-surface-container-lowest border border-outline-variant">
          <h2 className="text-headline-md text-on-surface font-semibold mb-md">Sengketa Terbaru</h2>
          {disputes.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant py-md text-center">
              Belum ada sengketa di platform.
            </p>
          ) : (
            <div className="space-y-sm">
              {disputes.slice(0, 5).map((d) => (
                <div key={d.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-md bg-surface-container rounded-md hover:bg-surface-container-high transition-colors gap-xs">
                  <div className="flex-1">
                    <p className="text-body-sm font-bold text-on-surface">{d.reason}</p>
                    <p className="text-label-xs text-on-surface-variant">
                      Sengketa &bull; ID: <span className="font-mono text-primary">{d.id}</span>
                    </p>
                  </div>
                  <span className="text-label-xs text-on-surface-variant shrink-0 bg-background px-2 py-0.5 rounded border border-outline-variant">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Holding Funds Card */}
        <Card className="p-md bg-surface-container-lowest border border-outline-variant flex flex-col justify-between">
          <div>
            <h2 className="text-headline-md text-on-surface font-semibold mb-md">Dana Tertahan</h2>
            <p className="text-headline-lg text-primary font-bold mb-xs">Rp {(holdingFunds).toLocaleString('id-ID')}</p>
            <p className="text-body-sm text-on-surface-variant mb-md leading-relaxed">
              Jumlah dana dari pembayaran yang masih PENDING (belum settle ke vendor).
            </p>
          </div>
          <div>
            <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container"
                style={{ width: `${totalGMV > 0 ? Math.min(100, (holdingFunds / totalGMV) * 100) : 0}%` }}
              ></div>
            </div>
            <p className="text-label-xs text-on-surface-variant mt-sm">
              {totalGMV > 0 ? Math.round((holdingFunds / totalGMV) * 100) : 0}% dari total keseluruhan transaksi
            </p>
          </div>
        </Card>
      </div>

      {/* Vendor Status Overview */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Ringkasan Status Mitra Vendor</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Aktif (Terverifikasi)</p>
            <p className="text-headline-lg text-primary font-bold">{activeVendors}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Ditangguhkan</p>
            <p className="text-headline-lg text-error font-bold">{suspendedVendors}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Menunggu KYB</p>
            <p className="text-headline-lg text-tertiary font-bold">{pendingKyb}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Total Terdaftar</p>
            <p className="text-headline-lg text-on-surface font-bold">{vendors.length}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-md">
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Ditolak</p>
            <p className="text-headline-lg text-error font-bold">{rejectedKyb}</p>
          </div>
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Belum Kirim Dokumen</p>
            <p className="text-headline-lg text-on-surface-variant font-bold">{unsubmittedKyb}</p>
          </div>
        </div>
      </Card>

      {/* System Health */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Metrik Performa & Keandalan Platform</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-label-sm text-on-surface-variant mb-xs">Uptime Sistem</p>
            <p className="text-headline-lg text-tertiary font-bold">99.98%</p>
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
