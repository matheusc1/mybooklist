import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMe, logout } from '#/http/auth'
import {
	renderHookWithProviders,
	renderHookWithRouter,
	waitFor,
} from '#/test/test-utils'
import { useLogout, useMe } from './use-auth'

vi.mock('#/http/auth', () => ({
	getMe: vi.fn(),
	logout: vi.fn(),
}))

describe('use-auth', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('useLogout', () => {
		it('clears the query cache and navigates to login after logout', async () => {
			vi.mocked(logout).mockResolvedValue({ message: 'Logged out' })
			const { result, queryClient, router } = renderHookWithRouter(() =>
				useLogout(),
			)
			queryClient.setQueryData(['books'], [{ id: 'book-1' }])

			result.current.mutate()

			await waitFor(() => expect(result.current.isSuccess).toBe(true))
			await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
			expect(queryClient.getQueryData(['books'])).toBeUndefined()
			expect(logout).toHaveBeenCalledOnce()
		})
	})

	describe('useMe', () => {
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
})
