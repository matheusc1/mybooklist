import {
	createFileRoute,
	Outlet,
	redirect,
	useMatches,
} from '@tanstack/react-router'
import { GoalModal } from '#/components/modals/goal-modal'
import { NavBar } from '#/components/ui/nav-bar'
import { isHttpError } from '#/http/client'
import type { User } from '#/types/user'
import { authQueryKey } from '#/utils/query-keys'
import { resolveCurrentUser } from '#/utils/resolve-current-user'

function getReadingSpeedPrompted() {
	try {
		return sessionStorage.getItem('reading-speed-prompted')
	} catch {
		return null
	}
}

function setReadingSpeedPrompted() {
	try {
		sessionStorage.setItem('reading-speed-prompted', 'true')
	} catch {
		// ignore: sessionStorage unavailable (SSR, private mode, etc.)
	}
}

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ location, context }) => {
		let user: User
		try {
			user = await context.queryClient.ensureQueryData({
				queryKey: authQueryKey,
				queryFn: resolveCurrentUser,
			})
		} catch (error) {
			if (isHttpError(error) && error.status === 401) {
				throw redirect({
					to: '/login',
					search: { redirect: location.href },
				})
			}
			throw error
		}

		const alreadyPrompted = getReadingSpeedPrompted()
		const isReadingSpeedRoute = location.pathname === '/reading-speed'

		if (!user.readingSpeed && !alreadyPrompted && !isReadingSpeedRoute) {
			setReadingSpeedPrompted()
			throw redirect({ to: '/reading-speed' })
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
