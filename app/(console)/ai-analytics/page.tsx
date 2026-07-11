'use client'

import { useEffect, useState } from 'react'
import { getAIAnalyticsLogs } from '@/lib/services/analytics'
import type { AIAnalyticsLog } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AIAnalyticsPage() {
  const [logs, setLogs] = useState<AIAnalyticsLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAIAnalyticsLogs()
      setLogs(data)
    } catch {
      setError('Gagal memuat data AI Analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">AI Analytics</h1>
          <p className="text-body-md text-on-surface-variant">Monitor AI-powered insights and vendor query analytics</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-md py-24">
          <AlertCircle className="h-12 w-12 text-error" />
          <p className="text-body-md text-on-surface-variant">{error}</p>
          <Button onClick={fetchData}>Coba lagi</Button>
        </div>
      </main>
    )
  }

  const totalQueries = logs.length
  const avgConfidence = totalQueries > 0
    ? ((logs.reduce((sum, log) => sum + log.confidence, 0) / totalQueries) * 100).toFixed(1)
    : '0'
  const totalTokens = logs.reduce((sum, log) => sum + log.tokensUsed, 0)
  const avgTokensPerQuery = totalQueries > 0 ? (totalTokens / totalQueries).toFixed(0) : '0'

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">AI Analytics</h1>
        <p className="text-body-md text-on-surface-variant">Monitor AI-powered insights and vendor query analytics</p>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
                <Skeleton className="h-4 w-24 mb-xs" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Queries</p>
              <p className="text-headline-lg text-on-surface font-semibold">{totalQueries}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Avg Confidence</p>
              <p className="text-headline-lg text-tertiary font-semibold">{avgConfidence}%</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Tokens Used</p>
              <p className="text-headline-lg text-primary font-semibold">{(totalTokens / 1000).toFixed(1)}K</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Avg Tokens/Query</p>
              <p className="text-headline-lg text-on-surface font-semibold">{avgTokensPerQuery}</p>
            </Card>
          </>
        )}
      </div>

      {/* Query Analytics */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Recent Vendor Queries</h2>
        {loading ? (
          <div className="space-y-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <div className="flex items-start justify-between mb-md">
                  <div className="space-y-xs">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-xs text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-md mb-md" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-md">
            {logs.map((log) => (
              <div key={log.id} className="p-md bg-surface-container rounded-md border border-outline-variant hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between mb-md">
                  <div>
                    <p className="text-body-md text-on-surface font-semibold">{log.topic}</p>
                    <p className="text-label-sm text-on-surface-variant">Vendor: {log.vendorId} • Type: {log.queryType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-md text-tertiary font-semibold">{(log.confidence * 100).toFixed(0)}% Confidence</p>
                    <p className="text-label-sm text-on-surface-variant">{log.tokensUsed} tokens</p>
                  </div>
                </div>
                <div className="bg-surface-container-high rounded-md p-md mb-md">
                  <p className="text-label-md text-on-surface-variant font-semibold mb-xs">Query:</p>
                  <p className="text-body-sm text-on-surface-variant mb-md italic">&ldquo;{log.query}&rdquo;</p>
                  <p className="text-label-md text-on-surface-variant font-semibold mb-xs">Response:</p>
                  <p className="text-body-sm text-on-surface-variant">{log.response}</p>
                </div>
                <p className="text-label-sm text-on-surface-variant">Generated: {new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Query Type Distribution */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">Query Type Distribution</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md">
                <Skeleton className="h-5 w-32 mb-sm" />
                <Skeleton className="h-2 w-full rounded-full mb-sm" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {Array.from(new Set(logs.map(l => l.queryType))).map((type) => {
              const count = logs.filter(l => l.queryType === type).length
              const percentage = ((count / totalQueries) * 100).toFixed(0)
              return (
                <div key={type} className="p-md bg-surface-container rounded-md">
                  <p className="text-body-md text-on-surface font-semibold mb-sm">{type}</p>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-sm">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">{count} queries ({percentage}%)</p>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </main>
  )
}
