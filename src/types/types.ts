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
