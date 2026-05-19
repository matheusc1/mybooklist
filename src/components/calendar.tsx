import { LucideArrowLeft, LucideArrowRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from 'tailwind-variants'
import { Button } from '#/components/ui/button'
import { getCalendarDays } from '#/hooks/get-calendar-days'

type Session = {
	book: string
	author: string
	pages: number[]
	time: string
}

type DayState = {
	daySessions: Session[]
	isToday: boolean
	hasSession: boolean
	isMulti: boolean
}

type CalendarProps = {
	sessions: Record<string, Session[]>
}

export function Calendar({ sessions }: CalendarProps) {
	const today = new Date()

	const [view, setView] = useState({
		year: today.getFullYear(),
		month: today.getMonth(),
	})

	const calendarDays = getCalendarDays(view.year, view.month)
	const viewMonthLabel = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
	}).format(new Date(view.year, view.month))

	function getDayState(key: string, day: number): DayState {
		const daySessions = sessions[key] ?? []
		const isToday =
			today.getFullYear() === view.year &&
			today.getMonth() === view.month &&
			today.getDate() === day

		return {
			daySessions,
			isToday,
			hasSession: daySessions.length > 0,
			isMulti: daySessions.length > 1,
		}
	}

	function prevMonth() {
		setView(({ year, month }) =>
			month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
		)
	}

	function nextMonth() {
		setView(({ year, month }) =>
			month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
		)
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<h3 className="font-serif font-semibold text-xl tracking-[-0.01em]">
					{viewMonthLabel}
				</h3>
				<div className="flex gap-1.5">
					<Button variant="icon" size="icon" onClick={prevMonth}>
						<LucideArrowLeft className="size-4" />
					</Button>
					<Button variant="icon" size="icon" onClick={nextMonth}>
						<LucideArrowRight className="size-4" />
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
					{calendarDays.map(({ day, key }) => {
						if (!day) return <div key={key} className="aspect-square" />

						const state = getDayState(key, day)

						return (
							<div
								key={key}
								className={cn(
									'aspect-square rounded-lg flex flex-col items-center justify-center relative',
									'font-mono text-sm text-muted/60 border border-transparent transition-all duration-150',
									state.hasSession &&
										'bg-surface border-border text-text cursor-pointer',
									state.hasSession &&
										'hover:bg-surface2 hover:border-accent/30 hover:scale-105 hover:z-10 hover:shadow-lg',
									state.isToday && 'border-accent/50 text-accent font-medium',
									state.isToday &&
										state.hasSession &&
										'bg-accent/8 hover:bg-accent/10',
								)}
							>
								{day}
								{state.hasSession && (
									<span
										className={cn(
											'absolute bottom-1.5 size-1.5 rounded-full',
											state.isMulti ? 'bg-accent2' : 'bg-accent',
										)}
									/>
								)}
							</div>
						)
					})}
				</div>
			</div>

			<div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted uppercase tracking-wider">
				<div className="flex items-center gap-1.5">
					<div className="size-1.5 rounded-full bg-accent" /> Session logged
				</div>
				<div className="flex items-center gap-1.5">
					<div className="size-1.5 rounded-full bg-accent2" /> Multiple sessions
				</div>
				<div className="flex items-center gap-1.5">
					<div className="size-1.5 rounded-full bg-accent/40 border border-accent" />{' '}
					Today
				</div>
			</div>
		</div>
	)
}
