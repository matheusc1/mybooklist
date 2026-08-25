import { BOOK_STATUS } from '#/constants/book-status'
import type { Book } from '#/types/book'
import { formatBookDate } from '#/utils/format-date'

interface BookActivityCardProps {
	book: Book
}

export function BookActivityCard({ book }: BookActivityCardProps) {
	const status = BOOK_STATUS[book.status]

	return (
		<div className="flex gap-3 py-3">
			<div className="flex items-center justify-center w-10 h-15 bg-surface2 rounded-sm shadow-[2px_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
				<img
					src={book.coverUrl ?? '/book-cover.jpg'}
					alt={book.coverUrl ? `${book.title} cover` : 'Default Book Cover'}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="flex flex-col justify-between">
				<div>
					<p className="line-clamp-1 text-sm font-medium">{book.title}</p>
					<p className="line-clamp-1 text-xs text-muted">{book.author}</p>
				</div>
				<div className="flex items-center gap-1.5">
					<div
						aria-hidden="true"
						className={`size-1.5 rounded-full ${status.color}`}
					/>
					<span className="text-xxs font-mono text-muted tracking-wider uppercase">
						{status.shortLabel} · {formatBookDate(book.updatedAt)}
					</span>
				</div>
			</div>
		</div>
	)
}
