import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '#/http/dashboard'
import { queryKeys } from '#/utils/query-keys'

export function useDashboard() {
	return useQuery({
		queryKey: queryKeys.dashboard,
		queryFn: getDashboard,
	})
}
