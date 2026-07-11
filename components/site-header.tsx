'use client'

import { useState } from 'react'
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
import { Bell, Search, LogOut, UserCircle, X } from 'lucide-react'
import { clearSession, getSession } from '@/lib/session'

export function SiteHeader() {
  const router = useRouter()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const session = getSession()

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  if (mobileSearchOpen) {
    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-outline-variant bg-surface-container-lowest px-4">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 text-on-surface-variant" />
          <input
            autoFocus
            type="search"
            placeholder="Cari vendor, pengguna, transaksi..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-outline-variant bg-surface-container text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="ghost" size="sm" className="p-2 h-auto" onClick={() => setMobileSearchOpen(false)}>
          <X className="h-5 w-5 text-on-surface" />
        </Button>
      </header>
    )
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-outline-variant bg-surface-container-lowest transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-outline-variant"
        />

        {/* Full search bar from sm breakpoint up; icon-only trigger on mobile */}
        <div className="hidden flex-1 max-w-md sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Cari vendor, pengguna, transaksi..."
              className="w-full pl-9 pr-3 py-2 rounded-md border border-outline-variant bg-surface-container text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
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
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 h-auto"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5 text-on-surface" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-tertiary rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-auto rounded-full" aria-label="Menu profil">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-label-sm">
                    {(session?.name ?? 'A').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-body-sm font-medium text-on-surface truncate">{session?.name ?? 'Admin'}</p>
                <p className="text-label-sm text-on-surface-variant truncate">{session?.email ?? ''}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-error focus:text-error">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
