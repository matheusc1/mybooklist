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

const olderSession: ReadingSession = {
	...session,
	id: 'session-2',
	fromPage: 1,
	toPage: 9,
	readAt: '2024-02-08',
}

function renderSessions(
	sessions: ReadingSession[],
	className?: string,
): {
	onAddSession: ReturnType<typeof vi.fn>
	onEditSession: ReturnType<typeof vi.fn>
	onDeleteSession: ReturnType<typeof vi.fn>
} {
	const handlers = {
		onAddSession: vi.fn(),
		onEditSession: vi.fn(),
		onDeleteSession: vi.fn(),
	}
	render(
		<ReadingSessions sessions={sessions} className={className} {...handlers} />,
	)
	return handlers
}

describe('ReadingSessions', () => {
	describe('without sessions', () => {
		it('shows the empty state and allows starting a session', async () => {
			const user = userEvent.setup()
			const { onAddSession } = renderSessions([])

			expect(
				screen.getByRole('heading', {
					name: 'No sessions logged for this book',
				}),
			).toBeInTheDocument()
			await user.click(screen.getByRole('button', { name: 'Log session' }))

			expect(onAddSession).toHaveBeenCalledOnce()
		})

		it('does not render the list, the table header, or the count', () => {
			renderSessions([])

			expect(screen.queryByRole('list')).not.toBeInTheDocument()
			expect(screen.queryByText('Date')).not.toBeInTheDocument()
			expect(screen.queryByText(/logged$/)).not.toBeInTheDocument()
		})

		it('labels the section with the empty state heading', () => {
			renderSessions([])

			expect(
				screen.getByRole('region', {
					name: 'No sessions logged for this book',
				}),
			).toBeInTheDocument()
		})
	})

	describe('with sessions', () => {
		it('labels the section with the sessions heading and hides the empty state', () => {
			renderSessions([session])

			expect(
				screen.getByRole('region', { name: 'Sessions' }),
			).toBeInTheDocument()
			expect(
				screen.queryByText('No sessions logged for this book'),
			).not.toBeInTheDocument()
		})

		it('shows how many sessions were logged', () => {
			renderSessions([session, olderSession])

			expect(screen.getByText(/2 logged/)).toBeInTheDocument()
		})

		it('lets the reader log another session from the header', async () => {
			const user = userEvent.setup()
			const { onAddSession } = renderSessions([session])

			await user.click(screen.getByRole('button', { name: 'Log session' }))

			expect(onAddSession).toHaveBeenCalledOnce()
		})

		it('shows the table column headers', () => {
			renderSessions([session])

			for (const label of ['Date', 'Pages', 'Read', 'Time']) {
				expect(screen.getByText(label)).toBeInTheDocument()
			}
		})

		it('renders the sessions in the order it receives them', () => {
			const { unmount } = render(
				<ReadingSessions
					sessions={[session, olderSession]}
					onAddSession={vi.fn()}
					onEditSession={vi.fn()}
					onDeleteSession={vi.fn()}
				/>,
			)
			let rows = screen.getAllByRole('listitem')
			expect(within(rows[0]).getByText('pp. 10-20')).toBeInTheDocument()
			expect(within(rows[1]).getByText('pp. 1-9')).toBeInTheDocument()
			unmount()

			render(
				<ReadingSessions
					sessions={[olderSession, session]}
					onAddSession={vi.fn()}
					onEditSession={vi.fn()}
					onDeleteSession={vi.fn()}
				/>,
			)
			rows = screen.getAllByRole('listitem')
			expect(within(rows[0]).getByText('pp. 1-9')).toBeInTheDocument()
			expect(within(rows[1]).getByText('pp. 10-20')).toBeInTheDocument()
		})

		it('applies the className to the section', () => {
			renderSessions([session], '[animation-delay:0.2s]')

			expect(screen.getByRole('region', { name: 'Sessions' })).toHaveClass(
				'[animation-delay:0.2s]',
			)
		})
	})

	describe('session details', () => {
		it('shows the page range, the pages read, and the reading time', () => {
			renderSessions([session])

			const row = screen.getByRole('listitem')
			expect(within(row).getByText('pp. 10-20')).toBeInTheDocument()
			expect(within(row).getByText('11 pages')).toBeInTheDocument()
			expect(within(row).getByText('~1h 1m')).toBeInTheDocument()
			expect(within(row).getByText('Feb 10')).toBeInTheDocument()
		})

		it('shows a dash when the duration was not calculated', () => {
			renderSessions([{ ...session, durationSeconds: 0 }])

			const row = screen.getByRole('listitem')
			expect(within(row).getByText('—')).toBeInTheDocument()
			expect(within(row).queryByText(/~/)).not.toBeInTheDocument()
		})

		it('uses the singular form for a single page', () => {
			renderSessions([{ ...session, fromPage: 5, toPage: 5 }])

			expect(screen.getByText('1 page')).toBeInTheDocument()
		})

		it('never reports a negative number of pages', () => {
			renderSessions([{ ...session, fromPage: 20, toPage: 10 }])

			expect(screen.getByText('0 pages')).toBeInTheDocument()
		})
	})

	describe('row actions', () => {
		it('names each action after the session date', () => {
			renderSessions([session, olderSession])

			expect(
				screen.getByRole('button', { name: 'Edit session from Feb 10' }),
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: 'Delete session from Feb 8' }),
			).toBeInTheDocument()
		})

		it('dispatches the edit action with the whole session', async () => {
			const user = userEvent.setup()
			const { onEditSession, onDeleteSession } = renderSessions([session])

			await user.click(
				screen.getByRole('button', { name: 'Edit session from Feb 10' }),
			)

			expect(onEditSession).toHaveBeenCalledWith(session)
			expect(onDeleteSession).not.toHaveBeenCalled()
		})

		it('dispatches the delete action with the session id only', async () => {
			const user = userEvent.setup()
			const { onEditSession, onDeleteSession } = renderSessions([session])

			await user.click(
				screen.getByRole('button', { name: 'Delete session from Feb 10' }),
			)

			expect(onDeleteSession).toHaveBeenCalledWith('session-1')
			expect(onEditSession).not.toHaveBeenCalled()
		})

		it('targets the session of the clicked row when there are several', async () => {
			const user = userEvent.setup()
			const { onEditSession, onDeleteSession } = renderSessions([
				session,
				olderSession,
			])
			const rows = screen.getAllByRole('listitem')

			await user.click(
				within(rows[1]).getByRole('button', { name: /Delete session/ }),
			)
			await user.click(
				within(rows[0]).getByRole('button', { name: /Edit session/ }),
			)

			expect(onDeleteSession).toHaveBeenCalledOnce()
			expect(onDeleteSession).toHaveBeenCalledWith('session-2')
			expect(onEditSession).toHaveBeenCalledOnce()
			expect(onEditSession).toHaveBeenCalledWith(session)
		})
	})
})
