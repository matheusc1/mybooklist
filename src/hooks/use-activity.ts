import { useQuery } from '@tanstack/react-query'
import { getActivity } from '#/http/activity'
import { queryKeys } from '#/utils/query-keys'

export function useActivity(month: string) {
	return useQuery({
		queryKey: [...queryKeys.activity, month],
		queryFn: () => getActivity(month),
	})
}
