import { describe, expect, it } from 'vitest'
import { throwWhenNoData } from './query-errors'

const noData = { state: { data: undefined } }
const withData = { state: { data: [{ id: 'book-1' }] } }
const serverError = { status: 500, message: 'Server error' }
const unauthorized = { status: 401, message: 'Unauthorized' }

describe('throwWhenNoData', () => {
	it('throws for an error when there is no data', () => {
		expect(throwWhenNoData(serverError, noData)).toBe(true)
	})

	it('does not throw when cached data exists', () => {
		expect(throwWhenNoData(serverError, withData)).toBe(false)
	})

	it('does not throw for a 401 so the session recovery can redirect', () => {
		expect(throwWhenNoData(unauthorized, noData)).toBe(false)
	})

	it('does not throw for a 401 with cached data either', () => {
		expect(throwWhenNoData(unauthorized, withData)).toBe(false)
	})
})
