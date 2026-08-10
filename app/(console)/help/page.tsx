'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { 
  HelpCircle, 
  Send, 
  Loader2, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert 
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: 'Bagaimana alur verifikasi KYB Mitra Vendor baru?',
    answer: 'Setiap vendor baru wajib mengunggah KTP, NPWP, SIUP, dan menandatangani draf MOU kerjasama. Tim verifikator memeriksa berkas legalitas di modul Verifikasi KYB. Status PENDING akan dirubah menjadi ACTIVE jika semua berkas valid, atau REJECTED dengan mencantumkan alasan penolakan dokumen.'
  },
  {
    question: 'Apa itu prinsip Zero Holding Funds di SIMPUL?',
    answer: 'Prinsip ini meminimalkan jumlah penumpukan dana platform. Transaksi bagi hasil yang masuk via QRIS akan langsung divalidasi dan dicairkan ke rekening vendor paling lambat H+1 hari kerja setelah acara selesai, kecuali jika terdapat dispute/sengketa yang diajukan oleh pihak pengantin.'
  },
  {
    question: 'Bagaimana cara menangani deviasi lokasi GPS (Geofencing)?',
    answer: 'Sistem otomatis membandingkan koordinat GPS lokasi wedding pengantin dengan titik koordinat saat vendor memindai QRIS. Jika deviasi melebihi radius 100 meter, transaksi diberi badge merah "Potensi Deviasi Zonasi" di Detail Transaksi. Admin perlu menghubungi vendor dan pengantin untuk mengonfirmasi validitas kehadiran layanan sebelum melepas hold dana.'
  },
  {
    question: 'Kapan tombol Force Payout Manual harus digunakan?',
    answer: 'Tombol Force Payout Manual di modul Audit Pendapatan digunakan hanya saat sistem otomatisasi transfer settlement bank mengalami gangguan teknis (status FAILED) atau saat sengketa berhasil diselesaikan dan dana harus dirilis manual oleh mediator setelah status sengketa ditutup.'
  }
]

export default function HelpSupportPage() {
  const { toast } = useToast()
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)
  const [isSending, setIsSending] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    category: 'TEKNIS',
    message: ''
  })

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    // ponytail: Simulating message dispatch to super admin
    setTimeout(() => {
      setIsSending(false)
      setFormData({ subject: '', category: 'TEKNIS', message: '' })
      toast({
        title: 'Pesan Terkirim',
        description: 'Pesan Anda telah diteruskan ke Super Admin. Tanggapan akan dikirimkan ke email Anda.',
      })
    }, 1200)
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-md md:p-xl bg-background">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface font-bold flex items-center gap-xs">
          <HelpCircle className="h-7 w-7 text-primary" /> Bantuan & Dukungan
        </h1>
        <p className="text-body-md text-on-surface-variant">Pusat FAQ operasional dasbor admin SIMPUL dan hububungi administrator utama.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        {/* Left Side: FAQ List Accordion */}
        <Card className="lg:col-span-2 p-md md:p-lg bg-surface-container-lowest border border-outline-variant space-y-md">
          <h2 className="text-headline-md font-bold text-on-surface pb-xs border-b border-outline-variant flex items-center gap-xs">
            <MessageSquare className="h-5 w-5 text-primary" /> Pusat Pertanyaan Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-sm">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <div key={idx} className="border border-outline-variant rounded-md overflow-hidden bg-surface-container-low">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-md text-left text-body-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors flex justify-between items-center gap-sm"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" /> : <ChevronDown className="h-4 w-4 shrink-0 text-on-surface-variant" />}
                  </button>
                  {isOpen && (
                    <div className="p-md pt-0 text-body-sm text-on-surface-variant leading-relaxed border-t border-outline-variant bg-surface-container-lowest">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Right Side: Contact Super Admin form */}
        <Card className="lg:col-span-1 p-md bg-surface-container-lowest border border-outline-variant flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-md">
            <h2 className="text-headline-md font-bold text-on-surface pb-xs border-b border-outline-variant flex items-center gap-xs">
              <ShieldAlert className="h-5 w-5 text-primary" /> Hubungi Super Admin
            </h2>
            <p className="text-label-xs text-on-surface-variant leading-relaxed">
              Kirimkan tiket aduan atau kendala teknis internal yang memerlukan otorisasi tingkat tinggi dari Super Admin.
            </p>

            <div className="space-y-1">
              <label className="text-label-sm font-medium">Subjek Masalah</label>
              <Input 
                required
                placeholder="Contoh: Gangguan API midtrans..."
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="bg-surface-container border border-outline-variant text-on-surface focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-label-sm font-medium">Kategori Kendala</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="TEKNIS">Masalah Teknis & Server</option>
                <option value="AKUN">Akses Akun & Autentikasi</option>
                <option value="FINANCE">Pencairan Dana FAILED</option>
                <option value="LAINNYA">Kategori Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-label-sm font-medium">Pesan Detail</label>
              <Textarea 
                required
                placeholder="Jelaskan secara rinci kronologi masalah..."
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="bg-surface-container border border-outline-variant text-on-surface resize-none focus-visible:ring-primary text-body-sm"
              />
            </div>

            <Button type="submit" disabled={isSending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-sm">
              {isSending ? <><Loader2 className="h-4 w-4 mr-xs animate-spin" /> Mengirim...</> : <><Send className="h-4 w-4 mr-xs" /> Kirim Aduan</>}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
