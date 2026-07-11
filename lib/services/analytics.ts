import { apiFetch } from '@/lib/api'
import type { AIAnalyticsLog } from '@/lib/types'

export async function getAIAnalyticsLogs(): Promise<AIAnalyticsLog[]> {
  return apiFetch<AIAnalyticsLog[]>('/ai-analytics-logs')
}
