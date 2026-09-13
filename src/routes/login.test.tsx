import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter, screen } from '#/test/test-utils'
import { Login } from './login'

vi.mock('#/http/auth', () => ({
	getGoogleLoginUrl: () => '/auth/google',
	getGithubLoginUrl: () => '/auth/github',
	getMe: vi.fn(),
}))

describe('Login', () => {
	it('renders provider links and legal navigation', () => {
		renderWithRouter(<Login />)

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
