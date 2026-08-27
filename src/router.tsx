import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ErrorComponent } from './error'
import { NotFound } from './not-found'
import { getQueryClient } from './query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
	const queryClient = getQueryClient()

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
