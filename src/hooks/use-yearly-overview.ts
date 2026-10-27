import { useQuery } from '@tanstack/react-query'
import { getYearlyOverview } from '#/http/yearly-overview'
import { queryKeys } from '#/utils/query-keys'

export function useYearlyOverview(year: number) {
	return useQuery({
		queryKey: [...queryKeys.yearlyOverview, year],
		queryFn: () => getYearlyOverview(year),
	})
}
