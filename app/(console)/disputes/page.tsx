'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDisputes } from '@/lib/services/dispute'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Dispute } from '@/lib/types'

const DISPUTE_STATUSES = ['OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED']

export default function DisputeResolutionPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState(DISPUTE_STATUSES[0])

  useEffect(() => {
    getDisputes()
      .then(setDisputes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'OPEN': 'bg-destructive text-destructive-foreground',
      'IN_REVIEW': 'bg-secondary text-secondary-foreground',
      'RESOLVED': 'bg-tertiary-container text-tertiary-on-container',
      'CLOSED': 'bg-surface-container-high text-on-surface',
    }
    return colors[status] || 'bg-surface-container-high text-on-surface'
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Dispute Resolution</h1>
          <p className="text-body-md text-on-surface-variant">Manage and resolve customer disputes with vendors</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <div className="hidden lg:grid lg:grid-cols-4 gap-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-6 w-32 mb-md" />
              <div className="space-y-md">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Card key={j} className="p-md bg-surface-container">
                    <Skeleton className="h-4 w-20 mb-xs" />
                    <Skeleton className="h-3 w-full mb-sm" />
                    <Skeleton className="h-5 w-16" />
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <Skeleton className="h-6 w-32 mb-md" />
          <div className="space-y-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-md bg-surface-container rounded-md border border-outline-variant">
                <Skeleton className="h-5 w-48 mb-sm" />
                <Skeleton className="h-4 w-24 mb-sm" />
                <Skeleton className="h-4 w-full mb-sm" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
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
          <h1 className="font-heading text-headline-lg text-on-surface">Dispute Resolution</h1>
          <p className="text-body-md text-on-surface-variant">Manage and resolve customer disputes with vendors</p>
        </div>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center py-xl gap-md">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-body-md text-on-surface font-semibold">Gagal memuat data dispute</p>
          <p className="text-body-sm text-on-surface-variant text-center max-w-md">{error}</p>
          <Button variant="outline" onClick={() => { setLoading(true); setError(null); getDisputes().then(setDisputes).catch((e) => setError(e.message)).finally(() => setLoading(false)) }}>
            Coba Lagi
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Dispute Resolution</h1>
        <p className="text-body-md text-on-surface-variant">Manage and resolve customer disputes with vendors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Total Disputes</p>
          <p className="text-headline-lg text-on-surface font-semibold">{disputes.length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Open</p>
          <p className="text-headline-lg text-destructive font-semibold">{disputes.filter(d => d.status === 'OPEN').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">In Review</p>
          <p className="text-headline-lg text-secondary font-semibold">{disputes.filter(d => d.status === 'IN_REVIEW').length}</p>
        </Card>
        <Card className="p-md bg-surface-container-lowest border border-outline-variant">
          <p className="text-label-sm text-on-surface-variant mb-xs">Resolved</p>
          <p className="text-headline-lg text-primary font-semibold">{disputes.filter(d => d.status === 'RESOLVED').length}</p>
        </Card>
      </div>

      {/* Kanban Board — desktop/tablet: side-by-side columns */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-md">
        {DISPUTE_STATUSES.map((status) => (
          <Card key={status} className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-sm text-on-surface font-semibold mb-md">{status.replace(/_/g, ' ')}</h3>
            <div className="space-y-md">
              {disputes.filter(d => d.status === status).map((dispute) => (
                <Link href={`/disputes/${dispute.id}`} key={dispute.id} className="block transition-transform hover:scale-[1.02]">
                  <Card className="p-md bg-surface-container border-l-4 border-l-primary hover:shadow-elevated transition-shadow cursor-pointer">
                    <p className="text-label-md text-on-surface font-semibold mb-xs">ID: {dispute.id}</p>
                    <p className="text-body-sm text-on-surface-variant mb-sm">{dispute.reason}</p>
                    <Badge className="bg-primary text-primary-foreground">{dispute.status}</Badge>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Kanban Board — mobile: tab switcher between statuses, no horizontal scroll */}
      <div className="lg:hidden">
        <Tabs value={activeStatus} onValueChange={setActiveStatus}>
          <TabsList className="w-full overflow-x-auto justify-start">
            {DISPUTE_STATUSES.map((status) => (
              <TabsTrigger key={status} value={status} className="whitespace-nowrap">
                {status.replace(/_/g, ' ')} ({disputes.filter(d => d.status === status).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="space-y-md mt-md">
          {disputes.filter(d => d.status === activeStatus).map((dispute) => (
            <Link href={`/disputes/${dispute.id}`} key={dispute.id} className="block">
              <Card className="p-md bg-surface-container-lowest border-l-4 border-l-primary hover:shadow-elevated cursor-pointer transition-shadow">
                <p className="text-label-md text-on-surface font-semibold mb-xs">ID: {dispute.id}</p>
                <p className="text-body-sm text-on-surface-variant mb-sm">{dispute.reason}</p>
                <Badge className="bg-primary text-primary-foreground">{dispute.status}</Badge>
              </Card>
            </Link>
          ))}
          {disputes.filter(d => d.status === activeStatus).length === 0 && (
            <p className="text-center text-body-sm text-on-surface-variant py-lg">Tidak ada dispute dengan status ini</p>
          )}
        </div>
      </div>

      {/* Dispute Details */}
      <Card className="p-md bg-surface-container-lowest border border-outline-variant">
        <h2 className="text-headline-md text-on-surface font-semibold mb-md">All Disputes</h2>
        <div className="space-y-md">
          {disputes.map((dispute) => (
            <Link href={`/disputes/${dispute.id}`} key={dispute.id} className="block transition-transform hover:scale-[1.01]">
              <div className="p-md bg-surface-container rounded-md border border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-md">
                  <div>
                    <p className="text-body-md text-on-surface font-semibold">{dispute.reason}</p>
                    <p className="text-label-sm text-on-surface-variant">ID: {dispute.id}</p>
                  </div>
                  <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-md">{dispute.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md text-label-sm text-on-surface-variant">
                  <div>Buyer: {dispute.buyerId}</div>
                  <div>Vendor: {dispute.vendorId}</div>
                  <div>Created: {new Date(dispute.createdAt).toLocaleDateString('id-ID')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </main>
  )
}
