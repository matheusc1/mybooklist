import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	createReadingSession,
	deleteReadingSession,
	updateReadingSession,
} from '#/http/reading-sessions'
import { renderHookWithProviders, waitFor } from '#/test/test-utils'
import { invalidateDomain } from '#/utils/query-keys'
import {
	useCreateReadingSession,
	useDeleteReadingSession,
	useUpdateReadingSession,
} from './use-reading-sessions'

vi.mock('#/http/reading-sessions', () => ({
	createReadingSession: vi.fn(),
	deleteReadingSession: vi.fn(),
	updateReadingSession: vi.fn(),
}))

vi.mock('#/utils/query-keys', async () => {
	const actual =
		await vi.importActual<typeof import('#/utils/query-keys')>(
			'#/utils/query-keys',
		)
	return {
		...actual,
		invalidateDomain: vi.fn(),
	}
})
describe.each([
	['useCreateReadingSession', useCreateReadingSession, createReadingSession],
	['useUpdateReadingSession', useUpdateReadingSession, updateReadingSession],
] as const)('%s', (_name, useMutationHook, mutationFn) => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(mutationFn).mockResolvedValue({} as never)
	})

	it('passes mutation input to the HTTP function', async () => {
		const { result } = renderHookWithProviders(() => useMutationHook())
		const input = { bookId: 'book-1', fromPage: 10, toPage: 25 }

		result.current.mutate(input as never)

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(mutationFn).toHaveBeenCalledWith(input, expect.anything())
		expect(invalidateDomain).toHaveBeenCalledWith(
			expect.anything(),
			'readingSessions',
		)
	})
})

describe('useDeleteReadingSession', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(deleteReadingSession).mockResolvedValue(undefined)
	})

	it('passes the session id and reset option', async () => {
		const { result } = renderHookWithProviders(() => useDeleteReadingSession())

		result.current.mutate({ id: 'session-1', resetToPlanned: true })

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(deleteReadingSession).toHaveBeenCalledWith('session-1', true)
		expect(invalidateDomain).toHaveBeenCalledWith(
			expect.anything(),
			'readingSessions',
		)
	})

	it('defaults resetToPlanned to false when omitted', async () => {
		const { result } = renderHookWithProviders(() => useDeleteReadingSession())

		result.current.mutate({ id: 'session-1' })

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(deleteReadingSession).toHaveBeenCalledWith('session-1', false)
	})

	it.each([
		['create', useCreateReadingSession, createReadingSession],
		['update', useUpdateReadingSession, updateReadingSession],
		['delete', useDeleteReadingSession, deleteReadingSession],
	] as const)('exposes %s mutation errors', async (_name, useMutationHook, mutationFn) => {
		const error = new Error('Mutation failed')
		vi.mocked(mutationFn).mockRejectedValue(error)
		const { result } = renderHookWithProviders(() => useMutationHook())

		result.current.mutate(
			(_name === 'delete'
				? { id: 'session-1' }
				: { bookId: 'book-1', fromPage: 1, toPage: 2 }) as never,
		)

		await waitFor(() => expect(result.current.error).toBe(error))
	})
})
