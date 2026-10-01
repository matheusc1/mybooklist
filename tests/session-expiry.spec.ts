import { expect, test } from '@playwright/test'
import { API_URL, authTest } from './fixtures/api'

authTest.describe('expired session', () => {
	authTest.use({ expired: true })

	authTest(
		'redirects a stale session to login with its requested route',
		async ({ authenticated }) => {
			const page = await authenticated.context.newPage()

			await page.goto('/books')
			await expect(page).toHaveURL(/\/login(?:\?.*)?$/)
			await expect(
				page.getByRole('link', { name: 'Continue with Google' }),
			).toHaveAttribute('href', `${API_URL}/auth/google`)
			await expect(
				page.getByRole('link', { name: 'Continue with GitHub' }),
			).toHaveAttribute('href', `${API_URL}/auth/github`)
			await expect(
				page.getByRole('heading', { name: /Sign In to MyBookList/ }),
			).toBeVisible()

			const redirect = new URL(page.url()).searchParams.get('redirect')
			expect(redirect).toBeTruthy()
			if (!redirect)
				throw new Error(
					'Expired-session redirect did not include the requested route',
				)
			expect(new URL(redirect, page.url()).pathname).toBe('/books')
		},
	)
})

test('login provider links target the configured API without navigating away', async ({
	page,
}) => {
	await page.goto('/login')
	await expect(
		page.getByRole('link', { name: 'Continue with Google' }),
	).toHaveAttribute('href', `${API_URL}/auth/google`)
	await expect(
		page.getByRole('link', { name: 'Continue with GitHub' }),
	).toHaveAttribute('href', `${API_URL}/auth/github`)
})
