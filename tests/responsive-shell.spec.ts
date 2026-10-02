import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { authTest } from './fixtures/api'

async function expectNoHorizontalOverflow(page: Page, route: string) {
	const { clientWidth, scrollWidth } = await page.evaluate(() => ({
		clientWidth: document.documentElement.clientWidth,
		scrollWidth: document.documentElement.scrollWidth,
	}))
	expect(
		scrollWidth,
		`Unexpected horizontal overflow on ${route}: scrollWidth ${scrollWidth}, clientWidth ${clientWidth}`,
	).toBeLessThanOrEqual(clientWidth)
}

for (const viewport of [
	{ width: 1280, height: 900 },
	{ width: 390, height: 844 },
]) {
	authTest.describe(`${viewport.width}px authenticated shell`, () => {
		authTest.use({ viewport })

		authTest(
			'keeps navigation and user menu usable without horizontal overflow',
			async ({ authenticated, viewport }) => {
				if (!viewport) {
					throw new Error('The responsive test requires a viewport')
				}

				const page = await authenticated.context.newPage()
				await page.setViewportSize(viewport)

				await page.goto('/home')
				await expect(
					page.getByText('Add your first reading record to see stats here.'),
				).toBeVisible()
				await expectNoHorizontalOverflow(page, '/home')

				await page.getByRole('link', { name: 'My Books' }).click()
				await expect(page).toHaveURL(/\/books$/)
				await expect(
					page.getByRole('heading', { name: 'Your library is empty' }),
				).toBeVisible()
				await expectNoHorizontalOverflow(page, '/books')

				await page.getByRole('link', { name: 'Activity', exact: true }).click()
				await expect(page).toHaveURL(/\/activity$/)
				await expect(
					page.getByRole('button', { name: 'Previous month' }),
				).toBeEnabled()
				await expectNoHorizontalOverflow(page, '/activity')

				await page.getByRole('button', { name: 'Open user menu' }).click()
				await expect(
					page.getByRole('menuitem', { name: 'Take reading speed test' }),
				).toBeVisible()
				await page.keyboard.press('Escape')
				await expect(
					page.getByRole('menuitem', { name: 'Sign out' }),
				).toBeHidden()
			},
		)
	})
}
