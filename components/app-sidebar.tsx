"use client"

import * as React from "react"
import {
  IconDashboard,
  IconBriefcase,
  IconCreditCard,
  IconAlertCircle,
  IconTrendingUp,
  IconShield,
  IconBrain,
  IconStar,
  IconUsers,
  IconSettings,
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
      title: "Risiko & Kepatuhan",
      url: "/compliance",
      icon: IconShield,
    },
    {
      title: "Analisis AI",
      url: "/ai-analytics",
      icon: IconBrain,
    },
    {
      title: "Pemasaran & Unggulan",
      url: "/marketing",
      icon: IconStar,
    },
    {
      title: "Manajemen Pengguna & Peran",
      url: "/user-management",
      icon: IconUsers,
    },
    {
      title: "Pengaturan",
      url: "/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-14"
            >
              <a href="/dashboard">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-sm">
                  S
                </div>
                <span className="flex flex-col leading-tight">
                  <span className="font-heading text-lg font-bold">SIMPUL</span>
                  <span className="text-xs text-on-surface-variant font-normal">
                    Admin Platform
                  </span>
                </span>
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
