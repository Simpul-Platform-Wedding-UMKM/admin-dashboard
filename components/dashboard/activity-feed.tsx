import { ActivityLog } from '@/lib/types'
import {
  UserPlus,
  Building2,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

interface ActivityFeedProps {
  logs: ActivityLog[]
}

const activityIcons: Record<string, any> = {
  vendor_registered: UserPlus,
  kyb_submitted: FileCheck,
  dispute_opened: AlertCircle,
  user_joined: UserPlus,
  transaction_completed: CheckCircle2,
  vendor_suspended: XCircle,
}

const activityColors: Record<string, string> = {
  vendor_registered: 'bg-primary-fixed text-primary',
  kyb_submitted: 'bg-secondary-fixed text-secondary',
  dispute_opened: 'bg-error-container text-error',
  user_joined: 'bg-tertiary-fixed text-tertiary',
  transaction_completed: 'bg-primary-fixed text-primary',
  vendor_suspended: 'bg-error-container text-error',
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m yang lalu`
  if (hours < 24) return `${hours}h yang lalu`
  if (days < 7) return `${days}d yang lalu`

  return date.toLocaleDateString('id-ID')
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-elevated">
      <div className="mb-6">
        <h3 className="font-heading text-label-md font-semibold text-on-surface uppercase mb-1">
          Aktivitas Terbaru
        </h3>
        <p className="text-label-sm text-on-surface-variant">
          Update platform real-time
        </p>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((log, index) => {
            const Icon = activityIcons[log.tipe] || Clock
            const colorClass = activityColors[log.tipe] || 'bg-surface-container text-on-surface'

            return (
              <div key={log.id} className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < logs.length - 1 && (
                    <div className="h-8 w-0.5 bg-outline-variant my-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 py-1">
                  <p className="text-body-md text-on-surface font-medium">
                    {log.deskripsi}
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1">
                    {log.aktor} • {formatTime(log.waktu)}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto text-on-surface-variant mb-2" />
            <p className="text-on-surface-variant text-body-md">
              Belum ada aktivitas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
