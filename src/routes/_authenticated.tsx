import { useQuery } from '@tanstack/react-query'
import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
	useMatches,
	useRouter,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { GoalModal } from '#/components/modals/goal-modal'
import { NavBar } from '#/components/ui/nav-bar'
import { isHttpError } from '#/http/client'
import { authQueryKey } from '#/utils/query-keys'
import { resolveCurrentUser } from '#/utils/resolve-current-user'

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ location, context }) => {
		try {
			await context.queryClient.ensureQueryData({
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
	},
	component: Layout,
})

function Layout() {
	const matches = useMatches()
	const hideNav = matches.some((match) => match.staticData?.hideNav)

	return (
		<div className="min-h-dvh flex flex-col">
			{!hideNav && <NavBar />}
			<OnboardingGuard />
			<GoalModal />
		</div>
	)
}

function OnboardingGuard() {
	const router = useRouter()
	const location = useLocation()
	const { data: user } = useQuery({
		queryKey: authQueryKey,
		queryFn: resolveCurrentUser,
	})
	const [isReady, setIsReady] = useState(() => !!user?.readingSpeed)

	useEffect(() => {
		if (!user) return

		let prompted = false

		try {
			prompted = sessionStorage.getItem('reading-speed-prompted') === 'true'
		} catch {
			// ignore: sessionStorage unavailable
		}

		const needsOnboarding = !user.readingSpeed
		const isReadingSpeedRoute = location.pathname === '/reading-speed'

		if (needsOnboarding && !prompted && !isReadingSpeedRoute) {
			router.navigate({
				to: '/reading-speed',
				replace: true,
			})
			return
		}

		setIsReady(true)
	}, [user, location.pathname, router])

	if (!isReady) {
		return null
	}

	return <Outlet />
}
