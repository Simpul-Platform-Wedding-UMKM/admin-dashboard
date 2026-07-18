'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  User, 
  CreditCard, 
  Bell, 
  Key, 
  Loader2, 
  Download, 
  FileText, 
  CheckCircle2, 
  BadgeCheck 
} from 'lucide-react'
import { getSession } from '@/lib/session'

export default function ProfilePage() {
  const { toast } = useToast()
  const session = getSession()
  const [activeTab, setActiveTab] = useState<'akun' | 'billing' | 'notifikasi'>('akun')
  const [isSaving, setIsSaving] = useState(false)

  // Profile info
  const [profileData, setProfileData] = useState({
    name: session?.name || 'Simpul Admin',
    email: session?.email || 'admin@simpul.com',
    oldPassword: '',
    newPassword: '',
  })

  // Notification preferences
  const [notifPreferences, setNotifPreferences] = useState({
    disputeAlerts: true,
    vendorAlerts: true,
    settlementAlerts: true,
    monthlyReports: false
  })

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // ponytail: Simulating admin credentials update delay
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: 'Profil Diperbarui',
        description: 'Informasi akun dan sandi Anda berhasil diperbarui.',
      })
      setProfileData(prev => ({ ...prev, oldPassword: '', newPassword: '' }))
    }, 1200)
  }

  const handleNotifSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // ponytail: Simulating notification preferences save delay
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: 'Preferensi Disimpan',
        description: 'Pengaturan notifikasi berhasil diperbarui.',
      })
    }, 1000)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: 'Unduhan Dimulai',
      description: `Dokumen tagihan ${invoiceId} sedang diunduh.`,
    })
  }

  const handleUpdatePayment = () => {
    toast({
      title: 'Integrasi Gerbang Pembayaran',
      description: 'Fitur pembaruan metode pembayaran sedang diarahkan ke penyedia PJP.',
    })
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-lg md:p-xl bg-background">
      {/* Header Profile Cover */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/80 to-tertiary/90 p-md md:p-lg text-white flex flex-col sm:flex-row items-center gap-md border border-outline-variant/10 shadow-sm">
        <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-headline-lg font-bold border-2 border-white/40">
          {(profileData.name).charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-xs">
            <h1 className="font-heading text-headline-lg font-bold">{profileData.name}</h1>
            <BadgeCheck className="h-5 w-5 text-white fill-primary" />
          </div>
          <p className="text-body-md text-white/80 font-mono text-xs">{profileData.email}</p>
          <p className="text-label-xs bg-white/25 px-2 py-0.5 rounded mt-xs inline-block uppercase tracking-wider font-semibold">
            {session?.role || 'ADMINISTRATOR'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-xs border-b border-outline-variant pb-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('akun')}
          className={`px-sm py-2 text-label-sm font-semibold rounded-t-md transition-colors flex items-center gap-xs ${
            activeTab === 'akun' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <User className="h-4 w-4" /> Detail Akun
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-sm py-2 text-label-sm font-semibold rounded-t-md transition-colors flex items-center gap-xs ${
            activeTab === 'billing' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <CreditCard className="h-4 w-4" /> Penagihan (Billing)
        </button>
        <button
          onClick={() => setActiveTab('notifikasi')}
          className={`px-sm py-2 text-label-sm font-semibold rounded-t-md transition-colors flex items-center gap-xs ${
            activeTab === 'notifikasi' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Bell className="h-4 w-4" /> Notifikasi
        </button>
      </div>

      {/* Content panes */}
      <div className="grid grid-cols-1 gap-md">
        {/* Tab 1: Akun */}
        {activeTab === 'akun' && (
          <Card className="p-md md:p-lg bg-surface-container-lowest border border-outline-variant">
            <form onSubmit={handleProfileSave} className="space-y-md">
              <h3 className="text-headline-md font-bold text-on-surface border-b border-outline-variant pb-xs">Informasi Profil Admin</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-sm font-medium">Nama Lengkap</label>
                  <Input 
                    required
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-surface-container border border-outline-variant text-on-surface"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm font-medium">Alamat Email</label>
                  <Input 
                    required
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-surface-container border border-outline-variant text-on-surface"
                  />
                </div>
              </div>

              <div className="pt-sm border-t border-outline-variant space-y-md">
                <h4 className="text-body-sm font-bold text-on-surface flex items-center gap-xs">
                  <Key className="h-4 w-4 text-primary" /> Keamanan & Ganti Kata Sandi
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Kata Sandi Lama</label>
                    <Input 
                      type="password"
                      placeholder="Masukkan sandi saat ini..."
                      value={profileData.oldPassword}
                      onChange={e => setProfileData({ ...profileData, oldPassword: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm font-medium">Kata Sandi Baru</label>
                    <Input 
                      type="password"
                      placeholder="Masukkan sandi baru..."
                      value={profileData.newPassword}
                      onChange={e => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="bg-surface-container border border-outline-variant text-on-surface"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-md border-t border-outline-variant">
                <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-lg">
                  {isSaving ? <><Loader2 className="h-4 w-4 mr-xs animate-spin" /> Menyimpan...</> : 'Simpan Profil'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tab 2: Billing */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
            {/* Plan Info Card */}
            <Card className="lg:col-span-1 p-md bg-surface-container-lowest border border-outline-variant flex flex-col justify-between h-full">
              <div className="space-y-sm">
                <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Tipe Berlangganan</h3>
                <h2 className="text-headline-md font-bold text-primary">SIMPUL Enterprise Tier</h2>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Akses dasbor administrator tak terbatas, geofence QRIS, dispute mediator desk, dan laporan audit bulanan.
                </p>
                <div className="flex items-center gap-xs text-label-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded w-fit font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Akun Aktif & Berlisensi
                </div>
              </div>
              <div className="pt-md border-t border-outline-variant space-y-sm mt-md">
                <div>
                  <p className="text-label-xs text-on-surface-variant">Metode Pembayaran:</p>
                  <p className="text-body-sm font-bold text-on-surface font-mono">Mastercard ending in • • • • 4242</p>
                </div>
                <div>
                  <p className="text-label-xs text-on-surface-variant">Tagihan Berikutnya:</p>
                  <p className="text-body-sm font-bold text-on-surface">1 Agustus 2026</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleUpdatePayment} className="w-full text-label-sm border-outline-variant mt-xs">
                  Ubah Metode Pembayaran
                </Button>
              </div>
            </Card>

            {/* Invoices List Card */}
            <Card className="lg:col-span-2 p-md bg-surface-container-lowest border border-outline-variant h-full">
              <h3 className="text-headline-md font-bold text-on-surface mb-md pb-xs border-b border-outline-variant flex items-center gap-xs">
                <FileText className="h-5 w-5 text-primary" /> Riwayat Transaksi Penagihan
              </h3>
              
              <div className="divide-y divide-outline-variant">
                {[
                  { id: 'INV-2026-006', date: '2026-07-01', amount: 'Rp 4.500.000', status: 'LUNAS' },
                  { id: 'INV-2026-005', date: '2026-06-01', amount: 'Rp 4.500.000', status: 'LUNAS' },
                  { id: 'INV-2026-004', date: '2026-05-01', amount: 'Rp 4.500.000', status: 'LUNAS' },
                ].map((inv) => (
                  <div key={inv.id} className="py-md flex justify-between items-center gap-sm">
                    <div className="min-w-0">
                      <p className="text-body-sm font-bold text-on-surface font-mono">{inv.id}</p>
                      <p className="text-label-xs text-on-surface-variant">{new Date(inv.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-md shrink-0">
                      <div className="text-right">
                        <p className="text-body-sm font-bold text-on-surface">{inv.amount}</p>
                        <Badge className="bg-tertiary-container text-on-tertiary-container py-0 px-1 text-[10px]">{inv.status}</Badge>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(inv.id)} className="h-8 w-8 hover:bg-surface-container rounded-full text-on-surface-variant">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Notifikasi */}
        {activeTab === 'notifikasi' && (
          <Card className="p-md md:p-lg bg-surface-container-lowest border border-outline-variant">
            <form onSubmit={handleNotifSave} className="space-y-md">
              <h3 className="text-headline-md font-bold text-on-surface border-b border-outline-variant pb-xs">Preferensi Notifikasi Akun</h3>

              <div className="space-y-sm">
                <div className="flex items-center justify-between p-sm bg-surface-container border border-outline-variant rounded">
                  <div>
                    <p className="text-body-sm font-bold">Email Alert Kasus Sengketa (Dispute)</p>
                    <p className="text-label-xs text-on-surface-variant">Kirim email pemberitahuan setiap ada dispute sengketa baru diajukan pengantin.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifPreferences.disputeAlerts}
                    onChange={e => setNotifPreferences({ ...notifPreferences, disputeAlerts: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-sm bg-surface-container border border-outline-variant rounded">
                  <div>
                    <p className="text-body-sm font-bold">Email Verifikasi KYB Vendor Baru</p>
                    <p className="text-label-xs text-on-surface-variant">Kirim alert email instan saat vendor melengkapi kelengkapan berkas verifikasi KYB.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifPreferences.vendorAlerts}
                    onChange={e => setNotifPreferences({ ...notifPreferences, vendorAlerts: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-sm bg-surface-container border border-outline-variant rounded">
                  <div>
                    <p className="text-body-sm font-bold">Laporan Payout & Settlement Selesai</p>
                    <p className="text-label-xs text-on-surface-variant">Notifikasi email saat pembayaran bagi hasil ditarik/payout sukses.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifPreferences.settlementAlerts}
                    onChange={e => setNotifPreferences({ ...notifPreferences, settlementAlerts: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-sm bg-surface-container border border-outline-variant rounded">
                  <div>
                    <p className="text-body-sm font-bold">Laporan Analisis Bisnis Bulanan</p>
                    <p className="text-label-xs text-on-surface-variant">Kirim ringkasan file analisis omzet dan status platform di tiap awal bulan.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifPreferences.monthlyReports}
                    onChange={e => setNotifPreferences({ ...notifPreferences, monthlyReports: e.target.checked })}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-md border-t border-outline-variant">
                <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-lg">
                  {isSaving ? <><Loader2 className="h-4 w-4 mr-xs animate-spin" /> Menyimpan...</> : 'Simpan Preferensi'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </main>
  )
}
