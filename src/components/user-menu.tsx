import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { Goal, User } from '#/types/types'
import { UserDropdown } from './dropdown-menu'

const user: User = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	avatar: 'https://avatars.githubusercontent.com/u/117493813?v=4',
}

const goal: Goal = { target: 10, current: 2, year: 2026 }

function UserMenuTrigger({ user }: { user: User }) {
	const triggerClassName =
		'size-9 rounded-full cursor-pointer hover:ring-3 hover:ring-accent/40 transition-all'

	return (
		<DropdownMenu.Trigger asChild>
			{user.avatar ? (
				<img
					src={user.avatar}
					alt={user.name}
					className={`${triggerClassName} object-cover`}
				/>
			) : (
				<div
					className={`${triggerClassName} bg-gradient-avatar flex items-center justify-center text-xs font-semibold text-bg uppercase`}
				>
					{user.name.charAt(0) || '?'}
				</div>
			)}
		</DropdownMenu.Trigger>
	)
}

export function UserMenu() {
	return (
		<DropdownMenu.Root>
			<div className="flex items-center">
				<div className="mr-2 hidden text-end md:block">
					<p className="text-sm font-medium text-text">{user.name}</p>
					<p className="text-xs text-muted">{user.email}</p>
				</div>
				<UserMenuTrigger user={user} />
			</div>

			<DropdownMenu.Portal>
				<UserDropdown user={user} goal={goal} />
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
