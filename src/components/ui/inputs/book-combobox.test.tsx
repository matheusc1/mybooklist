import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '#/test/test-utils'
import type { Book } from '#/types/book'
import { BookCombobox } from './book-combobox'

const books: Book[] = [
	{
		id: 'book-1',
		userId: 'user-1',
		title: 'The Hobbit',
		author: 'J.R.R. Tolkien',
		genre: 'fantasy',
		coverUrl: '/hobbit.jpg',
		totalPages: 310,
		currentPage: 100,
		status: 'reading',
		rating: 4,
		startedAt: null,
		completedAt: null,
		createdAt: '',
		updatedAt: '',
	},
	{
		id: 'book-2',
		userId: 'user-1',
		title: 'Dune',
		author: 'Frank Herbert',
		genre: 'sci-fi',
		coverUrl: null,
		totalPages: 500,
		currentPage: 0,
		status: 'planned',
		rating: null,
		startedAt: null,
		completedAt: null,
		createdAt: '',
		updatedAt: '',
	},
]

describe('BookCombobox', () => {
	it('renders the default and custom placeholder contracts', () => {
		const { rerender } = render(<BookCombobox books={books} />)
		expect(
			screen.getByRole('combobox', { name: 'Search books...' }),
		).toHaveAttribute('placeholder', 'Search books...')
		expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()

		rerender(<BookCombobox books={books} placeholder="Choose a book" />)
		expect(
			screen.getByRole('combobox', { name: 'Choose a book' }),
		).toHaveAttribute('placeholder', 'Choose a book')
	})

	it('opens and renders book titles and authors', async () => {
		const user = userEvent.setup()
		render(<BookCombobox books={books} />)
		await user.click(screen.getByRole('combobox', { name: 'Search books...' }))

		expect(screen.getByText('Books')).toBeInTheDocument()
		expect(screen.getByText('The Hobbit')).toBeInTheDocument()
		expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument()
		expect(screen.getByText('Dune')).toBeInTheDocument()
		expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
	})

	it('filters by title and author and shows the exact empty result copy', async () => {
		const user = userEvent.setup()
		render(<BookCombobox books={books} />)
		const input = screen.getByRole('combobox', { name: 'Search books...' })
		await user.click(screen.getByRole('combobox', { name: 'Search books...' }))
		await user.type(input, 'dune')

		expect(screen.getByText('Dune')).toBeInTheDocument()
		expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()

		await user.clear(input)
		await user.type(input, 'unknown')
		expect(screen.getByText('No books found')).toBeInTheDocument()
	})

	it('reports the selected Book object and supports clearing it', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		const { rerender } = render(
			<BookCombobox books={books} onValueChange={onValueChange} />,
		)
		await user.click(screen.getByRole('combobox', { name: 'Search books...' }))
		await user.click(screen.getByText('The Hobbit'))

		expect(onValueChange.mock.calls[0][0]).toBe(books[0])

		rerender(
			<BookCombobox
				books={books}
				value={books[0]}
				onValueChange={onValueChange}
			/>,
		)
		expect(
			screen.getByRole('combobox', { name: 'Search books...' }),
		).toHaveValue('The Hobbit')
		fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
		expect(onValueChange.mock.calls.at(-1)?.[0]).toBeNull()
	})

	it('keeps the selected value visible and blocks interaction when disabled or read-only', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		const { rerender } = render(
			<BookCombobox
				books={books}
				value={books[0]}
				disabled
				onValueChange={onValueChange}
			/>,
		)
		expect(
			screen.getByRole('combobox', { name: 'Search books...' }),
		).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Open' })).toBeDisabled()

		rerender(
			<BookCombobox
				books={books}
				value={books[0]}
				readOnly
				onValueChange={onValueChange}
			/>,
		)
		const input = screen.getByRole('combobox', { name: 'Search books...' })
		expect(input).toHaveValue('The Hobbit')
		await user.click(screen.getByRole('combobox', { name: 'Search books...' }))
		expect(screen.queryByText('Dune')).not.toBeInTheDocument()
		expect(onValueChange).not.toHaveBeenCalled()
	})

	it('uses the fallback cover for books without a cover URL', async () => {
		const user = userEvent.setup()
		render(<BookCombobox books={[books[1]]} />)
		await user.click(screen.getByRole('combobox', { name: 'Search books...' }))
		expect(document.querySelector('img')).toHaveAttribute(
			'src',
			'/book-cover.jpg',
		)
	})
})
