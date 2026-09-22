import {
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { getMe, logout } from '#/http/auth'
import { isHttpError } from '#/http/client'
import type { User } from '#/types/user'
import { authQueryKey } from '#/utils/query-keys'

export function useMe(options?: Partial<UseQueryOptions<User, unknown>>) {
	return useQuery({
		queryKey: authQueryKey,
		queryFn: getMe,
		retry: (failureCount, error) => {
			if (isHttpError(error) && error.status === 401) return false
			return failureCount < 2
		},
		...options,
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
