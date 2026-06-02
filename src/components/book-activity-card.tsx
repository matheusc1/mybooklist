import type { ActivityStatus, Book } from '#/types/types'
import { formatBookDate } from '#/utils/format-date'

const statusColor: Record<ActivityStatus, string> = {
	reading: 'bg-accent2',
	finished: 'bg-accent',
	paused: 'bg-muted',
	abandoned: 'bg-danger',
	'want-to-read': 'bg-mist',
}

const statusLabel: Record<ActivityStatus, string> = {
	reading: 'Reading',
	finished: 'Finished',
	paused: 'Paused',
	abandoned: 'Abandoned',
	'want-to-read': 'Planned',
}

interface BookActivityCardProps {
	book: Book
}

export function BookActivityCard({ book }: BookActivityCardProps) {
	return (
		<div className="flex gap-3 py-3 border-b border-border last:border-b-0">
			<div className="flex items-center justify-center w-10 h-15 bg-surface2 rounded-sm shadow-[2px_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
				<img
					src={book.bookCover ?? '/book-cover.jpg'}
					alt={book.bookCover ? `${book.title} cover` : 'Default Book Cover'}
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
						className={`size-1.5 rounded-full ${statusColor[book.status]}`}
					/>
					<span className="text-xxs font-mono text-muted tracking-wider uppercase">
						{statusLabel[book.status]} · {formatBookDate(book.updatedAt)}
					</span>
				</div>
			</div>
		</div>
	)
}
