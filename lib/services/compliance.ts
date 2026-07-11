import { apiFetch } from '@/lib/api'
import type { ComplianceCheck } from '@/lib/types'

export async function getComplianceChecks(): Promise<ComplianceCheck[]> {
  return apiFetch<ComplianceCheck[]>('/compliance-checks')
}
