export type ActivityStatus =
	| 'reading'
	| 'finished'
	| 'paused'
	| 'abandoned'
	| 'want-to-read'

export type User = {
	name: string
	email: string
	avatar?: string
}

export type Goal = {
	target: number
	current: number
	year: number
}

export type Book = {
	id: number
	title: string
	author: string
	genre: string
	status: ActivityStatus
	currentPage: number
	totalPages: number
	rating?: number
	bookCover?: string
	startDate?: string
	endDate?: string
	updatedAt: string
}

export interface ActivityResponse {
	stats: {
		sessions: number
		pages: number
		readingTime: number
		activeDays: number
	}
	calendar: {
		date: string
		sessions: {
			bookId: string
			title: string
			author: string
			fromPage: number
			toPage: number
			duration: number
		}[]
	}[]
}
