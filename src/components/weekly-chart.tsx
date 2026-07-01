interface ChartDay {
	day: string
	pages: number
}

const chartData: ChartDay[] = [
	{ day: 'Mon', pages: 40 },
	{ day: 'Tue', pages: 90 },
	{ day: 'Wed', pages: 55 },
	{ day: 'Thu', pages: 30 },
	{ day: 'Fri', pages: 65 },
	{ day: 'Sat', pages: 45 },
	{ day: 'Sun', pages: 38 },
]

const maxPages = Math.max(...chartData.map((day) => day.pages))
const mostActiveDay = chartData.reduce((a, b) =>
	a.pages > b.pages ? a : b,
).day

export function WeeklyChart() {
	return (
		<div
			role="img"
			aria-label={`Weekly reading chart. ${chartData.map((d) => `${d.day}: ${d.pages} pages`).join(', ')}`}
			className="flex items-end gap-1 lg:gap-2.5"
		>
			{chartData.map(({ day, pages }) => {
				const heightPercent = (pages / maxPages) * 100
				const isActive = day === mostActiveDay

				return (
					<div
						key={day}
						aria-hidden="true"
						className="flex flex-col items-center flex-1 gap-2"
					>
						<div className="w-full h-25 flex items-end">
							<div
								className={`w-full rounded-t cursor-pointer transition-all hover:brightness-125 ${
									isActive
										? 'bg-linear-to-b from-accent to-accent/60'
										: 'bg-linear-to-b from-accent2 to-accent2/50'
								}`}
								style={{ height: `${heightPercent}%` }}
							/>
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
