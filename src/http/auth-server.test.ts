import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchMeServer } from './auth-server'

const originalFetch = globalThis.fetch

afterEach(() => {
	globalThis.fetch = originalFetch
	vi.restoreAllMocks()
})

describe('fetchMeServer', () => {
	it('forwards the incoming cookie and returns the authenticated user', async () => {
		const user = { id: 'user-1', name: 'Reader' }
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(user), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		)
		globalThis.fetch = fetchMock

		await expect(fetchMeServer('session=abc')).resolves.toEqual(user)

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining('/auth/me'),
			{ headers: { Cookie: 'session=abc' } },
		)
	})

	it('omits request headers when no cookie is available', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ id: 'user-1' }), { status: 200 }),
			)
		globalThis.fetch = fetchMock

		await fetchMeServer()

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining('/auth/me'),
			{
				headers: undefined,
			},
		)
	})

	it('converts an unsuccessful response into an HTTP error', async () => {
		globalThis.fetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ message: 'Not authenticated' }), {
				status: 401,
				statusText: 'Unauthorized',
			}),
		)

		await expect(fetchMeServer()).rejects.toEqual({
			status: 401,
			message: 'Not authenticated',
		})
	})
})
