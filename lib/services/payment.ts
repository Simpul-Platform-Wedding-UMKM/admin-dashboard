import { apiFetch } from '@/lib/api'
import type { PaymentSplit } from '@/lib/types'

export async function getPaymentSplits(): Promise<PaymentSplit[]> {
  return apiFetch<PaymentSplit[]>('/payment-splits')
}

export async function getPaymentSplitById(id: string): Promise<PaymentSplit> {
  return apiFetch<PaymentSplit>(`/payment-splits/${id}`)
}

export async function updatePaymentSplit(id: string, data: Partial<PaymentSplit>): Promise<PaymentSplit> {
  return apiFetch<PaymentSplit>(`/payment-splits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
