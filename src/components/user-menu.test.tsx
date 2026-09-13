import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter, screen } from '#/test/test-utils'
import { UserMenu } from './user-menu'

const mocks = vi.hoisted(() => ({
	me: vi.fn(),
	goal: vi.fn(),
	logoutHook: vi.fn(),
	logoutMutation: vi.fn(),
}))

vi.mock('#/hooks/use-auth', () => ({
	useMe: mocks.me,
	useLogout: mocks.logoutHook,
}))
vi.mock('#/hooks/use-goal', () => ({ useGoal: mocks.goal }))

beforeEach(() => {
	vi.clearAllMocks()
	mocks.me.mockReturnValue({
		data: { id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com' },
	})
	mocks.goal.mockReturnValue({ data: undefined })
	mocks.logoutHook.mockReturnValue({ mutate: mocks.logoutMutation })
})

describe('UserMenu', () => {
	it('shows the user and dropdown actions', async () => {
		const user = userEvent.setup()
		renderWithRouter(<UserMenu />)

		await user.click(screen.getByRole('button', { name: 'Open user menu' }))

		expect(screen.getAllByText('Ada Lovelace').length).toBeGreaterThan(0)
		expect(screen.getByText('No reading goal set.')).toBeInTheDocument()
		expect(screen.getByText('Take reading speed test')).toBeInTheDocument()
	})

	it('calls logout from the sign-out action', async () => {
		const user = userEvent.setup()
		renderWithRouter(<UserMenu />)

		await user.click(screen.getByRole('button', { name: 'Open user menu' }))
		await user.click(screen.getByText('Sign out'))

		expect(mocks.logoutMutation).toHaveBeenCalledOnce()
	})

	it('renders nothing without an authenticated user', () => {
		mocks.me.mockReturnValue({ data: undefined })
		const { container } = renderWithRouter(<UserMenu />)

		expect(container).toBeEmptyDOMElement()
	})
})
