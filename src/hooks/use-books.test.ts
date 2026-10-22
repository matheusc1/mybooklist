import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBook, deleteBook, getBooks, updateBook } from '#/http/books'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import {
	invalidateAfterBookDeletion,
	invalidateDomain,
} from '#/utils/query-keys'
import {
	useBooks,
	useCreateBook,
	useDeleteBook,
	useUpdateBook,
} from './use-books'

vi.mock('#/http/books', () => ({
	getBooks: vi.fn(),
	createBook: vi.fn(),
	updateBook: vi.fn(),
	deleteBook: vi.fn(),
}))

vi.mock('#/utils/query-keys', async () => {
	const actual =
		await vi.importActual<typeof import('#/utils/query-keys')>(
			'#/utils/query-keys',
		)
	return {
		...actual,
		invalidateDomain: vi.fn(),
		invalidateAfterBookDeletion: vi.fn(),
	}
})

describe('useBooks', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads books successfully', async () => {
		const books = [{ id: 'book-1', title: 'The Hobbit' }]
		vi.mocked(getBooks).mockResolvedValue(books as never)

		const { result } = renderHookWithProviders(() => useBooks())

		await waitFor(() => expect(result.current.data).toEqual(books))
		expect(getBooks).toHaveBeenCalledOnce()
	})

	it('exposes query errors', async () => {
		const error = new Error('Request failed')
		vi.mocked(getBooks).mockRejectedValue(error)

		const { result } = renderHookWithProviders(() => useBooks())

		await waitFor(() => expect(result.current.error).toBe(error))
	})
})

describe.each([
	['useCreateBook', useCreateBook, createBook],
	['useUpdateBook', useUpdateBook, updateBook],
] as const)('%s', (_name, useMutationHook, mutationFn) => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(mutationFn).mockResolvedValue({} as never)
	})

	it('passes mutation input to the HTTP function and succeeds', async () => {
		const { result } = renderHookWithProviders(() => useMutationHook())
		const input = { id: 'book-1', title: 'Updated' }

		result.current.mutate(input as never)

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(mutationFn).toHaveBeenCalledWith(input, expect.anything())
		expect(invalidateDomain).toHaveBeenCalledWith(expect.anything(), 'books')
		expect(invalidateAfterBookDeletion).not.toHaveBeenCalled()
	})
})

describe('useDeleteBook', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(deleteBook).mockResolvedValue(undefined as never)
	})

	it('deletes the book and invalidates related data for that book id', async () => {
		const { result } = renderHookWithProviders(() => useDeleteBook())

		result.current.mutate('book-1')

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(deleteBook).toHaveBeenCalledWith('book-1', expect.anything())
		expect(invalidateAfterBookDeletion).toHaveBeenCalledWith(
			expect.anything(),
			'book-1',
		)
		expect(invalidateDomain).not.toHaveBeenCalled()
	})

	it('succeeds without waiting for the invalidation to finish', async () => {
		vi.mocked(invalidateAfterBookDeletion).mockReturnValueOnce(
			new Promise<void>(() => {}),
		)
		const { result } = renderHookWithProviders(() => useDeleteBook())

		result.current.mutate('book-1')

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
	})
})
