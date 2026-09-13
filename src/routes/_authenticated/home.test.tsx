import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter, screen } from '#/test/test-utils'
import { Home } from './home'

const mocks = vi.hoisted(() => ({
	dashboard: vi.fn(),
	goal: vi.fn(),
}))

vi.mock('#/hooks/use-dashboard', () => ({ useDashboard: mocks.dashboard }))
vi.mock('#/hooks/use-goal', () => ({ useGoal: mocks.goal }))
vi.mock('#/components/modals/reading-session-modal', () => ({
	ReadingSessionModal: ({ open }: { open: boolean }) =>
		open ? <div role="dialog">Reading session modal</div> : null,
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
	mocks.goal.mockReturnValue({ data: undefined })
	mocks.dashboard.mockReturnValue({
		data: {
			currentlyReading: book,
			recentActivity: [book],
			lastCompleted: [book],
			weeklyStats: {
				pagesByDay: [],
				totalPagesRead: 10,
				totalReadingMinutes: 30,
				mostActiveDay: 'Mon',
				daysStreak: 1,
			},
		},
		isLoading: false,
	})
})

describe('Home', () => {
	it('renders dashboard content and opens the add-record modal', async () => {
		const user = userEvent.setup()
		renderWithRouter(<Home />)

		expect(
			screen.getByRole('heading', { name: 'Bookshelf' }),
		).toBeInTheDocument()
		expect(screen.getAllByText('The Hobbit').length).toBeGreaterThan(0)
		await user.click(screen.getByRole('button', { name: 'Add Record' }))

		expect(screen.getByRole('dialog')).toHaveTextContent(
			'Reading session modal',
		)
	})

	it('renders the dashboard loading screen', () => {
		mocks.dashboard.mockReturnValue({ data: undefined, isLoading: true })
		renderWithRouter(<Home />)

		expect(
			screen.getByRole('heading', { name: 'Weekly Stats' }),
		).toBeInTheDocument()
		expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
			0,
		)
	})

	it('renders empty states for the current book, completed books, and weekly stats', () => {
		mocks.dashboard.mockReturnValue({
			data: {
				currentlyReading: null,
				recentActivity: [],
				lastCompleted: [],
				weeklyStats: {
					pagesByDay: [],
					totalPagesRead: 0,
					totalReadingMinutes: 0,
					mostActiveDay: null,
					daysStreak: 0,
				},
			},
			isLoading: false,
		})
		renderWithRouter(<Home />)

		expect(
			screen.getByText("You're not tracking any book right now."),
		).toBeInTheDocument()
		expect(screen.getByText('No books completed yet')).toBeInTheDocument()
		expect(
			screen.getByText('Add your first reading record to see stats here.'),
		).toBeInTheDocument()
	})
})
