import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useGoalStore } from '#/stores/goal-store'
import type { UserUI } from '#/types/user'
import { UserDropdown } from './dropdown-menu'

const user: UserUI = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	avatarUrl: 'https://avatars.githubusercontent.com/u/117493813?v=4',
}

function UserMenuAvatar({ user }: { user: UserUI }) {
	return user.avatarUrl ? (
		<img
			src={user.avatarUrl}
			alt={user.name}
			className="size-9 rounded-full object-cover"
		/>
	) : (
		<div
			aria-hidden="true"
			className="size-9 rounded-full bg-gradient-avatar flex items-center justify-center text-xs font-semibold text-bg uppercase"
		>
			{user.name.charAt(0) || '?'}
		</div>
	)
}

export function UserMenu() {
	const { goal } = useGoalStore()

	return (
		<DropdownMenu.Root>
			<div className="flex items-center">
				<div className="mr-2 hidden text-end md:block">
					<p className="text-sm font-medium text-text">{user.name}</p>
					<p className="text-xs text-muted">{user.email}</p>
				</div>
				<DropdownMenu.Trigger
					aria-label="Open user menu"
					className="size-9 rounded-full cursor-pointer hover:ring-3 hover:ring-accent/40 transition-all"
				>
					<UserMenuAvatar user={user} />
				</DropdownMenu.Trigger>
			</div>

			<DropdownMenu.Portal>
				<UserDropdown user={user} goal={goal} />
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
