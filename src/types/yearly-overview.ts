import type { Book } from './book'
import type { GoalProgress } from './goal'

export interface YearlyOverview {
	goal: GoalProgress
	yearlyStats: {
		sessions: number
		pages: number
		readingTime: number
		activeDays: number
		pagesByMonth: number[]
	}
	completedBooks: Book[]
}
