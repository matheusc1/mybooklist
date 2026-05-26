import { Link } from '@tanstack/react-router'
import { UserMenu } from '../user-menu'
import { Logo } from './logo'

const links = [
	{ label: 'Home', to: '/home' },
	{ label: 'My Books', to: '/books' },
	{ label: 'Activity', to: '/activity' },
]

export function NavBar() {
	return (
		<div className="sticky top-0 bg-bg/85 z-10 backdrop-blur-md">
			<nav className="flex w-full items-center justify-between h-17 px-5 lg:px-10">
				<Logo textClassName="hidden md:block" />

				<div className="flex gap-0.5">
					{links.map((link) => (
						<Link
							className="text-sm text-muted p-1.5 rounded-md transition-all uppercase tracking-wide hover:text-text hover:bg-surface2"
							activeProps={{
								className: '!text-accent bg-surface2 font-medium',
							}}
							key={link.to}
							to={link.to}
						>
							{link.label}
						</Link>
					))}
				</div>

				<UserMenu />
			</nav>
			<div className="w-full h-px bg-border" />
		</div>
	)
}
