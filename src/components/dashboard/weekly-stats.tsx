import type { WeeklyStats } from '#/types/dashboard'
import { formatReadingTime } from '#/utils/format-reading-time'
import { StatCard } from '../stat-card'
import { WeeklyChart } from './weekly-chart'

interface WeeklyStatsContentProps {
	weeklyStats: WeeklyStats
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyStatsContent({ weeklyStats }: WeeklyStatsContentProps) {
	const hours = Math.floor(weeklyStats.totalReadingMinutes / 60)
	const minutes = weeklyStats.totalReadingMinutes % 60
	const readingTime = formatReadingTime(
		weeklyStats.totalReadingMinutes,
		'hours',
	)

	return (
		<>
			<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-1 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
				<StatCard
					value={weeklyStats.totalPagesRead}
					label="Pages read"
					textColor="text-accent"
					isEmpty={!weeklyStats.totalPagesRead}
				/>
				<StatCard
					value={readingTime}
					label="Hours read"
					textColor="text-accent2"
					isEmpty={!weeklyStats.totalReadingMinutes}
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
				<WeeklyChart
					pagesByDay={weeklyStats.pagesByDay}
					mostActiveDay={weeklyStats.mostActiveDay}
				/>
			</div>

			<div className="flex items-center justify-between bg-surface rounded-xl border border-border py-5 px-4 lg:px-6">
				<div className="flex flex-col gap-1.5">
					<p className="text-xs text-muted uppercase tracking-widest">
						This week
					</p>
					<p className="text-sm font-serif text-muted lining-nums">
						<strong className="text-xl text-text">{hours} </strong>
						hrs{' '}
						<strong className="text-xl text-text">
							{String(minutes).padStart(2, '0')}{' '}
						</strong>
						min
					</p>
				</div>
				<div className="flex flex-col text-right">
					<p className="text-xs text-muted">Most active day</p>
					<p className="text-sm font-mono text-accent2 font-medium">
						{weeklyStats.mostActiveDay ? `${weeklyStats.mostActiveDay} ↑` : '—'}
					</p>
				</div>
			</div>
		</>
	)
}

export function WeeklyStatsEmptyState() {
	return (
		<>
			<div
				aria-hidden="true"
				className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-1 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1"
			>
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
