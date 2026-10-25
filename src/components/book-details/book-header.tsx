import type { CSSProperties } from 'react'
import { BookStatusSelector } from '#/components/ui/inputs'
import type { Book } from '#/types/book'
import { getPercent } from '#/utils/get-percent'
import { BookMetadata } from './book-metadata'
import { RatingDisplay } from './rating-display'

interface BookHeaderProps {
	book: Book
	hasSessions: boolean
	elapsedDays: number | null
}

export function BookHeader({
	book,
	hasSessions,
	elapsedDays,
}: BookHeaderProps) {
	const progress = getPercent(book.currentPage, book.totalPages)
	const hasMetadata = Boolean(book.startedAt || book.completedAt)
	const metadataLayout = hasSessions
		? { beside: 'hidden min-[415px]:block', below: 'min-[415px]:hidden' }
		: { beside: 'hidden min-[493px]:block', below: 'min-[493px]:hidden' }

	return (
		<section className="animate-fade-up border-b border-border pb-7 [animation-delay:0.05s] motion-reduce:animate-none">
			<div className="flex items-start gap-5 md:gap-7">
				<div className="aspect-2/3 w-34 shrink-0 overflow-hidden rounded-lg border border-border bg-surface2 shadow-xl sm:w-36">
					<img
						src={book.coverUrl ?? '/book-cover.webp'}
						alt={book.coverUrl ? `${book.title} cover` : 'Default Book Cover'}
						className="h-full w-full object-cover"
					/>
				</div>

				<div className="flex min-w-0 flex-1 flex-col self-stretch">
					<h1 className="truncate font-serif text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
						{book.title}
					</h1>

					<div className="mt-2 mb-4 text-sm text-muted">
						<span className="mr-2">{book.author}</span>
						{book.genre && (
							<span className="inline-block rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide">
								{book.genre}
							</span>
						)}
					</div>

					<div className="mb-5 flex flex-wrap items-center gap-3">
						<BookStatusSelector readOnly value={book.status} />
						<RatingDisplay value={book.rating ?? 0} />
					</div>

					<div className="mt-auto max-w-xs">
						<div className="mb-2 flex justify-between gap-3 text-xs text-muted">
							<span>
								Page {book.currentPage} of {book.totalPages}
							</span>
							<span className="font-mono text-accent">{progress}%</span>
						</div>

						<div className="h-0.75 overflow-hidden rounded-full bg-surface3">
							<div
								role="progressbar"
								aria-label={`${book.title} reading progress`}
								aria-valuenow={Math.round(progress)}
								aria-valuemin={0}
								aria-valuemax={100}
								className="h-full w-(--progress) rounded-full bg-gradient-progress transition-[width] duration-700 ease-out starting:w-0 motion-reduce:transition-none"
								style={{ '--progress': `${progress}%` } as CSSProperties}
							/>
						</div>

						{/* Metadata beside the book information */}
						{hasMetadata && (
							<div className={`mt-4 ${metadataLayout.beside}`}>
								<BookMetadata
									startedAt={book.startedAt}
									completedAt={book.completedAt}
									elapsedDays={elapsedDays}
									showTimeTaken={!hasSessions}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Metadata below the entire book section on narrow screens */}
			{hasMetadata && (
				<div className={`mt-4 ${metadataLayout.below}`}>
					<BookMetadata
						startedAt={book.startedAt}
						completedAt={book.completedAt}
						elapsedDays={elapsedDays}
						showTimeTaken={!hasSessions}
					/>
				</div>
			)}
		</section>
	)
}
