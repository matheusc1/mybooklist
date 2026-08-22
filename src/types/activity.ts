export interface Activity {
	monthlyStats: {
		sessions: number
		pages: number
		readingTime: number
		activeDays: number
	}
	monthlyActivity: {
		date: string
		sessions: {
			id: string
			bookId: string
			title: string
			author: string
			coverUrl: string | null
			fromPage: number
			toPage: number
			duration: number
		}[]
	}[]
}
