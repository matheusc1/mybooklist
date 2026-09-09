import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGoal, upsertGoal } from '#/http/goals'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { useGoal, useUpsertGoal } from './use-goal'

vi.mock('#/http/goals', () => ({
	getGoal: vi.fn(),
	upsertGoal: vi.fn(),
}))

describe('useGoal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads the current goal', async () => {
		const goal = { year: 2026, target: 12, current: 3 }
		vi.mocked(getGoal).mockResolvedValue(goal)

		const { result } = renderHookWithProviders(() => useGoal())

		await waitFor(() => expect(result.current.data).toEqual(goal))
		expect(getGoal).toHaveBeenCalledOnce()
	})
})

describe('useUpsertGoal', () => {
	it('updates the goal query with the returned goal', async () => {
		const goal = { year: 2026, target: 20, current: 4 }
		const input = { target: 20 }
		vi.mocked(upsertGoal).mockResolvedValue(goal)

		const { result, queryClient } = renderHookWithProviders(() =>
			useUpsertGoal(),
		)

		result.current.mutate(input)

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(upsertGoal).toHaveBeenCalledWith(input, expect.anything())
		expect(queryClient.getQueryData(['goals'])).toEqual(goal)
	})

	it('exposes mutation errors', async () => {
		const error = new Error('Could not save goal')
		vi.mocked(upsertGoal).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useUpsertGoal())

		result.current.mutate({ target: 20 })

		await waitFor(() => expect(result.current.error).toBe(error))
	})
})
