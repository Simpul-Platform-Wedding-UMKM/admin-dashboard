'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, ShieldCheck, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getComplianceChecks } from '@/lib/services/compliance'
import { getAuditLogs } from '@/lib/services/admin'
import type { ComplianceCheck, AuditLog } from '@/lib/types'

export default function RiskCompliancePage() {
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [checks, logs] = await Promise.all([
        getComplianceChecks(),
        getAuditLogs(),
      ])
      setComplianceChecks(checks)
      setAuditLogs(logs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data kepatuhan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'VENDOR_VERIFICATION': 'Verifikasi Legalitas Vendor',
      'PAYMENT_SECURITY': 'Keamanan Transaksi Pembayaran',
      'FRAUD_DETECTION': 'Deteksi Fraud & Penipuan',
      'DATA_PRIVACY': 'Privasi & Perlindungan Data',
      'KYC_REQUIREMENTS': 'Ketentuan KYC & NPWP'
    }
    return labels[category] || category.replace(/_/g, ' ')
  }

  const getRiskLabel = (level: string) => {
    const labels: Record<string, string> = {
      'LOW': 'Risiko Rendah',
      'MEDIUM': 'Risiko Sedang',
      'HIGH': 'Risiko Tinggi',
      'CRITICAL': 'Risiko Kritis'
    }
    return labels[level] || level
  }

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
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Risiko & Kepatuhan</h1>
          <p className="text-body-md text-on-surface-variant">Pantau kepatuhan mitra vendor, faktor risiko platform, dan log audit keamanan.</p>
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-20 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>

        {/* Skeleton compliance check cards */}
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-48 mb-md" />
          <div className="space-y-md">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <div className="flex items-start justify-between mb-md">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="flex gap-xs">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-32 mt-md" />
              </div>
            ))}
          </div>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background w-full max-w-full overflow-hidden">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">Risiko & Kepatuhan</h1>
          <p className="text-body-md text-on-surface-variant">Pantau kepatuhan mitra vendor, faktor risiko platform, dan log audit keamanan.</p>
        </div>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center py-xl gap-md">
          <AlertCircle className="h-10 w-10 text-error" />
          <p className="text-body-md text-on-surface text-center">{error}</p>
          <Button onClick={fetchData} variant="outline">Coba lagi</Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background w-full max-w-full overflow-hidden">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Risiko & Kepatuhan</h1>
        <p className="text-body-md text-on-surface-variant">Pantau kepatuhan mitra vendor, faktor risiko platform, dan log audit keamanan.</p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total Pemeriksaan</p>
          <p className="text-headline-lg text-on-surface font-bold">{complianceChecks.length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Lolos Verifikasi</p>
          <p className="text-headline-lg text-tertiary font-bold">{complianceChecks.filter(c => c.status === 'PASSED').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Peringatan</p>
          <p className="text-headline-lg text-tertiary font-bold">{complianceChecks.filter(c => c.status === 'WARNING').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Gagal Kepatuhan</p>
          <p className="text-headline-lg text-error font-bold">{complianceChecks.filter(c => c.status === 'FAILED').length}</p>
        </Card>
      </div>

      {/* Compliance Checks */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md flex items-center gap-xs">
          <ShieldCheck className="h-5 w-5 text-primary" /> Riwayat Audit & Pemeriksaan Kepatuhan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {complianceChecks.map((check) => (
            <div key={check.id} className="p-md bg-surface-container rounded-md border border-outline-variant flex flex-col justify-between hover:shadow-elevated transition-shadow">
              <div>
                <div className="flex items-start justify-between mb-sm gap-xs">
                  <div>
                    <p className="text-body-md text-on-surface font-bold">{getCategoryLabel(check.category)}</p>
                    <p className="text-label-xs text-on-surface-variant font-mono">ID Pemeriksaan: {check.id} &bull; Vendor: {check.vendorId}</p>
                  </div>
                  <div className="flex gap-xs items-center shrink-0">
                    <Badge className={check.status === 'PASSED' ? 'bg-tertiary-container text-on-tertiary-container' : check.status === 'WARNING' ? 'bg-tertiary text-on-tertiary' : 'bg-error text-on-error'}>
                      {check.status === 'PASSED' ? 'LOLOS' : check.status === 'WARNING' ? 'PERINGATAN' : 'GAGAL'}
                    </Badge>
                    <Badge className={check.riskLevel === 'LOW' ? 'bg-tertiary-container text-on-tertiary-container' : check.riskLevel === 'MEDIUM' ? 'bg-tertiary text-on-tertiary' : check.riskLevel === 'HIGH' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error text-on-error'}>
                      {getRiskLabel(check.riskLevel)}
                    </Badge>
                  </div>
                </div>
                <div className="bg-surface-container-high rounded p-sm text-body-sm text-on-surface leading-relaxed mb-sm">
                  <p className="font-semibold text-label-xs uppercase text-on-surface-variant mb-xs">Deskripsi Temuan:</p>
                  <p className="italic text-on-surface-variant">&ldquo;{check.description}&rdquo;</p>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-md">{check.findings}</p>
              </div>
              <p className="text-label-xs text-on-surface-variant pt-xs border-t border-outline-variant">
                Tanggal Periksa: {new Date(check.checkedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Log */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant w-full max-w-full overflow-hidden">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md flex items-center gap-xs">
          <History className="h-5 w-5 text-primary" /> Log Audit Keamanan Terbaru
        </h2>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[650px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="sticky left-0 z-10 bg-surface-container-lowest text-left p-md text-label-md text-on-surface font-semibold">Tindakan</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Entitas Objek</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">ID Admin</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Alamat IP</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Tanggal Log</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="group border-b border-outline-variant hover:bg-surface-container transition-colors">
                  <td className="sticky left-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container p-md text-body-sm font-bold text-on-surface">
                    {getActionLabel(log.actionType)}
                  </td>
                  <td className="p-md text-body-sm text-on-surface-variant">
                    {getEntityLabel(log.entityType)}: <span className="font-mono text-xs text-primary">{log.entityId}</span>
                  </td>
                  <td className="p-md text-body-sm text-on-surface">{log.adminId}</td>
                  <td className="p-md text-body-sm font-mono text-on-surface-variant text-xs">{log.ipAddress}</td>
                  <td className="p-md text-body-sm text-on-surface-variant">
                    {new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
