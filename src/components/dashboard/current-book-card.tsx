import { Link } from '@tanstack/react-router'
import { LucideBookOpen } from 'lucide-react'
import type { Book } from '#/types/book'
import { getPercent } from '#/utils/get-percent'
import { button } from '../ui/button'

export function CurrentBookCard({ book }: { book: Book }) {
	const progress = getPercent(book.currentPage ?? 0, book.totalPages)

	return (
		<div className="bg-surface border border-border rounded-xl overflow-hidden">
			<div className="h-0.5 bg-gradient-progress" />
			<div className="p-5 flex flex-col gap-3">
				<span className="text-accent text-xs uppercase tracking-widest font-medium">
					Currently Reading
				</span>

				<div className="flex gap-3.5 items-start">
					<img
						src={book.coverUrl ?? '/book-cover.jpg'}
						alt={book.coverUrl ? `${book.title} cover` : 'Default Book Cover'}
						className="w-13.5 h-19 rounded-md object-cover"
					/>

					<div className="flex flex-col flex-1">
						<h3 className="font-serif font-semibold leading-snug line-clamp-1">
							{book.title}
						</h3>
						<p className="text-muted text-xs mt-0.5 mb-2.5 line-clamp-1">
							{book.author}
						</p>

						<div className="flex justify-between text-xs text-muted mb-1.5">
							<span>
								Page {book.currentPage} of {book.totalPages}
							</span>
							<span className="text-accent font-medium">{progress}%</span>
						</div>
						<div className="h-0.75 bg-surface2 rounded-full overflow-hidden">
							<div
								role="progressbar"
								aria-label={`${book.title} reading progress`}
								aria-valuenow={Math.round(progress)}
								aria-valuemin={0}
								aria-valuemax={100}
								className="h-full bg-gradient-progress rounded-full"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function CurrentBookEmptyState() {
	return (
		<div className="bg-surface border border-dashed border-accent/25 rounded-xl p-5 transition-colors hover:border-accent/50">
			<span className="text-accent text-xs uppercase tracking-widest font-medium block mb-3">
				Currently Reading
			</span>
			<div className="flex gap-3.5 items-center">
				<div className="w-13.5 h-19 rounded-md border border-dashed border-white/10 flex items-center justify-center shrink-0">
					<LucideBookOpen aria-hidden="true" className="size-5 text-white/15" />
				</div>
				<div className="flex flex-col flex-1 gap-2.5">
					<p className="text-xs/normal text-muted">
						You're not tracking any book right now.
					</p>
					<Link
						to="/books"
						className={button({
							variant: 'dashed',
							className: 'self-start px-4 py-1.5 text-xs',
						})}
					>
						Start tracking
					</Link>
				</div>
			</div>
		</div>
	)
}
