import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDashboard } from '#/http/dashboard'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { useDashboard } from './use-dashboard'

vi.mock('#/http/dashboard', () => ({
	getDashboard: vi.fn(),
}))

describe('useDashboard', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads dashboard data', async () => {
		const dashboard = {
			recentActivity: [],
			lastCompleted: [],
			weeklyStats: {
				pagesByDay: [],
				totalPagesRead: 0,
				totalReadingMinutes: 0,
				mostActiveDay: null,
				daysStreak: 0,
			},
		}
		vi.mocked(getDashboard).mockResolvedValue(dashboard)

		const { result } = renderHookWithProviders(() => useDashboard())

		await waitFor(() => expect(result.current.data).toEqual(dashboard))
		expect(getDashboard).toHaveBeenCalledOnce()
	})

	it('exposes dashboard query errors', async () => {
		const error = new Error('Dashboard unavailable')
		vi.mocked(getDashboard).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useDashboard())

		await waitFor(() => expect(result.current.error).toBe(error))
	})
})
