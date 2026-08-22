export interface ReadingSession {
	id: string
	bookId: string
	fromPage: number
	toPage: number
	durationSeconds: number
	readAt: string
	createdAt: string
	updatedAt: string
}

export interface CreateReadingSession {
	bookId: string
	fromPage: number
	toPage: number
	readAt?: string
}

export type UpdateReadingSession = Partial<
	Omit<CreateReadingSession, 'bookId'>
> & { id: string }
