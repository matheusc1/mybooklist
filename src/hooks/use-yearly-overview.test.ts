import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getYearlyOverview } from '#/http/yearly-overview'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { queryKeys } from '#/utils/query-keys'
import { useYearlyOverview } from './use-yearly-overview'

vi.mock('#/http/yearly-overview', () => ({
	getYearlyOverview: vi.fn(),
}))

describe('useYearlyOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads the overview for the requested year and caches it under its query key', async () => {
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
		vi.mocked(getYearlyOverview).mockResolvedValue(overview as never)

		const { result, queryClient } = renderHookWithProviders(() =>
			useYearlyOverview(2025),
		)

		await waitFor(() => expect(result.current.data).toEqual(overview))
		expect(getYearlyOverview).toHaveBeenCalledWith(2025)
		expect(
			queryClient.getQueryData([...queryKeys.yearlyOverview, 2025]),
		).toEqual(overview)
	})

	it('exposes errors from the overview request', async () => {
		const error = new Error('Request failed')
		vi.mocked(getYearlyOverview).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useYearlyOverview(2025))

		await waitFor(() => expect(result.current.error).toBe(error))
	})
})
