import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import type { User } from '#/types/user'
import { API_URL, buildHttpError } from './client'

export async function fetchMeServer(cookie?: string): Promise<User> {
	const response = await fetch(`${API_URL}/auth/me`, {
		headers: cookie ? { Cookie: cookie } : undefined,
	})

	if (!response.ok) {
		throw await buildHttpError(response)
	}

	return response.json()
}

export const getMeServer = createServerFn({ method: 'GET' }).handler(
	async (): Promise<User> => {
		const cookie = getRequestHeader('cookie')
		return fetchMeServer(cookie)
	},
)
