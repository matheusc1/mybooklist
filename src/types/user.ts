export interface User {
	id: string
	email: string
	name: string
	avatarUrl: string | null
	readingSpeed: number | null
}

export type UserUI = Pick<User, 'email' | 'name' | 'avatarUrl'>

export type UpdateReadingSpeed = { readingSpeed: number }
