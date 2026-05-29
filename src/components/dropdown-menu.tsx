import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link } from '@tanstack/react-router'
import { LucideGauge, LucideLogOut, LucideTarget } from 'lucide-react'
import type { Goal, User } from '#/types/types'
import { GoalCardCompact } from './goal-card'

type UserDropdownProps = {
	user: User
	goal: Goal | null
	onUpdateGoal?: () => void
	onSignOut?: () => void
}

function DropdownMenuUser({ user }: { user: User }) {
	return (
		<div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
			{user.avatar ? (
				<img
					src={user.avatar}
					alt={user.name}
					className="size-9 rounded-full object-cover"
				/>
			) : (
				<div className="size-9 rounded-full bg-gradient-avatar flex items-center justify-center text-xs font-semibold text-bg uppercase">
					{user.name.charAt(0) || '?'}
				</div>
			)}

			<div>
				<p className="text-sm font-medium truncate">{user.name}</p>
				<p className="text-xs text-muted font-mono truncate">{user.email}</p>
			</div>
		</div>
	)
}

function DropdownMenuActions({
	onUpdateGoal,
	onSignOut,
}: {
	onUpdateGoal?: () => void
	onSignOut?: () => void
}) {
	const itemClassName =
		'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted cursor-pointer outline-none transition-colors'

	const iconClassName =
		'size-7 rounded-lg border flex items-center justify-center shrink-0'

	return (
		<div className="p-1.5">
			<DropdownMenu.Item
				onSelect={onUpdateGoal}
				className={`${itemClassName} hover:bg-surface2 hover:text-text data-highlighted:bg-surface2 data-highlighted:text-text`}
			>
				<span className={`${iconClassName} bg-accent/10 border-accent/15`}>
					<LucideTarget className="size-4 text-accent" />
				</span>
				Update reading goal
			</DropdownMenu.Item>

			<DropdownMenu.Item asChild>
				<Link
					to="/reading-speed"
					className={`${itemClassName} hover:bg-surface2 hover:text-text data-highlighted:bg-surface2 data-highlighted:text-text`}
				>
					<span className={`${iconClassName} bg-accent/10 border-accent/15`}>
						<LucideGauge className="size-4 text-accent" />
					</span>
					Take reading speed test
				</Link>
			</DropdownMenu.Item>

			<DropdownMenu.Separator className="h-px bg-border my-1 mx-1.5" />

			<DropdownMenu.Item
				onSelect={onSignOut}
				className={`${itemClassName} hover:bg-danger/10 hover:text-danger data-highlighted:bg-danger/10 data-highlighted:text-danger`}
			>
				<span className={`${iconClassName} bg-danger/10 border-danger/15`}>
					<LucideLogOut className="size-4 text-danger" />
				</span>
				Sign out
			</DropdownMenu.Item>
		</div>
	)
}

export function UserDropdown({
	user,
	goal,
	onUpdateGoal,
	onSignOut,
}: UserDropdownProps) {
	return (
		<DropdownMenu.Content
			align="end"
			sideOffset={8}
			className="w-64 bg-surface border border-white/12 rounded-xl overflow-hidden z-50
				shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]
				data-[state=open]:animate-in data-[state=closed]:animate-out
				data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
				data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
				data-[side=bottom]:slide-in-from-top-2"
		>
			<DropdownMenuUser user={user} />
			{goal ? (
				<GoalCardCompact goal={goal} />
			) : (
				<p className="px-4 py-3 text-xs text-muted border-b border-border">
					No reading goal set.
				</p>
			)}
			<DropdownMenuActions onUpdateGoal={onUpdateGoal} onSignOut={onSignOut} />
		</DropdownMenu.Content>
	)
}
