import { expect } from '@playwright/test'
import { API_URL, authTest } from './fixtures/api'

authTest.describe('reading-speed maintenance', () => {
	authTest.use({ readingSpeed: 120 })

	authTest(
		'updates reading speed through the user menu test flow',
		async ({ authenticated }) => {
			const page = await authenticated.context.newPage()

			await page.goto('/home')
			await expect(page.getByTestId('dashboard-skeleton')).toHaveCount(0)
			await page.getByRole('button', { name: 'Open user menu' }).click()
			// menu item is rendered as a link inside the Radix item; wait for the text and click it
			const takeTest = page.getByText('Take reading speed test')
			await takeTest.waitFor({ state: 'visible' })
			await takeTest.click()
			await expect(page).toHaveURL(/\/reading-speed$/)

			await page.getByRole('button', { name: /Start Reading/ }).click()
			await expect(
				page.getByRole('heading', { name: 'Page 1 of 2' }),
			).toBeVisible()
			await page.getByRole('button', { name: /Next page/ }).click()
			await expect(
				page.getByRole('heading', { name: 'Page 2 of 2' }),
			).toBeVisible()
			await page.getByRole('button', { name: /^Finish/ }).click()
			await expect(
				page.getByRole('heading', { name: "Here's your reading pace" }),
			).toBeVisible()

			const saveResponse = page.waitForResponse(
				(response) =>
					response.url().endsWith('/users/reading-speed') &&
					response.request().method() === 'PATCH',
			)
			await page.getByRole('button', { name: /Update reading pace/ }).click()
			expect((await saveResponse).ok()).toBeTruthy()

			const meResponse = await authenticated.context.request.get(
				`${API_URL}/auth/me`,
			)
			expect(meResponse.ok()).toBeTruthy()
			const user = (await meResponse.json()) as { readingSpeed: number | null }
			expect(user.readingSpeed).toBe(60)
		},
	)
})
