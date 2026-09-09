import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	type RenderHookOptions,
	render,
	renderHook,
} from '@testing-library/react'
import type { ReactElement } from 'react'

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	})
}

export function renderWithProviders(ui: ReactElement) {
	const queryClient = createTestQueryClient()
	return render(ui, {
		wrapper: ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	})
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
