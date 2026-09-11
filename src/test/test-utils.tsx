import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	createMemoryHistory,
	createRouter,
	RouterContextProvider,
} from '@tanstack/react-router'
import {
	type RenderHookOptions,
	render,
	renderHook,
} from '@testing-library/react'
import type { ReactElement } from 'react'
import { routeTree } from '#/routeTree.gen'

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	})
}

export function createTestRouter(initialEntries = ['/']) {
	const queryClient = createTestQueryClient()
	const history = createMemoryHistory({ initialEntries })
	const router = createRouter({
		routeTree,
		history,
		context: { queryClient },
		scrollRestoration: false,
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0,
	})

	return { router, queryClient }
}

export function renderWithProviders(ui: ReactElement) {
	const queryClient = createTestQueryClient()
	return render(ui, {
		wrapper: ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	})
}

export function renderWithRouter(
	ui: ReactElement,
	options: { initialEntries?: string[] } = {},
) {
	const { router, queryClient } = createTestRouter(options.initialEntries)
	const renderResult = render(ui, {
		wrapper: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				<RouterContextProvider router={router}>
					{children}
				</RouterContextProvider>
			</QueryClientProvider>
		),
	})

	return { ...renderResult, router, queryClient }
}

export function renderHookWithProviders<Result, Props = undefined>(
	callback: (props: Props) => Result,
	options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) {
	const queryClient = createTestQueryClient()
	const renderResult = renderHook(callback, {
		...options,
		wrapper: ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	})

	return { ...renderResult, queryClient }
}

export * from '@testing-library/react'
