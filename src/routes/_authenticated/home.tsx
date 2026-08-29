import { createFileRoute, Link } from '@tanstack/react-router'
import { LucidePlus } from 'lucide-react'
import { useState } from 'react'
import { BookActivityCard } from '#/components/dashboard/book-activity-card'
import {
	CompletedBookCard,
	CompletedBooksEmptyState,
} from '#/components/dashboard/completed-book-card'
import {
	CurrentBookCard,
	CurrentBookEmptyState,
} from '#/components/dashboard/current-book-card'
import { DashboardSkeleton } from '#/components/dashboard/dashboard-skeleton'
import {
	WeeklyStatsContent,
	WeeklyStatsEmptyState,
} from '#/components/dashboard/weekly-stats'
import { GoalCard } from '#/components/goal-card'
import { ReadingSessionModal } from '#/components/modals/reading-session-modal'
import { Button } from '#/components/ui/button'
import { useDashboard } from '#/hooks/use-dashboard'
import { useGoal } from '#/hooks/use-goal'

export const Route = createFileRoute('/_authenticated/home')({
	component: Home,
})

function Home() {
	const { data: dashboard, isLoading } = useDashboard()
	const { data: goal } = useGoal()
	const [addSessionOpen, setAddSessionOpen] = useState(false)

	const currentlyReading = dashboard?.currentlyReading
	const recentActivity = dashboard?.recentActivity
	const lastCompletedBooks = dashboard?.lastCompleted
	const weeklyStats = dashboard?.weeklyStats

	const hasRecentActivity = (recentActivity?.length ?? 0) > 0
	const hasCompletedBooks = (lastCompletedBooks?.length ?? 0) > 0
	const hasWeeklyActivity = weeklyStats
		? weeklyStats.totalPagesRead > 0 || weeklyStats.totalReadingMinutes > 0
		: false

	if (isLoading) return <DashboardSkeleton />

	return (
		<main className="min-h-[calc(100vh-69px)] overflow-hidden grid md:grid-cols-[268px_1fr_224px] lg:grid-cols-[300px_1fr_280px] md:divide-x divide-border">
			<section
				aria-labelledby="bookshelf-heading"
				className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6 animate-fade-up [animation-delay:0.05s]"
			>
				<div className="w-full flex items-baseline justify-between">
					<h2
						id="bookshelf-heading"
						className="font-serif font-semibold tracking-tight text-xl"
					>
						Bookshelf
					</h2>
					<Link
						to="/books"
						aria-label="View all books"
						className="uppercase text-muted text-xs transition-colors tracking-[0.06em] hover:text-accent"
					>
						View all
					</Link>
				</div>

				{currentlyReading ? (
					<CurrentBookCard book={currentlyReading} />
				) : (
					<CurrentBookEmptyState />
				)}

				{hasRecentActivity && (
					<>
						<h3 className="text-xs text-muted font-medium uppercase tracking-widest">
							Recent Activity
						</h3>

						<ul className="-mt-3">
							{recentActivity?.map((book) => (
								<li
									key={book.id}
									className="border-b border-border last:border-b-0"
								>
									<BookActivityCard book={book} />
								</li>
							))}
						</ul>
					</>
				)}
			</section>

			<section
				aria-labelledby="weekly-stats-heading"
				className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6 animate-fade-up [animation-delay:0.12s]"
			>
				<div className="w-full flex items-center justify-between">
					<h2
						id="weekly-stats-heading"
						className="font-serif font-semibold tracking-tight text-xl"
					>
						Weekly Stats
					</h2>
					<Button
						variant="primary"
						size="sm"
						onClick={() => setAddSessionOpen(true)}
					>
						<LucidePlus
							aria-hidden="true"
							className="size-3 md:hidden lg:block"
						/>
						Add Record
					</Button>
				</div>

				{hasWeeklyActivity && weeklyStats ? (
					<WeeklyStatsContent weeklyStats={weeklyStats} />
				) : (
					<WeeklyStatsEmptyState />
				)}
			</section>

			<section
				aria-labelledby="completed-heading"
				className="flex gap-6 flex-col justify-start px-5 lg:px-7 py-6 animate-fade-up [animation-delay:0.19s]"
			>
				<h2
					id="completed-heading"
					className="font-serif font-semibold tracking-tight text-xl"
				>
					Completed
				</h2>

				{hasCompletedBooks ? (
					<ul className="-mt-3">
						{lastCompletedBooks?.map((book) => (
							<li key={book.id}>
								<CompletedBookCard book={book} />
							</li>
						))}
					</ul>
				) : (
					<CompletedBooksEmptyState />
				)}

				<GoalCard goal={goal} />
			</section>

			{addSessionOpen && (
				<ReadingSessionModal
					key="add"
					open={addSessionOpen}
					onOpenChange={setAddSessionOpen}
					mode="add"
				/>
			)}
		</main>
	)
}
