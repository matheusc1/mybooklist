import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateReadingSpeed } from '#/http/users'

export function useUpdateReadingSpeed() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReadingSpeed,
		onSuccess: (user) => {
			queryClient.setQueryData(['auth', 'me'], user)
		},
	})
}
