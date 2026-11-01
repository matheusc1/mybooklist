import { MutationObserver } from '@tanstack/react-query'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authQueryKey } from '#/utils/query-keys'
import { getQueryClient } from './query-client'

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

const unauthorized = { status: 401, message: 'Unauthorized' }
const serverError = { status: 500, message: 'Server error' }

describe('query client 401 handling', () => {
	const onUnauthorized = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('calls onUnauthorized without a toast when a resource query returns 401', async () => {
		const client = getQueryClient({ onUnauthorized })

		await client
			.query({
				queryKey: ['books'],
				queryFn: () => Promise.reject(unauthorized),
				retry: false,
			})
			.catch(() => {})

		expect(onUnauthorized).toHaveBeenCalledTimes(1)
		expect(toast.error).not.toHaveBeenCalled()
	})

	it('ignores a 401 from the auth query', async () => {
		const client = getQueryClient({ onUnauthorized })

		await client
			.query({
				queryKey: authQueryKey,
				queryFn: () => Promise.reject(unauthorized),
				retry: false,
			})
			.catch(() => {})

		expect(onUnauthorized).not.toHaveBeenCalled()
	})

	it('keeps the toast for other errors', async () => {
		const client = getQueryClient({ onUnauthorized })

		await client
			.query({
				queryKey: ['books'],
				queryFn: () => Promise.reject(serverError),
				retry: false,
			})
			.catch(() => {})

		expect(onUnauthorized).not.toHaveBeenCalled()
		expect(toast.error).toHaveBeenCalledTimes(1)
	})

	it('calls onUnauthorized when a mutation returns 401', async () => {
		const client = getQueryClient({ onUnauthorized })

		await new MutationObserver(client, {
			mutationFn: () => Promise.reject(unauthorized),
		})
			.mutate()
			.catch(() => {})

		expect(onUnauthorized).toHaveBeenCalledTimes(1)
	})
})
