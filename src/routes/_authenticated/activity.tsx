import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Calendar } from '#/components/calendar'
import { SessionModal } from '#/components/modals/session-modal'
import { StatCard } from '#/components/stat-card'
import { useActivity } from '#/hooks/use-activity'
import type { Activity as ActivityType } from '#/types/activity'
import { formatReadingTime } from '#/utils/format-reading-time'

export const Route = createFileRoute('/_authenticated/activity')({
	component: Activity,
})

type Stats = ActivityType['monthlyStats']

const today = new Date()

function Activity() {
	const [view, setView] = useState({
		year: today.getFullYear(),
		month: today.getMonth(),
	})
	const [selectedDate, setSelectedDate] = useState<string | null>(null)

	const monthParam = `${view.year}-${String(view.month + 1).padStart(2, '0')}`
	const { data: activity } = useActivity(monthParam)

	const monthlyStats = activity?.monthlyStats
	const calendar = activity?.monthlyActivity ?? []
	const selectedSessions =
		calendar.find((d) => d.date === selectedDate)?.sessions ?? []

	const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
	}).format(new Date(view.year, view.month))

	return (
		<main className="min-h-[calc(100vh-69px)] w-full max-w-250 mx-auto p-5 lg:p-10 space-y-10">
			<div className="space-y-1.5 animate-fade-up [animation-delay:0.05s]">
				<p className="font-mono text-xs text-accent uppercase tracking-widest">
					History
				</p>
				<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
					Activity
				</h1>
				<p className="text-muted text-xs tracking-wider">{currentMonthLabel}</p>
			</div>

			<ActivityStatsContent monthlyStats={monthlyStats} />

			<div className="animate-fade-up [animation-delay:0.15s]">
				<Calendar
					calendar={calendar}
					year={view.year}
					month={view.month}
					onMonthChange={(year, month) => setView({ year, month })}
					onDayClick={(date) => setSelectedDate(date)}
				/>
			</div>

			<SessionModal
				open={selectedDate !== null}
				onClose={() => setSelectedDate(null)}
				date={selectedDate ?? ''}
				sessions={selectedSessions}
			/>
		</main>
	)
}

function ActivityStatsContent({ monthlyStats }: { monthlyStats?: Stats }) {
	const readingTime = formatReadingTime(monthlyStats?.readingTime ?? 0)

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 animate-fade-up [animation-delay:0.1s]">
			<StatCard
				value={monthlyStats?.sessions}
				isEmpty={!monthlyStats?.sessions}
				label="Sessions this month"
				textColor="text-accent"
			/>
			<StatCard
				value={monthlyStats?.pages}
				isEmpty={!monthlyStats?.pages}
				label="Pages this month"
			/>
			<StatCard
				value={readingTime}
				isEmpty={!monthlyStats?.readingTime}
				label="Reading time"
				textColor="text-accent2"
			/>
			<StatCard
				value={monthlyStats?.activeDays}
				isEmpty={!monthlyStats?.activeDays}
				label="Active Days"
			/>
		</div>
	)
}
