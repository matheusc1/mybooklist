import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateReadingSpeed } from '#/http/users'
import { authQueryKey } from '#/utils/query-keys'

export function useUpdateReadingSpeed() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReadingSpeed,
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, user)
		},
	})
}
