import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import type { Book } from '#/types/book'
import type { WeeklyStats } from '#/types/dashboard'
import { MonthlyStats } from '../activity/monthly-stats'
import { BookActivityCard } from './book-activity-card'
import {
	CompletedBookCard,
	CompletedBooksEmptyState,
} from './completed-book-card'
import { CurrentBookCard, CurrentBookEmptyState } from './current-book-card'
import { WeeklyStatsContent, WeeklyStatsEmptyState } from './weekly-stats'

vi.mock('@tanstack/react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@tanstack/react-router')>()
	return {
		...actual,
		Link: ({
			children,
			to,
			params,
			...props
		}: ComponentProps<'a'> & {
			to?: string
			params?: Record<string, string>
		}) => (
			<a
				{...props}
				href={to?.replace(/\$(\w+)/g, (_, key) => params?.[key] ?? '')}
			>
				{children}
			</a>
		),
	}
})

const book: Book = {
	id: 'book-1',
	userId: 'user-1',
	title: 'The Hobbit',
	author: 'J.R.R. Tolkien',
	genre: 'fantasy',
	coverUrl: null,
	totalPages: 310,
	currentPage: 100,
	status: 'reading',
	rating: 4,
	startedAt: null,
	completedAt: '2026-09-01',
	createdAt: '',
	updatedAt: '2026-09-05',
	notes: null,
}

const weeklyStats: WeeklyStats = {
	pagesByDay: [
		{ day: 'Mon', pages: 10 },
		{ day: 'Tue', pages: 20 },
	],
	totalPagesRead: 30,
	totalReadingMinutes: 90,
	mostActiveDay: 'Tue',
	daysStreak: 2,
}

describe('dashboard presentation components', () => {
	it('renders current book progress, details link, and decorative cover', () => {
		const { container } = render(<CurrentBookCard book={book} />)

		expect(screen.getByText('The Hobbit')).toBeInTheDocument()
		expect(screen.getByText('Page 100 of 310')).toBeInTheDocument()
		expect(screen.getByRole('progressbar')).toHaveAttribute(
			'aria-valuenow',
			'32',
		)
		expect(screen.getByRole('link')).toHaveAttribute('href', '/books/book-1')

		const cover = container.querySelector('img')
		expect(cover).toHaveAttribute('alt', '')
		expect(cover).toHaveAttribute('src', '/book-cover.webp')
	})

	it('renders the current-book empty state with a books link', () => {
		render(<CurrentBookEmptyState />)

		expect(
			screen.getByText("You're not tracking any book right now."),
		).toBeInTheDocument()
		expect(
			screen.getByRole('link', { name: 'Start tracking' }),
		).toHaveAttribute('href', '/books')
	})

	it('renders completed book rating, details link, and empty state copy', () => {
		const { rerender } = render(<CompletedBookCard book={book} />)

		expect(
			screen.getByRole('img', { name: '4 out of 5 stars' }),
		).toBeInTheDocument()
		expect(screen.getByText('Sep 1, 2026')).toBeInTheDocument()
		expect(screen.getByRole('link')).toHaveAttribute('href', '/books/book-1')

		rerender(<CompletedBooksEmptyState />)
		expect(screen.getByText('No books completed yet')).toBeInTheDocument()
	})

	it('renders an empty rating when the book has no rating yet', () => {
		render(<CompletedBookCard book={{ ...book, rating: null }} />)

		expect(
			screen.getByRole('img', { name: '0 out of 5 stars' }),
		).toBeInTheDocument()
	})

	it('renders recent book activity details and links to the book', () => {
		render(<BookActivityCard book={book} />)

		expect(screen.getByText('The Hobbit')).toBeInTheDocument()
		expect(screen.getByText('Reading · Sep 5, 2026')).toBeInTheDocument()
		expect(screen.getByRole('link')).toHaveAttribute('href', '/books/book-1')
	})

	it('renders monthly activity statistics and formatted reading time', () => {
		render(
			<MonthlyStats
				monthlyStats={{
					sessions: 3,
					pages: 120,
					readingTime: 90,
					activeDays: 4,
				}}
			/>,
		)

		expect(screen.getByText('3')).toBeInTheDocument()
		expect(screen.getByText('120')).toBeInTheDocument()
		expect(screen.getByText('~1h 30m')).toBeInTheDocument()
		expect(screen.getByText('4')).toBeInTheDocument()
	})

	it('renders weekly metrics, chart description, tooltips, and active day', () => {
		render(<WeeklyStatsContent weeklyStats={weeklyStats} />)

		expect(screen.getByText('30', { selector: 'p' })).toBeInTheDocument()
		expect(screen.getByText('~1h', { selector: 'p' })).toBeInTheDocument()
		expect(screen.getByText('1', { selector: 'strong' })).toBeInTheDocument()
		expect(screen.getByText('30', { selector: 'strong' })).toBeInTheDocument()
		expect(
			screen.getByRole('img', { name: /Tue: 20 pages/ }),
		).toBeInTheDocument()
		expect(screen.getByText('10 pages')).toBeInTheDocument()
		expect(screen.getByText('20 pages')).toBeInTheDocument()
		expect(screen.getByText('Tue ↑')).toBeInTheDocument()
	})

	it('uses the singular form for one page in the tooltip and chart description', () => {
		render(
			<WeeklyStatsContent
				weeklyStats={{
					...weeklyStats,
					pagesByDay: [
						{ day: 'Mon', pages: 1 },
						{ day: 'Tue', pages: 20 },
					],
				}}
			/>,
		)

		expect(screen.getByText('1 page')).toBeInTheDocument()
		expect(
			screen.getByRole('img', { name: /Mon: 1 page,/ }),
		).toBeInTheDocument()
	})

	it('renders the weekly empty state', () => {
		render(<WeeklyStatsEmptyState />)

		expect(
			screen.getByText('Add your first reading record to see stats here.'),
		).toBeInTheDocument()
		expect(screen.getByText('Pages per day')).toBeInTheDocument()
		expect(screen.getByText('Mon')).toBeInTheDocument()
	})
})
