import type { GoalProgress, UpsertGoal } from '#/types/goal'
import { httpClient } from './client'

export function getGoal(): Promise<GoalProgress> {
	return httpClient.get('/goals')
}

export function upsertGoal(goal: UpsertGoal): Promise<GoalProgress> {
	return httpClient.post('/goals', goal)
}
