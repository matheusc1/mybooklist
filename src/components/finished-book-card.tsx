import { LucideStar } from 'lucide-react'
import type { Book } from '#/types/types'
import { formatBookDate } from '#/utils/format-date'

interface FinishedBookCardProps {
	book: Book
}

export function FinishedBookCard({ book }: FinishedBookCardProps) {
	const stars = Array.from({ length: 5 }, (_, i) => i < (book.rating ?? 0))

	return (
		<div className="group flex gap-3 py-3 border-b border-border transition-all duration-200 cursor-pointer hover:opacity-95">
			<div className="relative w-13 h-19.5 shrink-0 bg-surface2 rounded overflow-hidden flex items-center justify-center shadow-[3px_3px_12px_rgba(0,0,0,0.4)]">
				<img
					src={book.bookCover ?? '/book-cover.jpg'}
					alt={book.bookCover ? `${book.title} cover` : 'Default Book Cover'}
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
					{formatBookDate(book.endDate ?? '')}
				</p>
			</div>
		</div>
	)
}
