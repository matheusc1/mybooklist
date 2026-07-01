import { useGoalStore } from '#/stores/goal-store'
import type { Goal } from '#/types/types'
import { getPercent } from '#/utils/get-percent'

function formatMonthsRemaining(months: number): string {
	if (months === 0) return '< 1 month remaining'
	return `${months} month${months === 1 ? '' : 's'} remaining`
}

export function GoalCard({ goal }: { goal: Goal | null }) {
	const now = new Date()

	if (!goal) return <EmptyCard year={now.getFullYear()} />

	const percent = getPercent(goal.current, goal.target)
	const monthsRemaining = 11 - now.getMonth()

	return (
		<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
			<p className="text-muted uppercase tracking-widest text-xs mb-3">
				Reading Goal · {goal.year}
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
						role="progressbar"
						aria-label={`Reading goal progress: ${goal.current} of ${goal.target} books`}
						aria-valuenow={percent}
						aria-valuemin={0}
						aria-valuemax={100}
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
	const { openModal } = useGoalStore()

	return (
		<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
			<p className="text-muted uppercase tracking-widest text-xs mb-3">
				Reading Goal · {year}
			</p>

			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<span className="font-serif text-2xl font-semibold text-text/20">
						0
					</span>
					<p className="text-sm text-muted">of -- books</p>
				</div>

				<div className="h-1.5 bg-surface2 rounded-full" />

				<button
					onClick={() => openModal('add')}
					type="button"
					className="text-xs text-muted underline cursor-pointer"
				>
					Set a goal and start reading.
				</button>
			</div>
		</div>
	)
}

export function GoalCardCompact({ goal }: { goal: Goal }) {
	const percent = getPercent(goal.current, goal.target)

	return (
		<div className="px-4 py-3 border-b border-border">
			<p className="text-muted uppercase tracking-widest text-xs mb-2">
				Reading goal · {goal.year}
			</p>
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
					className="h-full rounded-full bg-gradient-progress"
					role="progressbar"
					aria-label={`Reading goal progress: ${goal.current} of ${goal.target} books`}
					aria-valuenow={percent}
					aria-valuemin={0}
					aria-valuemax={100}
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	)
}
