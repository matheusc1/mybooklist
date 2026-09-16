import { describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen } from '#/test/test-utils'

vi.mock('#/http/auth', () => ({
	getGoogleLoginUrl: () => '/auth/google',
	getGithubLoginUrl: () => '/auth/github',
	getMe: vi.fn().mockRejectedValue({ status: 401, message: 'Unauthorized' }),
}))

describe('Login', () => {
	it('renders provider links and legal navigation', async () => {
		await renderWithRoute('/login')

		expect(
			screen.getByRole('link', { name: /Continue with Google/i }),
		).toHaveAttribute('href', '/auth/google')
		expect(
			screen.getByRole('link', { name: /Continue with GitHub/i }),
		).toHaveAttribute('href', '/auth/github')
		expect(
			screen.getByRole('link', { name: 'Terms of Service' }),
		).toHaveAttribute('href', '/terms')
		expect(
			screen.getByRole('link', { name: 'Privacy Policy' }),
		).toHaveAttribute('href', '/privacy')
	})
})
