import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUpsertGoal } from '#/hooks/use-goal'
import { useGoalModalStore } from '#/stores/goal-store'
import { render, screen, waitFor } from '#/test/test-utils'
import { GoalModal } from './goal-modal'

const mutate = vi.fn()

vi.mock('#/hooks/use-goal', () => ({
	useUpsertGoal: vi.fn(),
}))

describe('GoalModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		useGoalModalStore.setState({ open: true, mode: 'add' })
		vi.mocked(useUpsertGoal).mockReturnValue({
			mutate,
			isPending: false,
		} as never)
	})

	it('keeps submission disabled until a positive goal is entered', async () => {
		const user = userEvent.setup()
		render(<GoalModal />)

		expect(screen.getByRole('button', { name: 'Set Goal' })).toBeDisabled()
		await user.type(
			screen.getByRole('spinbutton', { name: /books to read/i }),
			'12',
		)

		expect(screen.getByRole('button', { name: 'Set Goal' })).toBeEnabled()
	})

	it('uses the Save label in edit mode', () => {
		useGoalModalStore.setState({ open: true, mode: 'edit' })
		render(<GoalModal />)

		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
	})

	it('shows validation for a non-positive goal', async () => {
		const user = userEvent.setup()
		render(<GoalModal />)

		await user.type(
			screen.getByRole('spinbutton', { name: /books to read/i }),
			'0',
		)

		expect(
			await screen.findByText('Your goal must be at least 1 book'),
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Set Goal' })).toBeDisabled()
	})

	it('submits the target and closes after a successful mutation', async () => {
		const user = userEvent.setup()
		mutate.mockImplementation((_input, options) => options.onSuccess())
		render(<GoalModal />)

		await user.type(
			screen.getByRole('spinbutton', { name: /books to read/i }),
			'12',
		)
		await user.click(screen.getByRole('button', { name: 'Set Goal' }))

		await waitFor(() => {
			expect(mutate).toHaveBeenCalledWith(
				{ target: 12 },
				expect.objectContaining({ onSuccess: expect.any(Function) }),
			)
		})
		expect(useGoalModalStore.getState().open).toBe(false)
	})

	it('resets and closes when cancelled', async () => {
		const user = userEvent.setup()
		render(<GoalModal />)

		await user.type(
			screen.getByRole('spinbutton', { name: /books to read/i }),
			'12',
		)
		await user.click(screen.getByRole('button', { name: 'Cancel' }))

		expect(useGoalModalStore.getState().open).toBe(false)
	})

	it('keeps the form disabled while saving', () => {
		vi.mocked(useUpsertGoal).mockReturnValue({
			mutate,
			isPending: true,
		} as never)
		render(<GoalModal />)

		expect(
			screen.getByRole('spinbutton', { name: /books to read/i }),
		).toHaveAttribute('readonly')
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
	})

	it('does not close after a failed mutation', async () => {
		const user = userEvent.setup()
		mutate.mockImplementation((_input, options) => options.onError?.())
		render(<GoalModal />)

		await user.type(
			screen.getByRole('spinbutton', { name: /books to read/i }),
			'12',
		)
		await user.click(screen.getByRole('button', { name: 'Set Goal' }))

		await waitFor(() => expect(mutate).toHaveBeenCalled())
		expect(useGoalModalStore.getState().open).toBe(true)
	})
})
