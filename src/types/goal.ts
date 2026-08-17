export interface GoalProgress {
	year: number
	target: number | null
	current: number
}

export type UpsertGoal = { target: number }
