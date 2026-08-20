import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useLogout, useMe } from '#/hooks/use-auth'
import { useGoal } from '#/hooks/use-goal'
import { UserDropdown } from './dropdown-menu'

export function UserMenu() {
	const { data: user } = useMe()
	const { data: goal } = useGoal()
	const { mutate: logout } = useLogout()

	if (!user) return null

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
					{user.avatarUrl ? (
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
					)}
				</DropdownMenu.Trigger>
			</div>

			<DropdownMenu.Portal>
				<UserDropdown user={user} goal={goal} onSignOut={() => logout()} />
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
