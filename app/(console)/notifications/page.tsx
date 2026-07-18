'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  Bell, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  Inbox
} from 'lucide-react'
import { formatDate } from '@/lib/utils-simpul'

interface SystemNotification {
  id: string
  title: string
  description: string
  type: 'WARNING' | 'INFO' | 'SUCCESS'
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionLabel?: string
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Potensi Deviasi Zonasi Terdeteksi',
    description: 'Vendor Budi Catering Service melakukan pemindaian QRIS (split-2) berjarak 6.3 km dari titik lokasi pengantin. Sistem menandai potensi penyalahgunaan zonasi.',
    type: 'WARNING',
    isRead: false,
    createdAt: '2026-07-16T15:30:00Z',
    actionUrl: '/transactions/split-2',
    actionLabel: 'Periksa Lokasi Transaksi'
  },
  {
    id: 'notif-2',
    title: 'Pengajuan Verifikasi KYB Baru',
    description: 'Vendor baru "Rina MUA & Gallery" telah melengkapi semua dokumen legalitas. Menunggu verifikasi dokumen identitas dan SIUP dari tim admin.',
    type: 'INFO',
    isRead: false,
    createdAt: '2026-07-16T09:15:00Z',
    actionUrl: '/kyb/vendor-2',
    actionLabel: 'Verifikasi Dokumen'
  },
  {
    id: 'notif-3',
    title: 'Dispute Berhasil Diselesaikan',
    description: 'Dispute disp-1 untuk transaksi buffet CV Budi Catering telah diselesaikan oleh mediator dengan pengembalian dana 100% ke Pengantin.',
    type: 'SUCCESS',
    isRead: true,
    createdAt: '2026-07-15T18:00:00Z',
    actionUrl: '/disputes/disp-1',
    actionLabel: 'Lihat Catatan Resolusi'
  },
  {
    id: 'notif-4',
    title: 'Bagi Hasil Settlement Berhasil',
    description: 'Dana bagi hasil split-1 untuk Satria Decoration sebesar Rp14.775.000 telah sukses dicairkan ke rekening Bank Rakyat Indonesia.',
    type: 'SUCCESS',
    isRead: true,
    createdAt: '2026-07-14T20:10:00Z',
    actionUrl: '/revenue/audit',
    actionLabel: 'Lihat Buku Besar'
  }
]

export default function NotificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS)
  const [filterType, setFilterType] = useState<'ALL' | 'WARNING' | 'INFO' | 'SUCCESS'>('ALL')

  const filteredNotifs = notifications.filter(n => {
    return filterType === 'ALL' || n.type === filterType
  })

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }))
    setNotifications(updated)
    toast({
      title: 'Notifikasi Diperbarui',
      description: 'Semua notifikasi telah ditandai sebagai dibaca.',
    })
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => {
      if (n.id === id) return { ...n, isRead: true }
      return n
    })
    setNotifications(updated)
  }

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    toast({
      title: 'Notifikasi Dihapus',
      description: 'Notifikasi berhasil dibuang dari daftar.',
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    toast({
      title: 'Notifikasi Dibersihkan',
      description: 'Semua notifikasi sistem telah dihapus permanen.',
    })
  }

  const handleNotificationClick = (notif: SystemNotification) => {
    markAsRead(notif.id)
    if (notif.actionUrl) {
      router.push(notif.actionUrl)
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-lg p-lg md:p-xl bg-background">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm border-b border-outline-variant pb-md">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface flex items-center gap-xs">
            <Bell className="h-6 w-6 text-primary" /> Notifikasi Sistem
          </h1>
          <p className="text-body-sm text-on-surface-variant">Pantau peringatan keamanan transaksi, pendaftaran, dan audit keuangan SIMPUL.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-xs w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="flex-1 sm:flex-initial text-label-sm border-outline-variant"
            >
              <Check className="h-4 w-4 mr-xs" /> Tandai Semua Dibaca
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllNotifications}
              className="flex-1 sm:flex-initial text-label-sm border-error text-error hover:bg-error/10 hover:text-error"
            >
              <Trash2 className="h-4 w-4 mr-xs" /> Bersihkan Semua
            </Button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-xs border-b border-outline-variant pb-xs overflow-x-auto">
        {(['ALL', 'WARNING', 'INFO', 'SUCCESS'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-sm py-xs text-label-sm font-semibold rounded-t-md transition-colors relative ${
              filterType === type 
                ? 'text-primary border-b-2 border-primary font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {type === 'ALL' && 'Semua'}
            {type === 'WARNING' && 'Peringatan'}
            {type === 'INFO' && 'Informasi'}
            {type === 'SUCCESS' && 'Sukses'}
            
            {/* Show badge count for unread items of this type */}
            {(() => {
              const count = notifications.filter(n => !n.isRead && (type === 'ALL' || n.type === type)).length
              return count > 0 ? (
                <span className="ml-xs px-1.5 py-0.5 rounded-full bg-error text-white text-[9px] font-bold">
                  {count}
                </span>
              ) : null
            })()}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-sm">
        {filteredNotifs.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-xl text-center border-dashed border-outline-variant py-20 bg-surface-container-lowest">
            <Inbox className="h-12 w-12 text-on-surface-variant opacity-40 mb-sm" />
            <p className="text-body-md font-bold text-on-surface-variant">Tidak ada notifikasi baru</p>
            <p className="text-body-sm text-on-surface-variant">Semua peringatan sistem telah dibersihkan atau disaring.</p>
          </Card>
        ) : (
          filteredNotifs.map(notif => {
            const Icon = notif.type === 'WARNING' 
              ? AlertTriangle 
              : notif.type === 'SUCCESS' 
                ? CheckCircle2 
                : Info
            
            const colorClass = notif.type === 'WARNING'
              ? 'text-warning bg-warning/10 border-warning/20'
              : notif.type === 'SUCCESS'
                ? 'text-tertiary bg-tertiary-container/20 border-tertiary-container'
                : 'text-primary bg-primary/5 border-primary/10'

            return (
              <Card 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-md border transition-all duration-200 cursor-pointer flex gap-md items-start group relative ${
                  notif.isRead 
                    ? 'bg-surface-container-lowest border-outline-variant opacity-75' 
                    : 'bg-surface-container border-primary/20 shadow-sm hover:shadow'
                }`}
              >
                {/* Status Dot */}
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 h-2.5 w-2.5 bg-primary rounded-full animate-pulse" />
                )}

                {/* Severity Icon */}
                <div className={`p-sm rounded-md border shrink-0 ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start pr-6 gap-xs">
                    <h3 className={`text-body-sm font-bold truncate text-on-surface ${!notif.isRead ? 'text-primary' : ''}`}>
                      {notif.title}
                    </h3>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">
                    {notif.description}
                  </p>
                  
                  <div className="flex items-center gap-md mt-sm text-label-xs text-on-surface-variant">
                    <span>{formatDate(notif.createdAt)}</span>
                    
                    {notif.actionUrl && (
                      <span className="text-primary font-bold hover:underline flex items-center gap-xs">
                        {notif.actionLabel || 'Lihat Detail'} <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Dismiss Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => deleteNotification(notif.id, e)}
                  className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full self-center"
                  aria-label="Hapus notifikasi"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            )
          })
        )}
      </div>
    </main>
  )
}
