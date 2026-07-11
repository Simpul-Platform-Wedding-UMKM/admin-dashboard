import { apiFetch } from '@/lib/api'
import type { SystemUser, AuditLog } from '@/lib/types'

export async function getSystemUsers(): Promise<SystemUser[]> {
  return apiFetch<SystemUser[]>('/system-users')
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return apiFetch<AuditLog[]>('/audit-logs')
}
