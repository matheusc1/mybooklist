import type { QueryClient } from '@tanstack/react-query'

export const authQueryKey = ['auth', 'me'] as const

export const queryKeys = {
	books: ['books'],
	readingSessions: ['reading-sessions'],
	goals: ['goals'],
	dashboard: ['dashboard'],
	activity: ['activity'],
	bookDetails: ['book-details'],
	yearlyOverview: ['yearly-overview'],
} as const

const BOOK_DELETION_DOMAINS: QueryDomain[] = [
	'books',
	'readingSessions',
	'dashboard',
	'activity',
	'goals',
	'yearlyOverview',
]

type QueryDomain = keyof typeof queryKeys

const invalidationGraph: Record<QueryDomain, QueryDomain[]> = {
	books: ['books', 'dashboard', 'goals', 'bookDetails', 'yearlyOverview'],
	readingSessions: [
		'readingSessions',
		'books',
		'dashboard',
		'activity',
		'goals',
		'bookDetails',
		'yearlyOverview',
	],
	goals: ['goals', 'yearlyOverview'],
	dashboard: ['dashboard'],
	activity: ['activity'],
	bookDetails: ['bookDetails'],
	yearlyOverview: ['yearlyOverview'],
}

export function invalidateDomain(
	queryClient: QueryClient,
	domain: QueryDomain,
) {
	for (const affected of invalidationGraph[domain]) {
		queryClient.invalidateQueries({ queryKey: queryKeys[affected] })
	}
}

export async function invalidateAfterBookDeletion(
	queryClient: QueryClient,
	bookId: string,
) {
	await Promise.all([
		...BOOK_DELETION_DOMAINS.map((domain) =>
			queryClient.invalidateQueries({ queryKey: queryKeys[domain] }),
		),
		queryClient.invalidateQueries({
			queryKey: queryKeys.bookDetails,
			predicate: (query) => query.queryKey[1] !== bookId,
		}),
		queryClient.invalidateQueries({
			queryKey: [...queryKeys.bookDetails, bookId],
			refetchType: 'none',
		}),
	])
}
