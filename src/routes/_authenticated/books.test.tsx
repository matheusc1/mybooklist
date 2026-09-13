import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter, screen } from '#/test/test-utils'
import { MyBooks } from './books'

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

beforeEach(() => {
	vi.clearAllMocks()
	books.mockReturnValue({ data: [book], isLoading: false })
})

describe('MyBooks', () => {
	it('filters books by search and opens a book in view mode', async () => {
		const user = userEvent.setup()
		renderWithRouter(<MyBooks />)

		await user.type(
			screen.getByRole('textbox', { name: 'Search by title or author' }),
			'Hobbit',
		)
		expect(screen.getByText('The Hobbit')).toBeInTheDocument()
		await user.click(screen.getByText('The Hobbit'))

		expect(screen.getByRole('dialog')).toHaveTextContent('Book modal: view')
	})

	it('renders the empty library state', () => {
		books.mockReturnValue({ data: [], isLoading: false })
		renderWithRouter(<MyBooks />)

		expect(screen.getByText('Your library is empty')).toBeInTheDocument()
		expect(
			screen.getByText(/Start building your collection/),
		).toBeInTheDocument()
	})
})
