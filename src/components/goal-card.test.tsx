import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { GoalCard, GoalCardCompact } from './goal-card'

const openModal = vi.hoisted(() => vi.fn())

vi.mock('#/stores/goal-store', () => ({
	useGoalModalStore: () => ({ openModal }),
}))

afterEach(() => {
	vi.useRealTimers()
	vi.clearAllMocks()
})

function setDate(year: number, month: number, day = 15) {
	vi.useFakeTimers()
	vi.setSystemTime(new Date(year, month, day, 12))
}

describe('GoalCard', () => {
	it('renders the empty state when no goal is set', () => {
		setDate(2026, 8)
		render(<GoalCard goal={undefined} />)

		expect(screen.getByText('Reading Goal · 2026')).toBeInTheDocument()
		expect(screen.getByText('0')).toBeInTheDocument()
		expect(screen.getByText('of -- books')).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: 'Set a goal and start reading.' }),
		).toBeInTheDocument()
	})

	it('shows the real completed count in the current-year empty state', () => {
		setDate(2026, 8)
		render(<GoalCard goal={{ year: 2026, current: 3, target: null }} />)

		expect(screen.getByText('Reading Goal · 2026')).toBeInTheDocument()
		expect(screen.getByText('3')).toBeInTheDocument()
		expect(screen.getByText('of -- books')).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: 'Set a goal and start reading.' }),
		).toBeInTheDocument()
	})

	it('renders a past-year empty state without the set-goal action', () => {
		setDate(2026, 8)
		render(<GoalCard goal={{ year: 2025, current: 3, target: null }} />)

		expect(screen.getByText('Reading Goal · 2025')).toBeInTheDocument()
		expect(screen.getByText('3')).toBeInTheDocument()
		expect(screen.getByText('of -- books')).toBeInTheDocument()
		expect(screen.getByText('No goal was set for 2025.')).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: 'Set a goal and start reading.' }),
		).not.toBeInTheDocument()
	})

	it('opens the add goal modal from the empty state', async () => {
		const user = userEvent.setup()
		render(<GoalCard goal={undefined} />)

		await user.click(
			screen.getByRole('button', { name: 'Set a goal and start reading.' }),
		)

		expect(openModal).toHaveBeenCalledWith('add')
	})

	it('renders progress values and the exact progress accessibility contract', () => {
		setDate(2026, 0)
		render(<GoalCard goal={{ year: 2026, current: 4, target: 10 }} />)

		expect(screen.getByText('4')).toBeInTheDocument()
		expect(screen.getByText('of 10 books')).toBeInTheDocument()
		expect(
			screen.getByText('40% complete · 11 months remaining'),
		).toBeInTheDocument()

		const progress = screen.getByRole('progressbar')
		expect(progress).toHaveAttribute(
			'aria-label',
			'Reading goal progress: 4 of 10 books',
		)
		expect(progress).toHaveAttribute('aria-valuenow', '40')
		expect(progress).toHaveAttribute('aria-valuemin', '0')
		expect(progress).toHaveAttribute('aria-valuemax', '100')
	})

	it('caps progress at 100 percent when current exceeds target', () => {
		setDate(2026, 5)
		render(<GoalCard goal={{ year: 2026, current: 12, target: 10 }} />)

		const progress = screen.getByRole('progressbar')
		expect(progress).toHaveAttribute('aria-valuenow', '100')
		expect(progress).toHaveStyle({ width: '100%' })
		expect(
			screen.getByText('100% complete · 6 months remaining'),
		).toBeInTheDocument()
	})

	it('uses singular month wording when one month remains', () => {
		setDate(2026, 10)
		render(<GoalCard goal={{ year: 2026, current: 1, target: 10 }} />)

		expect(
			screen.getByText('10% complete · 1 month remaining'),
		).toBeInTheDocument()
	})

	it('uses the less-than-one-month wording in December', () => {
		setDate(2026, 11)
		render(<GoalCard goal={{ year: 2026, current: 1, target: 10 }} />)

		expect(
			screen.getByText('10% complete · < 1 month remaining'),
		).toBeInTheDocument()
	})

	it('renders a past-year goal with its own year and no months remaining', () => {
		setDate(2026, 8)
		render(<GoalCard goal={{ year: 2025, current: 8, target: 10 }} />)

		expect(screen.getByText('Reading Goal · 2025')).toBeInTheDocument()
		expect(screen.getByText('of 10 books')).toBeInTheDocument()
		expect(screen.getByText('80% complete')).toBeInTheDocument()
		expect(screen.queryByText(/remaining/)).not.toBeInTheDocument()
	})

	it('does not show the in-progress badge by default', () => {
		setDate(2026, 8)
		const { rerender } = render(
			<GoalCard goal={{ year: 2026, current: 4, target: 10 }} />,
		)

		expect(screen.queryByText('In progress')).not.toBeInTheDocument()

		rerender(<GoalCard goal={undefined} />)

		expect(screen.queryByText('In progress')).not.toBeInTheDocument()
	})

	it('shows the in-progress badge with a goal when requested', () => {
		setDate(2026, 8)
		render(
			<GoalCard goal={{ year: 2026, current: 4, target: 10 }} showInProgress />,
		)

		expect(screen.getByText('In progress')).toBeInTheDocument()
	})

	it('shows the in-progress badge in the empty state when requested', () => {
		setDate(2026, 8)
		render(<GoalCard goal={undefined} showInProgress />)

		expect(screen.getByText('In progress')).toBeInTheDocument()
	})
})

describe('GoalCardCompact', () => {
	it('renders compact goal values and progress accessibility', () => {
		render(<GoalCardCompact goal={{ year: 2026, current: 4, target: 10 }} />)

		expect(screen.getByText('Reading goal · 2026')).toBeInTheDocument()
		expect(screen.getByText('of 10 books')).toBeInTheDocument()
		expect(screen.getByText('40%')).toBeInTheDocument()
		expect(screen.getByRole('progressbar')).toHaveAttribute(
			'aria-label',
			'Reading goal progress: 4 of 10 books',
		)
	})

	it('caps compact progress at 100 percent', () => {
		render(<GoalCardCompact goal={{ year: 2026, current: 12, target: 10 }} />)

		expect(screen.getByText('100%')).toBeInTheDocument()
		expect(screen.getByRole('progressbar')).toHaveAttribute(
			'aria-valuenow',
			'100',
		)
	})
})
