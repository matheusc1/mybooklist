import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCreateBook, useDeleteBook, useUpdateBook } from '#/hooks/use-books'
import { fireEvent, render, screen, waitFor } from '#/test/test-utils'
import type { Book } from '#/types/book'
import { getTodayDate } from '#/utils/format-date'
import { BookModal } from './book-modal'

const createBook = vi.fn()
const updateBook = vi.fn()
const deleteBook = vi.fn()

vi.mock('#/hooks/use-books', () => ({
	useCreateBook: vi.fn(),
	useUpdateBook: vi.fn(),
	useDeleteBook: vi.fn(),
}))

vi.mock('./delete-modal', () => ({
	DeleteModal: ({
		open,
		onConfirm,
	}: {
		open: boolean
		onConfirm: (resetToPlanned: boolean) => void
	}) =>
		open ? (
			<button type="button" onClick={() => onConfirm(false)}>
				Confirm delete
			</button>
		) : null,
}))

vi.mock('../ui/inputs', async () => {
	const actual =
		await vi.importActual<typeof import('../ui/inputs')>('../ui/inputs')
	return {
		...actual,
		GenreSelector: ({
			value,
			onValueChange,
		}: {
			value?: string
			onValueChange?: (value: string) => void
		}) => (
			<select
				aria-label="Genre"
				value={value}
				onChange={(event) => onValueChange?.(event.target.value)}
			>
				<option value="">Select a genre</option>
				<option value="fantasy">Fantasy</option>
			</select>
		),
		BookStatusSelector: ({
			value,
			onValueChange,
		}: {
			value?: string
			onValueChange?: (value: string) => void
		}) => (
			<div role="radiogroup">
				{['reading', 'planned', 'paused', 'completed', 'dropped'].map(
					(status) => (
						<label key={status}>
							<input
								type="radio"
								name="status"
								value={status}
								checked={value === status}
								onChange={(event) => onValueChange?.(event.target.value)}
							/>
							{status[0].toUpperCase() + status.slice(1)}
						</label>
					),
				)}
			</div>
		),
	}
})

describe('BookModal', () => {
	const book = {
		id: 'book-1',
		userId: 'user-1',
		title: 'The Hobbit',
		author: 'J.R.R. Tolkien',
		genre: 'fantasy',
		coverUrl: null,
		totalPages: 310,
		currentPage: 100,
		status: 'reading',
		rating: null,
		startedAt: null,
		completedAt: null,
		createdAt: '',
		updatedAt: '',
		notes: null,
	} satisfies Book

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useCreateBook).mockReturnValue({
			mutate: createBook,
			isPending: false,
		} as never)
		vi.mocked(useUpdateBook).mockReturnValue({
			mutate: updateBook,
			isPending: false,
		} as never)
		vi.mocked(useDeleteBook).mockReturnValue({
			mutate: deleteBook,
			isPending: false,
		} as never)
	})

	it('requires title, author, genre, status, and total pages', async () => {
		render(<BookModal open onOpenChange={vi.fn()} />)

		fireEvent.change(screen.getByRole('textbox', { name: 'Title' }), {
			target: { value: 'The Hobbit' },
		})
		fireEvent.change(screen.getByRole('textbox', { name: 'Author' }), {
			target: { value: 'J.R.R. Tolkien' },
		})
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Total Pages' }), {
			target: { value: '310', valueAsNumber: 310 },
		})

		expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
	})

	it('submits a normalized create payload', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		createBook.mockImplementation((_input, options) => options.onSuccess())
		render(<BookModal open onOpenChange={onOpenChange} />)

		fireEvent.change(screen.getByRole('textbox', { name: 'Title' }), {
			target: { value: 'The Hobbit' },
		})
		fireEvent.change(screen.getByRole('textbox', { name: 'Author' }), {
			target: { value: 'J.R.R. Tolkien' },
		})
		await user.selectOptions(
			screen.getByRole('combobox', { name: 'Genre' }),
			'fantasy',
		)
		await user.click(screen.getByRole('radio', { name: 'Reading' }))
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Total Pages' }), {
			target: { value: '310', valueAsNumber: 310 },
		})
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Current Page' }), {
			target: { value: '12', valueAsNumber: 12 },
		})
		await user.click(screen.getByRole('button', { name: 'Save' }))

		await waitFor(() => expect(createBook).toHaveBeenCalled())
		expect(createBook).toHaveBeenCalledWith(
			{
				title: 'The Hobbit',
				author: 'J.R.R. Tolkien',
				genre: 'fantasy',
				status: 'reading',
				totalPages: 310,
				currentPage: 12,
				coverUrl: undefined,
				rating: undefined,
				startedAt: undefined,
				completedAt: undefined,
				notes: '',
			},
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
		expect(onOpenChange).toHaveBeenCalledWith(false)
	})

	it('automatically marks a book completed at its final page', async () => {
		render(<BookModal open onOpenChange={vi.fn()} />)

		fireEvent.change(screen.getByRole('spinbutton', { name: 'Total Pages' }), {
			target: { value: '100', valueAsNumber: 100 },
		})
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Current Page' }), {
			target: { value: '100', valueAsNumber: 100 },
		})

		await waitFor(() =>
			expect(screen.getByRole('radio', { name: 'Completed' })).toBeChecked(),
		)
		expect(screen.getByLabelText('Reading progress')).toHaveAttribute(
			'aria-valuenow',
			'100',
		)
	})

	it('fills the completion date with the local date when a book is completed', async () => {
		render(<BookModal open onOpenChange={vi.fn()} />)

		fireEvent.change(screen.getByRole('spinbutton', { name: 'Total Pages' }), {
			target: { value: '100', valueAsNumber: 100 },
		})
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Current Page' }), {
			target: { value: '100', valueAsNumber: 100 },
		})

		await waitFor(() =>
			expect(screen.getByLabelText('Date Completed')).toHaveValue(
				getTodayDate(),
			),
		)
	})

	it('uses the add title and does not offer delete when creating', () => {
		render(<BookModal open onOpenChange={vi.fn()} />)

		expect(screen.getByText('Add Book')).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: 'Delete book' }),
		).not.toBeInTheDocument()
	})

	it('uses the edit title and offers delete when editing', () => {
		render(<BookModal open mode="edit" book={book} onOpenChange={vi.fn()} />)

		expect(screen.getByText('Edit Book')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Delete book' })).toBeEnabled()
		expect(screen.getByRole('textbox', { name: 'Title' })).not.toHaveAttribute(
			'readonly',
		)
	})

	it('submits the transformed update payload', async () => {
		const user = userEvent.setup()
		updateBook.mockImplementation((_input, options) => options.onSuccess())
		render(<BookModal open mode="edit" book={book} onOpenChange={vi.fn()} />)

		await user.clear(screen.getByRole('textbox', { name: 'Title' }))
		await user.type(
			screen.getByRole('textbox', { name: 'Title' }),
			'The Hobbit 2',
		)
		await user.click(screen.getByRole('button', { name: 'Save' }))

		await waitFor(() => expect(updateBook).toHaveBeenCalled())
		expect(updateBook).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'book-1',
				title: 'The Hobbit 2',
				author: 'J.R.R. Tolkien',
				genre: 'fantasy',
				status: 'reading',
				totalPages: 310,
				currentPage: 100,
			}),
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
	})

	it('loads, edits, and saves notes for a book', async () => {
		const user = userEvent.setup()
		updateBook.mockImplementation((_input, options) => options.onSuccess())
		render(
			<BookModal
				open
				mode="edit"
				book={{ ...book, notes: 'Existing notes' }}
				onOpenChange={vi.fn()}
			/>,
		)

		const notes = screen.getByRole('textbox', { name: 'Notes' })
		expect(notes).toHaveValue('Existing notes')
		expect(notes).toHaveAttribute('maxLength', '5000')
		expect(notes).toHaveAccessibleDescription('14/5000')

		await user.clear(notes)
		await user.type(notes, 'Updated notes')
		expect(notes).toHaveAccessibleDescription('13/5000')
		await user.click(screen.getByRole('button', { name: 'Save' }))

		await waitFor(() =>
			expect(updateBook).toHaveBeenCalledWith(
				expect.objectContaining({ id: 'book-1', notes: 'Updated notes' }),
				expect.objectContaining({ onSuccess: expect.any(Function) }),
			),
		)
	})

	it('starts with empty notes when creating a book or opening a book without notes', () => {
		const { rerender } = render(<BookModal open onOpenChange={vi.fn()} />)
		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('')
		expect(
			screen.getByRole('textbox', { name: 'Notes' }),
		).toHaveAccessibleDescription('0/5000')

		rerender(<BookModal open mode="edit" book={book} onOpenChange={vi.fn()} />)
		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('')
		expect(
			screen.getByRole('textbox', { name: 'Notes' }),
		).toHaveAccessibleDescription('0/5000')
	})

	it('blocks submission for an invalid cover URL', async () => {
		render(<BookModal open onOpenChange={vi.fn()} />)

		fireEvent.change(screen.getByRole('textbox', { name: 'Book Cover' }), {
			target: { value: 'not a url' },
		})

		expect(await screen.findByText('Must be a valid URL')).toBeInTheDocument()
		expect(createBook).not.toHaveBeenCalled()
	})

	it('blocks submission when current page exceeds total pages', async () => {
		render(<BookModal open onOpenChange={vi.fn()} />)

		fireEvent.change(screen.getByRole('spinbutton', { name: 'Total Pages' }), {
			target: { value: '10', valueAsNumber: 10 },
		})
		fireEvent.change(screen.getByRole('spinbutton', { name: 'Current Page' }), {
			target: { value: '11', valueAsNumber: 11 },
		})

		expect(
			await screen.findByText(
				'Current page cannot be greater than total pages',
			),
		).toBeInTheDocument()
		expect(createBook).not.toHaveBeenCalled()
	})

	it('deletes a book from edit mode, closes the modal, and reports it', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		const onDeleted = vi.fn()
		deleteBook.mockImplementation((_id, options) => options.onSuccess())
		render(
			<BookModal
				open
				mode="edit"
				book={book}
				onOpenChange={onOpenChange}
				onDeleted={onDeleted}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Delete book' }))
		fireEvent.click(
			await screen.findByRole('button', {
				name: 'Confirm delete',
				hidden: true,
			}),
		)

		expect(deleteBook).toHaveBeenCalledWith(
			'book-1',
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
		expect(onOpenChange).toHaveBeenCalledWith(false)
		expect(onDeleted).toHaveBeenCalledTimes(1)
	})

	it('deletes a book without requiring an onDeleted callback', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		deleteBook.mockImplementation((_id, options) => options.onSuccess())
		render(
			<BookModal open mode="edit" book={book} onOpenChange={onOpenChange} />,
		)

		await user.click(screen.getByRole('button', { name: 'Delete book' }))
		fireEvent.click(
			await screen.findByRole('button', {
				name: 'Confirm delete',
				hidden: true,
			}),
		)

		expect(onOpenChange).toHaveBeenCalledWith(false)
	})

	it('disables actions while a mutation is pending', () => {
		vi.mocked(useCreateBook).mockReturnValue({
			mutate: createBook,
			isPending: true,
		} as never)
		render(<BookModal open onOpenChange={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
	})

	it('resets changed fields when cancelled and reopened', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		const view = render(<BookModal open onOpenChange={onOpenChange} />)

		await user.type(screen.getByRole('textbox', { name: 'Title' }), 'Changed')
		await user.click(screen.getByRole('button', { name: 'Cancel' }))
		view.rerender(<BookModal open onOpenChange={onOpenChange} />)

		expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('')
	})
})
