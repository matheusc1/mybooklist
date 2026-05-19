import { createFileRoute } from '@tanstack/react-router'
import { LucideArrowLeft, LucideArrowRight } from 'lucide-react'
import { StatCard } from '#/components/stat-card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_authenticated/activity')({
	component: Activity,
})

function Activity() {
	return (
		<div className="min-h-[calc(100vh-69px)] w-full max-w-250 mx-auto p-5 lg:p-10 space-y-10">
			<div className="space-y-1.5">
				<p className="font-mono text-xs text-accent uppercase tracking-widest">
					History
				</p>
				<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
					Activity
				</h1>
				<p className="text-muted text-xs tracking-wider">May 2026</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
				<StatCard
					value="18"
					label="Sessions this month"
					textColor="text-accent"
				/>
				<StatCard value="342" label="Pages this month" />
				<StatCard value="~14h" label="Reading time" textColor="text-accent2" />
				<StatCard value="12" label="Active Days" />
			</div>

			<div className="space-y-5">
				<div className="flex items-center justify-between">
					<h3 className="font-serif font-semibold text-xl tracking-[-0.01em]">
						May 2026
					</h3>

					<div className="flex gap-1">
						<Button variant="icon" size="icon">
							<LucideArrowLeft className="size-4" />
						</Button>
						<Button variant="icon" size="icon">
							<LucideArrowRight className="size-4" />
						</Button>
					</div>
				</div>

				<div>calendar</div>

				<div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted uppercase tracking-wider">
					<div className="flex items-center gap-1.5">
						<div className="size-1.5 rounded-full bg-accent" /> Session logged
					</div>
					<div className="flex items-center gap-1.5">
						<div className="size-1.5 rounded-full bg-accent2" /> Multiple
						sessions
					</div>
					<div className="flex items-center gap-1.5">
						<div className="size-1.5 rounded-full bg-accent/40 border border-accent" />
						Today
					</div>
				</div>
			</div>
		</div>
	)
}
