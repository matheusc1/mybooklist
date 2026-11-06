import { Link } from '@tanstack/react-router'
import type { Book } from '#/types/book'
import type { YearlyOverview } from '#/types/yearly-overview'
import { formatShortDate } from '#/utils/format-date'
import { RatingDisplay } from '../rating-display'

const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

interface CompletedBooksProps {
	completedBooks: YearlyOverview['completedBooks']
}

interface CompletedBookCardProps {
	book: Book
}

function groupByMonth(books: Book[]) {
	const groups = new Map<number, Book[]>()

	for (const book of books) {
		if (!book.completedAt) continue
		const month = Number(book.completedAt.slice(5, 7)) - 1
		groups.set(month, [...(groups.get(month) ?? []), book])
	}

	return [...groups.entries()].map(([month, monthBooks]) => ({
		month,
		books: monthBooks,
	}))
}

export function CompletedBooks({ completedBooks }: CompletedBooksProps) {
	const groups = groupByMonth(completedBooks)

	return (
		<section aria-label="Completed Books" className="mt-8">
			<h2 className="font-serif font-semibold text-xl">Completed Books</h2>

			{groups.map(({ month, books }) => (
				<div key={month}>
					<div className="mb-3 mt-6 flex items-baseline gap-3 border-b border-border pb-2.5">
						<h3 className="font-serif text-lg font-semibold">
							{MONTH_NAMES[month]}
						</h3>
						<span className="font-mono text-xs text-muted">
							{books.length} {books.length > 1 ? 'books' : 'book'}
						</span>
					</div>

					<ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
						{books.map((book) => (
							<li key={book.id}>
								<BookCard book={book} />
							</li>
						))}
					</ul>
				</div>
			))}
		</section>
	)
}

function BookCard({ book }: CompletedBookCardProps) {
	return (
		<Link
			to="/books/$bookId"
			params={{ bookId: String(book.id) }}
			className="group block text-left w-full"
		>
			<div className="relative mb-2.5 w-full aspect-2/3 rounded-lg overflow-hidden bg-surface2 shadow-[4px_6px_20px_rgba(0,0,0,0.5)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[6px_12px_30px_rgba(0,0,0,0.6)]">
				<img
					src={book.coverUrl ?? '/book-cover.webp'}
					alt=""
					className="w-full h-full object-cover"
				/>
			</div>

			<div>
				<p className="font-serif text-sm/[1.3] font-semibold truncate mb-0.5 transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent">
					{book.title}
				</p>
				<div className="flex items-baseline justify-between">
					<span className="text-xxs font-mono text-muted">
						{/** biome-ignore lint/style/noNonNullAssertion: Book always completed */}
						{formatShortDate(book.completedAt!)}
					</span>
					{book.rating !== null && (
						<RatingDisplay value={book.rating} size="small" />
					)}
				</div>
			</div>
		</Link>
	)
}
