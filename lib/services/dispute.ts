import { apiFetch } from '@/lib/api'
import type { Dispute } from '@/lib/types'

export async function getDisputes(): Promise<Dispute[]> {
  return apiFetch<Dispute[]>('/disputes')
}

export async function getDisputeById(id: string): Promise<Dispute> {
  return apiFetch<Dispute>(`/disputes/${id}`)
}
