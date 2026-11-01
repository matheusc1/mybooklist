import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isHttpError } from '#/http/client'
import { authQueryKey } from '#/utils/query-keys'

declare module '@tanstack/react-query' {
	interface Register {
		queryMeta: {
			suppressErrorToast?: boolean
		}
	}
}

interface QueryClientOptions {
	onUnauthorized?: () => void
}

function getErrorMessage(error: unknown) {
	// Expected API errors (400, 404, etc.) already come with a message meant for the user
	if (isHttpError(error) && error.status < 500) {
		return error.message
	}
	// Anything else (500, network failure, timeout) — don't leak internal details
	return 'Something went wrong. Please try again.'
}

function isUnauthorized(error: unknown) {
	return isHttpError(error) && error.status === 401
}

export function getQueryClient({ onUnauthorized }: QueryClientOptions = {}) {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error, query) => {
				const isAuthQuery = query.queryKey[0] === authQueryKey[0]

				// A 401 on the auth query just means "not signed in". The route guard
				// handles it, so it should never surface as a toast or trigger recovery.
				if (isAuthQuery && isUnauthorized(error)) return

				if (onUnauthorized && isUnauthorized(error)) {
					onUnauthorized()
					return
				}

				if (query.meta?.suppressErrorToast) return
				toast.error(getErrorMessage(error))
			},
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				if (onUnauthorized && isUnauthorized(error)) {
					onUnauthorized()
					return
				}

				toast.error(getErrorMessage(error))
			},
		}),
	})
}
