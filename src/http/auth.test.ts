import { describe, expect, it } from 'vitest'
import { getGithubLoginUrl, getGoogleLoginUrl } from './auth'
import { API_URL } from './client'

describe('auth login URLs', () => {
	it('builds the Google login URL from the API base URL', () => {
		expect(getGoogleLoginUrl()).toBe(`${API_URL}/auth/google`)
	})

	it('builds the GitHub login URL from the API base URL', () => {
		expect(getGithubLoginUrl()).toBe(`${API_URL}/auth/github`)
	})
})
