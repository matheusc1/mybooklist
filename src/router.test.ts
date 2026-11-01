import { describe, expect, it, vi } from 'vitest'
import { authQueryKey } from '#/utils/query-keys'
import { getRouter } from './router'

const unauthorized = { status: 401, message: 'Unauthorized' }

function setup() {
	const router = getRouter()
	const { queryClient } = router.options.context
	queryClient.setQueryData(authQueryKey, { id: 'user-1' })

	const fail = (key: string) =>
		queryClient
			.query({ queryKey: [key], queryFn: () => Promise.reject(unauthorized) })
			.catch(() => {})

	return { router, queryClient, fail }
}

describe('getRouter', () => {
	it('drops the cached user and revalidates once when queries return 401', async () => {
		const { router, queryClient, fail } = setup()
		const invalidate = vi
			.spyOn(router, 'invalidate')
			.mockReturnValue(new Promise<void>(() => {}))

		await Promise.all([fail('books'), fail('dashboard')])

		expect(queryClient.getQueryData(authQueryKey)).toBeUndefined()
		expect(invalidate).toHaveBeenCalledTimes(1)
	})

	it('revalidates again after a previous recovery has finished', async () => {
		const { router, queryClient, fail } = setup()
		const invalidate = vi
			.spyOn(router, 'invalidate')
			.mockResolvedValue(undefined)

		await fail('books')
		await new Promise((resolve) => setTimeout(resolve, 0))
		queryClient.setQueryData(authQueryKey, { id: 'user-1' })
		await fail('goals')

		expect(invalidate).toHaveBeenCalledTimes(2)
	})

	it('does not revalidate when the auth query itself returns 401', async () => {
		const { router, queryClient } = setup()
		const invalidate = vi
			.spyOn(router, 'invalidate')
			.mockResolvedValue(undefined)

		await queryClient
			.query({
				queryKey: [...authQueryKey, 'probe'],
				queryFn: () => Promise.reject(unauthorized),
			})
			.catch(() => {})

		expect(invalidate).not.toHaveBeenCalled()
	})
})
