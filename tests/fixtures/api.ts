import { randomUUID } from 'node:crypto'
import type {
	APIRequestContext,
	Browser,
	BrowserContext,
} from '@playwright/test'
import { test as base } from '@playwright/test'

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

export type BookStatus =
	| 'planned'
	| 'reading'
	| 'completed'
	| 'paused'
	| 'dropped'

export interface SeedBookOptions {
	/** Defaults to a unique "E2E Book xxxxxxxx" title. */
	title?: string
	/** Defaults to "E2E Test Author". */
	author?: string
	/** Defaults to "Fantasy". */
	genre?: string
	/** Defaults to 10. */
	totalPages?: number
	/** Omit to let the API default it (0). */
	currentPage?: number
	/** Defaults to "reading". */
	status?: BookStatus
}

export interface SeededBook {
	id: string
	title: string
	author: string
	genre: string
	totalPages: number
	currentPage: number
	status: BookStatus
}

/**
 * Creates a book through the real API as the user the request context is
 * logged in as. Pass `authenticated.context.request`: a browser context's
 * request object shares its cookie jar with the context, so the session set
 * by /test/login applies here too.
 */
export async function seedBook(
	request: APIRequestContext,
	options: SeedBookOptions = {},
): Promise<SeededBook> {
	const response = await request.post(`${API_URL}/books`, {
		data: {
			title: options.title ?? `E2E Book ${randomUUID().slice(0, 8)}`,
			author: options.author ?? 'E2E Test Author',
			genre: options.genre ?? 'Fantasy',
			totalPages: options.totalPages ?? 10,
			currentPage: options.currentPage,
			status: options.status ?? 'reading',
		},
	})

	if (!response.ok()) {
		throw new Error(
			`Failed to seed book (${response.status()}): ${await response.text()}`,
		)
	}

	return response.json()
}

export interface SeedSessionOptions {
	bookId: string
	fromPage: number
	toPage: number
	/** Date as YYYY-MM-DD. Omit to let the server default it to today. */
	readAt?: string
}

export interface SeededSession {
	id: string
	bookId: string
	fromPage: number
	toPage: number
	durationSeconds: number
	readAt: string
}

/**
 * Records a reading session through the real API. It goes through the same
 * backend status synchronization as a UI-created session, so a session that
 * reaches the book's totalPages completes the book.
 */
export async function seedSession(
	request: APIRequestContext,
	options: SeedSessionOptions,
): Promise<SeededSession> {
	const response = await request.post(`${API_URL}/reading-sessions`, {
		data: options,
	})

	if (!response.ok()) {
		throw new Error(
			`Failed to seed reading session (${response.status()}): ${await response.text()}`,
		)
	}

	return response.json()
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
