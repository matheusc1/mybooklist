import type { Book, CreateBook, UpdateBook } from '#/types/book'
import { httpClient } from './client'

export function getBooks(): Promise<Book[]> {
	return httpClient.get('/books')
}

export function createBook(book: CreateBook): Promise<Book> {
	return httpClient.post('/books', book)
}

export function updateBook(book: UpdateBook): Promise<Book> {
	return httpClient.patch(`/books/${book.id}`, book)
}

export function deleteBook(bookId: string) {
	return httpClient.delete(`/books/${bookId}`)
}
