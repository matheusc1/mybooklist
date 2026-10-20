import type { BookDetails } from '#/types/book-details'
import { httpClient } from './client'

export function getBookDetails(bookId: string): Promise<BookDetails> {
	return httpClient.get(`/book-details/${bookId}`)
}
