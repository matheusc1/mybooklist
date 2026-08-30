/** biome-ignore-all lint/suspicious/noArrayIndexKey: static data */
import { LucideArrowLeft, LucideArrowRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Skeleton } from '../ui/skeleton'

export function ActivitySkeleton() {
	const today = new Date()
	const monthLabel = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
	}).format(today)

	return (
		<div className="min-h-[calc(100vh-69px)] w-full max-w-250 mx-auto p-5 lg:p-10 space-y-10">
			<div className="space-y-1.5">
				<p className="font-mono text-xs text-accent uppercase tracking-widest">
					History
				</p>
				<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
					Activity
				</h1>
				<p className="text-muted text-xs tracking-wider">{monthLabel}</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
				{Array.from({ length: 4 }).map((_, index) => (
					<Skeleton key={index} className="h-16 lg:h-18 rounded-xl" />
				))}
			</div>

			<div className="space-y-5">
				<div className="flex items-center justify-between">
					<h3 className="font-serif font-semibold text-xl tracking-[-0.01em]">
						{monthLabel}
					</h3>

					<div className="flex gap-1.5">
						<Button
							variant="icon"
							size="icon"
							disabled
							aria-label="Previous month"
						>
							<LucideArrowLeft aria-hidden="true" className="size-4" />
						</Button>

						<Button variant="icon" size="icon" disabled aria-label="Next month">
							<LucideArrowRight aria-hidden="true" className="size-4" />
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<div className="grid grid-cols-7 gap-1">
						{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
							<div
								key={day}
								className="font-mono text-center text-xxs text-muted tracking-wider uppercase"
							>
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-1">
						{Array.from({ length: 35 }).map((_, index) => (
							<Skeleton
								key={index}
								className="bg-surface aspect-square rounded-lg"
							/>
						))}
					</div>
				</div>

				<div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted uppercase tracking-wider">
					<div className="flex items-center gap-1.5">
						<div
							aria-hidden="true"
							className="size-1.5 rounded-full bg-accent"
						/>{' '}
						Session logged
					</div>

					<div className="flex items-center gap-1.5">
						<div
							aria-hidden="true"
							className="size-1.5 rounded-full bg-accent2"
						/>{' '}
						Multiple sessions
					</div>

					<div className="flex items-center gap-1.5">
						<div
							aria-hidden="true"
							className="size-1.5 rounded-full bg-accent/40 border border-accent"
						/>
						Today
					</div>
				</div>
			</div>
		</div>
	)
}
