import type { Book } from './book'

export interface WeeklyStats {
	pagesByDay: { day: string; pages: number }[]
	totalPagesRead: number
	totalReadingMinutes: number
	mostActiveDay: string | null
	daysStreak: number
}

export interface Dashboard {
	currentlyReading?: Book
	recentActivity: Book[]
	lastCompleted: Book[]
	weeklyStats: WeeklyStats
}
