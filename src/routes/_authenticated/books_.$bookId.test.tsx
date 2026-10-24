import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, renderWithRoute, screen, within } from '#/test/test-utils'
import type { BookDetails } from '#/types/book-details'

const hooks = vi.hoisted(() => ({
	useBookDetails: vi.fn(),
	useDeleteReadingSession: vi.fn(),
	deleteSession: vi.fn(),
}))

vi.mock('#/hooks/use-book-details', () => ({
	useBookDetails: hooks.useBookDetails,
}))
vi.mock('#/hooks/use-reading-sessions', () => ({
	useDeleteReadingSession: hooks.useDeleteReadingSession,
}))
vi.mock('#/components/modals/book-modal', () => ({
	BookModal: ({ open, mode }: { open: boolean; mode?: string }) =>
		open ? <div role="dialog">Book editor: {mode}</div> : null,
}))
vi.mock('#/components/modals/reading-session-modal', () => ({
	ReadingSessionModal: ({
		open,
		mode,
		session,
		defaultBook,
		isLastSession,
	}: {
		open: boolean
		mode?: string
		session?: { id: string; bookId: string; date: string }
		defaultBook?: { id: string; currentPage: number }
		isLastSession?: boolean
	}) =>
		open ? (
			<div role="dialog">
				Session {mode} book {defaultBook?.id}, from page{' '}
				{defaultBook?.currentPage}
				{session && `, editing ${session.id} on ${session.date}`}
				{`, last session ${String(isLastSession)}`}
			</div>
		) : null,
}))
vi.mock('#/components/modals/delete-modal', () => ({
	DeleteModal: ({
		open,
		isLastSession,
		onConfirm,
	}: {
		open: boolean
		isLastSession?: boolean
		onConfirm: (resetToPlanned: boolean) => void
	}) =>
		open ? (
			<div>
				<span>Last session: {String(isLastSession)}</span>
				<button type="button" onClick={() => onConfirm(false)}>
					Confirm session deletion
				</button>
				<button type="button" onClick={() => onConfirm(true)}>
					Confirm deletion and reset
				</button>
			</div>
		) : null,
}))

const bookDetails: BookDetails = {
	book: {
		id: 'book-1',
		userId: 'user-1',
		title: 'The Hobbit',
		author: 'J.R.R. Tolkien',
		genre: 'fantasy',
		coverUrl: null,
		totalPages: 300,
		currentPage: 75,
		status: 'reading',
		rating: 4,
		startedAt: '2024-01-01',
		completedAt: null,
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01',
		notes: 'A favorite adventure.',
	},
	readingSessions: [
		{
			id: 'session-old',
			bookId: 'book-1',
			fromPage: 20,
			toPage: 30,
			durationSeconds: 0,
			readAt: '2024-02-08',
			createdAt: '2024-02-08',
			updatedAt: '2024-02-08',
		},
		{
			id: 'session-new',
			bookId: 'book-1',
			fromPage: 40,
			toPage: 60,
			durationSeconds: 3660,
			readAt: '2024-02-10',
			createdAt: '2024-02-10',
			updatedAt: '2024-02-10',
		},
	],
	stats: { sessions: 2, readingTime: 60, activeDays: 2 },
}

const completedDetails: BookDetails = {
	...bookDetails,
	book: {
		...bookDetails.book,
		status: 'completed',
		currentPage: 300,
		startedAt: '2024-01-01',
		completedAt: '2024-01-11',
	},
}

beforeEach(() => {
	vi.clearAllMocks()
	hooks.useBookDetails.mockReturnValue({
		data: bookDetails,
		isLoading: false,
		isError: false,
	})
	hooks.useDeleteReadingSession.mockReturnValue({
		mutate: hooks.deleteSession,
		isPending: false,
	})
})

describe('BookDetailsPage', () => {
	it('renders book information, progress, statistics, and newest sessions first', async () => {
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(
			screen.getByRole('heading', { name: 'The Hobbit' }),
		).toBeInTheDocument()
		expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument()
		expect(
			screen.getByRole('progressbar', {
				name: 'The Hobbit reading progress',
			}),
		).toHaveAttribute('aria-valuenow', '25')
		expect(
			screen.getByRole('img', { name: 'Rating: 4 out of 5 stars' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('region', { name: 'Reading statistics' }),
		).toHaveTextContent('2')
		expect(screen.getByText('Total reading time')).toBeInTheDocument()

		const rows = screen.getAllByRole('listitem')
		expect(within(rows[0]).getByText('pp. 40-60')).toBeInTheDocument()
		expect(within(rows[1]).getByText('pp. 20-30')).toBeInTheDocument()
	})

	it('drives the progress bar width from the reading progress', async () => {
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(
			screen.getByRole('progressbar', { name: 'The Hobbit reading progress' }),
		).toHaveStyle('--progress: 25%')
	})

	it('shows notes as read-only text', async () => {
		await renderWithRoute('/books/book-1', { authenticated: true })

		const notes = screen.getByRole('textbox', { name: 'Book notes' })
		expect(notes).toHaveValue('A favorite adventure.')
		expect(notes).toHaveAttribute('readonly')
	})

	it('shows a dash for a session without a calculated duration', async () => {
		await renderWithRoute('/books/book-1', { authenticated: true })

		const rows = screen.getAllByRole('listitem')
		expect(within(rows[1]).getByText('—')).toBeInTheDocument()
		expect(within(rows[0]).queryByText('—')).not.toBeInTheDocument()
	})

	it('does not show days it took while the book is not completed', async () => {
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(screen.queryByText('Days it took')).not.toBeInTheDocument()
	})

	it('shows days it took once the book is completed', async () => {
		hooks.useBookDetails.mockReturnValue({
			data: completedDetails,
			isLoading: false,
			isError: false,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(screen.getByText('Days it took')).toBeInTheDocument()
		expect(
			screen.getByRole('region', { name: 'Reading statistics' }),
		).toHaveTextContent('10')
	})

	it('shows the empty-session state without reading statistics', async () => {
		hooks.useBookDetails.mockReturnValue({
			data: {
				...bookDetails,
				readingSessions: [],
				stats: { sessions: 0, readingTime: 0, activeDays: 0 },
			},
			isLoading: false,
			isError: false,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(
			screen.getByRole('heading', { name: 'No sessions logged for this book' }),
		).toBeInTheDocument()
		expect(
			screen.queryByRole('region', { name: 'Reading statistics' }),
		).not.toBeInTheDocument()
	})

	it('renders a loading state', async () => {
		hooks.useBookDetails.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
		expect(
			screen.queryByRole('heading', { name: 'The Hobbit' }),
		).not.toBeInTheDocument()
	})

	it('renders an error state when the book cannot be loaded', async () => {
		hooks.useBookDetails.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(
			screen.getByRole('heading', { name: 'Unable to load book' }),
		).toBeInTheDocument()
		expect(screen.getByRole('link', { name: '← Back' })).toHaveAttribute(
			'href',
			'/books',
		)
	})

	it('links back to the book list from the page header', async () => {
		await renderWithRoute('/books/book-1', { authenticated: true })

		expect(screen.getByRole('link', { name: '← Back' })).toHaveAttribute(
			'href',
			'/books',
		)
	})

	it('opens the book editor in edit mode', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(screen.getByRole('button', { name: 'Edit book' }))

		expect(screen.getByRole('dialog')).toHaveTextContent('Book editor: edit')
	})

	it('opens a session form prefilled with this book and its current page', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(screen.getByRole('button', { name: 'Log session' }))

		expect(screen.getByRole('dialog')).toHaveTextContent(
			'Session add book book-1, from page 75',
		)
	})

	it('opens the session form from the empty state', async () => {
		const user = userEvent.setup()
		hooks.useBookDetails.mockReturnValue({
			data: {
				...bookDetails,
				readingSessions: [],
				stats: { sessions: 0, readingTime: 0, activeDays: 0 },
			},
			isLoading: false,
			isError: false,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(screen.getByRole('button', { name: 'Log session' }))

		expect(screen.getByRole('dialog')).toHaveTextContent(
			'Session add book book-1, from page 75',
		)
	})

	it('opens a session in edit mode with its stored values', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(
			screen.getAllByRole('button', { name: /Edit session from/ })[0],
		)

		expect(screen.getByRole('dialog')).toHaveTextContent(
			'Session edit book book-1',
		)
		expect(screen.getByRole('dialog')).toHaveTextContent(
			'editing session-new on 2024-02-10',
		)
	})

	it('does not flag a session as the last one while the book has several', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(
			screen.getAllByRole('button', { name: /Edit session from/ })[0],
		)

		expect(screen.getByRole('dialog')).toHaveTextContent('last session false')
	})

	it('flags the only session of the book as the last one in the session form', async () => {
		const user = userEvent.setup()
		hooks.useBookDetails.mockReturnValue({
			data: {
				...bookDetails,
				readingSessions: [bookDetails.readingSessions[1]],
				stats: { sessions: 1, readingTime: 61, activeDays: 1 },
			},
			isLoading: false,
			isError: false,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(screen.getByRole('button', { name: /Edit session from/ }))

		expect(screen.getByRole('dialog')).toHaveTextContent('last session true')
	})

	it('deletes the chosen session without resetting the book', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(
			screen.getAllByRole('button', { name: /Delete session from/ })[0],
		)
		expect(screen.getByText('Last session: false')).toBeInTheDocument()
		await user.click(
			screen.getByRole('button', { name: 'Confirm session deletion' }),
		)

		expect(hooks.deleteSession).toHaveBeenCalledWith(
			{ id: 'session-new', resetToPlanned: false },
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
	})

	it('tells the delete modal when it is the last session and passes the reset choice', async () => {
		const user = userEvent.setup()
		hooks.useBookDetails.mockReturnValue({
			data: {
				...bookDetails,
				readingSessions: [bookDetails.readingSessions[1]],
				stats: { sessions: 1, readingTime: 61, activeDays: 1 },
			},
			isLoading: false,
			isError: false,
		})
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(
			screen.getByRole('button', { name: /Delete session from/ }),
		)
		expect(screen.getByText('Last session: true')).toBeInTheDocument()
		await user.click(
			screen.getByRole('button', { name: 'Confirm deletion and reset' }),
		)

		expect(hooks.deleteSession).toHaveBeenCalledWith(
			{ id: 'session-new', resetToPlanned: true },
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
	})
})
