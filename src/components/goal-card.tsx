import type { Goal } from '#/types/types'

function formatMonthsRemaining(months: number): string {
	if (months === 0) return '< 1 month remaining'
	return `${months} month${months === 1 ? '' : 's'} remaining`
}

function getPercent(goal: Goal) {
	return Math.round((goal.current / goal.target) * 100)
}

export function GoalCard() {
	const goal: Goal = { target: 10, current: 2, year: 2026 }
	const percent = getPercent(goal)

	const now = new Date()
	const monthsRemaining = 11 - now.getMonth()

	if (!goal) return <EmptyCard year={now.getFullYear()} />

	return (
		<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
			<p className="text-muted uppercase tracking-widest text-xs mb-3">
				READING GOAL · {goal.year}
			</p>

			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<span className="font-serif text-2xl font-semibold">
						{goal.current}
					</span>
					<p className="text-sm text-muted">of {goal.target} books</p>
				</div>

				<div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-progress rounded-full"
						style={{ width: `${percent}%` }}
					/>
				</div>

				<p className="text-xs text-muted">
					{percent}% complete · {formatMonthsRemaining(monthsRemaining)}
				</p>
			</div>
		</div>
	)
}

function EmptyCard({ year }: { year: number }) {
	return (
		<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
			<p className="text-muted uppercase tracking-widest text-xs mb-3">
				READING GOAL · {year}
			</p>

			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<span className="font-serif text-2xl font-semibold text-text/20">
						0
					</span>
					<p className="text-sm text-muted">of -- books</p>
				</div>

				<div className="h-1.5 bg-surface2 rounded-full" />

				<p className="text-xs text-muted underline cursor-pointer">
					Set a gol and start reading.
				</p>
			</div>
		</div>
	)
}

export function GoalCardCompact({ goal }: { goal: Goal }) {
	const percent = getPercent(goal)

	return (
		<div className="px-4 py-3 border-b border-border">
			<div className="flex items-center mb-2">
				<span className="text-muted uppercase tracking-widest text-xs">
					Reading Goal · {goal.year}
				</span>
			</div>
			<div className="flex justify-between items-baseline mb-2">
				<p className="font-serif text-2xl font-semibold">
					{goal.current}{' '}
					<span className="text-sm text-muted font-sans font-normal">
						of {goal.target} books
					</span>
				</p>
				<span className="text-xs text-accent font-mono">{percent}%</span>
			</div>
			<div className="h-0.75 bg-surface2 rounded-full overflow-hidden">
				<div
					className="h-full rounded-full bg-linear-to-r from-accent to-accent2"
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	)
}
