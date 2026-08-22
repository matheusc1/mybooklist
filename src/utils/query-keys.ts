import type { QueryClient } from '@tanstack/react-query'

export const queryKeys = {
	books: ['books'],
	readingSessions: ['reading-sessions'],
	goals: ['goals'],
	dashboard: ['dashboard'],
	activity: ['activity'],
} as const

type QueryDomain = keyof typeof queryKeys

const invalidationGraph: Record<QueryDomain, QueryDomain[]> = {
	books: ['books', 'dashboard', 'goals'],
	readingSessions: ['readingSessions', 'books', 'dashboard', 'activity'],
	goals: ['goals'],
	dashboard: ['dashboard'],
	activity: ['activity'],
}

export function invalidateDomain(
	queryClient: QueryClient,
	domain: QueryDomain,
) {
	for (const affected of invalidationGraph[domain]) {
		queryClient.invalidateQueries({ queryKey: queryKeys[affected] })
	}
}
