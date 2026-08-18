import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link } from '@tanstack/react-router'
import { LucideGauge, LucideLogOut, LucideTarget } from 'lucide-react'
import { useGoalStore } from '#/stores/goal-store'
import type { GoalProgress } from '#/types/goal'
import type { UserUI } from '#/types/user'
import { GoalCardCompact } from './goal-card'

interface UserDropdownProps {
	user: UserUI
	goal: GoalProgress | null
	onSignOut: () => void
}

function DropdownMenuUser({ user }: { user: UserUI }) {
	return (
		<div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
			{user.avatarUrl ? (
				<img
					src={user.avatarUrl}
					alt={user.name}
					className="size-9 rounded-full object-cover shrink-0"
				/>
			) : (
				<div
					aria-hidden="true"
					className="size-9 rounded-full bg-gradient-avatar flex items-center justify-center text-xs font-semibold text-bg uppercase shrink-0"
				>
					{user.name.charAt(0) || '?'}
				</div>
			)}

			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium truncate">{user.name}</p>
				<p className="text-xs text-muted font-mono truncate">{user.email}</p>
			</div>
		</div>
	)
}

function DropdownMenuActions({ onSignOut }: { onSignOut?: () => void }) {
	const { openModal, goal } = useGoalStore()

	const itemClassName =
		'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted cursor-pointer outline-none transition-colors'

	const iconClassName =
		'size-7 rounded-lg border flex items-center justify-center shrink-0'

	return (
		<div className="p-1.5">
			<DropdownMenu.Item
				onClick={() => openModal(goal ? 'edit' : 'add')}
				className={`${itemClassName} hover:bg-surface2 hover:text-text data-highlighted:bg-surface2 data-highlighted:text-text`}
			>
				<div className={`${iconClassName} bg-accent/10 border-accent/15`}>
					<LucideTarget aria-hidden="true" className="size-4 text-accent" />
				</div>
				Update reading goal
			</DropdownMenu.Item>

			<DropdownMenu.Item asChild>
				<Link
					to="/reading-speed"
					className={`${itemClassName} hover:bg-surface2 hover:text-text data-highlighted:bg-surface2 data-highlighted:text-text`}
				>
					<div className={`${iconClassName} bg-accent/10 border-accent/15`}>
						<LucideGauge aria-hidden="true" className="size-4 text-accent" />
					</div>
					Take reading speed test
				</Link>
			</DropdownMenu.Item>

			<DropdownMenu.Separator className="h-px bg-border my-1 mx-1.5" />

			<DropdownMenu.Item
				onSelect={onSignOut}
				className={`${itemClassName} hover:bg-danger/10 hover:text-danger data-highlighted:bg-danger/10 data-highlighted:text-danger`}
			>
				<div className={`${iconClassName} bg-danger/10 border-danger/15`}>
					<LucideLogOut aria-hidden="true" className="size-4 text-danger" />
				</div>
				Sign out
			</DropdownMenu.Item>
		</div>
	)
}

export function UserDropdown({ user, goal, onSignOut }: UserDropdownProps) {
	return (
		<DropdownMenu.Content
			align="end"
			sideOffset={8}
			className="w-64 bg-surface border border-border2 rounded-xl overflow-hidden z-50
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
			<DropdownMenuActions onSignOut={onSignOut} />
		</DropdownMenu.Content>
	)
}
