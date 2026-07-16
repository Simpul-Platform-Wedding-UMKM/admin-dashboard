'use client'

import React, { useEffect, useState, startTransition } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getVendorById, updateVendor } from '@/lib/services/vendor'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
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
  Eye
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from '@/lib/utils-simpul'
import type { ExtendedVendor } from '@/lib/dummyData'

export default function KYBDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const id = params?.id as string
  
  const [vendor, setVendor] = useState<ExtendedVendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  
  // State for active document zoom modal
  const [zoomDoc, setZoomDoc] = useState<{ title: string; url: string } | null>(null)

  const fetchVendor = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getVendorById(id)
      setVendor(data as ExtendedVendor)
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data vendor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchVendor()
    }
  }, [id])

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      const updated = await updateVendor(id, {
        kycVerified: true,
        status: 'ACTIVE' as any,
        kycVerifiedAt: new Date().toISOString()
      })
      setVendor(updated as ExtendedVendor)
      toast({
        title: "KYB Disetujui",
        description: `Vendor ${vendor?.name} telah berhasil diverifikasi dan diaktifkan.`,
      })
      // Navigate back to KYB list page using startTransition
      startTransition(() => {
        router.push('/kyb')
        router.refresh()
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal menyetujui KYB",
        description: err?.message || "Terjadi kesalahan sistem.",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        variant: "destructive",
        title: "Alasan penolakan kosong",
        description: "Harap masukkan alasan penolakan dokumen.",
      })
      return
    }
    
    setActionLoading(true)
    try {
      const updated = await updateVendor(id, {
        kycVerified: false,
        status: 'REJECTED' as any,
        rejectionReason: rejectReason
      } as any)
      setVendor(updated as ExtendedVendor)
      setIsRejectOpen(false)
      toast({
        title: "KYB Ditolak",
        description: `Pengajuan KYB dari ${vendor?.name} telah ditolak. Alasan: "${rejectReason}"`,
      })
      startTransition(() => {
        router.push('/kyb')
        router.refresh()
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal menolak KYB",
        description: err?.message || "Terjadi kesalahan sistem.",
      })
    } finally {
      setActionLoading(false)
      setRejectReason('')
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-md p-md md:p-lg">
        <div className="flex items-center gap-xs">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-md mb-sm">
          <div>
            <Skeleton className="h-8 w-64 mb-xs" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-xs">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          <Card className="lg:col-span-1 p-md space-y-md">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </Card>
          <Card className="lg:col-span-2 p-md space-y-md">
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </Card>
        </div>
      </main>
    )
  }

  if (error || !vendor) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-md py-20 gap-md">
        <AlertTriangle className="h-12 w-12 text-error" />
        <h2 className="text-headline-md text-on-surface font-semibold">Vendor Tidak Ditemukan</h2>
        <p className="text-body-md text-on-surface-variant text-center max-w-md">
          {error || 'Data detail vendor dengan ID tersebut tidak dapat ditemukan.'}
        </p>
        <Link href="/kyb">
          <Button variant="outline">
            <ChevronLeft className="mr-xs h-4 w-4" /> Kembali ke Daftar KYB
          </Button>
        </Link>
      </main>
    )
  }

  const documents = [
    { key: 'ktp', title: 'KTP (Kartu Tanda Penduduk)', url: vendor.ktpUrl, label: 'Identitas Pemilik' },
    { key: 'npwp', title: 'NPWP (Nomor Pokok Wajib Pajak)', url: vendor.npwpUrl, label: 'Dokumen Pajak' },
    { key: 'siup', title: 'SIUP (Izin Usaha)', url: vendor.siupUrl, label: 'Legalitas Usaha' },
    { key: 'mou', title: 'MOU / Perjanjian Kerjasama', url: vendor.mouUrl, label: 'Kontrak Kemitraan' },
  ]

  return (
    <main className="flex flex-1 flex-col gap-md p-md md:p-lg bg-background">
      {/* Navigation Header */}
      <div className="flex items-center gap-xs">
        <Link href="/kyb" className="text-label-md text-on-surface-variant hover:text-on-surface flex items-center transition-colors">
          <ChevronLeft className="h-4 w-4" /> Kembali ke KYB
        </Link>
      </div>

      {/* Action Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-xs border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-sm mb-xs">
            <h1 className="font-heading text-headline-lg text-on-surface">{vendor.businessName}</h1>
            <Badge className={
              vendor.status === 'ACTIVE' 
                ? 'bg-tertiary-container text-on-tertiary-container' 
                : vendor.status === 'REJECTED' 
                  ? 'bg-error-container text-on-error-container' 
                  : 'bg-tertiary text-on-tertiary'
            }>
              {vendor.status === 'ACTIVE' ? 'VERIFIED' : vendor.status}
            </Badge>
          </div>
          <p className="text-body-md text-on-surface-variant">Diajukan oleh: <span className="font-semibold">{vendor.name}</span> &bull; {vendor.businessType}</p>
        </div>

        {vendor.status === 'PENDING' && (
          <div className="flex gap-sm w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsRejectOpen(true)}
              disabled={actionLoading}
              className="flex-1 md:flex-initial border-error text-error hover:bg-error/10 hover:text-error"
            >
              <X className="mr-xs h-4 w-4" /> Tolak Pengajuan
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex-1 md:flex-initial bg-tertiary text-on-tertiary hover:bg-tertiary/90"
            >
              <Check className="mr-xs h-4 w-4" /> Setujui Verifikasi
            </Button>
          </div>
        )}
      </div>

      {/* Rejection Alert Box */}
      {vendor.status === 'REJECTED' && (
        <Card className="p-md bg-error-container border border-error/20 flex gap-sm items-start">
          <AlertTriangle className="h-5 w-5 text-error mt-0.5" />
          <div>
            <h4 className="text-body-md font-semibold text-error">Pengajuan Verifikasi KYB Ditolak</h4>
            <p className="text-label-md text-on-surface-variant mt-xs">
              Alasan Penolakan: <span className="font-semibold text-on-surface font-mono">{vendor.rejectionReason || 'Tidak ada alasan spesifik.'}</span>
            </p>
          </div>
        </Card>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        
        {/* Left Side: Business & Account Information */}
        <div className="lg:col-span-1 space-y-md">
          
          {/* Vendor Profile Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <Building className="h-5 w-5 text-tertiary" /> Profil Bisnis
            </h3>
            
            <div className="space-y-sm">
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Nama Perusahaan / Bisnis</p>
                <p className="text-body-md text-on-surface font-semibold">{vendor.businessName}</p>
              </div>
              
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Kategori Usaha</p>
                <p className="text-body-md text-on-surface">{vendor.businessType}</p>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Penanggung Jawab</p>
                <p className="text-body-md text-on-surface">{vendor.name}</p>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Region / Wilayah Operasi</p>
                <p className="text-body-md text-on-surface flex items-center gap-xs">
                  <MapPin className="h-4 w-4 text-on-surface-variant" /> {vendor.region}
                </p>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Alamat Lengkap</p>
                <p className="text-body-md text-on-surface leading-relaxed">{vendor.address}</p>
              </div>

              <div className="pt-xs border-t border-outline-variant space-y-sm">
                <div className="flex items-center gap-sm">
                  <Mail className="h-4 w-4 text-on-surface-variant" />
                  <span className="text-body-md text-on-surface">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <Phone className="h-4 w-4 text-on-surface-variant" />
                  <span className="text-body-md text-on-surface">{vendor.phone}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Bank Details Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <CreditCard className="h-5 w-5 text-tertiary" /> Informasi Rekening Payout
            </h3>
            
            <div className="space-y-sm">
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Nama Bank</p>
                <p className="text-body-md text-on-surface font-semibold">{vendor.bankName} ({vendor.bankCode})</p>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Nomor Rekening</p>
                <p className="text-body-md text-on-surface font-mono font-bold tracking-wider">{vendor.bankAccountNumber}</p>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Nama Pemilik Rekening</p>
                <p className="text-body-md text-on-surface">{vendor.bankAccountName}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Uploaded Documents Section */}
        <div className="lg:col-span-2">
          <Card className="p-md bg-surface-container-lowest border border-outline-variant h-full">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <FileText className="h-5 w-5 text-tertiary" /> Berkas Legalitas & Dokumen Pendukung
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {documents.map((doc) => (
                <Card key={doc.key} className="overflow-hidden bg-surface-container border border-outline-variant flex flex-col justify-between group">
                  <div className="p-sm pb-xs">
                    <span className="text-label-sm bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm">{doc.label}</span>
                    <h4 className="text-body-md font-semibold text-on-surface mt-xs">{doc.title}</h4>
                  </div>
                  
                  {/* Document Thumbnail / Interactive Area */}
                  <div className="relative h-48 w-full bg-black/5 flex items-center justify-center overflow-hidden border-t border-b border-outline-variant bg-cover bg-center" style={{ backgroundImage: doc.url ? `url('${doc.url}')` : 'none' }}>
                    {!doc.url && (
                      <div className="flex flex-col items-center gap-xs text-on-surface-variant">
                        <FileText className="h-10 w-10 opacity-40" />
                        <span className="text-label-sm">File tidak tersedia</span>
                      </div>
                    )}
                    
                    {doc.url && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-sm">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setZoomDoc({ title: doc.title, url: doc.url! })}
                        >
                          <Eye className="h-4 w-4 mr-xs" /> Pratinjau
                        </Button>
                        <a href={doc.url} target="_blank" rel="noreferrer" className="no-underline">
                          <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white text-black border-none">
                            <ExternalLink className="h-4 w-4 mr-xs" /> Unduh <span className="sr-only">Unduh berkas</span>
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-sm flex justify-between items-center text-label-sm text-on-surface-variant">
                    <span>Format: Gambar / JPG</span>
                    {doc.url && (
                      <button 
                        onClick={() => setZoomDoc({ title: doc.title, url: doc.url! })}
                        className="text-tertiary font-semibold hover:underline flex items-center gap-xs bg-transparent border-none cursor-pointer"
                      >
                        Pratinjau <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Reject Reason Modal/Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md bg-surface-container-lowest border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-headline-md text-error flex items-center gap-xs">
              <AlertTriangle className="h-5 w-5" /> Tolak Verifikasi KYB
            </DialogTitle>
            <DialogDescription className="text-body-md text-on-surface-variant">
              Masukkan alasan mengapa pengajuan verifikasi legalitas dari {vendor.businessName} ditolak. Alasan ini akan dikirimkan kepada vendor agar mereka dapat memperbaiki dokumen mereka.
            </DialogDescription>
          </DialogHeader>

          <div className="py-sm">
            <Textarea
              placeholder="Contoh: Foto KTP buram, tidak terbaca, dan dokumen SIUP telah kadaluarsa."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="bg-surface-container border border-outline-variant text-on-surface resize-none focus-visible:ring-tertiary"
            />
          </div>

          <DialogFooter className="flex gap-sm sm:gap-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRejectOpen(false)
                setRejectReason('')
              }}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              className="flex-1 sm:flex-initial bg-error text-on-error hover:bg-error/95"
            >
              {actionLoading ? 'Memproses...' : 'Tolak & Kirim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Zoom / Preview Modal */}
      {zoomDoc && (
        <Dialog open={!!zoomDoc} onOpenChange={(open) => !open && setZoomDoc(null)}>
          <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden bg-black border border-outline-variant">
            <DialogHeader className="p-sm bg-surface-container-lowest border-b border-outline-variant flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-body-lg text-on-surface font-semibold">{zoomDoc.title}</DialogTitle>
                <DialogDescription className="text-label-sm text-on-surface-variant">Pratinjau Resolusi Penuh</DialogDescription>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-surface-container-high rounded-full self-start" onClick={() => setZoomDoc(null)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Tutup pratinjau</span>
              </Button>
            </DialogHeader>
            <div className="relative w-full h-[65vh] bg-black flex items-center justify-center p-sm">
              <img 
                src={zoomDoc.url} 
                alt={zoomDoc.title}
                className="max-w-full max-h-full object-contain rounded-md border border-outline-variant shadow-lg"
              />
            </div>
            <div className="p-sm bg-surface-container-lowest border-t border-outline-variant flex justify-end gap-sm">
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
