import { apiFetch } from '@/lib/api'
import type { Booking } from '@/lib/types'

export async function getBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>('/bookings')
}
