import { test as base } from '@playwright/test'
import type { APIRequestContext, Browser, BrowserContext } from '@playwright/test'

export const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export interface TestUser {
	id: string
	provider: string
	providerId: string
	email: string
	name: string
	avatarUrl: string | null
	readingSpeed: number | null
	createdAt: string
}

export interface CreateAndLoginOptions {
	/**
	 * Short, unique-ish label for this fixture user (e.g. the test name).
	 * Gets baked into the generated email/providerId, not used for lookup.
	 */
	suffix: string
	/**
	 * Pass `null` to simulate a user who hasn't taken the reading-speed
	 * test yet (the onboarding scenario). Omit to default to 60.
	 */
	readingSpeed?: number | null
	/**
	 * When true, the issued cookie is already expired, for testing the
	 * "stale session redirects to login" scenario.
	 */
	expired?: boolean
}

/**
 * Calls the backend's test-only /test/login endpoint to create a fixture
 * user and set the same httpOnly session cookie the real OAuth flow would.
 * Requires the API to be running with E2E_TEST_MODE=true.
 */
export async function createAndLogin(
	request: APIRequestContext,
	options: CreateAndLoginOptions,
): Promise<TestUser> {
	const response = await request.post(`${API_URL}/test/login`, {
		data: {
			suffix: options.suffix,
			readingSpeed: options.readingSpeed,
			expired: options.expired,
		},
	})

	if (!response.ok()) {
		throw new Error(
			`Failed to create test user (${response.status()}): ${await response.text()}`,
		)
	}

	return response.json()
}

/**
 * Deletes a fixture user created via createAndLogin. Safe to call even if
 * the user was already deleted or never existed (the endpoint is a no-op
 * in that case), so it's fine to call unconditionally during cleanup.
 */
export async function deleteTestUser(
	request: APIRequestContext,
	userId: string,
): Promise<void> {
	await request.delete(`${API_URL}/test/users/${userId}`)
}

/**
 * Creates a fresh browser context already authenticated as a fixture user.
 * Use this instead of `browser.newContext()` in tests that need to start
 * already logged in.
 */
export async function createAuthenticatedContext(
	browser: Browser,
	options: CreateAndLoginOptions,
): Promise<{ context: BrowserContext; user: TestUser }> {
	const context = await browser.newContext()
	const user = await createAndLogin(context.request, options)
	return { context, user }
}

interface AuthFixtures {
	/** Options for the fixture user created for this test. Override with
	 * `authTest.use({ readingSpeed: null })` per test or per describe block. */
	readingSpeed: number | null | undefined
	expired: boolean | undefined
	/** An authenticated context + its user, cleaned up automatically after
	 * the test (pass or fail). */
	authenticated: { context: BrowserContext; user: TestUser }
}

/**
 * A Playwright test extended with an `authenticated` fixture: a browser
 * context already logged in as a fixture user, deleted (and its
 * books/sessions/goals cascaded) after the test runs.
 *
 * Usage:
 *   authTest('...', async ({ authenticated }) => {
 *     const page = await authenticated.context.newPage()
 *     await page.goto('/home')
 *   })
 *
 * Override per test or describe block:
 *   authTest.use({ readingSpeed: null }) // onboarding scenario
 *   authTest.use({ expired: true })      // stale-session scenario
 */
export const authTest = base.extend<AuthFixtures>({
	readingSpeed: undefined,
	expired: undefined,

	authenticated: async ({ browser, readingSpeed, expired }, use, testInfo) => {
		const context = await browser.newContext()
		const user = await createAndLogin(context.request, {
			suffix: testInfo.title.replace(/\s+/g, '-'),
			readingSpeed,
			expired,
		})

		await use({ context, user })

		await deleteTestUser(context.request, user.id)
		await context.close()
	},
})
