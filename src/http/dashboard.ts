import type { Dashboard } from '#/types/dashboard'
import { httpClient } from './client'

export function getDashboard(): Promise<Dashboard> {
	return httpClient.get('/dashboard')
}
