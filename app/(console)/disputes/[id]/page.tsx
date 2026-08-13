'use client'

import React, { useEffect, useState, startTransition } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getDisputeById, updateDispute } from '@/lib/services/dispute'
import { getPaymentSplits, updatePaymentSplit } from '@/lib/services/payment'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle,
  FileText,
  User,
  Building,
  Scale,
  DollarSign,
  ArrowRight,
  Eye,
  ExternalLink,
  X,
  ShieldAlert
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
import { formatCurrency, formatDate } from '@/lib/utils-simpul'
import type { Dispute } from '@/lib/types'
import type { ExtendedPaymentSplit } from '@/lib/types'

type ResolutionOption = 'REFUND_100' | 'RELEASE_30' | 'CUSTOM'

export default function DisputeMediationPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const id = params?.id as string

  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [split, setSplit] = useState<ExtendedPaymentSplit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Modal states
  const [isResolveOpen, setIsResolveOpen] = useState(false)
  const [resolutionOption, setResolutionOption] = useState<ResolutionOption>('REFUND_100')
  const [buyerPercent, setBuyerPercent] = useState<number>(100)
  const [resolutionReason, setResolutionReason] = useState<string>('')
  
  // Image preview modal state
  const [zoomImg, setZoomImg] = useState<string | null>(null)

  const fetchDisputeDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const disputeData = await getDisputeById(id)
      setDispute(disputeData)
      
      // Fetch matching payment split by bookingItemId or bookingId
      const splitsData = await getPaymentSplits()
      const match = splitsData.find(s => s.bookingItemId === disputeData.bookingItemId || s.bookingId === disputeData.bookingId)
      if (match) {
        setSplit(match)
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat detail dispute')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchDisputeDetails()
    }
  }, [id])

  // Sync percentages based on preset options
  useEffect(() => {
    if (resolutionOption === 'REFUND_100') {
      setBuyerPercent(100)
    } else if (resolutionOption === 'RELEASE_30') {
      setBuyerPercent(70) // 70% refund, 30% release
    }
  }, [resolutionOption])

  const handleSetInReview = async () => {
    setActionLoading(true)
    try {
      const updated = await updateDispute(id, {
        status: 'IN_REVIEW' as any
      })
      setDispute(updated)
      toast({
        title: "Status Diperbarui",
        description: "Dispute sedang berada dalam peninjauan mediasi admin.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal memperbarui status",
        description: err?.message || "Terjadi kesalahan sistem.",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolve = async () => {
    if (!resolutionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Catatan resolusi kosong",
        description: "Harap isi alasan dan catatan kesepakatan penyelesaian dispute.",
      })
      return
    }

    const grossAmount = split ? split.grossAmount : 0
    const buyerRefund = (grossAmount * buyerPercent) / 100
    const vendorGross = grossAmount - buyerRefund
    const platformFee = vendorGross * 0.01
    const microFee = vendorGross * 0.005
    const vendorNet = vendorGross - platformFee - microFee

    setActionLoading(true)
    try {
      // Determine resolution type
      let resolutionType: 'BUYER_WIN' | 'SELLER_WIN' | 'MUTUAL_AGREEMENT' = 'MUTUAL_AGREEMENT'
      if (buyerPercent === 100) {
        resolutionType = 'BUYER_WIN'
      } else if (buyerPercent === 0) {
        resolutionType = 'SELLER_WIN'
      }

      // Update dispute status
      const updatedDispute = await updateDispute(id, {
        status: 'RESOLVED' as any,
        resolutionType: resolutionType as any,
        resolutionNotes: `Resolusi: Refund Pengantin ${buyerPercent}%, Payout Vendor ${100 - buyerPercent}%. Catatan Admin: "${resolutionReason}"`,
        resolvedAt: new Date().toISOString()
      } as any)
      
      // Update payment split details in simulated storage
      if (split) {
        await updatePaymentSplit(split.id, {
          platformFeeAmount: Math.round(platformFee),
          vendorAmount: Math.round(vendorNet),
          settlementStatus: (buyerPercent === 100 ? 'FAILED' : 'SETTLED') as any
        })
      }

      setDispute(updatedDispute)
      setIsResolveOpen(false)
      
      toast({
        title: "Sengketa Diselesaikan",
        description: `Resolusi berhasil diterapkan. Dana dialokasikan ke Pengantin: ${formatCurrency(buyerRefund)} & Vendor: ${formatCurrency(vendorNet)}.`,
      })
      
      startTransition(() => {
        router.push('/disputes')
        router.refresh()
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal menyelesaikan dispute",
        description: err?.message || "Terjadi kesalahan sistem.",
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
        <Skeleton className="h-6 w-32 mb-xs" />
        <Skeleton className="h-10 w-96 mb-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          <Card className="lg:col-span-2 p-md h-80"><Skeleton className="h-full w-full" /></Card>
          <Card className="lg:col-span-1 p-md space-y-md"><Skeleton className="h-full w-full" /></Card>
        </div>
      </main>
    )
  }

  if (error || !dispute) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-md py-20 gap-md">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-headline-md text-on-surface font-semibold">Dispute Tidak Ditemukan</h2>
        <p className="text-body-md text-on-surface-variant">{error || 'Data dispute dengan ID tersebut tidak tersedia.'}</p>
        <Link href="/disputes">
          <Button variant="outline">
            <ChevronLeft className="mr-xs h-4 w-4" /> Kembali ke Disputes
          </Button>
        </Link>
      </main>
    )
  }

  // Calculate calculations for modal previews
  const grossAmount = split ? split.grossAmount : 0
  const buyerRefund = (grossAmount * buyerPercent) / 100
  const vendorGross = grossAmount - buyerRefund
  const platformFee = vendorGross * 0.01
  const microFee = vendorGross * 0.005
  const vendorNet = vendorGross - platformFee - microFee

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      {/* Navigation Header */}
      <div className="flex items-center gap-xs">
        <Link href="/disputes" className="text-label-md text-on-surface-variant hover:text-on-surface flex items-center transition-colors">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Desk Sengketa
        </Link>
      </div>

      {/* Banner Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-xs border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-sm mb-xs">
            <h1 className="font-heading text-headline-lg text-on-surface font-bold">Mediasi ID: {dispute.id}</h1>
            <Badge className={
              dispute.status === 'RESOLVED' 
                ? 'bg-tertiary-container text-tertiary-on-container' 
                : dispute.status === 'OPEN' 
                  ? 'bg-destructive text-destructive-foreground' 
                  : 'bg-secondary text-secondary-foreground'
            }>
              {dispute.status}
            </Badge>
          </div>
          <p className="text-body-md text-on-surface-variant">Kategori: <span className="font-semibold">{dispute.reason}</span> &bull; Diajukan pada {formatDate(dispute.createdAt)}</p>
        </div>

        {/* Action Panel Buttons */}
        <div className="flex gap-sm w-full md:w-auto">
          {dispute.status === 'OPEN' && (
            <Button 
              variant="secondary" 
              onClick={handleSetInReview}
              disabled={actionLoading}
              className="flex-1 md:flex-initial"
            >
              Mulai Review
            </Button>
          )}
          {(dispute.status === 'OPEN' || dispute.status === 'IN_REVIEW') && (
            <Button 
              onClick={() => setIsResolveOpen(true)}
              disabled={actionLoading}
              className="flex-1 md:flex-initial"
            >
              <Scale className="mr-xs h-4 w-4" /> Selesaikan Sengketa
            </Button>
          )}
        </div>
      </div>

      {/* Resolved info alert */}
      {dispute.status === 'RESOLVED' && (
        <Card className="p-md bg-tertiary-container border border-outline-variant flex gap-sm items-start">
          <CheckCircle className="h-5 w-5 text-tertiary-on-container mt-0.5" />
          <div>
            <h4 className="text-body-md font-semibold text-tertiary-on-container">Sengketa Selesai Dimediasi</h4>
            <p className="text-label-md text-on-surface-variant mt-xs">
              Keputusan Mediasi: <span className="font-semibold text-on-surface">{dispute.resolutionNotes}</span>
            </p>
            {dispute.resolvedAt && (
              <p className="text-label-sm text-on-surface-variant mt-0.5">Diselesaikan pada {formatDate(dispute.resolvedAt)}</p>
            )}
          </div>
        </Card>
      )}

      {/* Details layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        
        {/* Left Side: Parties Profiles & Contract Summary */}
        <div className="lg:col-span-1 space-y-md">
          
          {/* Dispute Parties Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <User className="h-5 w-5 text-primary" /> Pihak Bersengketa
            </h3>

            <div className="space-y-sm">
              <div className="p-sm bg-surface-container rounded-md border border-outline-variant">
                <p className="text-label-sm text-on-surface-variant uppercase font-semibold">Penggugat (Pengantin/Buyer)</p>
                <p className="text-body-md text-on-surface font-bold mt-xs">ID: {dispute.buyerId}</p>
                <p className="text-label-md text-on-surface-variant mt-0.5">Klien Konsumen SIMPUL Mobile</p>
              </div>

              <div className="p-sm bg-surface-container rounded-md border border-outline-variant">
                <p className="text-label-sm text-on-surface-variant uppercase font-semibold">Tergugat (Vendor Mitra)</p>
                <p className="text-body-md text-on-surface font-bold mt-xs">ID: {dispute.vendorId}</p>
                {split && (
                  <p className="text-label-md text-on-surface-variant mt-0.5">Nama Usaha: <span className="font-semibold">{split.vendorName}</span></p>
                )}
              </div>
            </div>
          </Card>

          {/* Contract Split Info Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <Scale className="h-5 w-5 text-primary" /> Nilai Kontrak Bersengketa
            </h3>

            {split ? (
              <div className="space-y-sm">
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase">Paket Jasa Wedding</p>
                  <p className="text-body-md text-on-surface font-semibold">{split.bookingTitle || split.bookingItemId}</p>
                </div>
                
                <div className="pt-xs border-t border-outline-variant space-y-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-on-surface">Total Nilai Kontrak</span>
                    <span className="text-body-md font-bold text-destructive">{formatCurrency(split.grossAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-label-md text-on-surface-variant">
                    <span>Dana Ditahan (Holding Status)</span>
                    <Badge className="bg-surface-container-high text-on-surface-variant">HOLDING</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-label-md text-on-surface-variant italic">Data finansial kontrak tidak ditemukan.</p>
            )}
          </Card>
        </div>

        {/* Right Side: Dispute Evidence & Narrative */}
        <div className="lg:col-span-2 space-y-md">
          
          {/* Dispute Description */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <FileText className="h-5 w-5 text-primary" /> Kronologi & Alasan Sengketa
            </h3>

            <div className="space-y-sm text-body-md leading-relaxed text-on-surface">
              <p className="p-sm bg-surface-container rounded-md border border-outline-variant font-medium text-destructive flex items-start gap-xs">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <span>Kategori Pelanggaran: {dispute.reason}</span>
              </p>
              
              <p className="text-on-surface leading-relaxed whitespace-pre-line p-sm bg-surface-container/50 border border-outline-variant rounded-md">
                {dispute.description}
              </p>
            </div>
          </Card>

          {/* Evidence Card */}
          <Card className="p-md bg-surface-container-lowest border border-outline-variant">
            <h3 className="text-headline-md text-on-surface font-semibold mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
              <FileText className="h-5 w-5 text-primary" /> Lampiran Bukti Sengketa (Screenshots/Foto)
            </h3>

            {dispute.evidence && dispute.evidence.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {dispute.evidence.map((imgUrl, idx) => (
                  <Card key={idx} className="overflow-hidden bg-surface-container border border-outline-variant flex flex-col justify-between group">
                    <div className="p-sm pb-xs flex justify-between">
                      <span className="text-label-sm bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm">Bukti Tambahan #{idx+1}</span>
                    </div>

                    <div className="relative h-48 w-full bg-black/5 flex items-center justify-center overflow-hidden border-t border-b border-outline-variant bg-cover bg-center" style={{ backgroundImage: `url('${imgUrl}')` }}>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-sm">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setZoomImg(imgUrl)}
                        >
                          <Eye className="h-4 w-4 mr-xs" /> Perbesar
                        </Button>
                      </div>
                    </div>

                    <div className="p-sm flex justify-end text-label-sm text-on-surface-variant">
                      <button 
                        onClick={() => setZoomImg(imgUrl)}
                        className="text-primary font-semibold hover:underline flex items-center gap-1.5 bg-transparent border-none cursor-pointer py-1"
                      >
                        Pratinjau <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-label-md text-on-surface-variant italic">Tidak ada lampiran gambar bukti pendukung.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Resolution Modal Component */}
      <Dialog open={isResolveOpen} onOpenChange={setIsResolveOpen}>
        <DialogContent className="sm:max-w-lg bg-surface-container-lowest border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-headline-md text-on-surface flex items-center gap-xs">
              <Scale className="h-5 w-5" /> Formulir Penyelesaian Sengketa
            </DialogTitle>
            <DialogDescription className="text-body-md text-on-surface-variant">
              Tentukan porsi pembagian dana kontrak (gross: <span className="font-bold text-on-surface">{formatCurrency(grossAmount)}</span>) yang ditahan platform.
            </DialogDescription>
          </DialogHeader>

          {/* Option Selector */}
          <div className="space-y-md py-sm">
            <div className="space-y-xs">
              <span className="text-label-sm font-semibold text-on-surface">Pilih Opsi Alokasi Dana</span>
              <div className="grid grid-cols-1 gap-xs">
                <Button 
                  variant={resolutionOption === 'REFUND_100' ? 'default' : 'outline'}
                  onClick={() => setResolutionOption('REFUND_100')}
                  className="justify-start text-left h-auto py-2.5 px-3"
                >
                  <div className="w-full">
                    <p className="font-bold text-sm">Refund 100% ke Pengantin</p>
                    <p className="text-xs opacity-80 mt-0.5">Kembalikan seluruh dana ke pembeli. Vendor tidak mendapat payout.</p>
                  </div>
                </Button>

                <Button 
                  variant={resolutionOption === 'RELEASE_30' ? 'default' : 'outline'}
                  onClick={() => setResolutionOption('RELEASE_30')}
                  className="justify-start text-left h-auto py-2.5 px-3"
                >
                  <div className="w-full">
                    <p className="font-bold text-sm">Lepas 30% ke Vendor (Refund 70%)</p>
                    <p className="text-xs opacity-80 mt-0.5">Vendor dibayar 30% porsi DP, 70% sisanya dikembalikan ke pembeli.</p>
                  </div>
                </Button>

                <Button 
                  variant={resolutionOption === 'CUSTOM' ? 'default' : 'outline'}
                  onClick={() => setResolutionOption('CUSTOM')}
                  className="justify-start text-left h-auto py-2.5 px-3"
                >
                  <div className="w-full">
                    <p className="font-bold text-sm">Custom Split Payout</p>
                    <p className="text-xs opacity-80 mt-0.5">Tentukan porsi persentase pengembalian pembeli secara manual.</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* Custom Slider */}
            {resolutionOption === 'CUSTOM' && (
              <div className="p-sm bg-surface-container rounded-md border border-outline-variant space-y-sm">
                <div className="flex justify-between items-center text-label-md text-on-surface">
                  <span>Porsi Refund Pengantin</span>
                  <span className="font-bold text-primary">{buyerPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={buyerPercent} 
                  onChange={(e) => setBuyerPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center text-[11px] text-on-surface-variant">
                  <span>0% (Refund Kosong)</span>
                  <span>50% (Bagi Rata)</span>
                  <span>100% (Refund Penuh)</span>
                </div>
              </div>
            )}

            {/* CRITICAL UI: Real-time Rupiah calculation box */}
            <div className="p-sm bg-surface-variant rounded-md border border-outline-variant space-y-xs">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Kalkulasi Pembagian Payout Dana</span>
              
              <div className="pt-xs border-t border-outline-variant space-y-sm text-label-md">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Total Nilai Kontrak Gross:</span>
                  <span className="text-on-surface font-semibold">{formatCurrency(grossAmount)}</span>
                </div>
                
                <div className="flex justify-between text-primary font-semibold">
                  <span>Refund ke Pengantin ({buyerPercent}%):</span>
                  <span>{formatCurrency(buyerRefund)}</span>
                </div>

                <div className="flex justify-between text-on-surface">
                  <span>Payout Vendor Gross ({100 - buyerPercent}%):</span>
                  <span>{formatCurrency(vendorGross)}</span>
                </div>

                <div className="pl-sm border-l border-outline-variant text-[11px] text-on-surface-variant space-y-0.5">
                  <div className="flex justify-between">
                    <span>Biaya Platform (1%):</span>
                    <span>- {formatCurrency(platformFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Mikro PJP (0.5%):</span>
                    <span>- {formatCurrency(microFee)}</span>
                  </div>
                </div>

                <div className="pt-xs border-t border-outline-variant flex justify-between font-bold text-on-surface bg-black/5 p-1.5 rounded-sm">
                  <span className="text-xs uppercase flex items-center">Alokasi Bersih:</span>
                  <span className="text-sm font-mono">
                    Pengantin: {formatCurrency(buyerRefund)} | Vendor (Net): {formatCurrency(vendorNet)} | Platform: {formatCurrency(platformFee)}
                  </span>
                </div>
              </div>
            </div>

            {/* Resolution Reason Description */}
            <div className="space-y-xs">
              <span className="text-label-sm font-semibold text-on-surface">Catatan Keputusan Admin (Wajib)</span>
              <Textarea 
                placeholder="Contoh: Disepakati pengembalian dana 100% karena vendor MUA tidak hadir di lokasi pernikahan dan tidak melakukan konfirmasi."
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                rows={3}
                className="bg-surface-container border border-outline-variant text-on-surface resize-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-sm sm:gap-none border-t border-outline-variant pt-sm">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsResolveOpen(false)
                setResolutionReason('')
              }}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleResolve}
              disabled={actionLoading || !resolutionReason.trim()}
              className="flex-1 sm:flex-initial"
            >
              {actionLoading ? 'Memproses...' : 'Terapkan Resolusi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      {zoomImg && (
        <Dialog open={!!zoomImg} onOpenChange={(open) => !open && setZoomImg(null)}>
          <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden bg-black border border-outline-variant">
            <DialogHeader className="p-sm bg-surface-container-lowest border-b border-outline-variant flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-body-lg text-on-surface font-semibold">Bukti Sengketa Resolusi Penuh</DialogTitle>
                <DialogDescription className="text-label-sm text-on-surface-variant">Pratinjau Detil Lampiran</DialogDescription>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-surface-container-high rounded-full self-start" onClick={() => setZoomImg(null)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Tutup pratinjau</span>
              </Button>
            </DialogHeader>
            <div className="relative w-full h-[65vh] bg-black flex items-center justify-center p-sm">
              <img 
                src={zoomImg} 
                alt="Bukti Sengketa"
                className="max-w-full max-h-full object-contain rounded-md border border-outline-variant shadow-lg"
              />
            </div>
            <div className="p-sm bg-surface-container-lowest border-t border-outline-variant flex justify-end">
              <Button size="sm" onClick={() => setZoomImg(null)}>Tutup</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  )
}
