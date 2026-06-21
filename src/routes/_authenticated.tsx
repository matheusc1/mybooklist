import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
} from '@tanstack/react-router'
import { GoalModal } from '#/components/modals/goal-modal'
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
	const matches = useMatches()
	const hideNav = matches.some((m) => m.staticData?.hideNav)

	return (
		<div className="min-h-dvh flex flex-col">
			{!hideNav && <NavBar />}
			<Outlet />
			<GoalModal />
		</div>
	)
}
