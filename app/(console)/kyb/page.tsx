'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getVendorVerifications } from '@/lib/services/kyb'
import { formatDate, getBadgeClass, getStatColorClass } from '@/lib/utils-simpul'
import type { VendorVerification } from '@/lib/types'

// ── Tab configuration ───────────────────────────────────────────────────────
const TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'VERIFIED', label: 'Verified' },
  { key: 'REJECTED', label: 'Ditolak' },
] as const

const DOC_LABELS = [
  { key: 'ktp', label: 'KTP', color: 'bg-secondary-container/70 text-on-secondary-container' },
  { key: 'npwp', label: 'NPWP', color: 'bg-tertiary-container/70 text-on-tertiary-container' },
  { key: 'siup', label: 'SIUP', color: 'bg-primary-container/50 text-on-primary-container' },
  { key: 'mou', label: 'MOU', color: 'bg-surface-container-high text-on-surface-variant' },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function getStatusBadge(status: string) {
  const cls = getBadgeClass(status)
  const labels: Record<string, string> = {
    'VERIFIED': 'Terverifikasi',
    'REJECTED': 'Ditolak',
    'PENDING': 'Menunggu',
  }
  return <Badge className={`${cls} border-current`}>{labels[status] || '-'}</Badge>
}

function getStatusStatClass(status: string) {
  return getStatColorClass(status)
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function KYBVerificationPage() {
  const [verifications, setVerifications] = useState<VendorVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getVendorVerifications()
      setVerifications(data)
    } catch {
      setError('Gagal memuat data verifikasi vendor.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Derived data (memoized — tab switch tidak re-render seluruh page) ──
  const pending = useMemo(
    () => verifications.filter(v => v.status === 'PENDING'),
    [verifications],
  )
  const verified = useMemo(
    () => verifications.filter(v => v.status === 'VERIFIED'),
    [verifications],
  )
  const rejected = useMemo(
    () => verifications.filter(v => v.status === 'REJECTED'),
    [verifications],
  )

  const filtered = useMemo(
    () =>
      activeTab === 'all'
        ? verifications
        : verifications.filter(v => v.status === activeTab),
    [verifications, activeTab],
  )

  // ── Error State ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background w-full max-w-full overflow-hidden">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">Verifikasi KYB</h1>
          <p className="text-body-md text-on-surface-variant">
            Periksa dan setujui dokumen kepatuhan KYC/KYB mitra vendor pernikahan.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-md">
          <AlertCircle className="h-12 w-12 text-error" />
          <p className="text-body-md text-on-surface-variant text-center">{error}</p>
          <Button onClick={fetchData} variant="outline">Coba lagi</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background animate-fade-in w-full max-w-full overflow-hidden">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">Verifikasi KYB</h1>
        <p className="text-body-md text-on-surface-variant">
          Periksa dan setujui dokumen kepatuhan KYC/KYB mitra vendor pernikahan.
        </p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-md bg-surface-container-lowest border border-outline-variant">
              <Skeleton className="h-4 w-24 mb-xs" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))
        ) : (
          <>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant">
              <p className="text-label-sm text-on-surface-variant mb-xs">Total Pengajuan</p>
              <p className="text-headline-lg text-on-surface font-bold">{verifications.length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant cursor-pointer hover:border-tertiary transition-colors" onClick={() => setActiveTab('PENDING')}>
              <p className="text-label-sm text-on-surface-variant mb-xs">Menunggu Verifikasi</p>
              <p className={`text-headline-lg font-bold ${getStatusStatClass('PENDING')}`}>{pending.length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant cursor-pointer hover:border-tertiary-container transition-colors" onClick={() => setActiveTab('VERIFIED')}>
              <p className="text-label-sm text-on-surface-variant mb-xs">Lolos Verifikasi</p>
              <p className={`text-headline-lg font-bold ${getStatusStatClass('VERIFIED')}`}>{verified.length}</p>
            </Card>
            <Card className="p-md bg-surface-container-lowest border border-outline-variant cursor-pointer hover:border-error transition-colors" onClick={() => setActiveTab('REJECTED')}>
              <p className="text-label-sm text-on-surface-variant mb-xs">Ditolak</p>
              <p className={`text-headline-lg font-bold ${getStatusStatClass('REJECTED')}`}>{rejected.length}</p>
            </Card>
          </>
        )}
      </div>

      {/* ── Tab Filters ───────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => {
          const count = tab.key === 'all'
            ? verifications.length
            : verifications.filter(v => v.status === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-corner-md text-label-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-on-primary/70' : 'text-on-surface-variant/60'}`}>
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Verification Cards / Table ─────────────────────────────────── */}
      <Card className="bg-surface-container-lowest border border-outline-variant w-full max-w-full overflow-hidden">
        {loading ? (
          <div className="p-md space-y-md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-md p-md bg-surface-container rounded-lg border border-outline-variant">
                <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-xs">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="hidden md:flex gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-10 w-20 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* ── Empty State ──────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 px-md text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-md">
              <AlertCircle className="h-10 w-10 text-on-surface-variant/40" />
            </div>
            <h3 className="text-headline-md text-on-surface font-semibold mb-xs">
              {activeTab === 'all'
                ? 'Belum ada pengajuan verifikasi'
                : activeTab === 'PENDING'
                  ? 'Tidak ada pengajuan menunggu'
                  : activeTab === 'VERIFIED'
                    ? 'Belum ada vendor terverifikasi'
                    : 'Tidak ada pengajuan ditolak'}
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-sm">
              {activeTab === 'all'
                ? 'Pengajuan verifikasi KYB dari vendor akan muncul di sini.'
                : activeTab === 'PENDING'
                  ? 'Semua pengajuan verifikasi telah ditindaklanjuti.'
                  : activeTab === 'VERIFIED'
                    ? 'Setujui pengajuan vendor untuk memulai verifikasi.'
                    : 'Semua pengajuan vendor telah disetujui.'}
            </p>
          </div>
        ) : (
          /* ── Table (desktop) + Card list (mobile) ──────────────────── */
          <>
            {/* Mobile: stacked cards */}
            <div className="divide-y divide-outline-variant md:hidden">
              {filtered.map((v) => (
                <div key={v.vendorId} className="p-md">
                  <div className="flex items-start justify-between gap-sm">
                    <div className="min-w-0">
                      <p className="text-body-md text-on-surface font-semibold truncate">{v.businessName}</p>
                      <p className="text-label-sm text-on-surface-variant mt-1">{v.category} &bull; {v.region}</p>
                    </div>
                    {getStatusBadge(v.status)}
                  </div>
                  <div className="flex items-center justify-between mt-md">
                    <div className="flex gap-1.5">
                      {DOC_LABELS.map(doc => (
                        <span
                          key={doc.key}
                          className={`text-label-xs font-semibold px-2 py-1 rounded ${doc.color}`}
                        >
                          {doc.label}
                        </span>
                      ))}
                    </div>
                    <Link href={`/kyb/${v.vendorId}`} className="shrink-0">
                      <Button variant="outline" size="sm" className="h-8 text-label-lg rounded-corner-full">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                  {v.submittedAt && (
                    <p className="text-label-xs text-on-surface-variant/60 mt-sm">
                      Submit: {formatDate(v.submittedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/50">
                  <th className="text-left p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Vendor</th>
                  <th className="text-left p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                  <th className="text-left p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider hidden xl:table-cell">Wilayah</th>
                  <th className="text-left p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider hidden xl:table-cell">Tanggal Submit</th>
                  <th className="text-center p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider hidden lg:table-cell">Dokumen</th>
                  <th className="text-center p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Status</th>
                  <th className="text-center p-md text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.vendorId} className="group border-b border-outline-variant hover:bg-surface-container transition-colors">
                    {/* Vendor info */}
                    <td className="p-md max-w-0">
                      <p className="text-body-md text-on-surface font-semibold truncate">{v.businessName}</p>
                    </td>
                    {/* Category */}
                    <td className="p-md hidden lg:table-cell">
                      <span className="text-body-sm text-on-surface-variant">{v.category}</span>
                    </td>
                    {/* Region */}
                    <td className="p-md hidden xl:table-cell">
                      <span className="text-body-sm text-on-surface-variant">{v.region}</span>
                    </td>
                    {/* Submit date */}
                    <td className="p-md hidden xl:table-cell">
                      <span className="text-body-sm text-on-surface-variant">
                        {v.submittedAt ? formatDate(v.submittedAt) : '-'}
                      </span>
                    </td>
                    {/* Document thumbnails */}
                    <td className="p-md hidden lg:table-cell">
                      <div className="flex gap-1.5 justify-center">
                        {DOC_LABELS.map(doc => (
                          <div
                            key={doc.key}
                            className={`text-label-xs font-semibold px-2 py-1 rounded ${doc.color}`}
                            title={doc.label}
                          >
                            {doc.label}
                          </div>
                        ))}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="p-md text-center">
                      {getStatusBadge(v.status)}
                    </td>
                    {/* Action */}
                    <td className="p-md text-center">
                      <Link href={`/kyb/${v.vendorId}`}>
                                  <Button variant="outline" size="sm" className="h-8 text-label-lg rounded-corner-full">
                          Lihat Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </Card>
    </main>
  )
}
