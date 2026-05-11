const user = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	avatar: 'https://avatars.githubusercontent.com/u/117493813?v=4',
}

export function UserMenu() {
	return (
		<div className="flex items-center">
			<div className="mr-2 hidden text-end md:block">
				<p className="text-sm font-medium text-text">{user.name}</p>
				<p className="text-xs text-muted">{user.email}</p>
			</div>

			{user.avatar ? (
				<img
					src={user.avatar}
					alt={user.name}
					className="size-9 rounded-full object-cover"
				/>
			) : (
				<div className="size-9 rounded-full bg-gradient-avatar flex items-center justify-center text-xs font-semibold text-bg uppercase">
					{user.name[0] ?? '?'}
				</div>
			)}
		</div>
	)
}
