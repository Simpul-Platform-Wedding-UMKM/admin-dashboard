'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Search, LogOut, UserCircle, X, Mail, Plus, Building, CreditCard } from 'lucide-react'
import { clearSession, getSession } from '@/lib/session'
import { useToast } from '@/components/ui/use-toast'
import { dummyDb } from '@/lib/dummyData'
import { formatCurrency } from '@/lib/utils-simpul'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function SiteHeader() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  
  // States for search
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // States for Quick Action Modals
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form states
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    category: 'INFO',
    target: 'ALL',
  })
  
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
  })

  const session = getSession()

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  // Fetch search results from mock database
  const query = searchQuery.trim().toLowerCase()
  const vendors = dummyDb.getVendors()
  const splits = dummyDb.getPaymentSplits()

  const matchingVendors = query
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.businessName.toLowerCase().includes(query) ||
          v.businessType.toLowerCase().includes(query)
      )
    : []

  const matchingSplits = query
    ? splits.filter(
        (s) =>
          s.id.toLowerCase().includes(query) ||
          (s.transactionId && s.transactionId.toLowerCase().includes(query)) ||
          (s.vendorName && s.vendorName.toLowerCase().includes(query)) ||
          (s.bookingTitle && s.bookingTitle.toLowerCase().includes(query))
      )
    : []

  const totalResultsCount = matchingVendors.length + matchingSplits.length

  const handleResultClick = (url: string) => {
    setSearchQuery('')
    setMobileSearchOpen(false)
    startTransition(() => {
      router.push(url)
    })
  }

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // ponytail: Simulating API delay for announcement publishing
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAnnouncementOpen(false)
      setAnnouncementData({ title: '', content: '', category: 'INFO', target: 'ALL' })
      toast({
        title: 'Pengumuman Diterbitkan',
        description: 'Pengumuman baru berhasil dipublikasikan di platform.',
      })
    }, 1200)
  }

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // ponytail: Simulating API delay for admin account creation
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAdminOpen(false)
      setAdminData({ name: '', email: '', role: 'ADMIN' })
      toast({
        title: 'Admin Ditambahkan',
        description: `Akun administrator baru untuk ${adminData.name} berhasil dibuat.`,
      })
    }, 1200)
  }

  // Common Search Results Dropdown component
  const SearchResultsDropdown = () => {
    if (!query) return null

    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-outline-variant bg-surface-container-lowest p-2 shadow-lg">
        {totalResultsCount === 0 ? (
          <div className="p-3 text-center text-body-sm text-on-surface-variant">
            Tidak ada hasil ditemukan untuk &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          <div className="space-y-3">
            {matchingVendors.length > 0 && (
              <div>
                <h4 className="px-2 py-1 text-label-sm font-semibold uppercase text-on-surface-variant">
                  Verifikasi KYB / Vendor
                </h4>
                <div className="space-y-1">
                  {matchingVendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() => handleResultClick(`/kyb/${vendor.id}`)}
                      className="flex w-full items-center gap-2 rounded-sm p-2 text-left text-body-sm hover:bg-surface-container-high transition-colors"
                    >
                      <Building className="h-4 w-4 shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-on-surface truncate">{vendor.businessName}</p>
                        <p className="text-label-xs text-on-surface-variant truncate">
                          {vendor.name} &bull; {vendor.region}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchingSplits.length > 0 && (
              <div>
                <h4 className="px-2 py-1 text-label-sm font-semibold uppercase text-on-surface-variant">
                  Transaksi & Bagi Hasil
                </h4>
                <div className="space-y-1">
                  {matchingSplits.map((split) => (
                    <button
                      key={split.id}
                      onClick={() => handleResultClick(`/transactions/${split.id}`)}
                      className="flex w-full items-center gap-2 rounded-sm p-2 text-left text-body-sm hover:bg-surface-container-high transition-colors"
                    >
                      <CreditCard className="h-4 w-4 shrink-0 text-tertiary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-on-surface truncate">
                          {split.bookingTitle || 'Transaksi Tanpa Judul'}
                        </p>
                        <p className="text-label-xs text-on-surface-variant truncate">
                          ID: {split.id} &bull; {formatCurrency(split.grossAmount)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (mobileSearchOpen) {
    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-outline-variant bg-surface-container-lowest px-4 z-40 relative">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-5 w-5 text-on-surface-variant" />
          <input
            autoFocus
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari vendor, pengguna, transaksi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <SearchResultsDropdown />
        </div>
        <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); }}>
          <X className="h-5 w-5 text-on-surface" />
        </Button>
      </header>
    )
  }

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-outline-variant bg-surface-container-lowest transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) z-40 relative">
        <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 bg-outline-variant"
          />

          {/* Full search bar from sm breakpoint up */}
          <div className="hidden flex-1 max-w-md sm:block relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-on-surface-variant" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari vendor, pengguna, transaksi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <SearchResultsDropdown />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto sm:hidden"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Cari"
          >
            <Search className="h-5 w-5 text-on-surface" />
          </Button>

          <div className="ml-auto flex items-center gap-2">
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex gap-1 items-center border-primary/20 hover:border-primary/40 bg-surface-container-low text-on-surface">
                  <Plus className="h-4 w-4 text-primary" />
                  <span>Buat Baru</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsAnnouncementOpen(true)}>
                  Buat Pengumuman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAdminOpen(true)}>
                  Tambah Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Actions Mobile Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 h-auto md:hidden" aria-label="Buat Baru">
                  <Plus className="h-5 w-5 text-on-surface" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsAnnouncementOpen(true)}>
                  Buat Pengumuman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAdminOpen(true)}>
                  Tambah Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Helpdesk Inbox Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 h-auto"
              aria-label="Pesan Masuk"
              onClick={() => router.push('/inbox')}
            >
              <Mail className="h-5 w-5 text-on-surface" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
            </Button>

            {/* Notifications Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 h-auto"
              aria-label="Notifikasi"
              onClick={() => router.push('/notifications')}
            >
              <Bell className="h-5 w-5 text-on-surface" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-tertiary rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-auto rounded-full" aria-label="Menu profil">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-label-sm">
                      {mounted ? (session?.name ?? 'A').charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-body-sm font-medium text-on-surface truncate">
                    {mounted ? session?.name ?? 'Admin' : 'Admin'}
                  </p>
                  <p className="text-label-sm text-on-surface-variant truncate">
                    {mounted ? session?.email ?? '' : ''}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Akun
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-error focus:text-error">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modal: Buat Pengumuman */}
      <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
        <DialogContent className="sm:max-w-md bg-surface-container-lowest border border-outline-variant text-on-surface">
          <DialogHeader>
            <DialogTitle className="font-heading text-headline-sm font-semibold">Buat Pengumuman Baru</DialogTitle>
            <DialogDescription className="text-body-sm text-on-surface-variant">
              Terbitkan pengumuman resmi ke seluruh platform SIMPUL.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAnnouncementSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-label-sm font-medium text-on-surface">Judul Pengumuman</label>
              <Input
                required
                placeholder="Masukkan judul pengumuman..."
                value={announcementData.title}
                onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                className="bg-surface-container border border-outline-variant text-on-surface focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-label-sm font-medium text-on-surface">Konten Pengumuman</label>
              <Textarea
                required
                rows={3}
                placeholder="Tulis pesan pengumuman di sini..."
                value={announcementData.content}
                onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                className="bg-surface-container border border-outline-variant text-on-surface resize-none focus-visible:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-label-sm font-medium text-on-surface">Kategori</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={announcementData.category}
                  onChange={(e) => setAnnouncementData({ ...announcementData, category: e.target.value })}
                >
                  <option value="INFO">Informasi</option>
                  <option value="ALERT">Penting</option>
                  <option value="PROMO">Promosi</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-label-sm font-medium text-on-surface">Target Penerima</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={announcementData.target}
                  onChange={(e) => setAnnouncementData({ ...announcementData, target: e.target.value })}
                >
                  <option value="ALL">Semua Pengguna</option>
                  <option value="VENDOR">Hanya Vendor</option>
                  <option value="BUYER">Hanya Pengantin</option>
                </select>
              </div>
            </div>
            <DialogFooter className="pt-2 gap-2 sm:gap-none">
              <Button type="button" variant="outline" onClick={() => setIsAnnouncementOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? 'Mengirim...' : 'Terbitkan Pengumuman'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Tambah Admin */}
      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogContent className="sm:max-w-md bg-surface-container-lowest border border-outline-variant text-on-surface">
          <DialogHeader>
            <DialogTitle className="font-heading text-headline-sm font-semibold">Tambah Admin Baru</DialogTitle>
            <DialogDescription className="text-body-sm text-on-surface-variant">
              Buat akun akses admin internal SIMPUL yang baru.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-label-sm font-medium text-on-surface">Nama Lengkap</label>
              <Input
                required
                placeholder="Nama lengkap admin..."
                value={adminData.name}
                onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                className="bg-surface-container border border-outline-variant text-on-surface focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-label-sm font-medium text-on-surface">Alamat Email</label>
              <Input
                required
                type="email"
                placeholder="nama@simpul.com"
                value={adminData.email}
                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                className="bg-surface-container border border-outline-variant text-on-surface focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-label-sm font-medium text-on-surface">Peran Akses</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-outline-variant bg-surface-container text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={adminData.role}
                onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
              >
                <option value="ADMIN">Admin Verifikator</option>
                <option value="FINANCE">Admin Keuangan</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <DialogFooter className="pt-2 gap-2 sm:gap-none">
              <Button type="button" variant="outline" onClick={() => setIsAdminOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isSubmitting ? 'Menambahkan...' : 'Tambah Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
