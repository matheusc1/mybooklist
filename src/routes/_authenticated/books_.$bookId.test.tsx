import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen, within } from '#/test/test-utils'
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
	BookModal: ({ open }: { open: boolean }) =>
		open ? <div role="dialog">Book editor</div> : null,
}))
vi.mock('#/components/modals/reading-session-modal', () => ({
	ReadingSessionModal: ({
		open,
		defaultBook,
	}: {
		open: boolean
		defaultBook?: { id: string; currentPage: number }
	}) =>
		open ? (
			<div role="dialog">
				Session book {defaultBook?.id}, from page {defaultBook?.currentPage}
			</div>
		) : null,
}))
vi.mock('#/components/modals/delete-modal', () => ({
	DeleteModal: ({
		open,
		onConfirm,
	}: {
		open: boolean
		onConfirm: (resetToPlanned: boolean) => void
	}) =>
		open ? (
			<button type="button" onClick={() => onConfirm(false)}>
				Confirm session deletion
			</button>
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
		expect(screen.getByText('A favorite adventure.')).toBeInTheDocument()

		const rows = screen.getAllByRole('listitem')
		expect(within(rows[0]).getByText('pp. 40-60')).toBeInTheDocument()
		expect(within(rows[1]).getByText('pp. 20-30')).toBeInTheDocument()
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
		expect(screen.getByRole('link', { name: '← My Books' })).toHaveAttribute(
			'href',
			'/books',
		)
	})

	it('opens a session form prefilled with this book and its current page', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books/book-1', { authenticated: true })

		await user.click(screen.getByRole('button', { name: 'Log session' }))

		expect(screen.getByRole('dialog')).toHaveTextContent(
			'Session book book-1, from page 75',
		)
	})
})
