import type { UpdateReadingSpeed } from '#/types/user'
import { httpClient } from './client'

export function updateReadingSpeed(readingSpeed: UpdateReadingSpeed) {
	return httpClient.patch('/users/reading-speed', readingSpeed)
}
