import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getGoal, upsertGoal } from '#/http/goals'
import { queryKeys } from '#/utils/query-keys'

export function useGoal() {
	return useQuery({
		queryKey: queryKeys.goals,
		queryFn: getGoal,
	})
}

export function useUpsertGoal() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: upsertGoal,
		onSuccess: (goal) => {
			queryClient.setQueryData(queryKeys.goals, goal)
		},
	})
}
