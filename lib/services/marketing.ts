import { apiFetch } from '@/lib/api'
import type { FeaturedSlot } from '@/lib/types'

export async function getFeaturedSlots(): Promise<FeaturedSlot[]> {
  return apiFetch<FeaturedSlot[]>('/featured-slots')
}
