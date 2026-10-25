import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '#/test/test-utils'
import type { ReadingSession } from '#/types/reading-session'
import { ReadingSessions } from './reading-sessions'

const session: ReadingSession = {
	id: 'session-1',
	bookId: 'book-1',
	fromPage: 10,
	toPage: 20,
	durationSeconds: 3660,
	readAt: '2024-02-10',
	createdAt: '2024-02-10',
	updatedAt: '2024-02-10',
}

describe('ReadingSessions', () => {
	it('shows the empty state and allows starting a session', async () => {
		const user = userEvent.setup()
		const onAddSession = vi.fn()
		render(
			<ReadingSessions
				sessions={[]}
				onAddSession={onAddSession}
				onEditSession={vi.fn()}
				onDeleteSession={vi.fn()}
			/>,
		)

		expect(
			screen.getByRole('heading', { name: 'No sessions logged for this book' }),
		).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Log session' }))

		expect(onAddSession).toHaveBeenCalledOnce()
	})

	it('shows session details and dispatches edit and delete actions for that session', async () => {
		const user = userEvent.setup()
		const onEditSession = vi.fn()
		const onDeleteSession = vi.fn()
		render(
			<ReadingSessions
				sessions={[session]}
				onAddSession={vi.fn()}
				onEditSession={onEditSession}
				onDeleteSession={onDeleteSession}
			/>,
		)

		const row = screen.getByRole('listitem')
		expect(within(row).getByText('pp. 10-20')).toBeInTheDocument()
		expect(within(row).getByText('11 pages')).toBeInTheDocument()
		expect(within(row).getByText('~1h 1m')).toBeInTheDocument()

		await user.click(
			within(row).getByRole('button', { name: 'Edit session from Feb 10' }),
		)
		expect(onEditSession).toHaveBeenCalledWith(session)

		await user.click(
			within(row).getByRole('button', { name: 'Delete session from Feb 10' }),
		)
		expect(onDeleteSession).toHaveBeenCalledWith('session-1')
	})
})
