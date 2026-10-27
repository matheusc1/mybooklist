import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	invalidateAfterBookDeletion,
	invalidateDomain,
	queryKeys,
} from './query-keys'

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
})
const unsubscribes: Array<() => void> = []

function observe(queryKey: readonly unknown[]) {
	const queryFn = vi.fn().mockResolvedValue({})
	const observer = new QueryObserver(queryClient, { queryKey, queryFn })
	unsubscribes.push(observer.subscribe(() => {}))
	return queryFn
}

afterEach(() => {
	for (const unsubscribe of unsubscribes.splice(0)) unsubscribe()
	queryClient.clear()
	vi.restoreAllMocks()
})

describe('queryKeys', () => {
	it('defines the feature query keys', () => {
		expect(queryKeys).toEqual({
			books: ['books'],
			readingSessions: ['reading-sessions'],
			goals: ['goals'],
			dashboard: ['dashboard'],
			activity: ['activity'],
			bookDetails: ['book-details'],
			yearlyOverview: ['yearly-overview'],
		})
	})
})

describe('invalidateDomain', () => {
	it.each([
		['books', ['books', 'dashboard', 'goals', 'bookDetails', 'yearlyOverview']],
		[
			'readingSessions',
			[
				'readingSessions',
				'books',
				'dashboard',
				'activity',
				'goals',
				'bookDetails',
				'yearlyOverview',
			],
		],
		['goals', ['goals', 'yearlyOverview']],
		['dashboard', ['dashboard']],
		['activity', ['activity']],
		['bookDetails', ['bookDetails']],
		['yearlyOverview', ['yearlyOverview']],
	] as const)('invalidates the affected domains for %s', (domain, affectedDomains) => {
		const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')

		invalidateDomain(queryClient, domain)

		expect(invalidateQueries).toHaveBeenCalledTimes(affectedDomains.length)
		for (const affectedDomain of affectedDomains) {
			expect(invalidateQueries).toHaveBeenCalledWith({
				queryKey: queryKeys[affectedDomain],
			})
		}
	})
})

describe('invalidateAfterBookDeletion', () => {
	it('refetches related data but not the deleted book details', async () => {
		const deletedDetails = observe([...queryKeys.bookDetails, 'book-1'])
		const otherDetails = observe([...queryKeys.bookDetails, 'book-2'])
		const books = observe(queryKeys.books)
		const activity = observe(queryKeys.activity)
		const yearlyOverview = observe([...queryKeys.yearlyOverview, 2025])

		await vi.waitFor(() => expect(queryClient.isFetching()).toBe(0))
		for (const queryFn of [
			deletedDetails,
			otherDetails,
			books,
			activity,
			yearlyOverview,
		]) {
			expect(queryFn).toHaveBeenCalledTimes(1)
		}

		await invalidateAfterBookDeletion(queryClient, 'book-1')

		expect(books).toHaveBeenCalledTimes(2)
		expect(activity).toHaveBeenCalledTimes(2)
		expect(yearlyOverview).toHaveBeenCalledTimes(2)
		expect(otherDetails).toHaveBeenCalledTimes(2)
		expect(deletedDetails).toHaveBeenCalledTimes(1)
		expect(
			queryClient.getQueryState([...queryKeys.bookDetails, 'book-1'])
				?.isInvalidated,
		).toBe(true)
	})
})
