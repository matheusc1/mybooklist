import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { formatBookDate, getTodayDate } from './format-date'

describe('formatBookDate', () => {
	const originalTZ = process.env.TZ

	beforeAll(() => {
		process.env.TZ = 'America/Sao_Paulo' // UTC-3
	})

	afterAll(() => {
		process.env.TZ = originalTZ
	})

	it('does not shift the date backward in a negative UTC offset timezone', () => {
		expect(formatBookDate('2024-01-15')).toBe('Jan 15, 2024')
	})

	it('formats timestamps that use a space between date and time', () => {
		expect(formatBookDate('2024-01-15 18:30:00')).toBe('Jan 15, 2024')
	})

	it('returns "Invalid Date" for a malformed date string, without throwing', () => {
		expect(formatBookDate('not-a-date')).toBe('Invalid Date')
	})
})

describe('getTodayDate', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('returns today as an ISO date string', () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2024, 6, 9, 14, 30))

		expect(getTodayDate()).toBe('2024-07-09')
	})
})
