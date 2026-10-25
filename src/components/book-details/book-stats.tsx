import { StatCard } from '#/components/stat-card'
import type { BookDetails } from '#/types/book-details'
import { formatReadingTime } from '#/utils/format-reading-time'

interface BookStatsProps {
	stats: BookDetails['stats']
	elapsedDays: number | null
}

const STAT_DELAYS = [
	'[animation-delay:0.1s]',
	'[animation-delay:0.14s]',
	'[animation-delay:0.18s]',
	'[animation-delay:0.22s]',
]

export function BookStats({ stats, elapsedDays }: BookStatsProps) {
	const statCards = [
		{
			label: 'Total reading time',
			value: formatReadingTime(stats.readingTime),
			textColor: 'text-accent',
		},
		{ label: 'Sessions', value: stats.sessions },
		{
			label: 'Days with sessions',
			value: stats.activeDays,
			textColor: 'text-accent2',
		},
		...(elapsedDays !== null
			? [{ label: 'Days it took', value: elapsedDays }]
			: []),
	]

	const columns =
		statCards.length === 4
			? 'md:grid-cols-4'
			: 'sm:grid-cols-3 [&>*:last-child]:col-span-2 [&>*:last-child]:sm:col-span-1'

	return (
		<section
			aria-label="Reading statistics"
			className={`grid grid-cols-2 gap-3 ${columns}`}
		>
			{statCards.map((card, index) => (
				<div
					key={card.label}
					className={`animate-fade-up motion-reduce:animate-none *:h-full ${STAT_DELAYS[index]}`}
				>
					<StatCard {...card} />
				</div>
			))}
		</section>
	)
}
