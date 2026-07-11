import { Dashboard } from '@/lib/types'
import { Building2, Users, TrendingUp, Wallet } from 'lucide-react'

interface DashboardStatsProps {
  data: Dashboard
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Vendor',
      value: data.totalVendor,
      subtext: `${data.vendorAktif} aktif`,
      icon: Building2,
      iconBg: 'bg-primary-fixed',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Pengguna',
      value: data.totalPengguna,
      subtext: 'terdaftar',
      icon: Users,
      iconBg: 'bg-secondary-fixed',
      iconColor: 'text-secondary',
    },
    {
      title: 'Total Transaksi',
      value: data.totalTransaksi,
      subtext: 'bulan ini',
      icon: TrendingUp,
      iconBg: 'bg-tertiary-fixed',
      iconColor: 'text-tertiary',
    },
    {
      title: 'Saldo Tertangguhkan',
      value: `Rp ${(data.saldoTertangguhkan / 1000000).toLocaleString('id-ID')}M`,
      subtext: `dari Rp ${(data.nilaiTransaksiTotal / 1000000000).toLocaleString('id-ID')}M`,
      icon: Wallet,
      iconBg: 'bg-error-container',
      iconColor: 'text-error',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 md:p-6 shadow-elevated transition-all hover:shadow-elevated-lg hover:border-primary/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-label-sm font-semibold uppercase text-on-surface-variant mb-2">
                  {stat.title}
                </p>
                <p className="font-heading text-headline-md text-on-surface mb-1">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value}
                </p>
                <p className="text-label-sm text-on-surface-variant">
                  {stat.subtext}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${stat.iconBg}`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
