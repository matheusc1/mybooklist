import { isRedirect } from '@tanstack/react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTestQueryClient } from '#/test/test-utils'
import { Route as AuthenticatedRoute } from './_authenticated'
import { Route as LoginRoute } from './login'

const resolveCurrentUser = vi.hoisted(() => vi.fn())

vi.mock('#/utils/resolve-current-user', () => ({
	resolveCurrentUser,
}))

afterEach(() => {
	resolveCurrentUser.mockReset()
})

describe('authenticated route loader', () => {
	it('redirects unauthenticated users to login with the original location', async () => {
		resolveCurrentUser.mockRejectedValue({
			status: 401,
			message: 'Unauthorized',
		})

		const queryClient = createTestQueryClient()
		const beforeLoad = AuthenticatedRoute.options.beforeLoad

		await expect(
			beforeLoad?.({
				context: { queryClient },
				location: { href: 'https://example.test/books' },
			} as Parameters<NonNullable<typeof beforeLoad>>[0]),
		).rejects.toSatisfy((error: unknown) => {
			const search = isRedirect(error) ? error.options.search : undefined
			const redirectLocation =
				typeof search === 'object' && search !== null && 'redirect' in search
					? Reflect.get(search, 'redirect')
					: undefined
			return (
				isRedirect(error) &&
				error.options.to === '/login' &&
				redirectLocation === 'https://example.test/books'
			)
		})
	})

	it('rethrows non-authentication errors', async () => {
		const error = { status: 500, message: 'Server error' }
		resolveCurrentUser.mockRejectedValue(error)

		const queryClient = createTestQueryClient()

		await expect(
			AuthenticatedRoute.options.beforeLoad?.({
				context: { queryClient },
				location: { href: 'https://example.test/books' },
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).rejects.toBe(error)
	})
})

describe('login route loader', () => {
	it('redirects authenticated users to home', async () => {
		resolveCurrentUser.mockResolvedValue({ id: 'user-1' })

		await expect(
			LoginRoute.options.beforeLoad?.({
				context: { queryClient: createTestQueryClient() },
			} as Parameters<NonNullable<typeof LoginRoute.options.beforeLoad>>[0]),
		).rejects.toSatisfy((error: unknown) => {
			return isRedirect(error) && error.options.to === '/home'
		})
	})

	it('allows the login page when authentication fails', async () => {
		resolveCurrentUser.mockRejectedValue({
			status: 500,
			message: 'Unavailable',
		})

		await expect(
			LoginRoute.options.beforeLoad?.({
				context: { queryClient: createTestQueryClient() },
			} as Parameters<NonNullable<typeof LoginRoute.options.beforeLoad>>[0]),
		).resolves.toBeUndefined()
	})
})
