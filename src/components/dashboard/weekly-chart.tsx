import { ChartTooltip } from '../chart-tooltip'

interface WeeklyChartProps {
	pagesByDay: { day: string; pages: number }[]
	mostActiveDay: string | null
}

function formatPages(n: number) {
	return `${n} ${n === 1 ? 'page' : 'pages'}`
}

export function WeeklyChart({ pagesByDay, mostActiveDay }: WeeklyChartProps) {
	const maxPages = Math.max(...pagesByDay.map((d) => d.pages), 1)
	const summary = pagesByDay
		.map((d) => `${d.day}: ${formatPages(d.pages)}`)
		.join(', ')

	return (
		<div
			role="img"
			aria-label={`Weekly reading chart. ${summary}`}
			className="flex items-end gap-1 lg:gap-2.5"
		>
			{pagesByDay.map(({ day, pages }) => {
				const heightPercent = (pages / maxPages) * 100
				const isActive = day === mostActiveDay

				return (
					<div
						key={day}
						aria-hidden="true"
						className="flex flex-col items-center flex-1 gap-2"
					>
						<div className="group w-full h-25 flex items-end">
							<div
								className={`relative w-full rounded-t transition-all group-hover:brightness-125 ${
									isActive
										? 'bg-linear-to-b from-accent to-accent/60'
										: 'bg-linear-to-b from-accent2 to-accent2/50'
								}`}
								style={{ height: `${heightPercent}%` }}
							>
								<ChartTooltip>{formatPages(pages)}</ChartTooltip>
							</div>
						</div>
						<div className="font-mono text-muted tracking-wider text-xs">
							{day}
						</div>
					</div>
				)
			})}
		</div>
	)
}
