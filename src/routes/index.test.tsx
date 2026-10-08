import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen } from '#/test/test-utils'

const { getMe, googleUrl, githubUrl } = vi.hoisted(() => ({
	getMe: vi.fn(),
	googleUrl: 'https://api.test/auth/google',
	githubUrl: 'https://api.test/auth/github',
}))

vi.mock('#/http/auth', () => ({
	getMe,
	logout: vi.fn(),
	getGoogleLoginUrl: () => googleUrl,
	getGithubLoginUrl: () => githubUrl,
}))

afterEach(() => {
	getMe.mockReset()
})

describe('landing page CTA', () => {
	it('shows sign-in CTAs when the visitor is not authenticated', async () => {
		getMe.mockRejectedValue({ status: 401, message: 'Unauthorized' })

		await renderWithRoute('/')

		expect(
			await screen.findByRole('link', { name: /get started/i }),
		).toHaveAttribute('href', '/login')
		expect(
			screen.getByRole('link', { name: /start for free/i }),
		).toHaveAttribute('href', '/login')

		const google = screen.getByRole('link', { name: /sign in with google/i })
		expect(google).toHaveAttribute('href', googleUrl)
		expect(google).toHaveAttribute('rel', 'nofollow')

		const github = screen.getByRole('link', { name: /sign in with github/i })
		expect(github).toHaveAttribute('href', githubUrl)
		expect(github).toHaveAttribute('rel', 'nofollow')

		expect(
			screen.queryByRole('link', { name: /go to app/i }),
		).not.toBeInTheDocument()
		expect(
			screen.queryByRole('link', { name: /go to your dashboard/i }),
		).not.toBeInTheDocument()
	})

	it('shows app CTAs pointing to /home when the visitor is authenticated', async () => {
		getMe.mockResolvedValue({
			id: 'user-1',
			email: 'test@example.com',
			name: 'Test User',
			avatarUrl: null,
			readingSpeed: 250,
		})

		await renderWithRoute('/')

		expect(
			await screen.findByRole('link', { name: /go to app/i }),
		).toHaveAttribute('href', '/home')
		expect(
			screen.getByRole('link', { name: /continue reading/i }),
		).toHaveAttribute('href', '/home')
		expect(
			screen.getByRole('link', { name: /go to your dashboard/i }),
		).toHaveAttribute('href', '/home')

		expect(
			screen.queryByRole('link', { name: /get started/i }),
		).not.toBeInTheDocument()
		expect(
			screen.queryByRole('link', { name: /sign in with google/i }),
		).not.toBeInTheDocument()
	})
})
