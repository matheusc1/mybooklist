import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	createReadingSession,
	deleteReadingSession,
	updateReadingSession,
} from '#/http/reading-sessions'
import { invalidateDomain } from '#/utils/query-keys'

export function useCreateReadingSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createReadingSession,
		onSuccess: () => invalidateDomain(queryClient, 'readingSessions'),
	})
}

export function useUpdateReadingSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateReadingSession,
		onSuccess: () => invalidateDomain(queryClient, 'readingSessions'),
	})
}

export function useDeleteReadingSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			resetToPlanned,
		}: {
			id: string
			resetToPlanned?: boolean
		}) => deleteReadingSession(id, resetToPlanned),
		onSuccess: () => invalidateDomain(queryClient, 'readingSessions'),
	})
}
