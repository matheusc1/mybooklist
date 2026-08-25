import type { Activity } from '#/types/activity'
import { httpClient } from './client'

export function getActivity(month: string): Promise<Activity> {
	return httpClient.get(`/activity?month=${month}`)
}
