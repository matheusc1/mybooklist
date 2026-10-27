import type { YearlyOverview } from '#/types/yearly-overview'
import { httpClient } from './client'

export function getYearlyOverview(year: number): Promise<YearlyOverview> {
	return httpClient.get(`/yearly-overview/${year}`)
}
