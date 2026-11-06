import type { YearlyOverview } from '#/types/yearly-overview'
import { formatReadingTime } from '#/utils/format-reading-time'
import { StatCard } from '../stat-card'

interface YearlyStatsProps {
	stats: YearlyOverview['yearlyStats']
}

export function YearlyStats({ stats }: YearlyStatsProps) {
	const statCards = [
		{ label: 'Sessions', value: stats.sessions, isEmpty: stats.sessions === 0 },
		{
			label: 'Pages',
			value: stats.pages,
			textColor: 'text-accent',
			isEmpty: stats.pages === 0,
		},
		{
			label: 'Reading time',
			value: formatReadingTime(stats.readingTime),
			textColor: 'text-accent2',
			isEmpty: stats.readingTime === 0,
		},
		{
			label: 'Active days',
			value: stats.activeDays,
			isEmpty: stats.activeDays === 0,
		},
	]

	return (
		<section
			aria-label="Yearly statistics"
			className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4"
		>
			{statCards.map((card) => (
				<div key={card.label} className="motion-reduce:animate-none *:h-full">
					<StatCard {...card} />
				</div>
			))}
		</section>
	)
}
