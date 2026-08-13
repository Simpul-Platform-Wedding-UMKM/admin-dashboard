import { apiFetch } from '@/lib/api'
import type { SystemUser } from '@/lib/types'

export async function getSystemUsers(): Promise<SystemUser[]> {
  return apiFetch<SystemUser[]>('/system-users')
}
