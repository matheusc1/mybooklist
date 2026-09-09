import { describe, expect, it, vi } from 'vitest'
import { getActivity } from './activity'
import { httpClient } from './client'

vi.mock('./client', () => ({
	httpClient: {
		get: vi.fn(),
	},
}))

describe('getActivity', () => {
	it('builds the month query string', async () => {
		const activity = { monthlyStats: {}, monthlyActivity: [] }
		vi.mocked(httpClient.get).mockResolvedValue(activity)

		await expect(getActivity('2026-09')).resolves.toEqual(activity)

		expect(httpClient.get).toHaveBeenCalledWith('/activity?month=2026-09')
	})
})
