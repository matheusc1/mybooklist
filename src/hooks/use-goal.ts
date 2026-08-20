import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getGoal, upsertGoal } from '#/http/goals'

export function useGoal() {
	return useQuery({
		queryKey: ['goals'],
		queryFn: getGoal,
	})
}

export function useUpsertGoal() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: upsertGoal,
		onSuccess: (goal) => {
			queryClient.setQueryData(['goals'], goal)
		},
	})
}
