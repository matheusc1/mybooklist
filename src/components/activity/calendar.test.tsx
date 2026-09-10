import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import type { Activity } from '#/types/activity'
import { Calendar } from './calendar'

const singleSession = {
	id: 'session-1',
	bookId: 'book-1',
	title: 'The Hobbit',
	author: 'J.R.R. Tolkien',
	coverUrl: null,
	fromPage: 1,
	toPage: 10,
	duration: 30,
}

const secondSession = {
	...singleSession,
	id: 'session-2',
	fromPage: 10,
	toPage: 20,
}

const calendar: Activity['monthlyActivity'] = [
	{ date: '2026-09-10', sessions: [singleSession] },
	{ date: '2026-09-15', sessions: [singleSession, secondSession] },
]

describe('Calendar', () => {
	it('renders the month label', () => {
		render(
			<Calendar
				calendar={calendar}
				year={2026}
				month={8}
				onMonthChange={vi.fn()}
				onDayClick={vi.fn()}
			/>,
		)

		expect(
			screen.getByRole('heading', { name: 'September 2026' }),
		).toBeInTheDocument()
	})

	it('marks a day with no sessions as available to add one', () => {
		render(
			<Calendar
				calendar={calendar}
				year={2026}
				month={8}
				onMonthChange={vi.fn()}
				onDayClick={vi.fn()}
			/>,
		)

		const emptyDay = screen.getByRole('button', {
			name: /September 12, 2026, no sessions yet, click to add/,
		})

		expect(emptyDay.querySelector('span[aria-hidden="true"]')).toBeNull()
	})

	it('marks a day with a single session using the single-session indicator', () => {
		render(
			<Calendar
				calendar={calendar}
				year={2026}
				month={8}
				onMonthChange={vi.fn()}
				onDayClick={vi.fn()}
			/>,
		)

		const singleDay = screen.getByRole('button', {
			name: /September 10, 2026, has reading session/,
		})

		expect(singleDay.querySelector('span[aria-hidden="true"]')).toHaveClass(
			'bg-accent',
		)
		expect(singleDay.querySelector('span[aria-hidden="true"]')).not.toHaveClass(
			'bg-accent2',
		)
	})

	it('marks a day with multiple sessions differently from a single session', () => {
		render(
			<Calendar
				calendar={calendar}
				year={2026}
				month={8}
				onMonthChange={vi.fn()}
				onDayClick={vi.fn()}
			/>,
		)

		const multiDay = screen.getByRole('button', {
			name: /September 15, 2026, has reading session/,
		})

		expect(multiDay.querySelector('span[aria-hidden="true"]')).toHaveClass(
			'bg-accent2',
		)
	})

	it('retreats to December of the previous year from January', async () => {
		const user = userEvent.setup()
		const onMonthChange = vi.fn()
		render(
			<Calendar
				calendar={[]}
				year={2026}
				month={0}
				onMonthChange={onMonthChange}
				onDayClick={vi.fn()}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Previous month' }))

		expect(onMonthChange).toHaveBeenCalledWith(2025, 11)
	})

	it('advances to January of the next year from December', async () => {
		const user = userEvent.setup()
		const onMonthChange = vi.fn()
		render(
			<Calendar
				calendar={[]}
				year={2026}
				month={11}
				onMonthChange={onMonthChange}
				onDayClick={vi.fn()}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Next month' }))

		expect(onMonthChange).toHaveBeenCalledWith(2027, 0)
	})

	it('passes the selected date and sessions to the day handler', async () => {
		const user = userEvent.setup()
		const onDayClick = vi.fn()
		render(
			<Calendar
				calendar={calendar}
				year={2026}
				month={8}
				onMonthChange={vi.fn()}
				onDayClick={onDayClick}
			/>,
		)

		await user.click(
			screen.getByRole('button', {
				name: /September 15, 2026, has reading session/,
			}),
		)

		expect(onDayClick).toHaveBeenCalledWith(
			'2026-09-15',
			calendar[1].sessions,
		)
	})
})
