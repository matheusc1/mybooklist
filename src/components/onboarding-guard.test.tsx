import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderWithRouter, screen, waitFor } from '#/test/test-utils'
import { OnboardingGuard } from '../routes/_authenticated'

const resolveCurrentUser = vi.hoisted(() => vi.fn())

vi.mock('#/utils/resolve-current-user', () => ({
	resolveCurrentUser,
}))

// Outside a matched route, the real <Outlet /> has no parent match to read.
// A marker makes "the guard let the page render" observable.
vi.mock('@tanstack/react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@tanstack/react-router')>()
	return { ...actual, Outlet: () => <div data-testid="outlet" /> }
})

afterEach(() => {
	resolveCurrentUser.mockReset()
	vi.restoreAllMocks()
	sessionStorage.clear()
})

/**
 * Renders the guard with the user query held open, and spies on navigation
 * before any data arrives so the redirect cannot happen unobserved. Call
 * `signIn` to resolve the user.
 */
function renderGuard(path = '/home') {
	let resolveUser: (user: unknown) => void = () => {}
	resolveCurrentUser.mockReturnValue(
		new Promise((resolve) => {
			resolveUser = resolve
		}),
	)

	const { router } = renderWithRouter(<OnboardingGuard />, {
		initialEntries: [path],
	})
	const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined)

	return {
		navigate,
		signIn: (user: { readingSpeed: number | null }) =>
			act(async () => {
				resolveUser({ id: 'user-1', ...user })
			}),
	}
}

describe('OnboardingGuard', () => {
	it('renders the page for a user who already has a reading speed', async () => {
		const { navigate, signIn } = renderGuard()

		await signIn({ readingSpeed: 250 })

		expect(await screen.findByTestId('outlet')).toBeInTheDocument()
		expect(navigate).not.toHaveBeenCalled()
	})

	it('sends a user without a reading speed to the test, replacing the history entry', async () => {
		const { navigate, signIn } = renderGuard()

		await signIn({ readingSpeed: null })

		await waitFor(() =>
			expect(navigate).toHaveBeenCalledWith({
				to: '/reading-speed',
				replace: true,
			}),
		)
		expect(screen.queryByTestId('outlet')).not.toBeInTheDocument()
	})

	it('lets the user through once they were already prompted this session', async () => {
		sessionStorage.setItem('reading-speed-prompted', 'true')
		const { navigate, signIn } = renderGuard()

		await signIn({ readingSpeed: null })

		expect(await screen.findByTestId('outlet')).toBeInTheDocument()
		expect(navigate).not.toHaveBeenCalled()
	})

	it('does not redirect when already on the reading-speed route', async () => {
		const { navigate, signIn } = renderGuard('/reading-speed')

		await signIn({ readingSpeed: null })

		expect(await screen.findByTestId('outlet')).toBeInTheDocument()
		expect(navigate).not.toHaveBeenCalled()
	})

	it('treats unavailable sessionStorage as not prompted instead of throwing', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked')
		})
		const { navigate, signIn } = renderGuard()

		await signIn({ readingSpeed: null })

		await waitFor(() =>
			expect(navigate).toHaveBeenCalledWith({
				to: '/reading-speed',
				replace: true,
			}),
		)
	})

	it('decides nothing until the user is available', () => {
		const { navigate } = renderGuard()

		expect(screen.queryByTestId('outlet')).not.toBeInTheDocument()
		expect(navigate).not.toHaveBeenCalled()
	})
})
