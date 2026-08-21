import type { Book, CreateBook, UpdateBook } from '#/types/book'
import { httpClient } from './client'

export function getBooks(): Promise<Book[]> {
	return httpClient.get('/books')
}

export function createBook(book: CreateBook): Promise<Book> {
	return httpClient.post('/books', book)
}

export function updateBook(book: UpdateBook): Promise<Book> {
	const { id, ...data } = book
	return httpClient.patch(`/books/${id}`, data)
}

export function deleteBook(bookId: string) {
	return httpClient.delete(`/books/${bookId}`)
}
