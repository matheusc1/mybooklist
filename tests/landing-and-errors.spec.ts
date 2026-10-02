import { expect, test } from '@playwright/test'
import { API_URL, authTest } from './fixtures/api'

const getApiEndpoint = (path: string) => new URL(path, API_URL).toString()

authTest(
	'shows the authenticated landing CTA for a visitor with a real session',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const meResponse = page.waitForResponse(
			(response) =>
				response.url() === getApiEndpoint('/auth/me') &&
				response.status() === 200,
		)

		await page.goto('/')
		expect((await meResponse).ok()).toBeTruthy()
		await expect(page.getByRole('link', { name: 'Go to app' })).toHaveAttribute(
			'href',
			'/home',
		)
	},
)

test('does not show an Unauthorized toast on a direct visit to /', async ({
	page,
}) => {
	const meResponse = page.waitForResponse(
		(response) =>
			response.url() === getApiEndpoint('/auth/me') &&
			response.status() === 401,
	)

	await page.goto('/')
	expect((await meResponse).status()).toBe(401)

	// Wait for the expected 401 first so this absence check cannot pass before
	// the browser has had a chance to render an error toast.
	await expect(page.getByText('Unauthorized', { exact: true })).toHaveCount(0)
})

test('does not show an Unauthorized toast on a direct visit to /login', async ({
	page,
}) => {
	await page.goto('/login')

	// On a direct visit the /auth/me call runs in the route's beforeLoad during
	// SSR, so the browser never sees the 401. This only guards against a
	// client-side regression, so wait for content that exists after hydration.
	await expect(
		page.getByRole('heading', { name: /Sign In to MyBookList/ }),
	).toBeVisible()
	await expect(
		page.getByRole('link', { name: 'Continue with Google' }),
	).toBeVisible()
	await expect(page.getByText('Unauthorized', { exact: true })).toHaveCount(0)
})

test('does not show an Unauthorized toast when navigating to /login on the client', async ({
	page,
}) => {
	await page.goto('/')
	await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible()

	// A client-side navigation runs beforeLoad in the browser, so the 401 is
	// observable here, unlike on a direct visit.
	const meResponse = page.waitForResponse(
		(response) =>
			response.url() === getApiEndpoint('/auth/me') &&
			response.status() === 401,
	)
	await page.getByRole('link', { name: 'Get Started' }).click()
	expect((await meResponse).status()).toBe(401)
	await expect(page).toHaveURL(/\/login$/)
	await expect(
		page.getByRole('heading', { name: /Sign In to MyBookList/ }),
	).toBeVisible()

	await expect(page.getByText('Unauthorized', { exact: true })).toHaveCount(0)
})

test('renders the root SEO metadata in the hydrated page and server HTML', async ({
	page,
}) => {
	await page.goto('/')

	const serverResponse = await page.request.get(
		new URL('/', page.url()).toString(),
	)
	expect(serverResponse.ok()).toBeTruthy()
	const serverHtml = await serverResponse.text()

	const ogDescription =
		'Track your books, set goals, and follow your reading progress.'

	await expect(page).toHaveTitle('MyBookList')
	await expect(page.locator('meta[charset]')).toHaveAttribute(
		'charset',
		'utf-8',
	)
	await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
		'content',
		'width=device-width, initial-scale=1',
	)
	await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
		'content',
		'MyBookList',
	)
	await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
		'content',
		ogDescription,
	)
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		/\/og-image\.png$/,
	)
	await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
		'content',
		'website',
	)
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		'content',
		'summary_large_image',
	)

	expect(serverHtml).toMatch(/<title>MyBookList<\/title>/)
	expect(serverHtml).toMatch(/<meta\b(?=[^>]*charset="utf-8")[^>]*>/i)
	expect(serverHtml).toMatch(
		/<meta\b(?=[^>]*name="viewport")(?=[^>]*content="width=device-width, initial-scale=1")[^>]*>/,
	)
	expect(serverHtml).toMatch(
		/<meta\b(?=[^>]*property="og:title")(?=[^>]*content="MyBookList")[^>]*>/,
	)
	const escapeRegExp = (value: string) =>
		value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

	expect(serverHtml).toMatch(
		new RegExp(
			`<meta\\b(?=[^>]*property="og:description")(?=[^>]*content="${escapeRegExp(ogDescription)}")[^>]*>`,
		),
	)
	expect(serverHtml).toMatch(
		/<meta\b(?=[^>]*property="og:image")(?=[^>]*content="[^"]*\/og-image\.png")[^>]*>/,
	)
	expect(serverHtml).toMatch(
		/<meta\b(?=[^>]*property="og:type")(?=[^>]*content="website")[^>]*>/,
	)
	expect(serverHtml).toMatch(
		/<meta\b(?=[^>]*name="twitter:card")(?=[^>]*content="summary_large_image")[^>]*>/,
	)
})

test('renders the Terms of Service page', async ({ page }) => {
	await page.goto('/terms')
	await expect(
		page.getByRole('heading', { name: 'Terms of Service' }),
	).toBeVisible()
})

test('renders the Privacy Policy page', async ({ page }) => {
	await page.goto('/privacy')
	await expect(
		page.getByRole('heading', { name: 'Privacy Policy' }),
	).toBeVisible()
})

test('renders the not-found page for an unknown route', async ({ page }) => {
	await page.goto('/e2e-unknown-route')
	await expect(
		page.getByRole('heading', { name: "This page doesn't exist — yet." }),
	).toBeVisible()
})

authTest(
	'renders the generic message when a dashboard API request fails',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const endpoint = new URL('/dashboard', API_URL)

		await page.goto('/books')
		await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible()
		await expect(
			page.getByRole('heading', { name: 'Your library is empty' }),
		).toBeVisible()

		await page.route(
			(url) => {
				const requestUrl = new URL(url)
				return (
					requestUrl.origin === endpoint.origin &&
					requestUrl.pathname === endpoint.pathname
				)
			},
			(route) =>
				route.fulfill({
					status: 500,
					contentType: 'application/json',
					body: JSON.stringify({ message: 'Internal Server Error' }),
				}),
		)

		const failedDashboardResponse = page.waitForResponse(
			(response) =>
				response.url().startsWith(endpoint.toString()) &&
				response.status() === 500,
		)
		await page.getByRole('link', { name: 'Home', exact: true }).click()
		expect((await failedDashboardResponse).status()).toBe(500)
		await expect(
			page.getByText('Something went wrong. Please try again.', {
				exact: true,
			}),
			// Longer timeout on purpose: TanStack Query retries failed requests with
			// exponential backoff (1s, 2s, 4s by default), and the mocked endpoint
			// always returns 500, so the error message only shows after the last retry.
		).toBeVisible({ timeout: 15_000 })
	},
)
