import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
	LucideBookOpen,
	LucidePencil,
	LucidePlus,
	LucideTrash2,
} from 'lucide-react'
import type { ComponentProps, CSSProperties } from 'react'
import { useState } from 'react'
import { BackLink } from '#/components/book-details/back-link'
import { BookMetadata } from '#/components/book-details/book-metadata'
import { RatingDisplay } from '#/components/book-details/rating-display'
import { BookModal } from '#/components/modals/book-modal'
import { DeleteModal } from '#/components/modals/delete-modal'
import { ReadingSessionModal } from '#/components/modals/reading-session-modal'
import { StatCard } from '#/components/stat-card'
import { Button } from '#/components/ui/button'
import { BookStatusSelector, Textarea } from '#/components/ui/inputs'
import { MAX_NOTES_LENGTH } from '#/constants/book'
import { useBookDetails } from '#/hooks/use-book-details'
import { useDeleteReadingSession } from '#/hooks/use-reading-sessions'
import type { ModalMode } from '#/types/common'
import { formatShortDate } from '#/utils/format-date'
import { formatReadingTime } from '#/utils/format-reading-time'
import { getPercent } from '#/utils/get-percent'
import { sortByDateDesc } from '#/utils/sort-by-date'

export const Route = createFileRoute('/_authenticated/books_/$bookId')({
	head: () => ({
		meta: [{ title: 'Book Details | MyBookList' }],
	}),
	component: BookDetailsPage,
})

type ModalSession = NonNullable<
	ComponentProps<typeof ReadingSessionModal>['session']
>

const STAT_DELAYS = [
	'[animation-delay:0.1s]',
	'[animation-delay:0.14s]',
	'[animation-delay:0.18s]',
	'[animation-delay:0.22s]',
]

function getDaysBetween(start: string, end: string) {
	const startDate = new Date(`${start}T12:00:00`)
	const endDate = new Date(`${end}T12:00:00`)

	return Math.max(
		1,
		Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000),
	)
}

function getElapsedDays(startedAt: string | null, completedAt: string | null) {
	if (!startedAt || !completedAt) return null
	return getDaysBetween(startedAt, completedAt)
}

function BookDetailsPage() {
	const { bookId } = Route.useParams()
	const navigate = useNavigate()
	const { data: bookDetails, isLoading, isError } = useBookDetails(bookId)

	const [isEditOpen, setIsEditOpen] = useState(false)

	const [sessionModal, setSessionModal] = useState<{
		session?: ModalSession
		mode: ModalMode
	} | null>(null)

	const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)

	const { mutate: deleteSession, isPending: isDeleting } =
		useDeleteReadingSession()

	if (isLoading) {
		return (
			<main className="mx-auto min-h-[calc(100vh-69px)] w-full max-w-275 p-5 lg:p-10">
				<div className="animate-pulse space-y-8">
					<div className="h-4 w-24 rounded bg-surface2" />
					<div className="flex gap-6">
						<div className="aspect-2/3 w-24 rounded-lg bg-surface2 md:w-33" />
						<div className="flex-1 space-y-4">
							<div className="h-3 w-20 rounded bg-surface2" />
							<div className="h-8 max-w-80 rounded bg-surface2" />
							<div className="h-4 max-w-48 rounded bg-surface2" />
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
						{Array.from({ length: 4 }, (_, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: static
								key={index}
								className="h-20 rounded-xl border border-border bg-surface"
							/>
						))}
					</div>
				</div>
			</main>
		)
	}

	if (isError || !bookDetails) {
		return (
			<main className="mx-auto min-h-[calc(100vh-69px)] max-w-275 p-5 lg:p-10">
				<BackLink className="text-sm text-muted transition-colors hover:text-accent" />
				<div className="mt-12 text-center">
					<h1 className="font-serif text-xl font-semibold">
						Unable to load book
					</h1>
					<p className="mt-2 text-sm text-muted">
						The book could not be loaded. Please try again later.
					</p>
				</div>
			</main>
		)
	}

	const { book, readingSessions, stats } = bookDetails

	const progress = getPercent(book.currentPage, book.totalPages)

	const hasSessions = readingSessions.length > 0
	const sortedSessions = sortByDateDesc(
		readingSessions,
		(session) => session.readAt,
	)

	const elapsedDays = getElapsedDays(book.startedAt, book.completedAt)

	const statCards = [
		{
			label: 'Total reading time',
			value: formatReadingTime(stats.readingTime),
			textColor: 'text-accent',
		},
		{ label: 'Sessions', value: stats.sessions },
		{
			label: 'Days with sessions',
			value: stats.activeDays,
			textColor: 'text-accent2',
		},
		...(elapsedDays !== null
			? [{ label: 'Days it took', value: elapsedDays }]
			: []),
	]

	const hasMetadata = Boolean(book.startedAt || book.completedAt)
	const metadataLayout = hasSessions
		? { beside: 'hidden min-[415px]:block', below: 'min-[415px]:hidden' }
		: { beside: 'hidden min-[493px]:block', below: 'min-[493px]:hidden' }

	const sessionsDelay = hasSessions
		? '[animation-delay:0.2s]'
		: '[animation-delay:0.1s]'
	const notesDelay = hasSessions
		? '[animation-delay:0.26s]'
		: '[animation-delay:0.16s]'

	function openEditSession(session: (typeof readingSessions)[number]) {
		setSessionModal({
			mode: 'edit',
			session: {
				id: session.id,
				bookId: String(book.id),
				date: session.readAt,
				fromPage: session.fromPage,
				toPage: session.toPage,
			},
		})
	}

	return (
		<>
			<main className="mx-auto min-h-[calc(100vh-69px)] w-full max-w-275 space-y-7 px-5 py-6 pb-10 lg:space-y-8 lg:px-10 lg:py-8">
				<div className="flex items-center justify-between gap-3">
					<BackLink className="inline-block font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent" />

					<Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
						<LucidePencil aria-hidden="true" className="size-3.5" />
						Edit book
					</Button>
				</div>

				<section className="animate-fade-up border-b border-border pb-7 [animation-delay:0.05s] motion-reduce:animate-none">
					<div className="flex items-start gap-5 md:gap-7">
						<div className="aspect-2/3 w-34 shrink-0 overflow-hidden rounded-lg border border-border bg-surface2 shadow-xl sm:w-36">
							<img
								src={book.coverUrl ?? '/book-cover.webp'}
								alt={
									book.coverUrl ? `${book.title} cover` : 'Default Book Cover'
								}
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

				{hasSessions && (
					<section
						aria-label="Reading statistics"
						className={`grid grid-cols-2 gap-3 ${
							book.completedAt
								? 'md:grid-cols-4'
								: 'sm:grid-cols-3 [&>*:last-child]:col-span-2 [&>*:last-child]:sm:col-span-1'
						}`}
					>
						{statCards.map((card, index) => (
							<div
								key={card.label}
								className={`animate-fade-up motion-reduce:animate-none *:h-full ${STAT_DELAYS[index]}`}
							>
								<StatCard {...card} />
							</div>
						))}
					</section>
				)}

				{/* Sessions and notes */}
				<div
					className={`grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7 ${
						hasSessions ? '' : 'lg:mt-0'
					}`}
				>
					<section
						aria-labelledby="sessions-heading"
						className={`min-w-0 animate-fade-up motion-reduce:animate-none ${sessionsDelay}`}
					>
						{hasSessions ? (
							<>
								<div className="mb-4 flex items-center justify-between gap-3">
									<div className="flex min-w-0 items-baseline gap-3">
										<h2
											id="sessions-heading"
											className="font-serif text-xl font-semibold tracking-tight"
										>
											Sessions
										</h2>

										<span className="font-mono text-[10px] text-muted sm:text-xs">
											{sortedSessions.length} logged
											<span className="hidden sm:inline"> · newest first</span>
										</span>
									</div>

									<Button
										size="sm"
										onClick={() => setSessionModal({ mode: 'add' })}
									>
										<LucidePlus aria-hidden="true" className="size-3.5" />
										Log session
									</Button>
								</div>

								<div className="overflow-hidden rounded-xl border border-border bg-surface">
									<div className="hidden grid-cols-[96px_minmax(0,1fr)_84px_80px_64px] gap-3 bg-surface2 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted md:grid">
										<span>Date</span>
										<span>Pages</span>
										<span>Read</span>
										<span className="text-right">Time</span>
										<span />
									</div>

									<ul className="divide-y divide-border">
										{sortedSessions.map((session) => {
											const pagesRead = Math.max(
												0,
												session.toPage - session.fromPage + 1,
											)
											const durationMinutes = Math.round(
												session.durationSeconds / 60,
											)

											return (
												<li
													key={session.id}
													className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-sm transition-colors duration-150 hover:bg-surface2/60 focus-within:bg-surface2/60 motion-reduce:transition-none md:grid-cols-[96px_minmax(0,1fr)_84px_80px_64px] md:gap-3"
												>
													<span className="col-start-1 row-start-1 font-mono text-xs text-muted md:col-auto md:row-auto">
														{formatShortDate(session.readAt)}
													</span>

													<div className="col-start-1 row-start-2 flex items-baseline gap-2 md:contents">
														<span className="font-mono text-xs">
															pp. {session.fromPage}-{session.toPage}
														</span>
														<span
															aria-hidden="true"
															className="text-muted md:hidden"
														>
															·
														</span>
														<span className="text-xs text-accent md:text-sm">
															{pagesRead} pages
														</span>
													</div>

													<span
														className={`col-start-2 row-start-2 text-right font-mono text-xs md:col-auto md:row-auto ${
															durationMinutes > 0
																? 'text-accent2'
																: 'text-muted'
														}`}
													>
														{durationMinutes > 0
															? formatReadingTime(durationMinutes)
															: '—'}
													</span>

													<div className="col-start-2 row-start-1 flex justify-end gap-1 md:col-auto md:row-auto">
														<button
															type="button"
															title="Edit session"
															aria-label={`Edit session from ${formatShortDate(session.readAt)}`}
															onClick={() => openEditSession(session)}
															className="cursor-pointer flex size-7 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface3 hover:text-text"
														>
															<LucidePencil className="size-3.5" />
														</button>
														<button
															type="button"
															title="Delete session"
															aria-label={`Delete session from ${formatShortDate(session.readAt)}`}
															onClick={() => setSessionToDelete(session.id)}
															className="cursor-pointer flex size-7 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-danger/35 hover:bg-danger/10 hover:text-danger"
														>
															<LucideTrash2 className="size-3.5" />
														</button>
													</div>
												</li>
											)
										})}
									</ul>
								</div>
							</>
						) : (
							<div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center sm:py-16">
								<LucideBookOpen
									aria-hidden="true"
									className="mb-4 size-9 text-muted/40"
								/>
								<h2
									id="sessions-heading"
									className="font-serif text-lg font-semibold text-text/60"
								>
									No sessions logged for this book
								</h2>
								<p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">
									Sessions you log will show up here, along with time and pages
									read.
								</p>
								<Button
									className="mt-5"
									size="sm"
									onClick={() => setSessionModal({ mode: 'add' })}
								>
									<LucidePlus aria-hidden="true" className="size-3.5" />
									Log session
								</Button>
							</div>
						)}
					</section>

					<aside
						className={`min-w-0 animate-fade-up motion-reduce:animate-none lg:sticky lg:top-24 ${notesDelay}`}
					>
						<div className="mb-4 flex items-baseline justify-between">
							<h2 className="font-serif text-xl font-semibold tracking-tight">
								Notes
							</h2>
							<span className="font-mono text-[10px] text-muted">Private</span>
						</div>

						<Textarea
							value={book.notes ?? ''}
							maxLength={MAX_NOTES_LENGTH}
							readOnly
							aria-label="Book notes"
							placeholder="No notes yet. Use Edit book to add some."
							className="min-h-56 resize-y text-sm leading-relaxed"
						/>
					</aside>
				</div>
			</main>

			{isEditOpen && (
				<BookModal
					open
					onOpenChange={setIsEditOpen}
					mode="edit"
					book={book}
					onDeleted={() => navigate({ to: '/books', replace: true })}
				/>
			)}

			{sessionModal && (
				<ReadingSessionModal
					open
					onOpenChange={(open) => {
						if (!open) setSessionModal(null)
					}}
					mode={sessionModal.mode}
					session={sessionModal.session}
					defaultBook={{ id: String(book.id), currentPage: book.currentPage }}
					isLastSession={readingSessions.length === 1}
				/>
			)}

			{sessionToDelete && (
				<DeleteModal
					open
					onOpenChange={(open) => {
						if (!open) setSessionToDelete(null)
					}}
					type="session"
					bookTitle={book.title}
					isLastSession={readingSessions.length === 1}
					pending={isDeleting}
					onConfirm={(resetToPlanned) =>
						deleteSession(
							{ id: sessionToDelete, resetToPlanned },
							{ onSuccess: () => setSessionToDelete(null) },
						)
					}
				/>
			)}
		</>
	)
}
