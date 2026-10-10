import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { SITE_URL } from '#/constants/site-url'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

interface MyRouterContext {
	queryClient: QueryClient
}

const DESCRIPTION =
	'Track your books, set goals, and follow your reading progress.'

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'description', content: DESCRIPTION },
			{ property: 'og:title', content: 'MyBookList' },
			{ property: 'og:description', content: DESCRIPTION },
			{ property: 'og:image', content: `${SITE_URL}/og-image.png` },
			{ property: 'og:site_name', content: 'MyBookList' },
			{ property: 'og:type', content: 'website' },
			{ name: 'twitter:title', content: 'MyBookList' },
			{ name: 'twitter:description', content: DESCRIPTION },
			{ name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ title: 'MyBookList' },
		],
		links: [
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
			},
			{
				rel: 'stylesheet',
				href: appCss,
			},
			{
				rel: 'icon',
				href: '/favicon.svg',
			},
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	const router = useRouter()

	useEffect(() => {
		function handlePageShow(event: PageTransitionEvent) {
			if (event.persisted) {
				router.invalidate()
			}
		}

		window.addEventListener('pageshow', handlePageShow)
		return () => window.removeEventListener('pageshow', handlePageShow)
	}, [router])

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Toaster theme="dark" richColors position="bottom-right" />
				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}
