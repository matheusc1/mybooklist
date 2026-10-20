import { useQuery } from '@tanstack/react-query'
import { getBookDetails } from '#/http/books-details'
import { queryKeys } from '#/utils/query-keys'

export function useBookDetails(bookId: string) {
	return useQuery({
		queryKey: [...queryKeys.bookDetails, bookId],
		queryFn: () => getBookDetails(bookId),
	})
}
