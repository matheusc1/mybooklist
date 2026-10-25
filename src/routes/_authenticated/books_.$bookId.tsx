import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LucidePencil } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { BackLink } from '#/components/book-details/back-link'
import { BookHeader } from '#/components/book-details/book-header'
import { BookNotes } from '#/components/book-details/book-notes'
import { BookStats } from '#/components/book-details/book-stats'
import { BookDetailsError } from '#/components/book-details/error'
import { ReadingSessions } from '#/components/book-details/reading-sessions'
import { BookDetailsSkeleton } from '#/components/book-details/skeleton'
import { BookModal } from '#/components/modals/book-modal'
import { DeleteModal } from '#/components/modals/delete-modal'
import { ReadingSessionModal } from '#/components/modals/reading-session-modal'
import { Button } from '#/components/ui/button'
import { useBookDetails } from '#/hooks/use-book-details'
import { useDeleteReadingSession } from '#/hooks/use-reading-sessions'
import type { ModalMode } from '#/types/common'
import { getElapsedDays } from '#/utils/format-date'
import { sortByDateDesc } from '#/utils/sort-by-date'

type ModalSession = NonNullable<
	ComponentProps<typeof ReadingSessionModal>['session']
>

export const Route = createFileRoute('/_authenticated/books_/$bookId')({
	head: () => ({
		meta: [{ title: 'Book Details | MyBookList' }],
	}),
	component: BookDetailsPage,
})

function BookDetailsPage() {
	const { bookId } = Route.useParams()
	const navigate = useNavigate()
	const { data: bookDetails, isLoading, isError } = useBookDetails(bookId)
	const { mutate: deleteSession, isPending: isDeleting } =
		useDeleteReadingSession()

	const [isEditOpen, setIsEditOpen] = useState(false)
	const [sessionModal, setSessionModal] = useState<{
		session?: ModalSession
		mode: ModalMode
	} | null>(null)
	const [sessionToDeleteId, setSessionToDeleteId] = useState<string | null>(
		null,
	)

	if (isLoading) {
		return <BookDetailsSkeleton />
	}

	if (isError || !bookDetails) {
		return <BookDetailsError />
	}

	const { book, readingSessions, stats } = bookDetails

	const hasSessions = readingSessions.length > 0
	const isLastSession = readingSessions.length === 1
	const sortedSessions = sortByDateDesc(
		readingSessions,
		(session) => session.readAt,
	)
	const elapsedDays = getElapsedDays(book.startedAt, book.completedAt)

	function handleEditSession(session: (typeof readingSessions)[number]) {
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

	const sessionsDelay = hasSessions
		? '[animation-delay:0.2s]'
		: '[animation-delay:0.1s]'
	const notesDelay = hasSessions
		? '[animation-delay:0.26s]'
		: '[animation-delay:0.16s]'

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

				<BookHeader
					book={book}
					hasSessions={hasSessions}
					elapsedDays={elapsedDays}
				/>

				{hasSessions && <BookStats stats={stats} elapsedDays={elapsedDays} />}

				<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7">
					<ReadingSessions
						sessions={sortedSessions}
						onAddSession={() => setSessionModal({ mode: 'add' })}
						onEditSession={handleEditSession}
						onDeleteSession={setSessionToDeleteId}
						className={sessionsDelay}
					/>

					<BookNotes notes={book.notes} className={notesDelay} />
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
					isLastSession={isLastSession}
				/>
			)}

			{sessionToDeleteId && (
				<DeleteModal
					open
					onOpenChange={(open) => {
						if (!open) setSessionToDeleteId(null)
					}}
					type="session"
					bookTitle={book.title}
					isLastSession={isLastSession}
					pending={isDeleting}
					onConfirm={(resetToPlanned) =>
						deleteSession(
							{ id: sessionToDeleteId, resetToPlanned },
							{ onSuccess: () => setSessionToDeleteId(null) },
						)
					}
				/>
			)}
		</>
	)
}
