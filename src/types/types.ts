import type { ActivityStatus } from '#/constants/book-status'

export type User = {
	name: string
	email: string
	avatar?: string
}

export type Goal = {
	id: string
	target: number
	current: number
	year: number
}

export type Book = {
	id: string
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
			bookCover: string | null
			fromPage: number
			toPage: number
			duration: number
		}[]
	}[]
}

export type Mode = 'add' | 'edit' | 'view'
