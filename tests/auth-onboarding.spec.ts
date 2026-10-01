import { expect, test } from '@playwright/test'
import { authTest } from './fixtures/api'

test('redirects unauthenticated visitors to login with the requested route', async ({
	page,
}) => {
	await page.goto('/books')

	await expect(page).toHaveURL(/\/login(?:\?.*)?$/)
	await expect(
		page.getByRole('link', { name: 'Continue with Google' }),
	).toBeVisible()
	await expect(
		page.getByRole('link', { name: 'Continue with GitHub' }),
	).toBeVisible()

	const redirect = new URL(page.url()).searchParams.get('redirect')
	if (!redirect) {
		throw new Error('Login redirect did not preserve the requested route')
	}
	expect(new URL(redirect, page.url()).pathname).toBe('/books')
})

authTest.describe('first-login reading-speed onboarding', () => {
	authTest.use({ readingSpeed: null })

	authTest(
		'completes the pace test, saves it, and stays onboarded after reload',
		async ({ authenticated }) => {
			const page = await authenticated.context.newPage()

			await page.goto('/home')
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

			const saveResponsePromise = page.waitForResponse(
				(response) =>
					response.url().endsWith('/users/reading-speed') &&
					response.request().method() === 'PATCH',
			)
			await page.getByRole('button', { name: /Update reading pace/ }).click()
			expect((await saveResponsePromise).ok()).toBeTruthy()
			await expect(page).toHaveURL(/\/home$/)
			await expect(
				page.getByRole('heading', { name: 'Bookshelf' }),
			).toBeVisible()

			await page.reload()
			await expect(page).toHaveURL(/\/home$/)
			await expect(
				page.getByRole('heading', { name: 'Bookshelf' }),
			).toBeVisible()
			await page.getByRole('link', { name: 'My Books' }).click()
			await expect(page).toHaveURL(/\/books$/)
			await expect(
				page.getByRole('heading', { name: 'My Books' }),
			).toBeVisible()
		},
	)

	authTest(
		'can escape onboarding via the logo and use the app this session',
		async ({ authenticated }) => {
			const page = await authenticated.context.newPage()

			await page.goto('/home')
			await expect(page).toHaveURL(/\/reading-speed$/)

			await page.getByRole('button', { name: 'Back to home' }).click()
			await expect(page).toHaveURL(/\/home$/)
			await expect(
				page.getByRole('heading', { name: 'Bookshelf' }),
			).toBeVisible()

			await page.reload()
			await expect(page).toHaveURL(/\/home$/)
			await expect(
				page.getByRole('heading', { name: 'Bookshelf' }),
			).toBeVisible()
			await page.getByRole('link', { name: 'My Books' }).click()
			await expect(page).toHaveURL(/\/books$/)
			await expect(
				page.getByRole('heading', { name: 'My Books' }),
			).toBeVisible()
		},
	)

	authTest(
		'prompts again in a fresh browser context for the same user',
		async ({ authenticated }) => {
			const sourcePage = await authenticated.context.newPage()
			await sourcePage.goto('/home')
			await expect(sourcePage).toHaveURL(/\/reading-speed$/)

			const browser = authenticated.context.browser()
			if (!browser)
				throw new Error('The authenticated browser context is closed')

			const freshContext = await browser.newContext()
			try {
				await freshContext.addCookies(await authenticated.context.cookies())
				const page = await freshContext.newPage()
				const homeUrl = new URL('/home', sourcePage.url())
				await page.goto(homeUrl.toString())

				await expect(page).toHaveURL(/\/reading-speed$/)
				await expect(
					page.getByRole('heading', {
						name: "Let's measure your reading pace",
					}),
				).toBeVisible()
			} finally {
				await freshContext.close()
			}
		},
	)

	authTest(
		'skips onboarding from the result and keeps authenticated navigation available',
		async ({ authenticated }) => {
			const page = await authenticated.context.newPage()

			await page.goto('/home')
			await expect(page).toHaveURL(/\/reading-speed$/)
			await page.getByRole('button', { name: /Start Reading/ }).click()
			await page.getByRole('button', { name: /Next page/ }).click()
			await page.getByRole('button', { name: /^Finish/ }).click()
			await expect(
				page.getByRole('heading', { name: "Here's your reading pace" }),
			).toBeVisible()

			await page.getByRole('link', { name: 'Skip and go to home' }).click()
			await expect(page).toHaveURL(/\/home$/)
			await expect(
				page.getByRole('heading', { name: 'Bookshelf' }),
			).toBeVisible()
			await page.getByRole('link', { name: 'My Books' }).click()
			await expect(page).toHaveURL(/\/books$/)
			await expect(
				page.getByRole('heading', { name: 'Your library is empty' }),
			).toBeVisible()
		},
	)
})
