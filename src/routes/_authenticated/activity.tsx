import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from '#/components/calendar'
import { StatCard } from '#/components/stat-card'
import { sessions } from '#/mocks/sessions'

export const Route = createFileRoute('/_authenticated/activity')({
	component: Activity,
})

const today = new Date()
const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	year: 'numeric',
}).format(today)

function Activity() {
	return (
		<div className="min-h-[calc(100vh-69px)] w-full max-w-250 mx-auto p-5 lg:p-10 space-y-10">
			<div className="space-y-1.5 animate-fade-up [animation-delay:0.05s]">
				<p className="font-mono text-xs text-accent uppercase tracking-widest">
					History
				</p>
				<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
					Activity
				</h1>
				<p className="text-muted text-xs tracking-wider">{currentMonthLabel}</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3 animate-fade-up [animation-delay:0.1s]">
				<StatCard
					value="18"
					label="Sessions this month"
					textColor="text-accent"
				/>
				<StatCard value="342" label="Pages this month" />
				<StatCard value="~14h" label="Reading time" textColor="text-accent2" />
				<StatCard value="12" label="Active Days" />
			</div>

			<div className="animate-fade-up [animation-delay:0.15s]">
				<Calendar sessions={sessions} />
			</div>
		</div>
	)
}
