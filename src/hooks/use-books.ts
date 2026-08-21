import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBook, deleteBook, getBooks, updateBook } from '#/http/books'

export function useBooks() {
	return useQuery({
		queryKey: ['books'],
		queryFn: getBooks,
	})
}

export function useCreateBook() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createBook,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] })
		},
	})
}

export function useUpdateBook() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateBook,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] })
		},
	})
}

export function useDeleteBook() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteBook,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] })
		},
	})
}
