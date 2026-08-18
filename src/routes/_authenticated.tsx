import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
} from '@tanstack/react-router'
import { GoalModal } from '#/components/modals/goal-modal'
import { NavBar } from '#/components/ui/nav-bar'
import { getMe } from '#/http/auth'
import { getMeServer } from '#/http/auth-server'
import { isHttpError } from '#/http/client'

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ location, context }) => {
		try {
			await context.queryClient.ensureQueryData({
				queryKey: ['auth', 'me'],
				queryFn: () => {
					if (typeof window === 'undefined') {
						return getMeServer()
					}

					return getMe()
				},
			})
		} catch (error) {
			if (isHttpError(error) && error.status === 401) {
				throw redirect({
					to: '/login',
					search: {
						redirect: location.href,
					},
				})
			}

			throw error
		}
	},
	component: Layout,
})

function Layout() {
	const matches = useMatches()
	const hideNav = matches.some((match) => match.staticData?.hideNav)

	return (
		<div className="min-h-dvh flex flex-col">
			{!hideNav && <NavBar />}
			<Outlet />
			<GoalModal />
		</div>
	)
}
