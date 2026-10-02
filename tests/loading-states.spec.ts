import { expect } from '@playwright/test'
import { API_URL, authTest } from './fixtures/api'

authTest(
	'shows the dashboard skeleton until its client request completes',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const endpoint = new URL('/dashboard', API_URL)

		await page.goto('/books')
		await expect(
			page.getByRole('heading', { name: 'Your library is empty' }),
		).toBeVisible()

		let releaseDashboardRequest!: () => void
		const dashboardResponseGate = new Promise<void>((resolve) => {
			releaseDashboardRequest = resolve
		})
		let signalDashboardRequest!: () => void
		const dashboardRequestObserved = new Promise<void>((resolve) => {
			signalDashboardRequest = resolve
		})

		await page.route(
			(url) => {
				const requestUrl = new URL(url)
				return (
					requestUrl.origin === endpoint.origin &&
					requestUrl.pathname === endpoint.pathname
				)
			},
			async (route) => {
				signalDashboardRequest()
				await dashboardResponseGate
				await route.continue()
			},
		)

		try {
			await page.getByRole('link', { name: 'Home', exact: true }).click()
			await dashboardRequestObserved
			await expect(page.getByTestId('dashboard-skeleton')).toBeVisible()

			releaseDashboardRequest()
			await expect(page.getByTestId('dashboard-skeleton')).toHaveCount(0)
			await expect(
				page.getByText('Add your first reading record to see stats here.'),
			).toBeVisible()
		} finally {
			releaseDashboardRequest()
		}
	},
)
