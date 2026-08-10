'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  getVendorVerificationById,
  approveVerification,
  rejectVerification,
  getVerificationLogs,
} from '@/lib/services/kyb'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ChevronLeft,
  Check,
  X,
  FileText,
  MapPin,
  Mail,
  Phone,
  Building,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Eye,
  ZoomIn,
  Clock,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'
import { formatDate, formatDateTime, getRelativeTime, getBadgeClass } from '@/lib/utils-simpul'
import type { VerificationLog } from '@/lib/types'

// Shape response GET /admin/vendor-verifications/:id dari backend
interface KybVendorDetail {
  id: string
  vendorId: string
  businessName: string
  businessType: string
  region: string
  status: 'UNSUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  kybVerified: boolean
  kycVerifiedAt?: string
  rejectionReason?: string
  submittedAt?: string
  name: string
  email: string
  address: string
  phone: string
  bankName: string
  bankCode: string
  bankAccountNumber: string
  bankAccountName: string
  ktpUrl: string
  npwpUrl: string
  siupUrl: string
  mouUrl: string
  createdAt: string
}

// ── Document Tab Config ─────────────────────────────────────────────────────
const DOC_TABS = [
  { key: 'ktp', title: 'KTP Pemilik', label: 'KTP', icon: FileText },
  { key: 'npwp', title: 'NPWP', label: 'NPWP', icon: FileText },
  { key: 'siup', title: 'SIUP / NIB', label: 'SIUP', icon: FileText },
  { key: 'mou', title: 'MOU Kemitraan', label: 'MOU', icon: FileText },
] as const

type DocKey = typeof DOC_TABS[number]['key']

// ── Rejected Document Options ───────────────────────────────────────────────
const REJECTABLE_DOCS = [
  { key: 'ktp', label: 'KTP (Kartu Tanda Penduduk)' },
  { key: 'npwp', label: 'NPWP (Nomor Pokok Wajib Pajak)' },
  { key: 'siup', label: 'SIUP / NIB (Izin Usaha)' },
  { key: 'mou', label: 'MOU (Perjanjian Kerjasama)' },
]

// ── Status Helpers ──────────────────────────────────────────────────────────

function getStatusBadge(status: string) {
  const cls = getBadgeClass(status)
  const labels: Record<string, string> = {
    'VERIFIED': 'TERVERIFIKASI',
    'REJECTED': 'DITOLAK',
    'PENDING': 'MENUNGGU',
  }
  return <Badge className={`${cls} border-current`}>{labels[status] || status}</Badge>
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function KYBDetailsPage() {
  const params = useParams()
  const { toast } = useToast()

  const id = params?.id as string

  // ── State ──────────────────────────────────────────────────────────────
  const [vendor, setVendor] = useState<KybVendorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeDocTab, setActiveDocTab] = useState<DocKey>('ktp')
  const [logs, setLogs] = useState<VerificationLog[]>([])

  // Approve dialog
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [approveNotes, setApproveNotes] = useState('')

  // Reject dialog
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectedDocs, setRejectedDocs] = useState<Record<string, boolean>>({})

  // Zoom modal
  const [zoomDoc, setZoomDoc] = useState<{ title: string; url: string } | null>(null)

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchVendor = async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, logData] = await Promise.all([
        getVendorVerificationById(id),
        getVerificationLogs(id),
      ])
      setVendor(data)
      setLogs(logData)
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data vendor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchVendor()
  }, [id])

  // ── Actions ─────────────────────────────────────────────────────────────
  const isProcessed = vendor?.status === 'VERIFIED' || vendor?.status === 'REJECTED'

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await approveVerification(id, approveNotes.trim() || undefined)
      setVendor(prev => prev ? { ...prev, status: 'VERIFIED' as any, kycVerified: true, kycVerifiedAt: new Date().toISOString() } : null)
      setIsApproveOpen(false)
      setApproveNotes('')
      // Refresh logs
      const updatedLogs = await getVerificationLogs(id)
      setLogs(updatedLogs)
      toast({
        title: 'Verifikasi Disetujui',
        description: `Vendor ${vendor?.businessName} telah berhasil diverifikasi dan diaktifkan.`,
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal menyetujui',
        description: err?.message || 'Terjadi kesalahan sistem.',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Alasan wajib diisi',
        description: 'Harap masukkan alasan penolakan.',
      })
      return
    }

    const selectedDocs = Object.entries(rejectedDocs)
      .filter(([_, v]) => v)
      .map(([k]) => k)

    setActionLoading(true)
    try {
      await rejectVerification(id, rejectReason.trim(), selectedDocs)
      setVendor(prev => prev ? { ...prev, status: 'REJECTED' as any, kybVerified: false, rejectionReason: rejectReason.trim() } : null)
      setIsRejectOpen(false)
      setRejectReason('')
      setRejectedDocs({})
      // Refresh logs
      const updatedLogs = await getVerificationLogs(id)
      setLogs(updatedLogs)
      toast({
        title: 'Verifikasi Ditolak',
        description: `Pengajuan KYB dari ${vendor?.businessName} telah ditolak.`,
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal menolak',
        description: err?.message || 'Terjadi kesalahan sistem.',
      })
    } finally {
      setActionLoading(false)
    }
  }

  // ── Document Data ─────────────────────────────────────────────────────────
  const getDocUrl = (key: DocKey): string => {
    if (!vendor) return ''
    const map: Record<DocKey, string | undefined> = {
      ktp: vendor.ktpUrl,
      npwp: vendor.npwpUrl,
      siup: vendor.siupUrl,
      mou: vendor.mouUrl,
    }
    return map[key] || ''
  }

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl">
        <div className="flex items-center gap-xs"><Skeleton className="h-6 w-24" /></div>
        <div className="flex flex-col md:flex-row justify-between gap-md mb-sm">
          <div><Skeleton className="h-8 w-64 mb-xs" /><Skeleton className="h-4 w-40" /></div>
          <div className="flex gap-xs"><Skeleton className="h-10 w-28" /><Skeleton className="h-10 w-28" /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          <Card className="lg:col-span-1 p-md space-y-md">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </Card>
          <Card className="lg:col-span-2 p-md space-y-md">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </main>
    )
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error || !vendor) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-md py-20 gap-md">
        <AlertTriangle className="h-12 w-12 text-error" />
        <h2 className="text-headline-md text-on-surface font-semibold">Vendor Tidak Ditemukan</h2>
        <p className="text-body-md text-on-surface-variant text-center max-w-md">
          {error || 'Data detail vendor dengan ID tersebut tidak dapat ditemukan.'}
        </p>
        <Link href="/kyb">
          <Button variant="outline"><ChevronLeft className="mr-xs h-4 w-4" /> Kembali ke Daftar KYB</Button>
        </Link>
      </main>
    )
  }

  const currentDocUrl = getDocUrl(activeDocTab)
  const currentDocTab = DOC_TABS.find(t => t.key === activeDocTab)!

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      {/* ── Breadcrumb / Back ─────────────────────────────────────────── */}
      <div className="flex items-center gap-xs">
        <Link href="/kyb" className="text-label-md text-on-surface-variant hover:text-on-surface flex items-center transition-colors">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Verifikasi KYB
        </Link>
      </div>

      {/* ── Header Banner ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-xs border-b border-outline-variant">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-sm mb-xs">
            <h1 className="font-heading text-headline-md sm:text-headline-lg text-on-surface break-words min-w-0">{vendor.businessName}</h1>
            {getStatusBadge(vendor.status)}
          </div>
          <p className="text-body-md text-on-surface-variant flex flex-wrap items-center gap-x-xs">
            Diajukan oleh: <span className="font-semibold">{vendor.name}</span> &bull; {vendor.businessType}
            {vendor.createdAt && (
              <span className="text-label-sm">
                &bull; Submit: {formatDate(vendor.createdAt)}
              </span>
            )}
          </p>
        </div>

        {/* Action buttons (only when PENDING) */}
        {vendor.status === 'PENDING' && (
          <div className="flex gap-sm w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setRejectReason('')
                setRejectedDocs({})
                setIsRejectOpen(true)
              }}
              disabled={actionLoading}
              className="flex-1 md:flex-initial border-error text-error hover:bg-error/10 hover:text-error rounded-corner-full"
            >
              <X className="mr-xs h-4 w-4" /> Tolak Pengajuan
            </Button>
            <Button
              onClick={() => {
                setApproveNotes('')
                setIsApproveOpen(true)
              }}
              disabled={actionLoading}
              className="flex-1 md:flex-initial bg-primary text-on-primary hover:bg-primary/90 rounded-corner-full"
            >
              <Check className="mr-xs h-4 w-4" /> Setujui Verifikasi
            </Button>
          </div>
        )}
      </div>

      {/* ── Rejection Alert (when REJECTED) ────────────────────────────── */}
      {vendor.status === 'REJECTED' && vendor.rejectionReason && (
        <Card className="p-md bg-error-container/20 border border-error flex gap-sm items-start">
          <AlertTriangle className="h-5 w-5 text-error mt-0.5 shrink-0" />
          <div>
            <h4 className="text-body-md font-semibold text-on-error-container">Pengajuan Verifikasi Ditolak</h4>
            <p className="text-label-md text-error mt-xs">
              Alasan: <span className="font-semibold">{vendor.rejectionReason}</span>
            </p>
          </div>
        </Card>
      )}

      {/* ── Verified Alert ─────────────────────────────────────────────── */}
      {vendor.status === 'VERIFIED' && (
        <Card className="p-md bg-tertiary-container/20 border border-tertiary-container flex gap-sm items-start">
          <ShieldCheck className="h-5 w-5 text-tertiary mt-0.5 shrink-0" />
          <div>
            <h4 className="text-body-md font-semibold text-on-tertiary-container">Vendor Telah Terverifikasi</h4>
            <p className="text-label-md text-tertiary mt-xs">
              {vendor.kycVerifiedAt
                ? `Diverifikasi pada: ${formatDateTime(vendor.kycVerifiedAt)}`
                : 'Status verifikasi aktif.'}
            </p>
          </div>
        </Card>
      )}

      {/* ── Main Layout ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">

        {/* ═══ LEFT COLUMN: Business Info ═══ */}
        <div className="lg:col-span-1 space-y-md">

          {/* Vendor Profile Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-title-lg text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-sm">
                <Building className="h-5 w-5 text-primary" /> Profil Bisnis
            </h3>
            <div className="space-y-sm">
              <InfoRow label="Nama Perusahaan" value={vendor.businessName} bold />
              <InfoRow label="Kategori Usaha" value={vendor.businessType} />
              <InfoRow label="Penanggung Jawab" value={vendor.name} />
              <InfoRow label="Wilayah Operasi" value={vendor.region} icon={<MapPin className="h-4 w-4 text-on-surface-variant" />} />
              <InfoRow label="Alamat Lengkap" value={vendor.address} />
              <div className="pt-xs border-t border-outline-variant space-y-sm">
                <InfoRow label="Email" value={vendor.email} icon={<Mail className="h-4 w-4 text-on-surface-variant" />} />
                <InfoRow label="Telepon" value={vendor.phone} icon={<Phone className="h-4 w-4 text-on-surface-variant" />} />
              </div>
            </div>
          </Card>

          {/* Bank Details Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-title-lg text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-sm">
              <CreditCard className="h-5 w-5 text-primary" /> Rekening Payout
            </h3>
            <div className="space-y-sm">
              <InfoRow label="Nama Bank" value={`${vendor.bankName} (${vendor.bankCode})`} bold />
              <InfoRow label="Nomor Rekening" value={vendor.bankAccountNumber} mono />
              <InfoRow label="Pemilik Rekening" value={vendor.bankAccountName} />
            </div>
          </Card>

          {/* ── Verification History ───────────────────────────────── */ }
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-title-lg text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-sm">
              <Clock className="h-5 w-5 text-primary" /> Riwayat Verifikasi
            </h3>
            {logs.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant italic">Belum ada riwayat verifikasi.</p>
            ) : (
              <div className="space-y-sm">
                {[...logs].reverse().map((log) => (
                  <div key={log.id} className="flex gap-sm items-start p-sm bg-surface-container rounded-lg border border-outline-variant">
                    <div className={`mt-0.5 shrink-0 ${log.action === 'APPROVE' ? 'text-tertiary' : 'text-error'}`}>
                      {log.action === 'APPROVE'
                        ? <ShieldCheck className="h-4 w-4" />
                        : <ShieldX className="h-4 w-4" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm text-on-surface font-semibold">
                        {log.action === 'APPROVE' ? 'Disetujui' : 'Ditolak'} oleh {log.adminName}
                      </p>
                      {log.notes && <p className="text-label-sm text-on-surface-variant mt-0.5 break-words">{log.notes}</p>}
                      {log.reason && (
                        <div className="mt-1 p-2 bg-error-container/30 rounded border border-error">
                          <p className="text-label-xs text-on-error-container font-medium mb-0.5">Alasan Penolakan:</p>
                          <p className="text-label-sm text-error break-words">{log.reason}</p>
                          {log.rejectedDocuments && log.rejectedDocuments.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {log.rejectedDocuments.map(d => (
                                <span key={d} className="text-label-xs font-semibold px-1.5 py-0.5 bg-error-container text-on-error-container rounded uppercase">{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-label-xs text-on-surface-variant/60 mt-1">
                        {formatDateTime(log.createdAt)} &bull; {getRelativeTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ═══ RIGHT COLUMN: Document Viewer ═══ */}
        <div className="lg:col-span-2">
          <Card className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
            <h3 className="text-title-lg text-on-surface font-semibold p-md pb-xs border-b border-outline-variant flex items-center gap-sm">
              <FileText className="h-5 w-5 text-primary" /> Berkas Legalitas & Dokumen Pendukung
            </h3>

            {/* Document Tabs */}
            <div className="flex border-b border-outline-variant overflow-x-auto">
              {DOC_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveDocTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-label-lg font-medium transition-colors whitespace-nowrap ${
                    activeDocTab === tab.key
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                  {getDocUrl(tab.key) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" title="Tersedia" />
                  )}
                </button>
              ))}
            </div>

            {/* Document Preview Area */}
            <div className="p-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm mb-sm">
                <div className="min-w-0">
                  <h4 className="text-body-md text-on-surface font-semibold">{currentDocTab.title}</h4>
                  <p className="text-label-sm text-on-surface-variant">
                    {currentDocUrl ? 'Dokumen tersedia — klik untuk memperbesar' : 'Dokumen tidak tersedia'}
                  </p>
                </div>
                {currentDocUrl && (
                  <div className="flex gap-xs shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setZoomDoc({ title: currentDocTab.title, url: currentDocUrl })}
                      className="flex-1 sm:flex-initial"
                    >
                      <ZoomIn className="h-4 w-4 mr-xs" /> Perbesar
                    </Button>
                    <a href={currentDocUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-initial">
                        <ExternalLink className="h-4 w-4 mr-xs" /> Buka
                      </Button>
                    </a>
                  </div>
                )}
              </div>

              {/* Document Image */}
              {currentDocUrl ? (
                <div
                  className="relative w-full rounded-lg overflow-hidden border border-outline-variant bg-surface-container cursor-pointer group"
                  onClick={() => setZoomDoc({ title: currentDocTab.title, url: currentDocUrl })}
                  style={{ minHeight: 260 }}
                >
                  <img
                    src={currentDocUrl}
                    alt={currentDocTab.title}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: 500 }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-xs bg-black/60 text-white px-4 py-2 rounded-lg">
                      <Eye className="h-4 w-4" /> Klik untuk memperbesar
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 sm:h-64 rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center bg-surface-container/50 text-on-surface-variant px-md text-center">
                  <FileText className="h-12 w-12 mb-sm opacity-30" />
                  <p className="text-label-md">Dokumen belum diunggah</p>
                  <p className="text-label-sm opacity-60">Vendor belum mengunggah dokumen {currentDocTab.title.toLowerCase()}.</p>
                </div>
              )}

              {/* Document Status Indicators */}
              <div className="flex flex-wrap gap-2 mt-md">
                {DOC_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveDocTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm transition-colors ${
                      activeDocTab === tab.key
                        ? 'bg-primary text-on-primary'
                        : getDocUrl(tab.key)
                          ? 'bg-tertiary-container/30 text-on-tertiary-container border-tertiary-container'
                          : 'bg-surface-container text-on-surface-variant border border-outline-variant'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${getDocUrl(tab.key) ? 'bg-tertiary' : 'bg-outline-variant'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          DIALOGS
         ═════════════════════════════════════════════════════════════════ */}

      {/* ── Approve Confirmation Dialog ────────────────────────────────── */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="sm:max-w-md bg-surface-container-lowest border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-headline-md text-on-surface flex items-center gap-xs">
              <ShieldCheck className="h-5 w-5 text-tertiary" /> Setujui Verifikasi
            </DialogTitle>
            <DialogDescription className="text-body-md text-on-surface-variant">
              Anda akan menyetujui verifikasi KYB untuk <span className="font-semibold text-on-surface">{vendor.businessName}</span>.
              Vendor akan dapat menerima pesanan setelah disetujui.
            </DialogDescription>
          </DialogHeader>

          <div className="py-sm space-y-sm">
            <div className="p-sm bg-tertiary-container/20 rounded-lg border border-tertiary-container">
              <p className="text-label-sm text-on-tertiary-container font-semibold mb-xs">Efek setelah persetujuan:</p>
              <ul className="text-label-sm text-tertiary space-y-1 list-disc list-inside">
                <li>Status vendor berubah menjadi <strong>VERIFIED</strong></li>
                <li>Vendor dapat menerima booking/pesanan</li>
                <li>Notifikasi akan dikirim ke vendor</li>
              </ul>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant block mb-1">Catatan (opsional)</label>
              <Textarea
                placeholder="Contoh: Dokumen lengkap dan valid. Tidak ada masalah."
                value={approveNotes}
                onChange={e => setApproveNotes(e.target.value)}
                rows={2}
                className="bg-surface-container border border-outline-variant text-on-surface resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-sm">
            <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={actionLoading} className="flex-1 sm:flex-initial">
              Batal
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial bg-primary text-on-primary hover:bg-primary/90 rounded-corner-full"
            >
              {actionLoading ? 'Memproses...' : 'Setujui Verifikasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Confirmation Dialog ─────────────────────────────────── */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md bg-surface-container-lowest border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-headline-md text-error flex items-center gap-xs">
              <ShieldX className="h-5 w-5" /> Tolak Verifikasi
            </DialogTitle>
            <DialogDescription className="text-body-md text-on-surface-variant">
              Masukkan alasan penolakan dan pilih dokumen yang bermasalah.
              Alasan ini akan dikirimkan ke <span className="font-semibold">{vendor.businessName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-sm space-y-md">
            {/* Reason field */}
            <div>
              <label className="text-label-sm text-on-surface font-semibold block mb-1">
                Alasan Penolakan <span className="text-error">*</span>
              </label>
              <Textarea
                placeholder="Contoh: Foto KTP buram, tidak terbaca, dan dokumen SIUP telah kadaluarsa."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                className="bg-surface-container border border-outline-variant text-on-surface resize-none focus-visible:ring-error"
              />
            </div>

            {/* Rejected documents checkboxes */}
            <div>
              <label className="text-label-sm text-on-surface font-semibold block mb-2">
                Dokumen yang Bermasalah
              </label>
              <div className="space-y-2">
                {REJECTABLE_DOCS.map(doc => (
                  <label
                    key={doc.key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <Checkbox
                      checked={rejectedDocs[doc.key] || false}
                      onCheckedChange={(checked) =>
                        setRejectedDocs(prev => ({ ...prev, [doc.key]: checked === true }))
                      }
                      className="border-outline-variant data-[state=checked]:bg-error data-[state=checked]:border-error"
                    />
                    <span className="text-body-sm text-on-surface">{doc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Effects warning */}
            <div className="p-sm bg-error-container/30 rounded-lg border border-error">
              <p className="text-label-sm text-on-error-container font-semibold mb-xs">Efek setelah penolakan:</p>
              <ul className="text-label-sm text-error space-y-1 list-disc list-inside">
                <li>Status vendor berubah menjadi <strong>REJECTED</strong></li>
                <li>Vendor harus mengunggah ulang dokumen</li>
                <li>Alasan penolakan akan dikirim via notifikasi</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex gap-sm">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectOpen(false)
                setRejectReason('')
                setRejectedDocs({})
              }}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial"
            >
              Batal
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              className="flex-1 sm:flex-initial bg-error text-on-error hover:bg-error/90 rounded-corner-full"
            >
              {actionLoading ? 'Memproses...' : 'Tolak & Kirim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Document Zoom Modal ────────────────────────────────────────── */}
      {zoomDoc && (
        <Dialog open={!!zoomDoc} onOpenChange={(open) => !open && setZoomDoc(null)}>
          <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-black border border-outline-variant">
            <DialogHeader className="p-sm bg-surface-container-lowest border-b border-outline-variant flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-body-lg text-on-surface font-semibold">{zoomDoc.title}</DialogTitle>
                <DialogDescription className="text-label-sm text-on-surface-variant">Pratinjau Resolusi Penuh</DialogDescription>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-surface-container-high rounded-full self-start"
                onClick={() => setZoomDoc(null)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Tutup pratinjau</span>
              </Button>
            </DialogHeader>
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black flex items-center justify-center p-sm overflow-auto">
              <img
                src={zoomDoc.url}
                alt={zoomDoc.title}
                className="max-w-none object-contain rounded-md border border-outline-variant shadow-lg"
              />
            </div>
            <div className="p-sm bg-surface-container-lowest border-t border-outline-variant flex justify-end gap-sm flex-wrap">
              <a href={zoomDoc.url} target="_blank" rel="noreferrer" className="no-underline">
                <Button size="sm" variant="outline" className="flex items-center gap-xs">
                  <ExternalLink className="h-4 w-4" /> Buka Tab Baru
                </Button>
              </a>
              <Button size="sm" onClick={() => setZoomDoc(null)}>Tutup</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  )
}

// ── Helper: Info Row Component ──────────────────────────────────────────────

function InfoRow({
  label,
  value,
  icon,
  bold = false,
  mono = false,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  bold?: boolean
  mono?: boolean
}) {
  return (
    <div className="min-w-0">
      <p className="text-label-sm text-on-surface-variant uppercase">{label}</p>
      <p className={`text-body-md text-on-surface ${bold ? 'font-semibold' : ''} ${mono ? 'font-mono tracking-wider' : ''} flex items-center gap-xs min-w-0 break-words`}>
        {icon}
        <span className="min-w-0">{value}</span>
      </p>
    </div>
  )
}
