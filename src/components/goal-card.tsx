import { useGoalModalStore } from '#/stores/goal-store'
import type { GoalProgress } from '#/types/goal'
import { getPercent } from '#/utils/get-percent'

function formatMonthsRemaining(months: number): string {
	if (months === 0) return '< 1 month remaining'
	return `${months} month${months === 1 ? '' : 's'} remaining`
}

export function GoalCard({
	goal,
	showInProgress = false,
}: {
	goal: GoalProgress | undefined
	showInProgress?: boolean
}) {
	const now = new Date()
	const year = goal?.year ?? now.getFullYear()
	const isCurrentYear = year === now.getFullYear()

	if (!goal?.target) {
		return (
			<EmptyCard
				year={year}
				current={goal?.current ?? 0}
				editable={isCurrentYear}
				showInProgress={showInProgress}
			/>
		)
	}

	const percent = getPercent(goal.current, goal.target ?? 0)
	const monthsRemaining = 11 - now.getMonth()

	return (
		<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
			<GoalHeader year={goal.year} showInProgress={showInProgress} />

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
					{percent}% complete
					{isCurrentYear && ` · ${formatMonthsRemaining(monthsRemaining)}`}
				</p>
			</div>
		</div>
	)
}

function EmptyCard({
	year,
	current,
	editable,
	showInProgress,
}: {
	year: number
	current: number
	editable: boolean
	showInProgress: boolean
}) {
	const { openModal } = useGoalModalStore()

	return (
		<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
			<GoalHeader year={year} showInProgress={showInProgress} />

			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<span
						className={`font-serif text-2xl font-semibold ${current === 0 ? 'text-text/20' : ''}`}
					>
						{current}
					</span>
					<p className="text-sm text-muted">of -- books</p>
				</div>

				<div className="h-1.5 bg-surface2 rounded-full" />

				{editable ? (
					<button
						onClick={() => openModal('add')}
						type="button"
						className="text-left text-xs text-muted underline cursor-pointer"
					>
						Set a goal and start reading.
					</button>
				) : (
					<p className="text-xs text-muted">No goal was set for {year}.</p>
				)}
			</div>
		</div>
	)
}

function GoalHeader({
	year,
	showInProgress,
}: {
	year: number
	showInProgress: boolean
}) {
	return (
		<div className="mb-3 flex items-center justify-between gap-3">
			<p className="text-muted uppercase tracking-widest text-xs">
				Reading Goal · {year}
			</p>
			{showInProgress && (
				<span className="inline-flex items-center gap-1.5 rounded-full border border-accent2/25 bg-accent2/10 px-2.5 py-1 font-mono text-xxs uppercase tracking-[0.08em] text-accent2">
					<span
						aria-hidden="true"
						className="size-1.25 rounded-full bg-accent2 motion-safe:animate-pulse"
					/>
					In progress
				</span>
			)}
		</div>
	)
}

export function GoalCardCompact({ goal }: { goal: GoalProgress }) {
	const percent = getPercent(goal.current, goal.target ?? 0)

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
