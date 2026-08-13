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
import { Bell, Search, LogOut, UserCircle, X, Mail, Building, CreditCard } from 'lucide-react'
import { clearSession, getSession } from '@/lib/session'
import { getVendors } from '@/lib/services/vendor'
import { getPaymentSplits } from '@/lib/services/payment'
import type { Vendor, PaymentSplit } from '@/lib/types'
import { formatCurrency } from '@/lib/utils-simpul'

export function SiteHeader() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // States for search
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Search result data fetched from real API
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [splits, setSplits] = useState<PaymentSplit[]>([])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load search index once on mount (real API, not mock)
  useEffect(() => {
    let active = true
    Promise.allSettled([getVendors(), getPaymentSplits()]).then(([v, s]) => {
      if (!active) return
      if (v.status === 'fulfilled') setVendors(v.value)
      if (s.status === 'fulfilled') setSplits(s.value)
    })
    return () => {
      active = false
    }
  }, [])

  const session = getSession()

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  // Filter search results from real API data
  const query = searchQuery.trim().toLowerCase()
  const matchingVendors = query
    ? vendors.filter(
        (v) =>
          v.name?.toLowerCase().includes(query) ||
          v.businessName?.toLowerCase().includes(query) ||
          v.businessType?.toLowerCase().includes(query)
      )
    : []

  const matchingSplits = query
    ? splits.filter(
        (s) =>
          s.id.toLowerCase().includes(query) ||
          (s.transactionId && s.transactionId.toLowerCase().includes(query)) ||
          (s.bookingItemId && s.bookingItemId.toLowerCase().includes(query))
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
                          {split.bookingItemId || 'Transaksi Tanpa Judul'}
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
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-surface-container-lowest shadow-[0_1px_0_rgba(129,82,82,0.08),0_4px_16px_-6px_rgba(129,82,82,0.12)] px-4 z-40 relative">
        <div className="relative flex flex-1 items-center gap-2.5 h-11 rounded-xl border border-outline-variant bg-surface-container px-3.5 focus-within:ring-2 focus-within:ring-primary">
          <Search className="h-4 w-4 shrink-0 text-on-surface-variant" />
          <input
            autoFocus
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari vendor, pengguna, transaksi..."
            className="w-full min-w-0 bg-transparent text-on-surface placeholder-on-surface-variant text-sm outline-none border-none focus:outline-none focus:ring-0"
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
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-surface-container-lowest shadow-[0_1px_0_rgba(129,82,82,0.08),0_4px_16px_-6px_rgba(129,82,82,0.12)] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) z-40 relative">
        <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-6 bg-outline"
          />

          {/* Full search bar from sm breakpoint up */}
          <div className="hidden flex-1 max-w-md sm:block relative">
            <div className="flex items-center gap-2.5 h-10 rounded-lg border border-outline-variant bg-surface-container px-3.5 focus-within:ring-2 focus-within:ring-primary">
              <Search className="h-3 w-3 shrink-0 text-on-surface-variant" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari vendor, pengguna, transaksi..."
                className="w-full min-w-0 bg-transparent text-on-surface placeholder-on-surface-variant text-sm outline-none border-none focus:outline-none focus:ring-0"
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
    </>
  )
}
