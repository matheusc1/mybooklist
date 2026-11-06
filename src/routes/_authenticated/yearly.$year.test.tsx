import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen, within } from '#/test/test-utils'
import type { Book } from '#/types/book'
import type { YearlyOverview } from '#/types/yearly-overview'

const hooks = vi.hoisted(() => ({
	useYearlyOverview: vi.fn(),
}))

vi.mock('#/hooks/use-yearly-overview', () => ({
	useYearlyOverview: hooks.useYearlyOverview,
}))

function book(id: string, title: string, completedAt: string | null): Book {
	return {
		id,
		userId: 'user-1',
		title,
		author: 'Author',
		genre: 'fantasy',
		coverUrl: null,
		totalPages: 300,
		currentPage: 300,
		status: 'completed',
		rating: 4,
		startedAt: '2025-01-01',
		completedAt,
		createdAt: '2025-01-01',
		updatedAt: '2025-01-01',
		notes: null,
	}
}

function overviewFor(year: number): YearlyOverview {
	return {
		goal: { year, target: 10, current: 3 },
		yearlyStats: {
			sessions: 12,
			pages: 840,
			readingTime: 90,
			activeDays: 7,
			pagesByMonth: [0, 0, 420, 0, 0, 0, 0, 0, 0, 0, 0, 420],
		},
		completedBooks: [
			book('book-a', 'Alpha', `${year}-03-10`),
			book('book-b', 'Bravo', `${year}-03-10`),
			book('book-c', 'Charlie', `${year}-12-31`),
		],
	}
}

function mockOverview(overview: YearlyOverview) {
	hooks.useYearlyOverview.mockReturnValue({
		data: overview,
		isLoading: false,
		isError: false,
	})
}

beforeEach(() => {
	vi.clearAllMocks()
	vi.useFakeTimers({ toFake: ['Date'] })
	vi.setSystemTime(new Date(2026, 8, 2, 12))
	mockOverview(overviewFor(2025))
})

afterEach(() => {
	vi.useRealTimers()
})

describe('YearlyOverviewPage', () => {
	it('keeps the page header and year switcher visible while loading', async () => {
		hooks.useYearlyOverview.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
		})
		await renderWithRoute('/yearly/2025', { authenticated: true })

		expect(
			screen.getByRole('heading', { level: 1, name: 'Yearly Stats' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('navigation', { name: 'Change year' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('region', { name: 'Loading yearly overview' }),
		).toHaveAttribute('aria-busy', 'true')
		expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
			0,
		)
		expect(
			screen.queryByRole('region', { name: 'Completed Books' }),
		).not.toBeInTheDocument()
	})

	it('renders the goal, statistics, chart and completed books for the year', async () => {
		await renderWithRoute('/yearly/2025', { authenticated: true })

		expect(
			screen.getByRole('heading', { level: 1, name: 'Yearly Stats' }),
		).toBeInTheDocument()
		expect(screen.getByText('Reading Goal · 2025')).toBeInTheDocument()
		expect(
			screen.getByRole('region', { name: 'Yearly statistics' }),
		).toHaveTextContent('840')
		expect(
			screen.getByRole('img', { name: /^Yearly reading chart\./ }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('region', { name: 'Completed Books' }),
		).toBeInTheDocument()
	})

	it('converts the route year to a number before loading the overview', async () => {
		await renderWithRoute('/yearly/2025', { authenticated: true })

		expect(hooks.useYearlyOverview).toHaveBeenCalledWith(2025)
	})

	it.each([
		'abc',
		'20.5',
		'999',
		'10000',
	])('does not load anything for the invalid year %s', async (year) => {
		await renderWithRoute(`/yearly/${year}`, { authenticated: true })

		expect(hooks.useYearlyOverview).not.toHaveBeenCalled()
		expect(
			screen.queryByRole('heading', { name: 'Yearly Stats' }),
		).not.toBeInTheDocument()
	})

	it('shows the in-progress badge only for the current year', async () => {
		mockOverview(overviewFor(2026))
		await renderWithRoute('/yearly/2026', { authenticated: true })

		expect(screen.getByText('In progress')).toBeInTheDocument()
	})

	it('does not show the in-progress badge for a past year', async () => {
		await renderWithRoute('/yearly/2025', { authenticated: true })

		expect(screen.queryByText('In progress')).not.toBeInTheDocument()
	})
})

describe('YearSwitcher', () => {
	it('links to the previous and next year from a past year', async () => {
		await renderWithRoute('/yearly/2025', { authenticated: true })

		const switcher = screen.getByRole('navigation', { name: 'Change year' })
		expect(within(switcher).getByText('2025')).toBeInTheDocument()
		expect(
			within(switcher).getByRole('link', { name: 'Previous year' }),
		).toHaveAttribute('href', '/yearly/2024')
		expect(
			within(switcher).getByRole('link', { name: 'Next year' }),
		).toHaveAttribute('href', '/yearly/2026')
	})

	it('disables the next-year link in the current year', async () => {
		mockOverview(overviewFor(2026))
		await renderWithRoute('/yearly/2026', { authenticated: true })

		const next = screen.getByRole('link', { name: 'Next year' })
		expect(next).toHaveAttribute('aria-disabled', 'true')
		expect(next).not.toHaveAttribute('href')
		expect(screen.getByRole('link', { name: 'Previous year' })).toHaveAttribute(
			'href',
			'/yearly/2025',
		)
	})
})

describe('CompletedBooks', () => {
	it('groups the completed books by month in chronological order', async () => {
		await renderWithRoute('/yearly/2025', { authenticated: true })

		const section = screen.getByRole('region', { name: 'Completed Books' })
		const months = within(section).getAllByRole('heading', { level: 3 })
		expect(months.map((month) => month.textContent)).toEqual([
			'March',
			'December',
		])
		expect(section).toHaveTextContent('2 books')
		expect(section).toHaveTextContent('1 book')
	})

	it('links each book to its details page', async () => {
		await renderWithRoute('/yearly/2025', { authenticated: true })

		const section = screen.getByRole('region', { name: 'Completed Books' })
		const hrefs = within(section)
			.getAllByRole('link')
			.map((link) => link.getAttribute('href'))
		expect(hrefs).toEqual(['/books/book-a', '/books/book-b', '/books/book-c'])
	})

	it('skips a book without a completion date', async () => {
		mockOverview({
			...overviewFor(2025),
			completedBooks: [
				book('book-a', 'Alpha', '2025-03-10'),
				book('book-x', 'No Date', null),
			],
		})
		await renderWithRoute('/yearly/2025', { authenticated: true })

		const section = screen.getByRole('region', { name: 'Completed Books' })
		expect(within(section).getAllByRole('link')).toHaveLength(1)
	})

	it('does not render the section when no book was completed in the year', async () => {
		mockOverview({ ...overviewFor(2025), completedBooks: [] })
		await renderWithRoute('/yearly/2025', { authenticated: true })

		expect(
			screen.queryByRole('region', { name: 'Completed Books' }),
		).not.toBeInTheDocument()
	})
})
