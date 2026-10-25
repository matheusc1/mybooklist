import type { ReadingSession } from '#/types/reading-session'
import { BookNotes } from './book-notes'
import { ReadingSessions } from './reading-sessions'

interface SessionsAndNotesProps {
	sessions: ReadingSession[]
	notes: string | null
	onAddSession: () => void
	onEditSession: (session: ReadingSession) => void
	onDeleteSession: (sessionId: string) => void
}

export function SessionsAndNotes({
	sessions,
	notes,
	onAddSession,
	onEditSession,
	onDeleteSession,
}: SessionsAndNotesProps) {
	const hasSessions = sessions.length > 0
	const sessionsDelay = hasSessions
		? '[animation-delay:0.2s]'
		: '[animation-delay:0.1s]'
	const notesDelay = hasSessions
		? '[animation-delay:0.26s]'
		: '[animation-delay:0.16s]'

	return (
		<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7">
			<ReadingSessions
				sessions={sessions}
				onAddSession={onAddSession}
				onEditSession={onEditSession}
				onDeleteSession={onDeleteSession}
				className={sessionsDelay}
			/>
			<BookNotes notes={notes} className={notesDelay} />
		</div>
	)
}
