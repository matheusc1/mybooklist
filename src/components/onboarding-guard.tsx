import { useQuery } from '@tanstack/react-query'
import { Outlet, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { authQueryKey } from '#/utils/query-keys'
import { resolveCurrentUser } from '#/utils/resolve-current-user'

export function OnboardingGuard() {
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
