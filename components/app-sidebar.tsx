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
      title: "Overview",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Vendor Management",
      url: "/vendors",
      icon: IconBriefcase,
    },
    {
      title: "Transactions & Splits",
      url: "/transactions",
      icon: IconCreditCard,
    },
    {
      title: "Dispute Resolution",
      url: "/disputes",
      icon: IconAlertCircle,
    },
    {
      title: "Revenue & Financial",
      url: "/revenue",
      icon: IconTrendingUp,
    },
    {
      title: "Risk & Compliance",
      url: "/compliance",
      icon: IconShield,
    },
    {
      title: "AI Analytics",
      url: "/ai-analytics",
      icon: IconBrain,
    },
    {
      title: "Marketing & Featured",
      url: "/marketing",
      icon: IconStar,
    },
    {
      title: "User & Role Mgmt",
      url: "/user-management",
      icon: IconUsers,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: "Help & Support",
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
