import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { invalidateDomain, queryKeys } from './query-keys'

describe('queryKeys', () => {
	it('defines the feature query keys', () => {
		expect(queryKeys).toEqual({
			books: ['books'],
			readingSessions: ['reading-sessions'],
			goals: ['goals'],
			dashboard: ['dashboard'],
			activity: ['activity'],
		})
	})
})

describe('invalidateDomain', () => {
	let queryClient: QueryClient

	afterEach(() => {
		queryClient?.clear()
	})

	it.each([
		['books', ['books', 'dashboard', 'goals']],
		['readingSessions', ['readingSessions', 'books', 'dashboard', 'activity']],
		['goals', ['goals']],
		['dashboard', ['dashboard']],
		['activity', ['activity']],
	] as const)('invalidates the affected domains for %s', (domain, affectedDomains) => {
		queryClient = new QueryClient()
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
