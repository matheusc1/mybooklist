import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './client'
import { getYearlyOverview } from './yearly-overview'

vi.mock('./client', () => ({
	httpClient: {
		get: vi.fn(),
	},
}))

describe('getYearlyOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('requests the overview for the specified year and returns the response', async () => {
		const overview = {
			goal: { year: 2025, target: 30, current: 28 },
			yearlyStats: {
				sessions: 0,
				pages: 0,
				readingTime: 0,
				activeDays: 0,
				pagesByMonth: Array(12).fill(0),
			},
			completedBooks: [],
		}
		vi.mocked(httpClient.get).mockResolvedValue(overview)

		await expect(getYearlyOverview(2025)).resolves.toEqual(overview)
		expect(httpClient.get).toHaveBeenCalledWith('/yearly-overview/2025')
	})
})
