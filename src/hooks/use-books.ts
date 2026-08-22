import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBook, deleteBook, getBooks, updateBook } from '#/http/books'
import { invalidateDomain, queryKeys } from '#/utils/query-keys'

export function useBooks() {
	return useQuery({
		queryKey: queryKeys.books,
		queryFn: getBooks,
	})
}

export function useCreateBook() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createBook,
		onSuccess: () => invalidateDomain(queryClient, 'books'),
	})
}

export function useUpdateBook() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateBook,
		onSuccess: () => invalidateDomain(queryClient, 'books'),
	})
}

export function useDeleteBook() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteBook,
		onSuccess: () => invalidateDomain(queryClient, 'books'),
	})
}
