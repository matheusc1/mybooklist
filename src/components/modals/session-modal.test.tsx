import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '#/test/test-utils'
import { SessionModal } from './session-modal'

const readingSessionModal = vi.hoisted(() => vi.fn())
const useBookDetails = vi.hoisted(() => vi.fn())

vi.mock('#/hooks/use-book-details', () => ({ useBookDetails }))
vi.mock('../ui/modal', () => ({
	Modal: {
		Root: ({
			children,
			open,
		}: {
			children: React.ReactNode
			open?: boolean
		}) => (open ? <div role="dialog">{children}</div> : null),
		Header: ({ eyebrow, title }: { eyebrow: string; title: string }) => (
			<header>
				<span>{eyebrow}</span>
				<h2>{title}</h2>
			</header>
		),
		Body: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
		Footer: ({ children }: { children: React.ReactNode }) => (
			<footer>{children}</footer>
		),
	},
}))
vi.mock('./reading-session-modal', () => ({
	ReadingSessionModal: (props: {
		open: boolean
		mode: string
		defaultDate?: string
		session?: { date?: string }
		isLastSession?: boolean
		onOpenChange: (open: boolean) => void
	}) => {
		readingSessionModal(props)
		return props.open ? (
			<div role="dialog" aria-label="Reading session form">
				<input
					aria-label="Date"
					value={props.defaultDate ?? props.session?.date ?? ''}
					readOnly
				/>
				<span>{props.mode}</span>
				<button type="button" onClick={() => props.onOpenChange(false)}>
					Close nested session
				</button>
			</div>
		) : null
	},
}))

const session = {
	id: 'session-1',
	bookId: 'book-1',
	title: 'The Hobbit',
	author: 'J.R.R. Tolkien',
	coverUrl: '/hobbit.jpg',
	fromPage: 10,
	toPage: 25,
	duration: 30,
}

const sessionWithoutCover = { ...session, id: 'session-2', coverUrl: null }

const sessionButtonName =
	'The Hobbit by J.R.R. Tolkien, pages 10-25, 30 minutes'

beforeEach(() => {
	vi.clearAllMocks()
	useBookDetails.mockReturnValue({ data: undefined })
})

describe('SessionModal', () => {
	it('renders the empty state and formatted date', () => {
		render(
			<SessionModal open date="2026-09-15" sessions={[]} onClose={vi.fn()} />,
		)

		expect(screen.getByText('Sep 15, 2026')).toBeInTheDocument()
		expect(screen.getByText('No sessions logged')).toBeInTheDocument()
		expect(
			screen.getByText("You didn't log any reading for this day."),
		).toBeInTheDocument()
	})

	it('renders session labels, details, ordinals, and cover alternatives', () => {
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session, sessionWithoutCover]}
				onClose={vi.fn()}
			/>,
		)

		expect(
			screen.getAllByRole('button', { name: sessionButtonName })[0],
		).toBeInTheDocument()
		expect(screen.getAllByText('PP. 10-25')).toHaveLength(2)
		expect(screen.getAllByText('30min')).toHaveLength(2)
		expect(screen.getByText('#1')).toBeInTheDocument()
		expect(screen.getByText('#2')).toBeInTheDocument()
		expect(screen.getByAltText('The Hobbit cover')).toHaveAttribute(
			'src',
			'/hobbit.jpg',
		)
		expect(screen.getByAltText('Default Book Cover')).toHaveAttribute(
			'src',
			'/book-cover.webp',
		)
	})

	it('opens the selected session in edit mode with the selected date', () => {
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session]}
				onClose={vi.fn()}
			/>,
		)

		fireEvent.click(screen.getByRole('button', { name: sessionButtonName }))

		expect(
			screen.getByRole('dialog', { name: 'Reading session form' }),
		).toBeInTheDocument()
		expect(screen.getByText('edit')).toBeInTheDocument()
		expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue(
			'2026-09-15',
		)
		expect(readingSessionModal).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'edit',
				defaultDate: '2026-09-15',
				session: expect.objectContaining({
					id: 'session-1',
					date: '2026-09-15',
				}),
			}),
		)
	})

	it('loads the book sessions of the selected session', () => {
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session]}
				onClose={vi.fn()}
			/>,
		)

		fireEvent.click(screen.getByRole('button', { name: sessionButtonName }))

		expect(useBookDetails).toHaveBeenCalledWith('book-1')
	})

	it('marks the session as the last one when the book has a single session', () => {
		useBookDetails.mockReturnValue({
			data: { readingSessions: [{ id: 'session-1' }] },
		})
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session]}
				onClose={vi.fn()}
			/>,
		)

		fireEvent.click(screen.getByRole('button', { name: sessionButtonName }))

		expect(readingSessionModal).toHaveBeenLastCalledWith(
			expect.objectContaining({ isLastSession: true }),
		)
	})

	it('does not mark the session as the last one when the book has more sessions', () => {
		useBookDetails.mockReturnValue({
			data: { readingSessions: [{ id: 'session-1' }, { id: 'session-9' }] },
		})
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session]}
				onClose={vi.fn()}
			/>,
		)

		fireEvent.click(screen.getByRole('button', { name: sessionButtonName }))

		expect(readingSessionModal).toHaveBeenLastCalledWith(
			expect.objectContaining({ isLastSession: false }),
		)
	})

	it('leaves the last-session flag undefined until the book sessions are known', () => {
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session]}
				onClose={vi.fn()}
			/>,
		)

		fireEvent.click(screen.getByRole('button', { name: sessionButtonName }))

		expect(readingSessionModal).toHaveBeenLastCalledWith(
			expect.objectContaining({ isLastSession: undefined }),
		)
	})

	it('opens a new session form with the selected day as its default date', () => {
		render(
			<SessionModal open date="2026-09-15" sessions={[]} onClose={vi.fn()} />,
		)

		fireEvent.click(
			screen.getByRole('button', { name: 'Log a session for this day' }),
		)

		expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue(
			'2026-09-15',
		)
		expect(readingSessionModal).toHaveBeenLastCalledWith(
			expect.objectContaining({
				mode: 'add',
				defaultDate: '2026-09-15',
			}),
		)
		expect(useBookDetails).not.toHaveBeenCalled()
	})

	it('closes the nested session form through its onOpenChange callback', () => {
		render(
			<SessionModal open date="2026-09-15" sessions={[]} onClose={vi.fn()} />,
		)

		fireEvent.click(
			screen.getByRole('button', { name: 'Log a session for this day' }),
		)
		fireEvent.click(
			screen.getByRole('button', { name: 'Close nested session' }),
		)

		expect(
			screen.queryByRole('dialog', { name: 'Reading session form' }),
		).not.toBeInTheDocument()
	})

	it('closes the nested edit form through its onOpenChange callback', () => {
		render(
			<SessionModal
				open
				date="2026-09-15"
				sessions={[session]}
				onClose={vi.fn()}
			/>,
		)

		fireEvent.click(screen.getByRole('button', { name: sessionButtonName }))
		fireEvent.click(
			screen.getByRole('button', { name: 'Close nested session' }),
		)

		expect(
			screen.queryByRole('dialog', { name: 'Reading session form' }),
		).not.toBeInTheDocument()
	})
})
