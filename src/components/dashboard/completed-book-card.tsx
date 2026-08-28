import { LucideLibrary, LucideStar } from 'lucide-react'
import type { Book } from '#/types/book'
import { formatBookDate } from '#/utils/format-date'

interface CompletedBookCardProps {
	book: Book
}

export function CompletedBookCard({ book }: CompletedBookCardProps) {
	const stars = Array.from({ length: 5 }, (_, i) => i < (book.rating ?? 0))

	return (
		<div className="group flex gap-3 py-3 border-b border-border transition-all duration-200 cursor-pointer hover:opacity-95">
			<div className="relative w-13 h-19.5 shrink-0 bg-surface2 rounded overflow-hidden flex items-center justify-center shadow-[3px_3px_12px_rgba(0,0,0,0.4)]">
				<img
					src={book.coverUrl ?? '/book-cover.jpg'}
					alt={book.coverUrl ? `${book.title} cover` : 'Default Book Cover'}
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="flex-1">
				<h3 className="line-clamp-1 text-sm font-semibold font-serif text-text mb-0.5 leading-snug group-hover:text-accent transition-colors duration-200">
					{book.title}
				</h3>
				<p className="line-clamp-1 text-xs text-muted mb-2">{book.author}</p>

				<div
					className="flex gap-0.5 mb-1"
					role="img"
					aria-label={`${book.rating ?? 0} out of 5 stars`}
				>
					{stars.map((isFilled, i) => (
						<LucideStar
							// biome-ignore lint/suspicious/noArrayIndexKey: stars is a static derived array; order never changes
							key={i}
							aria-hidden="true"
							size={12}
							className={isFilled ? 'fill-accent text-accent' : 'text-surface2'}
						/>
					))}
				</div>

				<p className="text-xxs text-muted font-mono">
					{formatBookDate(book.completedAt ?? '')}
				</p>
			</div>
		</div>
	)
}

export function CompletedBooksEmptyState() {
	return (
		<div className="flex flex-col items-center text-center py-5 px-4 pb-8 border-b border-border -mt-3">
			<LucideLibrary aria-hidden="true" className="size-12 text-text/70 mb-5" />
			<p className="font-serif font-semibold text-sm lg:text-base text-text/60 mb-1.5">
				No books completed yet
			</p>
			<p className="text-xs/relaxed text-muted max-w-47.5">
				Your completed reads will appear here. Every great library starts with
				one book.
			</p>
		</div>
	)
}
