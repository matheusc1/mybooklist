import { expect } from '@playwright/test'
import { authTest } from './fixtures/api'

authTest('navigates the protected shell and signs out', async ({
	authenticated,
}) => {
	const page = await authenticated.context.newPage()

	await page.goto('/home')
	await expect(page.getByRole('heading', { name: 'Bookshelf' })).toBeVisible()
	await expect(
		page.getByRole('link', { name: 'Home', exact: true }),
	).toHaveAttribute('aria-current', 'page')

	await page.getByRole('link', { name: 'My Books' }).click()
	await expect(page).toHaveURL(/\/books$/)
	await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible()
	await expect(page.getByRole('link', { name: 'My Books' })).toHaveAttribute(
		'aria-current',
		'page',
	)

	await page.getByRole('link', { name: 'Activity', exact: true }).click()
	await expect(page).toHaveURL(/\/activity$/)
	await expect(page.getByRole('heading', { name: 'Activity' })).toBeVisible()
	await expect(
		page.getByRole('link', { name: 'Activity', exact: true }),
	).toHaveAttribute('aria-current', 'page')

	await page.getByRole('button', { name: 'Open user menu' }).click()
	const logoutResponsePromise = page.waitForResponse(
		(response) =>
			response.url().endsWith('/auth/logout') &&
			response.request().method() === 'POST',
	)
	await page.getByRole('menuitem', { name: 'Sign out' }).click()
	expect((await logoutResponsePromise).ok()).toBeTruthy()
	await expect(page).toHaveURL(/\/login$/)
	await expect(page.getByRole('heading', { name: /Sign In to MyBookList/ })).toBeVisible()

	await page.goto('/home')
	await expect(page).toHaveURL(/\/login(?:\?.*)?$/)
	await expect(page.getByRole('heading', { name: /Sign In to MyBookList/ })).toBeVisible()
})
