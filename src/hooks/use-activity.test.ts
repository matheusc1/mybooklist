import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getActivity } from '#/http/activity'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { useActivity } from './use-activity'

vi.mock('#/http/activity', () => ({
	getActivity: vi.fn(),
}))

describe('useActivity', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads activity for the requested month', async () => {
		const activity = { monthlyStats: {}, monthlyActivity: [] }
		vi.mocked(getActivity).mockResolvedValue(activity as never)

		const { result } = renderHookWithProviders(() => useActivity('2026-09'))

		await waitFor(() => expect(result.current.data).toEqual(activity))
		expect(getActivity).toHaveBeenCalledWith('2026-09')
	})

	it('exposes activity query errors', async () => {
		const error = new Error('Activity unavailable')
		vi.mocked(getActivity).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useActivity('2026-09'))

		await waitFor(() => expect(result.current.error).toBe(error))
	})

	it('retains the previous month while the next month loads', async () => {
		const september = {
			monthlyStats: {
				sessions: 5,
				pages: 120,
				readingTime: 300,
				activeDays: 4,
			},
			monthlyActivity: [],
		}
		const october = {
			monthlyStats: {
				sessions: 8,
				pages: 200,
				readingTime: 480,
				activeDays: 6,
			},
			monthlyActivity: [],
		}
		let resolveOctober!: (value: typeof october) => void
		const octoberPromise = new Promise<typeof october>((resolve) => {
			resolveOctober = resolve
		})

		vi.mocked(getActivity).mockImplementation((month) =>
			month === '2026-09' ? Promise.resolve(september) : octoberPromise,
		)

		const { result, rerender } = renderHookWithProviders(
			({ month }: { month: string }) => useActivity(month),
			{ initialProps: { month: '2026-09' } },
		)

		await waitFor(() => expect(result.current.data).toEqual(september))
		rerender({ month: '2026-10' })

		expect(result.current.data).toEqual(september)
		expect(result.current.isFetching).toBe(true)

		resolveOctober(october)
		await waitFor(() => expect(result.current.data).toEqual(october))
	})
})
