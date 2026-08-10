'use client'

import { useEffect, useState } from 'react'
import { getAIAnalyticsLogs } from '@/lib/services/analytics'
import type { AIAnalyticsLog } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle, BrainCircuit, BarChart3, MessageSquareText } from 'lucide-react'

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
      setError('Gagal memuat data Analisis AI')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const getQueryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'FAQ_BOT': 'Bot FAQ Kemitraan',
      'RECOMMENDATION': 'Strategi & Rekomendasi Bisnis'
    }
    return labels[type] || type
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">Analisis AI</h1>
          <p className="text-body-md text-on-surface-variant">Pantau hasil analisis kecerdasan buatan (AI Assistant) dan kueri pertanyaan vendor.</p>
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
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold flex items-center gap-xs">
            <BrainCircuit className="h-7 w-7 text-primary" /> Analisis AI
          </h1>
          <p className="text-body-md text-on-surface-variant">Pantau hasil analisis kecerdasan buatan (AI Assistant) dan kueri pertanyaan vendor.</p>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
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
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Kueri Masuk</p>
              <p className="text-headline-lg text-on-surface font-bold">{totalQueries}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Akurasi Rata-rata</p>
              <p className="text-headline-lg text-tertiary font-bold">{avgConfidence}%</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Token Terpakai</p>
              <p className="text-headline-lg text-primary font-bold">{(totalTokens / 1000).toFixed(1)}K</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Rata-rata Token / Kueri</p>
              <p className="text-headline-lg text-on-surface font-bold">{avgTokensPerQuery}</p>
            </Card>
          </>
        )}
      </div>

      {/* Query Analytics */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md flex items-center gap-xs">
          <MessageSquareText className="h-5 w-5 text-primary" /> Riwayat Kueri Asisten AI Vendor
        </h2>
        {loading ? (
          <div className="space-y-md">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <div className="flex justify-between items-start mb-md">
                  <div className="space-y-xs">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-xs text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-md">
            {logs.map((log) => (
              <div key={log.id} className="p-md bg-surface-container rounded-md border border-outline-variant hover:shadow-elevated transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-sm gap-xs">
                    <div>
                      <p className="text-body-md text-on-surface font-bold">{log.topic}</p>
                      <p className="text-label-xs text-on-surface-variant">Vendor ID: {log.vendorId} &bull; Peran Bot: {getQueryTypeLabel(log.queryType)}</p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-body-sm text-tertiary font-semibold">Akurasi: {(log.confidence * 100).toFixed(0)}%</p>
                      <p className="text-label-xs text-on-surface-variant font-mono">{log.tokensUsed} token terpakai</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-high rounded-md p-md mb-sm border border-outline-variant space-y-sm">
                    <div>
                      <p className="text-label-xs uppercase font-bold text-on-surface-variant">Kueri Pengguna:</p>
                      <p className="text-body-sm text-on-surface-variant italic leading-relaxed">&ldquo;{log.query}&rdquo;</p>
                    </div>
                    <div className="pt-xs border-t border-outline-variant">
                      <p className="text-label-xs uppercase font-bold text-on-surface-variant">Jawaban AI:</p>
                      <p className="text-body-sm text-on-surface leading-relaxed">{log.response}</p>
                    </div>
                  </div>
                </div>
                <p className="text-label-xs text-on-surface-variant mt-xs">
                  Dibuat: {new Date(log.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Query Type Distribution */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md flex items-center gap-xs">
          <BarChart3 className="h-5 w-5 text-tertiary" /> Distribusi Kategori Kueri
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md">
                <Skeleton className="h-5 w-32 mb-sm" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {Array.from(new Set(logs.map(l => l.queryType))).map((type) => {
              const count = logs.filter(l => l.queryType === type).length
              const percentage = ((count / totalQueries) * 100).toFixed(0)
              return (
                <div key={type} className="p-md bg-surface-container rounded-md border border-outline-variant">
                  <p className="text-body-md text-on-surface font-bold mb-xs">{getQueryTypeLabel(type)}</p>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-sm mt-sm">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <p className="text-label-sm text-on-surface-variant font-medium">{count} kueri ({percentage}%)</p>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </main>
  )
}
