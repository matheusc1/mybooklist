import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { NavBar } from '#/components/ui/nav-bar'

const isAuthenticated = () => {
	return true
}

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ location }) => {
		if (!isAuthenticated()) {
			throw redirect({
				to: '/login',
				search: {
					redirect: location.href,
				},
			})
		}
	},
	component: Layout,
})

function Layout() {
	return (
		<div className="min-h-dvh flex flex-col">
			<NavBar />
			<Outlet />
		</div>
	)
}
