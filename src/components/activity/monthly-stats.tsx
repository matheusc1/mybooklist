import { StatCard } from '#/components/stat-card'
import type { Activity } from '#/types/activity'
import { formatReadingTime } from '#/utils/format-reading-time'

type Stats = Activity['monthlyStats']

export function MonthlyStats({ monthlyStats }: { monthlyStats?: Stats }) {
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
