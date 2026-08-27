import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isHttpError } from '#/http/client'

function getErrorMessage(error: unknown) {
	// Expected API errors (400, 404, etc.) already come with a message meant for the user
	if (isHttpError(error) && error.status < 500) {
		return error.message
	}
	// Anything else (500, network failure, timeout) — don't leak internal details
	return 'Something went wrong. Please try again.'
}

export function getQueryClient() {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => toast.error(getErrorMessage(error)),
		}),
		mutationCache: new MutationCache({
			onError: (error) => toast.error(getErrorMessage(error)),
		}),
	})
}
