import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideBookOpen, LucideLibrary, LucidePlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BookActivityCard } from '#/components/book-activity-card'
import { FinishedBookCard } from '#/components/finished-book-card'
import { GoalCard } from '#/components/goal-card'
import { ActivityModal } from '#/components/modals/activity-modal'
import { StatCard } from '#/components/stat-card'
import { Button, button } from '#/components/ui/button'
import { WeeklyChart } from '#/components/weekly-chart'
import { books } from '#/mocks/books'
import { useGoalStore } from '#/stores/goal-store'
import { getPercent } from '#/utils/get-percent'
import { sortByDateDesc } from '#/utils/sort-by-date'

export const Route = createFileRoute('/_authenticated/home')({
	component: Home,
})

interface WeeklyStats {
	pagesRead: number
	hoursRead: number
	daysStreak: number
}

type Book = (typeof books)[number]

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const weeklyStats: WeeklyStats = {
	pagesRead: 148,
	hoursRead: 126, // minutes
	daysStreak: 7,
}

function Home() {
	const { goal } = useGoalStore()
	const [activityOpen, setActivityOpen] = useState(false)

	const currentBook = useMemo(
		() =>
			sortByDateDesc(
				books.filter((b) => b.status === 'reading'),
				(b) => b.updatedAt,
			)[0],
		[],
	)

	const recentActivity = useMemo(
		() =>
			sortByDateDesc(
				books.filter((b) => b.id !== currentBook?.id),
				(b) => b.updatedAt,
			).slice(0, 3),
		[currentBook],
	)

	const recentFinishedBooks = useMemo(
		() =>
			sortByDateDesc(
				books.filter((b) => b.status === 'finished'),
				(b) => b.endDate ?? '',
			).slice(0, 3),
		[],
	)

	const hasStats = books.some((b) => b.currentPage > 0)

	return (
		<>
			<div className="min-h-[calc(100vh-69px)] overflow-hidden grid md:grid-cols-[268px_1fr_224px] lg:grid-cols-[300px_1fr_280px] md:divide-x divide-border">
				<div className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6 animate-fade-up [animation-delay:0.05s]">
					<div className="w-full flex items-baseline justify-between">
						<h2 className="font-serif font-semibold tracking-tight text-xl">
							Bookshelf
						</h2>
						<Link
							to="/books"
							className="uppercase text-muted text-xs transition-colors tracking-[0.06em] hover:text-accent"
						>
							View all
						</Link>
					</div>

					{currentBook ? (
						<CurrentBookCard book={currentBook} />
					) : (
						<CurrentBookEmptyState />
					)}

					{recentActivity.length > 0 && (
						<>
							<p className="text-xs text-muted font-medium uppercase tracking-widest">
								Recent Activity
							</p>

							<div className="-mt-3">
								{recentActivity.map((book) => (
									<BookActivityCard key={book.id} book={book} />
								))}
							</div>
						</>
					)}
				</div>

				<div className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6 animate-fade-up [animation-delay:0.12s]">
					<div className="w-full flex items-center justify-between">
						<h2 className="font-serif font-semibold tracking-tight text-xl">
							Weekly Stats
						</h2>
						<Button
							variant="primary"
							size="sm"
							onClick={() => setActivityOpen(true)}
						>
							<LucidePlus className="size-3 md:hidden lg:block" />
							Add Record
						</Button>
					</div>

					{hasStats ? <WeeklyStatsContent /> : <WeeklyStatsEmptyState />}
				</div>

				<div className="flex gap-6 flex-col justify-start px-5 lg:px-7 py-6 animate-fade-up [animation-delay:0.19s]">
					<h2 className="font-serif font-semibold tracking-tight text-xl">
						Finished
					</h2>

					{recentFinishedBooks.length > 0 ? (
						<div className="-mt-3">
							{recentFinishedBooks.map((book) => (
								<FinishedBookCard key={book.id} book={book} />
							))}
						</div>
					) : (
						<FinishedBooksEmptyState />
					)}

					<GoalCard goal={goal} />
				</div>
			</div>

			<ActivityModal
				open={activityOpen}
				onOpenChange={setActivityOpen}
				mode="add"
			/>
		</>
	)
}

function CurrentBookCard({ book }: { book: Book }) {
	const progress = getPercent(book.currentPage, book.totalPages)

	return (
		<div className="bg-surface border border-border rounded-xl overflow-hidden">
			<div className="h-0.5 bg-gradient-progress" />
			<div className="p-5 flex flex-col gap-3">
				<span className="text-accent text-xs uppercase tracking-widest font-medium">
					Currently Reading
				</span>

				<div className="flex gap-3.5 items-start">
					<img
						src={book.bookCover ?? '/book-cover.jpg'}
						alt={book.bookCover ? `${book.title} cover` : 'Default Book Cover'}
						className="w-13.5 h-19 rounded-md object-cover"
					/>

					<div className="flex flex-col flex-1">
						<span className="font-serif font-semibold leading-snug line-clamp-1">
							{book.title}
						</span>
						<span className="text-muted text-xs mt-0.5 mb-2.5 line-clamp-1">
							{book.author}
						</span>

						<div className="flex justify-between text-xs text-muted mb-1.5">
							<span>
								Page {book.currentPage} of {book.totalPages}
							</span>
							<span className="text-accent font-medium">{progress}%</span>
						</div>
						<div className="h-0.75 bg-surface2 rounded-full overflow-hidden">
							<div
								role="progressbar"
								aria-valuenow={Math.round(progress)}
								aria-valuemin={0}
								aria-valuemax={100}
								className="h-full bg-gradient-progress rounded-full"
								style={{
									width: `${progress}%`,
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function CurrentBookEmptyState() {
	return (
		<div className="bg-surface border border-dashed border-accent/25 rounded-xl p-5 transition-colors hover:border-accent/50">
			<span className="text-accent text-xs uppercase tracking-widest font-medium block mb-3">
				Currently Reading
			</span>
			<div className="flex gap-3.5 items-center">
				<div className="w-13.5 h-19 rounded-md border border-dashed border-white/10 flex items-center justify-center shrink-0">
					<LucideBookOpen className="size-5 text-white/15" />
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

function WeeklyStatsContent() {
	const hours = Math.floor(weeklyStats.hoursRead / 60)
	const readingTime = hours === 0 ? '~1h' : `~${hours}h`

	return (
		<>
			<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-1 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
				<StatCard
					value={weeklyStats.pagesRead}
					label="Pages read"
					textColor="text-accent"
					isEmpty={!weeklyStats.pagesRead}
				/>
				<StatCard
					value={readingTime}
					label="Hours read"
					textColor="text-accent2"
					isEmpty={!weeklyStats.hoursRead}
				/>
				<StatCard
					value={weeklyStats.daysStreak}
					label="Days streak"
					isEmpty={!weeklyStats.daysStreak}
				/>
			</div>

			<div className="flex flex-col gap-5 bg-surface rounded-xl border border-border p-4 lg:p-6">
				<p className="text-xs text-muted font-medium uppercase tracking-widest">
					Pages per day
				</p>
				<WeeklyChart />
			</div>

			<div className="flex items-center justify-between bg-surface rounded-xl border border-border py-5 px-4 lg:px-6">
				<div className="flex flex-col gap-1.5">
					<p className="text-xs text-muted uppercase tracking-widest">
						This week
					</p>
					<p className="text-sm font-serif text-muted lining-nums">
						<strong className="text-xl text-text">2 </strong>
						hrs <strong className="text-xl text-text">02 </strong>
						min
					</p>
				</div>
				<div className="flex flex-col text-right">
					<p className="text-xs text-muted">Most active day</p>
					<p className="text-sm font-mono text-accent2 font-medium">
						Tuesday ↑
					</p>
				</div>
			</div>
		</>
	)
}

function WeeklyStatsEmptyState() {
	return (
		<>
			<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-1 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
				<StatCard isEmpty label="Pages read" />
				<StatCard isEmpty label="Hours read" />
				<StatCard isEmpty label="Days streak" />
			</div>

			<div className="flex flex-col gap-5 bg-surface rounded-xl border border-border p-4 lg:p-6">
				<p className="text-xs text-muted font-medium uppercase tracking-widest">
					Pages per day
				</p>
				<div className="flex items-end gap-1 lg:gap-2.5 h-25">
					{WEEK_DAYS.map((day, i) => (
						<div key={day} className="flex flex-col items-center gap-2 flex-1">
							<div
								aria-hidden="true"
								className="w-full h-10 rounded-t bg-surface2 animate-pulse"
								style={{ animationDelay: `${i * 0.2}s` }}
							/>
							<span className="text-xs text-muted font-mono tracking-wider">
								{day}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="flex items-center justify-between bg-surface rounded-xl border border-border py-5 px-4 lg:px-6">
				<div className="flex flex-col gap-1.5">
					<p className="text-xs text-muted uppercase tracking-widest">
						This week
					</p>
					<p className="text-sm font-serif text-muted">
						<strong className="text-2xl text-white/15">-- </strong>
						hrs <strong className="text-2xl text-white/15">-- </strong>
						min
					</p>
				</div>
				<div className="flex flex-col text-right">
					<p className="text-xs text-muted">Most active day</p>
					<p className="text-sm font-mono text-white/15 font-medium">--</p>
				</div>
			</div>

			<p className="text-center text-xs text-text/50 tracking-wider -mt-2">
				Add your first reading record to see stats here.
			</p>
		</>
	)
}

function FinishedBooksEmptyState() {
	return (
		<div className="flex flex-col items-center text-center py-7 px-4 pb-8 border-b border-border -mt-3">
			<LucideLibrary className="size-12 text-muted mb-5" />
			<p className="font-serif font-semibold text-sm lg:text-base text-text/50 mb-1.5">
				No books finished yet
			</p>
			<p className="text-xs/relaxed text-muted max-w-47.5">
				Your completed reads will appear here. Every great library starts with
				one book.
			</p>
		</div>
	)
}
