import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen } from '#/test/test-utils'

const http = vi.hoisted(() => ({
	getBooks: vi.fn(),
	getDashboard: vi.fn(),
	getActivity: vi.fn(),
}))

vi.mock('#/http/books', async (importOriginal) => ({
	...(await importOriginal<typeof import('#/http/books')>()),
	getBooks: http.getBooks,
}))
vi.mock('#/http/dashboard', async (importOriginal) => ({
	...(await importOriginal<typeof import('#/http/dashboard')>()),
	getDashboard: http.getDashboard,
}))
vi.mock('#/http/activity', async (importOriginal) => ({
	...(await importOriginal<typeof import('#/http/activity')>()),
	getActivity: http.getActivity,
}))

const circular: Record<string, unknown> = {}
circular.self = circular

describe('ErrorComponent', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllEnvs()
	})

	it.each([
		['/books', http.getBooks],
		['/home', http.getDashboard],
		['/activity', http.getActivity],
	])('replaces %s when its query fails without data', async (path, request) => {
		request.mockRejectedValue(new Error('Server error'))

		await renderWithRoute(path, { authenticated: true })

		expect(await screen.findByText('This page hit a snag.')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute(
			'href',
			'/home',
		)
	})

	it('recovers with Try again once the request succeeds', async () => {
		const user = userEvent.setup()
		http.getBooks.mockRejectedValueOnce(new Error('Server error'))
		http.getBooks.mockResolvedValue([])
		await renderWithRoute('/books', { authenticated: true })

		await user.click(await screen.findByRole('button', { name: 'Try again' }))

		expect(await screen.findByText('Your library is empty')).toBeInTheDocument()
	})

	it.each([
		['an Error', new Error('boom'), 'boom'],
		['a string', 'boom', 'boom'],
		['a plain object', { code: 1 }, '{"code":1}'],
		['an unserializable object', circular, '[object Object]'],
	])('describes %s in the dev details', async (_label, thrown, expected) => {
		const user = userEvent.setup()
		http.getBooks.mockRejectedValue(thrown)
		await renderWithRoute('/books', { authenticated: true })

		await user.click(
			await screen.findByRole('button', { name: /show error details/i }),
		)

		expect(screen.getByText(expected)).toBeInTheDocument()
	})

	it('does not offer error details outside development', async () => {
		vi.stubEnv('DEV', false)
		http.getBooks.mockRejectedValue(new Error('boom'))
		await renderWithRoute('/books', { authenticated: true })

		expect(await screen.findByText('This page hit a snag.')).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: /show error details/i }),
		).not.toBeInTheDocument()
		expect(screen.queryByText('boom')).not.toBeInTheDocument()
	})
})
