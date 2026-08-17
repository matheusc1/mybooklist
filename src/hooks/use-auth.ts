import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { getMe, logout } from '#/http/auth'
import { isHttpError } from '#/http/client'

export function useMe() {
	return useQuery({
		queryKey: ['auth', 'me'],
		queryFn: getMe,
		retry: (failureCount, error) => {
			if (isHttpError(error) && error.status === 401) return false
			return failureCount < 2
		},
	})
}

export function useLogout() {
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.clear()
			router.navigate({ to: '/login' })
		},
	})
}
