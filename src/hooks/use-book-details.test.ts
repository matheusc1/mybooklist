import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getBookDetails } from '#/http/books-details'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { queryKeys } from '#/utils/query-keys'
import { useBookDetails } from './use-book-details'

vi.mock('#/http/books-details', () => ({
	getBookDetails: vi.fn(),
}))

describe('useBookDetails', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads details for the requested book and caches them under its query key', async () => {
		const details = {
			book: { id: 'book-1', title: 'The Hobbit' },
			readingSessions: [],
			stats: { sessions: 0, readingTime: 0, activeDays: 0 },
		}
		vi.mocked(getBookDetails).mockResolvedValue(details as never)

		const { result, queryClient } = renderHookWithProviders(() =>
			useBookDetails('book-1'),
		)

		await waitFor(() => expect(result.current.data).toEqual(details))
		expect(getBookDetails).toHaveBeenCalledWith('book-1')
		expect(
			queryClient.getQueryData([...queryKeys.bookDetails, 'book-1']),
		).toEqual(details)
	})

	it('exposes errors from the details request', async () => {
		const error = new Error('Request failed')
		vi.mocked(getBookDetails).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useBookDetails('book-1'))

		await waitFor(() => expect(result.current.error).toBe(error))
	})
})
