"use client"

import * as React from "react"
import {
  IconDashboard,
  IconBriefcase,
  IconCreditCard,
  IconAlertCircle,
  IconTrendingUp,
  IconUsers,
  IconMap,
  IconUserCheck,
} from "@tabler/icons-react"

import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: "Ikhtisar",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Verifikasi KYB",
      url: "/kyb",
      icon: IconUserCheck,
    },
    {
      title: "Manajemen Vendor",
      url: "/vendors",
      icon: IconBriefcase,
    },
    {
      title: "Transaksi & Bagi Hasil",
      url: "/transactions",
      icon: IconCreditCard,
    },
    {
      title: "Peta Panas QRIS",
      url: "/qris-heatmap",
      icon: IconMap,
    },
    {
      title: "Resolusi Sengketa",
      url: "/disputes",
      icon: IconAlertCircle,
    },
    {
      title: "Audit Pendapatan",
      url: "/revenue/audit",
      icon: IconTrendingUp,
    },
    {
      title: "Manajemen Pengguna & Peran",
      url: "/user-management",
      icon: IconUsers,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-14 justify-center"
            >
              <a href="/dashboard">
                <img
                  src="/images/logo.png"
                  alt="SIMPUL"
                  className={`shrink-0 rounded-xl object-contain transition-all duration-200 ease-in-out ${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'}`}
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
