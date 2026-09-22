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
	vi.restoreAllMocks()
	sessionStorage.clear()
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
				location: {
					href: 'https://example.test/books',
					pathname: '/books',
				},
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
				location: {
					href: 'https://example.test/books',
					pathname: '/books',
				},
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).rejects.toBe(error)
	})

	it('redirects to reading-speed when unset and not yet prompted this session', async () => {
		resolveCurrentUser.mockResolvedValue({
			id: 'user-1',
			readingSpeed: null,
		})

		const queryClient = createTestQueryClient()

		await expect(
			AuthenticatedRoute.options.beforeLoad?.({
				context: { queryClient },
				location: {
					href: 'https://example.test/home',
					pathname: '/home',
				},
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).rejects.toSatisfy(
			(error: unknown) =>
				isRedirect(error) && error.options.to === '/reading-speed',
		)

		expect(sessionStorage.getItem('reading-speed-prompted')).toBe('true')
	})

	it('does not redirect when the user already has a reading speed', async () => {
		resolveCurrentUser.mockResolvedValue({
			id: 'user-1',
			readingSpeed: 250,
		})

		const queryClient = createTestQueryClient()

		await expect(
			AuthenticatedRoute.options.beforeLoad?.({
				context: { queryClient },
				location: {
					href: 'https://example.test/home',
					pathname: '/home',
				},
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).resolves.toBeUndefined()

		expect(sessionStorage.getItem('reading-speed-prompted')).toBeNull()
	})

	it('does not redirect again once the user was already prompted this session', async () => {
		sessionStorage.setItem('reading-speed-prompted', 'true')

		resolveCurrentUser.mockResolvedValue({
			id: 'user-1',
			readingSpeed: null,
		})

		const queryClient = createTestQueryClient()

		await expect(
			AuthenticatedRoute.options.beforeLoad?.({
				context: { queryClient },
				location: {
					href: 'https://example.test/home',
					pathname: '/home',
				},
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).resolves.toBeUndefined()
	})

	it('does not redirect when already on the reading-speed route', async () => {
		resolveCurrentUser.mockResolvedValue({
			id: 'user-1',
			readingSpeed: null,
		})

		const queryClient = createTestQueryClient()

		await expect(
			AuthenticatedRoute.options.beforeLoad?.({
				context: { queryClient },
				location: {
					href: 'https://example.test/reading-speed',
					pathname: '/reading-speed',
				},
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).resolves.toBeUndefined()

		expect(sessionStorage.getItem('reading-speed-prompted')).toBeNull()
	})

	it('does not throw when sessionStorage is unavailable', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked')
		})

		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked')
		})

		resolveCurrentUser.mockResolvedValue({
			id: 'user-1',
			readingSpeed: null,
		})

		const queryClient = createTestQueryClient()

		await expect(
			AuthenticatedRoute.options.beforeLoad?.({
				context: { queryClient },
				location: {
					href: 'https://example.test/home',
					pathname: '/home',
				},
			} as Parameters<
				NonNullable<typeof AuthenticatedRoute.options.beforeLoad>
			>[0]),
		).rejects.toSatisfy(
			(error: unknown) =>
				isRedirect(error) && error.options.to === '/reading-speed',
		)
	})
})

describe('login route loader', () => {
	it('redirects authenticated users to home', async () => {
		resolveCurrentUser.mockResolvedValue({ id: 'user-1' })

		await expect(
			LoginRoute.options.beforeLoad?.({
				context: { queryClient: createTestQueryClient() },
			} as Parameters<NonNullable<typeof LoginRoute.options.beforeLoad>>[0]),
		).rejects.toSatisfy(
			(error: unknown) => isRedirect(error) && error.options.to === '/home',
		)
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
