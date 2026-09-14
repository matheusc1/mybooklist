import { getMe } from '#/http/auth'
import { getMeServer } from '#/http/auth-server'

export function resolveCurrentUser() {
	return typeof window === 'undefined' ? getMeServer() : getMe()
}
