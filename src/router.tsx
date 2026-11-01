import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { authQueryKey } from '#/utils/query-keys'
import { ErrorComponent } from './error'
import { NotFound } from './not-found'
import { getQueryClient } from './query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
	let isRecovering = false

	const queryClient = getQueryClient({
		onUnauthorized: () => {
			if (typeof window === 'undefined' || isRecovering) return

			// Drop the cached user so the guard asks the API again. It gets a 401
			// and redirects to /login with the current location, as it already does.
			isRecovering = true
			queryClient.removeQueries({ queryKey: authQueryKey })
			router
				.invalidate()
				.catch(() => {})
				.finally(() => {
					isRecovering = false
				})
		},
	})

	const router = createTanStackRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: false,
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: NotFound,
		defaultErrorComponent: ErrorComponent,
	})

	setupRouterSsrQueryIntegration({ router, queryClient })

	return router
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
