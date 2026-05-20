import { LucideStar } from 'lucide-react'

interface FinishedBook {
	bookCover?: string
	title: string
	author: string
	rating: number
	date: string
}

interface FinishedBookCardProps {
	book: FinishedBook
}

export function FinishedBookCard({ book }: FinishedBookCardProps) {
	const stars = Array.from({ length: 5 }, (_, i) => i < book.rating)

	return (
		<div className="flex gap-3 py-3 border-b border-border transition-all duration-200 cursor-pointer hover:opacity-95">
			<div className="relative w-13 h-19.5 shrink-0 bg-surface2 rounded overflow-hidden flex items-center justify-center shadow-[3px_3px_12px_rgba(0,0,0,0.4)]">
				{book.bookCover ? (
					<img
						src={book.bookCover}
						alt={`${book.title} cover`}
						className="w-full h-full object-cover"
					/>
				) : null}
				{!book.bookCover && (
					<img
						src="/public/book-cover.jpg"
						alt="Default Book Cover"
						className="w-full h-full object-cover"
					/>
				)}
			</div>

			<div className="flex-1">
				<h3 className="text-sm font-semibold font-serif text-text mb-0.5 leading-snug hover:text-accent transition-colors duration-200">
					{book.title}
				</h3>
				<p className="text-xs text-muted mb-2">{book.author}</p>

				<div className="flex gap-0.5 mb-1">
					{stars.map((isFilled, i) => (
						<LucideStar
							// biome-ignore lint/suspicious/noArrayIndexKey: stars is a static derived array; order never changes
							key={i}
							size={12}
							className={isFilled ? 'fill-accent text-accent' : 'text-surface2'}
						/>
					))}
				</div>

				<p className="text-xxs text-muted font-mono">{book.date}</p>
			</div>
		</div>
	)
}
