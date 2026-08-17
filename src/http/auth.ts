import type { User } from '#/types/user'
import { API_URL, httpClient } from './client'

export function getMe(): Promise<User> {
	return httpClient.get('/auth/me')
}

export function logout(): Promise<{ message: string }> {
	return httpClient.post('/auth/logout')
}

export function getGoogleLoginUrl(): string {
	return `${API_URL}/auth/google`
}

export function getGithubLoginUrl(): string {
	return `${API_URL}/auth/github`
}
