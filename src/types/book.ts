import type { ActivityStatus } from '#/constants/book-status'

export interface Book {
	id: string
	userId: string
	title: string
	author: string
	genre: string
	coverUrl: string | null
	totalPages: number
	currentPage: number | null
	status: ActivityStatus
	rating: number | null
	startedAt: string | null
	completedAt: string | null
	createdAt: string
	updatedAt: string
}

export interface CreateBook {
	title: string
	author: string
	coverUrl?: string
	totalPages: number
	currentPage?: number
	status: ActivityStatus
	rating?: number
	startedAt?: string
	completedAt?: string
}

export type UpdateBook = Partial<CreateBook> & { id: string }
