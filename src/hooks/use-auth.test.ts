import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMe } from '#/http/auth'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { useMe } from './use-auth'

vi.mock('#/http/auth', () => ({
	getMe: vi.fn(),
	logout: vi.fn(),
}))

describe('useMe', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads the authenticated user', async () => {
		const user = { id: 'user-1', name: 'Reader' }
		vi.mocked(getMe).mockResolvedValue(user as never)

		const { result } = renderHookWithProviders(() => useMe())

		await waitFor(() => expect(result.current.data).toEqual(user))
		expect(getMe).toHaveBeenCalledOnce()
	})

	it('does not retry an unauthorized response', async () => {
		const error = { status: 401, message: 'Unauthorized' }
		vi.mocked(getMe).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useMe())

		await waitFor(() => expect(result.current.error).toEqual(error), {
			timeout: 5000,
		})
		expect(getMe).toHaveBeenCalledOnce()
	})

	it('retries non-401 errors twice before settling', async () => {
		const error = { status: 500, message: 'Server error' }
		vi.mocked(getMe).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useMe())

		await waitFor(() => expect(result.current.error).toEqual(error), {
			timeout: 5000,
		})
		expect(getMe).toHaveBeenCalledTimes(3)
	})
})
