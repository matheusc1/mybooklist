import type { QueryClient } from '@tanstack/react-query'

export const authQueryKey = ['auth', 'me'] as const

export const queryKeys = {
	books: ['books'],
	readingSessions: ['reading-sessions'],
	goals: ['goals'],
	dashboard: ['dashboard'],
	activity: ['activity'],
	bookDetails: ['book-details'],
} as const

type QueryDomain = keyof typeof queryKeys

const invalidationGraph: Record<QueryDomain, QueryDomain[]> = {
	books: ['books', 'dashboard', 'goals', 'bookDetails'],
	readingSessions: [
		'readingSessions',
		'books',
		'dashboard',
		'activity',
		'goals',
		'bookDetails',
	],
	goals: ['goals'],
	dashboard: ['dashboard'],
	activity: ['activity'],
	bookDetails: ['bookDetails'],
}

export function invalidateDomain(
	queryClient: QueryClient,
	domain: QueryDomain,
) {
	for (const affected of invalidationGraph[domain]) {
		queryClient.invalidateQueries({ queryKey: queryKeys[affected] })
	}
}
