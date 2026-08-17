import { LucideArrowRight, LucideMoon, LucideTimer } from 'lucide-react'
import { useState } from 'react'
import type { Activity } from '#/types/activity'
import { formatBookDate } from '#/utils/format-date'
import { Button } from '../ui/button'
import { Modal } from '../ui/modal'
import { ActivityModal } from './activity-modal'

type Session = Activity['monthlyActivity'][number]['sessions'][number]

interface SessionModalProps {
	open: boolean
	date: string
	sessions: Session[]
	onClose: () => void
}

export function SessionModal({
	open,
	date,
	sessions,
	onClose,
}: SessionModalProps) {
	const [selectedSession, setSelectedSession] = useState<Session | null>(null)
	const [addOpen, setAddOpen] = useState(false)

	return (
		<>
			<Modal.Root open={open} onOpenChange={(v) => !v && onClose()} size="md">
				<Modal.Header eyebrow="Reading sessions" title={formatBookDate(date)} />

				<SessionModalBody
					sessions={sessions}
					onSessionClick={setSelectedSession}
				/>

				<Modal.Footer>
					<Button
						variant="dashed"
						className="w-full text-sm"
						onClick={() => setAddOpen(true)}
					>
						Log a session for this day
					</Button>
				</Modal.Footer>
			</Modal.Root>

			<ActivityModal
				open={!!selectedSession}
				onOpenChange={(v) => !v && setSelectedSession(null)}
				mode="view"
				session={selectedSession ? { ...selectedSession, date } : undefined}
			/>

			<ActivityModal open={addOpen} onOpenChange={setAddOpen} mode="add" />
		</>
	)
}

function SessionModalBody({
	sessions,
	onSessionClick,
}: {
	sessions: Session[]
	onSessionClick: (session: Session) => void
}) {
	return (
		<Modal.Body>
			<div className="space-y-2.5">
				{sessions.length > 0 ? (
					sessions.map((session, index) => (
						<SessionCard
							key={session.bookId}
							session={session}
							index={index + 1}
							onClick={onSessionClick}
						/>
					))
				) : (
					<div className="flex flex-col items-center justify-center text-center">
						<LucideMoon
							aria-hidden="true"
							className="size-12 text-muted mb-4 stroke-1"
						/>
						<h3 className="font-serif font-semibold mb-1">
							No sessions logged
						</h3>
						<p className="text-muted text-xs/relaxed max-w-50">
							You didn't log any reading for this day.
						</p>
					</div>
				)}
			</div>
		</Modal.Body>
	)
}

function SessionCard({
	session,
	index,
	onClick,
}: {
	session: Session
	index: number
	onClick: (session: Session) => void
}) {
	return (
		<button
			type="button"
			onClick={() => onClick(session)}
			aria-label={`${session.title} by ${session.author}, pages ${session.fromPage}-${session.toPage}, ${session.duration} minutes`}
			className="group bg-surface2 border flex items-center gap-3 rounded-xl py-3 px-4 border-border hover:bg-surface3 hover:border-accent/30 hover:translate-x-0.75 cursor-pointer transition-all w-full text-left appearance-none"
		>
			<img
				src={session.coverUrl ?? '/book-cover.jpg'}
				alt={session.coverUrl ? `${session.title} cover` : 'Default Book Cover'}
				className="w-10 h-15 object-cover rounded-sm"
			/>

			<div className="flex-1 space-y-2.5">
				<div className="space-y-0.5">
					<p className="font-serif font-semibold text-sm line-clamp-1">
						{session.title}
					</p>
					<p className="text-muted text-xs line-clamp-1">{session.author}</p>
				</div>

				<div className="flex gap-2.5 font-mono text-xxs uppercase tracking-wider">
					<p className="text-accent">
						PP. {session.fromPage}-{session.toPage}
					</p>
					<div className="flex items-center text-accent2 gap-1">
						<LucideTimer aria-hidden="true" className="size-3" />
						{session.duration}min
					</div>
				</div>
			</div>

			<sup className="font-mono text-xxs self-start mt-0.5 text-text/50">
				#{index}
			</sup>
			<LucideArrowRight
				aria-hidden="true"
				className="size-5 text-muted transition-transform group-hover:text-accent group-hover:translate-x-0.75"
			/>
		</button>
	)
}
