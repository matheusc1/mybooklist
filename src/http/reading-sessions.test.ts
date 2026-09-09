import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './client'
import { deleteReadingSession, updateReadingSession } from './reading-sessions'

vi.mock('./client', () => ({
	httpClient: {
		patch: vi.fn(),
		delete: vi.fn(),
	},
}))

describe('reading-session HTTP wrappers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('removes the id from the reading-session PATCH body', async () => {
		const response = { id: 'session-1' }
		vi.mocked(httpClient.patch).mockResolvedValue(response)

		await expect(
			updateReadingSession({
				id: 'session-1',
				fromPage: 10,
				toPage: 25,
			}),
		).resolves.toEqual(response)

		expect(httpClient.patch).toHaveBeenCalledWith(
			'/reading-sessions/session-1',
			{ fromPage: 10, toPage: 25 },
		)
	})

	it('includes resetToPlanned in the delete URL', async () => {
		vi.mocked(httpClient.delete).mockResolvedValue(undefined)

		await deleteReadingSession('session-1', true)

		expect(httpClient.delete).toHaveBeenCalledWith(
			'/reading-sessions/session-1?resetToPlanned=true',
		)
	})

	it('defaults resetToPlanned to false', async () => {
		vi.mocked(httpClient.delete).mockResolvedValue(undefined)

		await deleteReadingSession('session-1')

		expect(httpClient.delete).toHaveBeenCalledWith(
			'/reading-sessions/session-1?resetToPlanned=false',
		)
	})
})
