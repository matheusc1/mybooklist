import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getBookDetails } from './books-details'
import { httpClient } from './client'

vi.mock('./client', () => ({
	httpClient: {
		get: vi.fn(),
	},
}))

describe('getBookDetails', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('requests details for the specified book and returns the response', async () => {
		const details = {
			book: { id: 'book-1', title: 'The Hobbit' },
			readingSessions: [],
			stats: { sessions: 0, readingTime: 0, activeDays: 0 },
		}
		vi.mocked(httpClient.get).mockResolvedValue(details)

		await expect(getBookDetails('book-1')).resolves.toEqual(details)
		expect(httpClient.get).toHaveBeenCalledWith('/book-details/book-1')
	})
})
