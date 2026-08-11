import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "3.8rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        {/* Main content: max-width + auto margin — no horizontal page scroll.
            Padding diatur per-halaman (p-lg md:p-xl) supaya tidak dobel. */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#FBF7F6]">
          <div className="flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-[1280px]">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
