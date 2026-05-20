import type { ActivityStatus } from '#/types/types'

const statusColor: Record<ActivityStatus, string> = {
	reading: 'bg-accent2',
	finished: 'bg-accent',
	paused: 'bg-muted',
	abandoned: 'bg-danger',
	'want-to-read': 'bg-mist',
}

const statusLabel: Record<ActivityStatus, string> = {
	reading: 'Reading',
	finished: 'Finished',
	paused: 'Paused',
	abandoned: 'Abandoned',
	'want-to-read': 'Planned',
}

interface BookActivity {
	bookCover?: string
	title: string
	author: string
	status: ActivityStatus
	date: string
}

interface BookActivityCardProps {
	activity: BookActivity
}

export function BookActivityCard({ activity }: BookActivityCardProps) {
	return (
		<div className="flex gap-3 py-3 border-b border-border last:border-b-0">
			<div className="flex items-center justify-center w-10 h-15 bg-surface2 rounded-sm shadow-[2px_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
				{activity.bookCover ? (
					<img
						src={activity.bookCover}
						alt={`${activity.title} cover`}
						className="w-full h-full object-cover"
					/>
				) : null}
				{!activity.bookCover && (
					<img
						src="/public/book-cover.jpg"
						alt="Default Book Cover"
						className="w-full h-full object-cover"
					/>
				)}
			</div>
			<div className="flex flex-col justify-between">
				<div>
					<p className="text-sm font-medium">{activity.title}</p>
					<p className="text-xs text-muted">{activity.author}</p>
				</div>
				<div className="flex items-center gap-1.5">
					<div
						className={`size-1.5 rounded-full ${statusColor[activity.status]}`}
					/>
					<span className="text-xxs font-mono text-muted tracking-wider uppercase">
						{statusLabel[activity.status]} · {activity.date}
					</span>
				</div>
			</div>
		</div>
	)
}
