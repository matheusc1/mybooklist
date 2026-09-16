import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen } from '#/test/test-utils'

const books = vi.hoisted(() => vi.fn())

vi.mock('#/hooks/use-books', () => ({ useBooks: books }))
vi.mock('#/components/modals/book-modal', () => ({
	BookModal: ({ open, mode }: { open: boolean; mode: string }) =>
		open ? <div role="dialog">Book modal: {mode}</div> : null,
}))

const book = {
	id: 'book-1',
	userId: 'user-1',
	title: 'The Hobbit',
	author: 'J.R.R. Tolkien',
	genre: 'fantasy',
	coverUrl: null,
	totalPages: 310,
	currentPage: 100,
	status: 'reading' as const,
	rating: 4,
	startedAt: null,
	completedAt: null,
	createdAt: '',
	updatedAt: '2026-09-01',
}

const plannedBook = {
	...book,
	id: 'book-2',
	title: 'Dune',
	status: 'planned' as const,
}
const completedBook = {
	...book,
	id: 'book-3',
	title: '1984',
	status: 'completed' as const,
}

beforeEach(() => {
	vi.clearAllMocks()
	books.mockReturnValue({ data: [book], isLoading: false })
})

describe('MyBooks', () => {
	it('filters books by search and opens a book in view mode', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books', { authenticated: true })

		await user.type(
			screen.getByRole('textbox', { name: 'Search by title or author' }),
			'Hobbit',
		)
		expect(screen.getByText('The Hobbit')).toBeInTheDocument()
		await user.click(screen.getByText('The Hobbit'))

		expect(screen.getByRole('dialog')).toHaveTextContent('Book modal: view')
	})

	it('renders the empty library state', async () => {
		books.mockReturnValue({ data: [], isLoading: false })
		await renderWithRoute('/books', { authenticated: true })

		expect(screen.getByText('Your library is empty')).toBeInTheDocument()
		expect(
			screen.getByText(/Start building your collection/),
		).toBeInTheDocument()
	})

	it('filters books by status', async () => {
		const user = userEvent.setup()
		books.mockReturnValue({
			data: [book, plannedBook, completedBook],
			isLoading: false,
		})
		await renderWithRoute('/books', { authenticated: true })

		await user.click(screen.getByRole('button', { name: /Want to read 1/ }))

		expect(screen.getByText('Dune')).toBeInTheDocument()
		expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
		expect(screen.queryByText('1984')).not.toBeInTheDocument()
	})

	it('matches trimmed search text without case sensitivity', async () => {
		const user = userEvent.setup()
		books.mockReturnValue({ data: [book, plannedBook], isLoading: false })
		await renderWithRoute('/books', { authenticated: true })

		await user.type(
			screen.getByRole('textbox', { name: 'Search by title or author' }),
			'  dUnE  ',
		)

		expect(screen.getByText('Dune')).toBeInTheDocument()
		expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
	})

	it('clears search with Escape and restores the full list', async () => {
		const user = userEvent.setup()
		books.mockReturnValue({ data: [book, plannedBook], isLoading: false })
		await renderWithRoute('/books', { authenticated: true })
		const search = screen.getByRole('textbox', {
			name: 'Search by title or author',
		})

		await user.type(search, 'Dune')
		expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
		await user.keyboard('{Escape}')

		expect(screen.getByText('The Hobbit')).toBeInTheDocument()
		expect(screen.getByText('Dune')).toBeInTheDocument()
	})

	it('shows a distinct empty state when filters match no books', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books', { authenticated: true })

		await user.type(
			screen.getByRole('textbox', { name: 'Search by title or author' }),
			'Unknown book',
		)

		expect(screen.getByText('No books here yet')).toBeInTheDocument()
		expect(
			screen.getByText('No books match your current filters.'),
		).toBeInTheDocument()
		expect(screen.queryByText('Your library is empty')).not.toBeInTheDocument()
	})

	it('opens the add-book modal in add mode', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/books', { authenticated: true })

		await user.click(screen.getByRole('button', { name: 'Add Book' }))

		expect(screen.getByRole('dialog')).toHaveTextContent('Book modal: add')
	})

	it('renders book loading skeletons', async () => {
		books.mockReturnValue({ data: undefined, isLoading: true })
		await renderWithRoute('/books', { authenticated: true })

		expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
			0,
		)
		expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
	})
})
