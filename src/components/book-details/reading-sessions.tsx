import {
	LucideBookOpen,
	LucidePencil,
	LucidePlus,
	LucideTrash2,
} from 'lucide-react'
import type { ReadingSession } from '#/types/reading-session'
import { formatShortDate } from '#/utils/format-date'
import { formatReadingTime } from '#/utils/format-reading-time'
import { Button } from '../ui/button'

interface ReadingSessionsProps {
	sessions: ReadingSession[]
	onAddSession: () => void
	onEditSession: (session: ReadingSession) => void
	onDeleteSession: (sessionId: string) => void
	className?: string
}

export function ReadingSessions({
	sessions,
	onAddSession,
	onEditSession,
	onDeleteSession,
	className = '',
}: ReadingSessionsProps) {
	return (
		<section
			aria-labelledby="sessions-heading"
			className={`min-w-0 animate-fade-up motion-reduce:animate-none ${className}`}
		>
			{sessions.length > 0 ? (
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
								{sessions.length} logged
								<span className="hidden sm:inline"> · newest first</span>
							</span>
						</div>

						<Button size="sm" onClick={onAddSession}>
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
							{sessions.map((session) => {
								const pagesRead = Math.max(
									0,
									session.toPage - session.fromPage + 1,
								)
								const durationMinutes = Math.round(session.durationSeconds / 60)
								const formattedDate = formatShortDate(session.readAt)

								return (
									<li
										key={session.id}
										className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-sm transition-colors duration-150 hover:bg-surface2/60 focus-within:bg-surface2/60 motion-reduce:transition-none md:grid-cols-[96px_minmax(0,1fr)_84px_80px_64px] md:gap-3"
									>
										<span className="col-start-1 row-start-1 font-mono text-xs text-muted md:col-auto md:row-auto">
											{formattedDate}
										</span>

										<div className="col-start-1 row-start-2 flex items-baseline gap-2 md:contents">
											<span className="font-mono text-xs">
												pp. {session.fromPage}-{session.toPage}
											</span>
											<span aria-hidden="true" className="text-muted md:hidden">
												·
											</span>
											<span className="text-xs text-accent md:text-sm">
												<span className="text-xs text-accent md:text-sm">
													{pagesRead} {pagesRead === 1 ? 'page' : 'pages'}
												</span>
											</span>
										</div>

										<span
											className={`col-start-2 row-start-2 text-right font-mono text-xs md:col-auto md:row-auto ${
												durationMinutes > 0 ? 'text-accent2' : 'text-muted'
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
												aria-label={`Edit session from ${formattedDate}`}
												onClick={() => onEditSession(session)}
												className="cursor-pointer flex size-7 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface3 hover:text-text"
											>
												<LucidePencil aria-hidden="true" className="size-3.5" />
											</button>
											<button
												type="button"
												title="Delete session"
												aria-label={`Delete session from ${formattedDate}`}
												onClick={() => onDeleteSession(session.id)}
												className="cursor-pointer flex size-7 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-danger/35 hover:bg-danger/10 hover:text-danger"
											>
												<LucideTrash2 aria-hidden="true" className="size-3.5" />
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
						Sessions you log will show up here, along with time and pages read.
					</p>
					<Button className="mt-5" size="sm" onClick={onAddSession}>
						<LucidePlus aria-hidden="true" className="size-3.5" />
						Log session
					</Button>
				</div>
			)}
		</section>
	)
}
