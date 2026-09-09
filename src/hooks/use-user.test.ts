import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateReadingSpeed } from '#/http/users'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { useUpdateReadingSpeed } from './use-user'

vi.mock('#/http/users', () => ({
	updateReadingSpeed: vi.fn(),
}))

describe('useUpdateReadingSpeed', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('passes the reading speed and succeeds', async () => {
		const user = { id: 'user-1', readingSpeed: 240 }
		const input = { readingSpeed: 240 }
		vi.mocked(updateReadingSpeed).mockResolvedValue(user as never)

		const { result } = renderHookWithProviders(() => useUpdateReadingSpeed())

		result.current.mutate(input)

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(updateReadingSpeed).toHaveBeenCalledWith(input, expect.anything())
	})
})
