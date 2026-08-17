import type { Book } from './book'

export interface Dashboard {
	currentlyReading: Book | null
	recentActivity: Book[]
	lastCompleted: Book[]
	weeklyStats: {
		pagesByDay: { day: string; pages: number }[]
		totalPagesRead: number
		totalReadingMinutes: number
		mostActiveDay: string | null
		daysStreak: number
	}
}
