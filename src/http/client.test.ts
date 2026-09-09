import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildHttpError, httpClient, isHttpError } from './client'

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('isHttpError', () => {
	it('recognizes objects with status and message fields', () => {
		expect(isHttpError({ status: 404, message: 'Not found' })).toBe(true)
	})

	it('rejects null, primitives, and incomplete objects', () => {
		expect(isHttpError(null)).toBe(false)
		expect(isHttpError('error')).toBe(false)
		expect(isHttpError({ status: 500 })).toBe(false)
		expect(isHttpError({ message: 'error' })).toBe(false)
	})
})

describe('buildHttpError', () => {
	it('uses the backend error message when available', async () => {
		const response = new Response(JSON.stringify({ message: 'Unauthorized' }), {
			status: 401,
			statusText: 'Unauthorized',
		})

		await expect(buildHttpError(response)).resolves.toEqual({
			status: 401,
			message: 'Unauthorized',
		})
	})

	it('falls back to the response status text for invalid error bodies', async () => {
		const response = new Response('not json', {
			status: 500,
			statusText: 'Internal Server Error',
		})

		await expect(buildHttpError(response)).resolves.toEqual({
			status: 500,
			message: 'Internal Server Error',
		})
	})
})

describe('httpClient', () => {
	it('builds GET requests with params and shared request defaults', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ ok: true }), { status: 200 }),
			)
		vi.stubGlobal('fetch', fetchMock)

		await expect(
			httpClient.get<{ ok: boolean }>('/books', {
				page: 2,
				includeArchived: false,
				ignored: undefined,
			}),
		).resolves.toEqual({ ok: true })

		const [calledUrl, calledInit] = fetchMock.mock.calls[0]
		expect(calledUrl.toString()).toBe(
			'http://localhost:3000/books?page=2&includeArchived=false',
		)
		expect(calledInit).toEqual({
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: undefined,
		})
	})

	it('serializes request bodies and applies the JSON content type', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ id: 'book-1' }), { status: 200 }),
			)
		vi.stubGlobal('fetch', fetchMock)

		await httpClient.post('/books', { title: 'The Hobbit' })

		expect(fetchMock).toHaveBeenCalledWith(
			new URL('http://localhost:3000/books'),
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: 'The Hobbit' }),
			},
		)
	})

	it('returns undefined for a successful 204 response', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 204 }))
		vi.stubGlobal('fetch', fetchMock)

		await expect(httpClient.delete('/books/book-1')).resolves.toBeUndefined()
	})

	it('throws a structured error for unsuccessful responses', async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ message: 'Forbidden' }), {
				status: 403,
				statusText: 'Forbidden',
			}),
		)
		vi.stubGlobal('fetch', fetchMock)

		await expect(httpClient.get('/books')).rejects.toEqual({
			status: 403,
			message: 'Forbidden',
		})
	})
})
