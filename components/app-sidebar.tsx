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
  IconHelp,
  IconMap,
  IconUserCheck,
} from "@tabler/icons-react"

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: "Admin Super",
    email: "admin@simpul.com",
    avatar: "/avatars/admin.jpg",
  },
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
  navSecondary: [
    {
      title: "Bantuan & Dukungan",
      url: "/help",
      icon: IconHelp,
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
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  S
                </div>
                <span className="font-heading text-base font-semibold">SIMPUL</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
