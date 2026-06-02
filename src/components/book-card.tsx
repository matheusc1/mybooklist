import { LucideStar } from 'lucide-react'
import type { ActivityStatus, Book } from '#/types/types'
import { getPercent } from '#/utils/get-percent'

interface BookCardProps {
	book: Book
}

const STATUS_COLORS: Record<ActivityStatus, string> = {
	reading: 'bg-accent2',
	'want-to-read': 'bg-mist',
	paused: 'bg-parchment',
	finished: 'bg-accent',
	abandoned: 'bg-danger',
}

function Stars({ rating }: { rating: number }) {
	return (
		<span className="flex items-center gap-0.5 shrink-0">
			{Array.from({ length: 5 }, (_, i) => (
				<LucideStar
					// biome-ignore lint/suspicious/noArrayIndexKey: static array
					key={i}
					className={`size-3 ${i < rating ? 'fill-accent text-accent' : 'fill-transparent text-muted'}`}
				/>
			))}
		</span>
	)
}

export function BookCard({ book }: BookCardProps) {
	const showProgress = book.status === 'reading' || book.status === 'paused'
	const showRating =
		book.status === 'finished' && !!book.rating && book.rating > 0

	const progress = getPercent(book.currentPage, book.totalPages)

	return (
		<div className="group cursor-pointer animate-fade-up">
			<div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-surface2 shadow-[4px_6px_20px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] duration-250 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-[6px_12px_32px_rgba(0,0,0,0.6)] mb-3">
				<img
					src={book.bookCover ?? '/book-cover.jpg'}
					alt={book.bookCover ? `${book.title} cover` : 'Default Book Cover'}
					className="w-full h-full object-cover"
				/>

				<span
					className={`absolute top-2 right-2 size-2 rounded-full shadow-[0_0_0_2px_rgba(12,12,14,0.8)] ${STATUS_COLORS[book.status]}`}
				/>

				{showProgress && (
					<div className="absolute bottom-0 left-0 right-0 h-0.75 bg-white/8">
						<div
							className="h-full bg-linear-to-r from-accent to-accent2"
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}

				<div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-end p-3">
					<span className="font-mono text-xs text-white/85 uppercase tracking-[0.08em]">
						View details →
					</span>
				</div>
			</div>

			<div>
				<p className="font-serif text-sm/[1.3] font-semibold truncate mb-0.5 transition-colors duration-200 group-hover:text-accent">
					{book.title}
				</p>
				<p className="text-xs text-muted truncate mb-1">{book.author}</p>
				<div className="flex items-center justify-between">
					<span className="font-mono text-xxs text-muted uppercase tracking-wider truncate max-w-[80%] mr-2">
						{book.genre}
					</span>
					{showRating && <Stars rating={book.rating as number} />}
				</div>
			</div>
		</div>
	)
}
