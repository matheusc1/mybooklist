import { describe, expect, it, vi } from 'vitest'
import { updateBook } from './books'
import { httpClient } from './client'

vi.mock('./client', () => ({
	httpClient: {
		patch: vi.fn(),
	},
}))

describe('updateBook', () => {
	it('removes the id from the PATCH body and uses it in the URL', async () => {
		const response = { id: 'book-1', title: 'Updated title' }
		vi.mocked(httpClient.patch).mockResolvedValue(response)

		await expect(
			updateBook({
				id: 'book-1',
				title: 'Updated title',
				totalPages: 300,
			}),
		).resolves.toEqual(response)

		expect(httpClient.patch).toHaveBeenCalledWith('/books/book-1', {
			title: 'Updated title',
			totalPages: 300,
		})
	})
})
