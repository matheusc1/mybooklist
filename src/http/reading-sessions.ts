import type {
	CreateReadingSession,
	ReadingSession,
	UpdateReadingSession,
} from '#/types/reading-session'
import { httpClient } from './client'

export function createReadingSession(
	readingSession: CreateReadingSession,
): Promise<ReadingSession> {
	return httpClient.post('/reading-sessions', readingSession)
}

export function updateReadingSession(
	readingSession: UpdateReadingSession,
): Promise<ReadingSession> {
	const { id, ...data } = readingSession
	return httpClient.patch(`/reading-sessions/${id}`, data)
}

export function deleteReadingSession(
	id: string,
	resetToPlanned: boolean = false,
) {
	return httpClient.delete(
		`/reading-sessions/${id}?resetToPlanned=${resetToPlanned}`,
	)
}
