import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBooks } from '#/hooks/use-books'
import {
	useCreateReadingSession,
	useDeleteReadingSession,
	useUpdateReadingSession,
} from '#/hooks/use-reading-sessions'
import { fireEvent, render, screen, waitFor } from '#/test/test-utils'
import { ReadingSessionModal } from './reading-session-modal'

const createReadingSession = vi.fn()
const updateReadingSession = vi.fn()
const deleteReadingSession = vi.fn()

vi.mock('#/hooks/use-books', () => ({
	useBooks: vi.fn(),
}))

vi.mock('#/hooks/use-reading-sessions', () => ({
	useCreateReadingSession: vi.fn(),
	useUpdateReadingSession: vi.fn(),
	useDeleteReadingSession: vi.fn(),
}))

vi.mock('../ui/inputs/book-combobox', () => ({
	BookCombobox: ({
		onValueChange,
	}: {
		onValueChange: (book: unknown) => void
	}) => (
		<select
			aria-label="Book"
			onChange={(event) =>
				onValueChange(
					event.target.value
						? { id: event.target.value, currentPage: 10 }
						: null,
				)
			}
		>
			<option value="">Select a book</option>
			<option value="book-1">The Hobbit</option>
		</select>
	),
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

describe('ReadingSessionModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(useBooks).mockReturnValue({
			data: [
				{
					id: 'book-1',
					title: 'The Hobbit',
					currentPage: 10,
				},
			],
		} as never)
		vi.mocked(useCreateReadingSession).mockReturnValue({
			mutate: createReadingSession,
			isPending: false,
		} as never)
		vi.mocked(useUpdateReadingSession).mockReturnValue({
			mutate: updateReadingSession,
			isPending: false,
		} as never)
		vi.mocked(useDeleteReadingSession).mockReturnValue({
			mutate: deleteReadingSession,
			isPending: false,
		} as never)
	})

	it('validates the page range', async () => {
		const user = userEvent.setup()
		render(<ReadingSessionModal open onOpenChange={vi.fn()} />)

		await user.selectOptions(
			screen.getByRole('combobox', { name: 'Book' }),
			'book-1',
		)
		await user.type(screen.getByRole('spinbutton', { name: 'To page' }), '5')

		expect(
			await screen.findByText('To page cannot be less than from page'),
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Set Record' })).toBeDisabled()
	})

	it('submits a new reading session and shows pages read', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		createReadingSession.mockImplementation((_input, options) =>
			options.onSuccess(),
		)
		render(<ReadingSessionModal open onOpenChange={onOpenChange} />)

		await user.selectOptions(
			screen.getByRole('combobox', { name: 'Book' }),
			'book-1',
		)
		expect(screen.getByRole('spinbutton', { name: 'From page' })).toHaveValue(
			10,
		)
		await user.clear(screen.getByRole('spinbutton', { name: 'From page' }))
		await user.type(screen.getByRole('spinbutton', { name: 'From page' }), '10')
		await user.type(screen.getByRole('spinbutton', { name: 'To page' }), '25')

		expect(screen.getByRole('textbox', { name: 'Pages read' })).toHaveValue(
			'15',
		)
		await user.click(screen.getByRole('button', { name: 'Set Record' }))

		await waitFor(() => expect(createReadingSession).toHaveBeenCalled())
		expect(createReadingSession).toHaveBeenCalledWith(
			{
				bookId: 'book-1',
				fromPage: 10,
				toPage: 25,
				readAt: expect.any(String),
			},
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
		expect(onOpenChange).toHaveBeenCalledWith(false)
	})

	it('transitions from view mode to edit mode', async () => {
		const user = userEvent.setup()
		const session = {
			id: 'session-1',
			bookId: 'book-1',
			date: '2026-09-09',
			fromPage: 10,
			toPage: 20,
		}
		render(
			<ReadingSessionModal
				open
				mode="view"
				session={session}
				onOpenChange={vi.fn()}
			/>,
		)

		expect(screen.getByRole('spinbutton', { name: 'To page' })).toHaveAttribute(
			'readonly',
		)
		await user.click(screen.getByRole('button', { name: 'Edit' }))

		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
		expect(
			screen.getByRole('spinbutton', { name: 'To page' }),
		).not.toHaveAttribute('readonly')
	})

	it('submits updated pages in edit mode', async () => {
		const user = userEvent.setup()
		const session = {
			id: 'session-1',
			bookId: 'book-1',
			date: '2026-09-09',
			fromPage: 10,
			toPage: 20,
		}
		updateReadingSession.mockImplementation((_input, options) =>
			options.onSuccess(),
		)
		render(
			<ReadingSessionModal
				open
				mode="edit"
				session={session}
				onOpenChange={vi.fn()}
			/>,
		)

		await user.clear(screen.getByRole('spinbutton', { name: 'To page' }))
		await user.type(screen.getByRole('spinbutton', { name: 'To page' }), '30')
		await user.click(screen.getByRole('button', { name: 'Save' }))

		await waitFor(() => expect(updateReadingSession).toHaveBeenCalled())
		expect(updateReadingSession).toHaveBeenCalledWith(
			{
				id: 'session-1',
				fromPage: 10,
				toPage: 30,
				readAt: '2026-09-09',
			},
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
	})

	it('deletes a session and passes the reset choice', async () => {
		const user = userEvent.setup()
		const session = {
			id: 'session-1',
			bookId: 'book-1',
			date: '2026-09-09',
			fromPage: 10,
			toPage: 20,
		}
		render(
			<ReadingSessionModal
				open
				mode="view"
				session={session}
				onOpenChange={vi.fn()}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Delete session' }))
		fireEvent.click(
			await screen.findByRole('button', {
				name: 'Confirm delete',
				hidden: true,
			}),
		)

		expect(deleteReadingSession).toHaveBeenCalledWith(
			{ id: 'session-1', resetToPlanned: false },
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
	})
})
