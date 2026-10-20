import type { Book } from './book'
import type { ReadingSession } from './reading-session'

export interface BookDetails {
	book: Book
	readingSessions: ReadingSession[]
	stats: {
		sessions: number
		readingTime: number
		activeDays: number
	}
}
