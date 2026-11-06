import { ChartTooltip } from '../chart-tooltip'

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]

function formatPages(n: number) {
	return `${n} ${n === 1 ? 'page' : 'pages'}`
}

export function YearlyChart({ pagesByMonth }: { pagesByMonth: number[] }) {
	const data = pagesByMonth.map((pages, index) => ({
		month: MONTHS[index],
		pages,
	}))
	const maxPages = Math.max(...pagesByMonth)
	const mostActiveMonth =
		maxPages > 0 ? data.find((d) => d.pages === maxPages)?.month : null
	const summary = data
		.map((d) => `${d.month}: ${formatPages(d.pages)}`)
		.join(', ')

	return (
		<section
			aria-labelledby="pages-by-month-heading"
			className="mb-4 rounded-xl border border-border bg-surface px-6 py-5"
		>
			<h2
				id="pages-by-month-heading"
				className="mb-3.5 font-mono text-xs uppercase tracking-widest text-muted"
			>
				Pages read per month
			</h2>

			<div
				role="img"
				aria-label={`Yearly reading chart. ${summary}`}
				className="flex items-end gap-1 lg:gap-2.5"
			>
				{data.map(({ month, pages }) => {
					const isEmpty = pages === 0
					const isActive = month === mostActiveMonth

					return (
						<div
							key={month}
							aria-hidden="true"
							className="flex flex-col items-center flex-1 gap-2"
						>
							<div className="group w-full h-32 flex items-end">
								<div
									className={`relative w-full rounded-t transition-all group-hover:brightness-125 ${
										isEmpty
											? 'h-0.75 bg-surface3'
											: isActive
												? 'bg-linear-to-b from-accent to-accent/60'
												: 'bg-linear-to-b from-accent2 to-accent2/50'
									}`}
									style={
										isEmpty
											? undefined
											: { height: `${Math.max((pages / maxPages) * 100, 3)}%` }
									}
								>
									<ChartTooltip>{formatPages(pages)}</ChartTooltip>
								</div>
							</div>
							<div className="font-mono text-muted tracking-wider text-[10px] lg:text-xs">
								{month}
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
