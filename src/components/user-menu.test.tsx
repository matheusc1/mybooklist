import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGoalModalStore } from '#/stores/goal-store'
import { renderWithRouter, screen } from '#/test/test-utils'
import { UserMenu } from './user-menu'

const mocks = vi.hoisted(() => ({
	me: vi.fn(),
	goal: vi.fn(),
	logoutHook: vi.fn(),
	logoutMutation: vi.fn(),
	upsertGoal: vi.fn(),
}))

vi.mock('#/hooks/use-auth', () => ({
	useMe: mocks.me,
	useLogout: mocks.logoutHook,
}))
vi.mock('#/hooks/use-goal', () => ({
	useGoal: mocks.goal,
	useUpsertGoal: () => ({ mutate: mocks.upsertGoal, isPending: false }),
}))

beforeEach(() => {
	vi.clearAllMocks()
	mocks.me.mockReturnValue({
		data: { id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com' },
	})
	mocks.goal.mockReturnValue({ data: undefined })
	mocks.logoutHook.mockReturnValue({ mutate: mocks.logoutMutation })
})

afterEach(() => {
	useGoalModalStore.setState({ open: false, mode: 'add' })
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

	it('shows the current reading goal and opens its modal in edit mode', async () => {
		const user = userEvent.setup()
		mocks.goal.mockReturnValue({
			data: { year: 2026, target: 12, current: 3 },
		})
		renderWithRouter(<UserMenu />)

		await user.click(screen.getByRole('button', { name: 'Open user menu' }))

		expect(screen.getByText('3')).toBeInTheDocument()
		expect(screen.getByText(/of 12 books/)).toBeInTheDocument()
		expect(screen.queryByText('No reading goal set.')).not.toBeInTheDocument()
		await user.click(screen.getByText('Update reading goal'))

		expect(useGoalModalStore.getState()).toEqual(
			expect.objectContaining({ open: true, mode: 'edit' }),
		)
	})

	it('renders nothing without an authenticated user', () => {
		mocks.me.mockReturnValue({ data: undefined })
		const { container } = renderWithRouter(<UserMenu />)

		expect(container).toBeEmptyDOMElement()
	})
})
