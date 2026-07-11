'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
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
      setError(err instanceof Error ? err.message : 'Gagal memuat data compliance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Risk & Compliance</h1>
          <p className="text-body-md text-on-surface-variant">Monitor vendor compliance and platform risk factors</p>
        </div>

        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
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
            {Array.from({ length: 3 }).map((_, i) => (
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
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-32 mt-md" />
              </div>
            ))}
          </div>
        </Card>

        {/* Skeleton audit log table */}
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-48 mb-md" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant">
                  {['Action', 'Entity', 'Admin', 'IP Address', 'Date'].map((h) => (
                    <th key={h} className="text-left p-md">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-outline-variant">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="p-md">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Risk & Compliance</h1>
          <p className="text-body-md text-on-surface-variant">Monitor vendor compliance and platform risk factors</p>
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
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Risk & Compliance</h1>
        <p className="text-body-md text-on-surface-variant">Monitor vendor compliance and platform risk factors</p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total Checks</p>
          <p className="text-headline-lg text-on-surface font-semibold">{complianceChecks.length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Passed</p>
          <p className="text-headline-lg text-tertiary-container font-semibold">{complianceChecks.filter(c => c.status === 'PASSED').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Warning</p>
          <p className="text-headline-lg text-tertiary font-semibold">{complianceChecks.filter(c => c.status === 'WARNING').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Failed</p>
          <p className="text-headline-lg text-error font-semibold">{complianceChecks.filter(c => c.status === 'FAILED').length}</p>
        </Card>
      </div>

      {/* Compliance Checks */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Compliance Checks</h2>
        <div className="space-y-md">
          {complianceChecks.map((check) => (
            <div key={check.id} className="p-md bg-surface-container rounded-md border border-outline-variant">
              <div className="flex items-start justify-between mb-md">
                <div>
                  <p className="text-body-md text-on-surface font-semibold">{check.category.replace(/_/g, ' ')}</p>
                  <p className="text-label-sm text-on-surface-variant">{check.description}</p>
                </div>
                <div className="flex gap-xs">
                  <Badge className={check.status === 'PASSED' ? 'bg-tertiary-container text-on-tertiary-container' : check.status === 'WARNING' ? 'bg-tertiary text-on-tertiary' : 'bg-error text-on-error'}>
                    {check.status}
                  </Badge>
                  <Badge className={check.riskLevel === 'LOW' ? 'bg-tertiary-container text-on-tertiary-container' : check.riskLevel === 'MEDIUM' ? 'bg-tertiary text-on-tertiary' : check.riskLevel === 'HIGH' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error text-on-error'}>
                    {check.riskLevel}
                  </Badge>
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant">{check.findings}</p>
              <p className="text-label-sm text-on-surface-variant mt-md">Checked: {new Date(check.checkedAt).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Log */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Recent Audit Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="sticky left-0 z-10 bg-surface-container-lowest text-left p-md text-label-md text-on-surface font-semibold">Action</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Entity</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Admin</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">IP Address</th>
                <th className="text-left p-md text-label-md text-on-surface font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="group border-b border-outline-variant hover:bg-surface-container">
                  <td className="sticky left-0 z-10 bg-surface-container-lowest group-hover:bg-surface-container p-md text-body-sm font-medium text-on-surface">{log.actionType}</td>
                  <td className="p-md text-body-sm text-on-surface-variant">{log.entityType}: {log.entityId}</td>
                  <td className="p-md text-body-sm text-on-surface">{log.adminId}</td>
                  <td className="p-md text-body-sm font-mono text-on-surface-variant">{log.ipAddress}</td>
                  <td className="p-md text-body-sm text-on-surface-variant">{new Date(log.createdAt).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
